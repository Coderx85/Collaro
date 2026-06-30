"use server";
import { auth } from "@/lib/auth/auth-server";
import { workspaceMeetingManager } from "@/modules/manager";
import { IParticipantDTO, TeamMeetingDTO, TMeetingId } from "@/modules/meeting";
import { APIResponse, IWorkspaceDTO, MeetingResponse, TCreateMeetingAuthResponse, TMemberId, TWorkspaceSlug } from "@/types";
import { headers } from "next/headers";
import { tryCatchAction } from "@/lib/try-catch-wrapper";

export async function getCallsBySlug(slug: string): Promise<APIResponse<TeamMeetingDTO[]>> {
  return tryCatchAction({
    ctx: async () => {
      const res =await auth.api.listMeetings({
        method: "GET",
        headers: await headers(),
        query: {
          workspaceSlug: slug,
        }
      });

      if(!res || !res.success) {
        throw new Error("Failed to fetch meetings");
      }

      return res.data;
    }
  })
}

export async function addMemberToMeeting(meetingId: TMeetingId, memberId: TMemberId) {
  try {
    const participant = await workspaceMeetingManager.joinMeeting(meetingId, memberId);

    return {
      success: true,
      message: "Member added to meeting",
      participant: participant,
    };
  } catch (error: unknown) {
    console.error(error);
    return {
      success: false,
      message: `Failed to add member to meeting: ${error}`,
      status: 500,
    };
  }
}

export async function removeMemberFromMeeting(
  meetingId: TMeetingId,
  memberId: TMemberId,
) {
  try {
    await workspaceMeetingManager.participantStore.removeParticipant(meetingId, memberId);

    return {
      success: true,
      message: "Member removed from meeting",
    };
  } catch (error: unknown) {
    console.error(error);
    return {
      success: false,
      message: `Failed to remove member from meeting: ${error}`,
      status: 500,
    };
  }
}

export async function getMeetingParticipants(meetingId: TMeetingId): Promise<APIResponse<{ participant: IParticipantDTO[] }>> {
  try {
    const participants = await workspaceMeetingManager.listParticipants(meetingId);

    return {
      success: true,
      data: {
        participant: participants,
      }
    }
  } catch (error: unknown) {
    console.error(error);
    return {
      success: false,
      error: `Failed to get meeting participants: ${error}`,
    };
  }
}

export async function endMeetingForAll(
  meetingId: TMeetingId,
): Promise<APIResponse<MeetingResponse>> {
  try {
    // Check if meeting exists
    const meeting = await workspaceMeetingManager.getMeeting(meetingId);

    if (!meeting) {
      return {
        success: false,
        error: `Meeting with ID ${meetingId} not found`,
      };
    }
    // End call for all participants
    await workspaceMeetingManager.participantStore.endMeetingForParticipants(meetingId);

    // End the meeting
    await workspaceMeetingManager.endMeeting(meetingId);
    
    const dto: MeetingResponse = {
      title: meeting.title,
      endAt: new Date(),
      startTime: meeting.startTime,
      meetingId: meeting.id,
      hostedBy: meeting.createdBy,
      description: meeting.description,
      status: meeting.status,
      workspaceId: meeting.workspaceId,
      createdAt: meeting.createdAt,
    };

    return {
      success: true,
      data: dto,
    };
  } catch (error: unknown) {
    console.error(error);
    return {
      success: false,
      error: `Failed to end meeting: ${error}`,
    };
  }
}

type CreateMeetingInput = {
  title: string;
  description?: string;
  startTime: Date;
  workspaceSlug: TWorkspaceSlug;
}

export async function getMeetingDetails(meetingId: TMeetingId): Promise<APIResponse<TeamMeetingDTO>> {
  return tryCatchAction({
    ctx: async () => {
      const res = await auth.api.getMeeting({
        method: "GET",
        headers: await headers(),
        query: {
          meetingId: meetingId as unknown as string,
        }
      });

      if(!res || !res.success) {
        throw new Error("Failed to fetch meeting details");
      }

      return res.data;
    }
  })
}

export async function createMeetingAction(input: CreateMeetingInput): Promise<APIResponse<TCreateMeetingAuthResponse>> {
  try {
    const headersList = await headers();
    
    console.log("Creating meeting with input:", input);
    
    // Get session
    const session = await auth.api.getSession({ headers: headersList });
    if (!session?.user) {
      console.error("No session or user");
      return { success: false, error: "Unauthorized" };
    }

    console.log("Session found for user:", session.user.id);

    // Get workspace and member directly from database
    const { db } = await import("@/db");
    const { workspacesTable, membersTable, workspaceMeetingTable } = await import("@/db/schema/schema");
    const { and, eq } = await import("drizzle-orm");
    
    const workspace = await db.query.workspacesTable.findFirst({
      where: eq(workspacesTable.slug, String(input.workspaceSlug)),
    });

    if (!workspace) {
      console.error("Workspace not found:", input.workspaceSlug);
      return { success: false, error: "Workspace not found" };
    }

    console.log("Workspace found:", workspace.id);

    // Get member directly from database
    const member = await db.query.membersTable.findFirst({
      where: and(
        eq(membersTable.workspaceId, workspace.id),
        eq(membersTable.userId, session.user.id as any)
      ),
    });

    if (!member) {
      console.error("Member not found for user:", session.user.id, "in workspace:", workspace.id);
      return { success: false, error: "Forbidden - not a member of this workspace" };
    }

    console.log("Member found:", member.id);

    // Create meeting in database
    const { ID } = await import("@/modules/utils/generate");
    
    const meetingId = ID.meetingId();
    const createdAt = new Date();
    
    console.log("Creating meeting with ID:", meetingId);
    
    const [newMeeting] = await db
      .insert(workspaceMeetingTable)
      .values({
        meetingId,
        workspaceId: workspace.id,
        hostedBy: member.id,
        title: input.title,
        description: input.description,
        status: "active",
        startTime: input.startTime,
        createdAt,
        endAt: null,
      })
      .returning();

    console.log("Meeting created:", newMeeting.meetingId);

    // Add host as participant
    const { participantStore } = await import("@/modules/meeting");
    await participantStore.addParticipant({
      status: "joined",
      meetingId: newMeeting.meetingId,
      memberId: member.id,
      name: member.name || session.user.name,
      joinedAt: newMeeting.createdAt,
      role: member.role,
      leaveAt: null,
    });

    console.log("Participant added for meeting");

    return {
      success: true,
      data: {
        id: newMeeting.meetingId,
        title: newMeeting.title,
        description: newMeeting.description || "",
        createdBy: newMeeting.hostedBy,
        status: newMeeting.status,
        startTime: newMeeting.startTime,
        endTime: newMeeting.endAt,
        createdAt: newMeeting.createdAt,
        workspaceId: newMeeting.workspaceId,
        participants: {},
        hostData: {
          id: member.id as any,
          userId: session.user.id as any,
          name: member.name || session.user.name,
          role: member.role,
          workspaceId: workspace.id as any,
          createdAt: member.createdAt,
          updatedAt: member.updatedAt,
        },
        workspace: {
          id: workspace.id as any,
          name: workspace.name,
          slug: workspace.slug as any,
          logoUrl: (workspace as any).logo || (workspace as any).logoUrl || "",
          createdBy: workspace.createdBy as any,
          description: (workspace as any).description || "",
          createdAt: workspace.createdAt,
          updatedAt: workspace.updatedAt,
        },
      } as any as TCreateMeetingAuthResponse,
    };
  } catch (error) {
    console.error("Full error in createMeetingAction:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to create meeting" 
    };
  }
}
