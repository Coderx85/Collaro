import { createAuthEndpoint, getOrgAdapter } from "better-auth/plugins";
import { BetterAuthPlugin, BetterAuthPluginDBSchema } from "better-auth";
import { z } from "zod";
import { workspaceMeetingTable } from "@/db/schema/schema";
import { db } from "@/db";
import { APIResponse, TCreateMeetingAuthResponse, IMemberDTO, IWorkspaceDTO, TMeetingId, TMemberId, TUserId, TWorkspaceSlug } from "@/types";
import { ID } from "@/modules/utils/generate";
import { APIError, sessionMiddleware } from "better-auth/api";
import { workspaceMemberManager } from "@/modules/member";
import { IParticipantDTO, participantStore, TeamMeetingDTO } from "@/modules/meeting";
import { eq } from "drizzle-orm";

const meetingSchema: BetterAuthPluginDBSchema = {
  meeting: {
    fields: {
      meetingId: {
        type: "string",
        required: true,
        input: false,
      },
      workspaceId: {
        type: "string",
        required: true,
        input: false,
      },
      hostedBy: {
        type: "string",
        required: true,
        input: false,
      },
      title: {
        type: "string",
        required: true,
        defaultValue: "Untitled Meeting",
      },
      description: {
        type: "string",
        required: false,
        defaultValue: "Instant Meeting",
      },
      status: {
        type: "string",
        required: true,
        defaultValue: "active",
      },
      startTime: {
        type: "date",
        required: true,
        input: false,
      },
      createdAt: {
        type: "date",
        required: true,
        input: false,
      },
      endAt: {
        type: "date",
        required: false,
        input: false,
      },
    }
  }
}

