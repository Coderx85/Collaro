import { IMember, Member } from "@collaro/member";
import { TMeetingId } from "../interface";
import { IMeetingStore, IParticipantDTO, IParticipantStore, MemoryWorkspaceMeetingStore, TParticipantStatus } from "./index";
import { Input } from "@collaro/utils/omit";
import { ID } from "@/modules/utils/generate";
import { db } from "@/db";
import { meetingParticipantsTable, membersTable } from "@/db/schema/schema";
import { and, eq } from "drizzle-orm";
import { TMemberId } from "@/types";
import tryCatch from "@/lib/try-catch-wrapper";

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

  async addParticipant(participant: Input<IParticipantDTO>): Promise<void> {
    const member: IParticipantDTO = {
      ...participant,
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

  async listParticipants(meetingId: TMeetingId): Promise<IParticipantDTO[]> {
    try {
      const checkMeetingExists = await this.meetingStore.checkMeetingExists(meetingId); 

      if (!checkMeetingExists) {
        throw new Error(`Meeting with ID: ${meetingId} does not exist`);
      }

      const participants = await db.query.meetingParticipantsTable.findMany({
        where: eq(meetingParticipantsTable.meetingId, meetingId),
        with: {
          member: true,
        }
      });

      const result: IParticipantDTO[] = participants.map((p) => ({
        id: p.id,
        meetingId: p.meetingId,
        memberId: p.memberId,
        name: p.name,
        role: p.member.role,
        joinedAt: p.joinedAt,
        leaveAt: p.leftAt,
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
            .set({ status: "left", leftAt: new Date() })
            .where(eq(meetingParticipantsTable.meetingId, meetingId))
      }}
    )
  }
}