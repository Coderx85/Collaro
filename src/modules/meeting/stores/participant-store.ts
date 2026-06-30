import { IMember, Member } from "@collaro/member";
import { TMeetingId } from "../interface";
import { IMeetingStore, IParticipantDTO, IParticipantStore, MemoryWorkspaceMeetingStore, TParticipantStatus } from "./index";
import { Input } from "@collaro/utils/omit";
import { ID } from "@/modules/utils/generate";
import { db } from "@/db";
import { meetingParticipantsTable, membersTable, workspacesTable } from "@/db/schema/schema";
import { and, eq, SQL } from "drizzle-orm";
import { TMemberId, TUserId, TWorkspaceDTO } from "@/types";
import tryCatch from "@/lib/try-catch-wrapper";
import { SelectParticipantType } from "@/db/schema/type";

type TQueryParticipants ={
  userId?: TUserId;
  memberId?: TMemberId;
  workspaceId?: TWorkspaceDTO["id"];
  workspaceSlug?: TWorkspaceDTO["slug"];
}

export class ParticipantStore implements IParticipantStore {
  private static instance: ParticipantStore;

  public static getInstance(): ParticipantStore {
    if (!ParticipantStore.instance) {
      ParticipantStore.instance = new ParticipantStore();
    }
    return ParticipantStore.instance;
  }

  member: IMember = new Member();
  meetingStore: IMeetingStore<TMemberId> = MemoryWorkspaceMeetingStore.getInstance();

  /**
   * This method adds a participant to a meeting.
   * @param participant An object containing the participant's details, including meetingId, memberId, name, role, and status.
   * @returns A promise that resolves when the participant has been successfully added to the meeting.
   */
  async addParticipant(participant: Input<IParticipantDTO>): Promise<void> {
    const member: SelectParticipantType = {
      ...participant,
      status: participant.status || "joined",
      role: participant.role || "member",
      id: ID.participantId(),
      joinedAt: new Date(),
      leaveAt: null,
    }

    return tryCatch({
      ctx: async () => {
        await db
          .insert(meetingParticipantsTable)
          .values(member);
      }
    })
  }

  /**
   * This method retrieves a list of participants for a given meeting ID. 
   * @param meetingId The ID of the meeting.
   * @returns A promise that resolves to an array of participant DTOs.
   */
  async listParticipants(meetingId: TMeetingId): Promise<IParticipantDTO[]> {
    try {
      const checkMeetingExists = await this.meetingStore.checkMeetingExists(meetingId); 

      if (!checkMeetingExists) {
        throw new Error(`Meeting with ID: ${meetingId} does not exist`);
      }

      const participants = await db.query.meetingParticipantsTable.findMany({
        where: eq(meetingParticipantsTable.meetingId, meetingId),
      });

      const result: IParticipantDTO[] = participants.map((p) => ({
        id: p.id,
        meetingId: p.meetingId,
        memberId: p.memberId,
        name: p.name,
        role: p.role as IParticipantDTO["role"],
        joinedAt: p.joinedAt,
        leaveAt: p.leaveAt,
        status: p.status 
      }));

      return result;
    } catch (error: unknown) {
      throw new Error(`Failed to list participants: ${(error as Error).message}`);
    }
  }

  /**
   * The removeParticipant method removes a participant from a meeting by their meeting ID. It first checks if the meeting exists, then deletes the participant record from the database. If any errors occur during this process, it throws an error with a descriptive message.
   * Is the right name for this method removeParticipant or should it be removeParticipants since it removes all participants for a meeting?
   * @param meetingId 
   */
  async removeParticipant(meetingId: TMeetingId, memberId: TMemberId): Promise<void> {
    await tryCatch({
      ctx: async () => {
        await db
          .delete(meetingParticipantsTable)
          .where(and(
            eq(meetingParticipantsTable.meetingId, meetingId),
            eq(meetingParticipantsTable.memberId, memberId)
          ))
          .returning();
      }
    })
  }

  /**
   * The endMeetingForParticipants method updates the status of all participants.
   * @param meetingId The ID of the meeting for which to end the meeting for all participants.
   * @returns A promise that resolves when the operation is complete.
   */
  async endMeetingForParticipants(meetingId: TMeetingId): Promise<void> {
    return tryCatch({
      ctx: async () => {
        await db
          .update(meetingParticipantsTable)
          .set({ status: "left", leaveAt: new Date() })
          .where(eq(meetingParticipantsTable.meetingId, meetingId))
      }}
    )
  }

  async queryParticipants(meetingId: TMeetingId, query?: TQueryParticipants): Promise<IParticipantDTO[]> {
    let whereClause: SQL[] = [eq(meetingParticipantsTable.meetingId, meetingId)];

    if (query?.memberId) {
      whereClause.push(eq(meetingParticipantsTable.memberId, query.memberId));
    }

    if (query?.userId) {
      whereClause.push(eq(membersTable.userId, query.userId));
    }

    if (query?.workspaceId) {
      whereClause.push(eq(membersTable.workspaceId, query.workspaceId));
    }

    if (query?.workspaceSlug) {
      whereClause.push(eq(workspacesTable.slug, query.workspaceSlug));
    }

    return tryCatch({
      ctx: async () => {
        const participants = await db
          .query
          .meetingParticipantsTable
          .findMany({
            where: and(...whereClause),
            with: {
              member: true,
              meeting: true,
            }
          });

        return participants.map((p) => ({
          id: p.id,
          meetingId: p.meetingId,
          memberId: p.memberId,
          userId: p.member.userId,
          name: p.name,
          role: p.role as IParticipantDTO["role"],
          joinedAt: p.joinedAt,
          leaveAt: p.leaveAt,
          status: p.status
        }));
      }
    });
  }
}

export const participantStore = ParticipantStore.getInstance();