export const meetingPlugin = () => {
  return {
    id: "meeting",
    schema: meetingSchema,
    endpoints: {
      createMeeting: createAuthEndpoint("/api/meeting/create", {
        method: "POST",
        use: [sessionMiddleware],
        body: z.object({
          workspaceSlug: z.string().min(1, "Workspace slug is required").transform(
            (value) => value as unknown as TWorkspaceSlug
          ),
          title: z.string().min(1, "Title is required"),
          description: z.string().optional(),
          startTime: z.date(),
          endTime: z.date().optional(),
        }),
        requireHeaders: true,
      },
      async ({ context, body }): Promise<APIResponse<TCreateMeetingAuthResponse>> => {
        const { title, description, startTime } = body;
        
        const { user } = context.session;
        const workspace = await workspaceMemberManager.findWorkspaceBySlug(body.workspaceSlug);
        if (!workspace) {
          throw new APIError("BAD_REQUEST");
        }

        const member =  await getOrgAdapter(context).checkMembership({
          organizationId: String(workspace.id),
          userId: user.id,
        });
        if (!member) {
          throw new APIError("FORBIDDEN");
        }

        const memberId = member.id as unknown as TMemberId;

        const createdAt = new Date();
        const [newMeeting] = await db
          .insert(workspaceMeetingTable)
          .values({
            meetingId: ID.meetingId(),
            workspaceId: workspace.id,
            hostedBy: memberId,
            title: title,
            description,
            status: "active",
            startTime,
            createdAt,
            endAt: null,
          })
          .returning();

        await participantStore.addParticipant({
          status: "joined",
          meetingId: newMeeting.meetingId,
          memberId,
          name: member.user.name,
          joinedAt: newMeeting.createdAt,
          role: member.role,
          leaveAt: null,
        });

        const dto: TeamMeetingDTO = {
          id: newMeeting.meetingId,
          title,
          description: newMeeting.description || "",
          createdBy: memberId,
          status: "active",
          startTime,
          endTime: newMeeting.endAt,
          createdAt: newMeeting.createdAt,
          workspaceId: workspace.id,
          participants: {
            [String(memberId)]: member.user.name,
          }
        };

        const hostData: IMemberDTO = {
          id: memberId,
          userId: user.id as unknown as TUserId,
          name: member.user.name,
          role: member.role,
          workspaceId: workspace.id,
          createdAt: member.createdAt,
          updatedAt: member.createdAt,
        };

        const teamData: IWorkspaceDTO = { ...workspace };

        return {
          success: true,
          data: {
            ...dto,
            hostData: hostData,
            workspace: teamData,
          }};
        } 
      ),
      // joinMeeting: createAuthEndpoint("/api/meeting/join", {
      //   method: "POST",
      //   use: [sessionMiddleware],
      //   body: z.object({
      //     meetingId: z.string().min(1, "Meeting ID is required").transform(
      //       (value) => value as unknown as TMeetingId
      //     ),
      //   }),
      //   requireHeaders: true,
      // },
      // async ({ context, body }): Promise<APIResponse<TCreateMeetingAuthResponse>> => {
      //   const { meetingId } = body;
      //   const { user } = context.session;

      //   // Get Meeting Details
      //   const meetingData = await db
      //     .query
      //     .workspaceMeetingTable
      //     .findFirst({
      //       where: eq(workspaceMeetingTable.meetingId, meetingId),
      //       with: {
      //         participants: true,
      //         workspace: true,
      //       }
      //     });

      //   if (!meetingData) {
      //     throw new APIError("NOT_FOUND");
      //   }

      //   if (meetingData.status === "scheduled" && meetingData.startTime.getTime() > Date.now()) {
      //     throw new APIError("FORBIDDEN");
      //   }

      //   if (meetingData.status !== "active") {
      //     throw new APIError("FORBIDDEN");
      //   }

      //   const hostDTO = meetingData.participants.find(
      //     (p) => p.memberId === meetingData.hostedBy
      //   );
      //   if (!hostDTO) {
      //     throw new APIError("INTERNAL_SERVER_ERROR");
      //   }

      //   const memberId = hostDTO.memberId as unknown as TMemberId;
      //   const newParticipantDTO: IParticipantDTO = {
      //     id: ID.participantId(),
      //     meetingId: meetingId,
      //     joinedAt: new Date(),
      //     leaveAt: null,
      //     memberId,
      //     name: hostDTO.name,
      //     role: member.role,
      //     status: "joined",
      //   }
      //   await participantStore.addParticipant({
      //     ...newParticipantDTO,
      //   });

      //   const hostData: IMemberDTO = {
      //     id: memberId,
      //     userId: user.id as unknown as TUserId,
      //     name: hostDTO.name,
      //     role: hostDTO.role,
      //     workspaceId: workspace.id,
      //     createdAt: hostDTO.createdAt,
      //     updatedAt: hostDTO.updatedAt,
      //   };

      //   return {
      //     success: true,
      //     data: newParticipantDTO,
      //   }}
      // ),
      getMeeting: createAuthEndpoint("/api/meeting/get", {
        method: "GET",
        use: [sessionMiddleware],
        query: z.object({
          meetingId: z.string().min(1, "Meeting ID is required").transform(
            (value) => value as unknown as TMeetingId
          ),
        }),
        requireHeaders: true,
      },
      async ({ context, query }): Promise<APIResponse<TeamMeetingDTO>> => {
        const { meetingId } = query;
        const { user } = context.session;

        // Get Meeting Details
        const meetingData = await db.query.workspaceMeetingTable.findFirst({
          where: eq(workspaceMeetingTable.meetingId, meetingId),
          with: {
            participants: true,
            workspace: true,
          }
        });

        if (!meetingData) {
          throw new APIError("NOT_FOUND");
        }

        const member = await getOrgAdapter(context).checkMembership({
          organizationId: String(meetingData.workspaceId),
          userId: user.id,
        });
        if (!member) {
          throw new APIError("FORBIDDEN");
        }

        const dto: TeamMeetingDTO = {
          id: meetingData.meetingId,
          title: meetingData.title,
          description: meetingData.description || "",
          createdBy: meetingData.hostedBy,
          status: meetingData.status,
          startTime: meetingData.startTime,
          endTime: meetingData.endAt,
          createdAt: meetingData.createdAt,
          workspaceId: meetingData.workspaceId,
          participants: {},
        };

        return {
          success: true,
          data: dto,
        };
        }
      ),
      listMeetings: createAuthEndpoint("/api/meeting/list", {
        method: "GET",
        use: [sessionMiddleware],
        query: z.object({
          workspaceSlug: z.string().min(1, "Workspace slug is required"),
        }),
        requireHeaders: true,
      },
      async ({ context, query }): Promise<APIResponse<TeamMeetingDTO[]>> => {
        const { workspaceSlug } = query;
        const { user } = context.session;
        const slug = workspaceSlug as unknown as TWorkspaceSlug;

        const workspace = await workspaceMemberManager.findWorkspaceBySlug(slug);
        if (!workspace) {
          throw new APIError("BAD_REQUEST");
        }

        const member =  await getOrgAdapter(context).checkMembership({
          organizationId: String(workspace.id),
          userId: user.id,
        });
        if (!member) {
          throw new APIError("FORBIDDEN");
        }

        const meetingsData = await db.query.workspaceMeetingTable.findMany({
          where: eq(workspaceMeetingTable.workspaceId, workspace.id),
          with: {
            participants: true,
          }
        });

        const dtos: TeamMeetingDTO[] = [];

        for (const meeting of meetingsData) {
          const dto: TeamMeetingDTO = {
            id: meeting.meetingId,
            title: meeting.title,
            description: meeting.description || "",
            createdBy: meeting.hostedBy,
            status: meeting.status,
            startTime: meeting.startTime,
            endTime: meeting.endAt,
            createdAt: meeting.createdAt,
            workspaceId: meeting.workspaceId,
            participants: {},
          };
          for (const participant of meeting.participants) {
            dto.participants[String(participant.memberId)] = participant.name;
          }
          dtos.push(dto);
        };

        return {
          success: true,
          data: dtos,
        };
        }
      ),
    }
  } satisfies BetterAuthPlugin;
};