import { IMember, Member, TMemberId } from "@collaro/member";
import { TMeetingId } from "../interface";
import { IMeetingStore, IParticipantDTO, IParticipantStore, MemoryWorkspaceMeetingStore, TParticipantId, TParticipantStatus } from "./index";
import { Input } from "@collaro/utils/omit";
import { ID } from "@/modules/utils/generate";
import { db } from "@/db";
import { meetingParticipantsTable } from "@/db/schema/schema";
import { eq } from "drizzle-orm";

const localStorage: IParticipantDTO[] = [];

export class ParticipantStore implements IParticipantStore {
  member: IMember = new Member();
  meetingStore: IMeetingStore<TMemberId> = new MemoryWorkspaceMeetingStore();

  async addParticipant(participant: Input<IParticipantDTO>): Promise<void> {
    const member: IParticipantDTO = {
      ...participant,
      id: ID.participantId(),
      joinedAt: new Date(),
      leaveAt: null,
    }

    const result = await db
      .insert(meetingParticipantsTable)
      .values({
        id: member.id,
        meetingId: member.meetingId,
        name: member.name,
        memberId: member.memberId,
        joinedAt: member.joinedAt,
        leftAt: member.leaveAt,
        status: member.status,
      })

    if(!result) throw new Error("Failed to add participant to the database");

    return;
  }

  async listParticipants(meetingId: TMeetingId): Promise<IParticipantDTO[]> {
    try {
      const checkMeetingExists = await this.meetingStore.checkMeetingExists(meetingId); 

      if (!checkMeetingExists) {
        throw new Error(`Meeting with ID: ${meetingId} does not exist`);
      }

      const participants = await db.query.meetingParticipantsTable.findMany({
        where: eq(meetingParticipantsTable.meetingId, meetingId)
      });

      const result: IParticipantDTO[] = participants.map((p) => ({
        id: p.id,
        meetingId: p.meetingId,
        memberId: p.memberId,
        name: p.name,
        role: "member",
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
  async removeParticipant(meetingId: TMeetingId): Promise<void> {
    try {
      const checkMeetingExists = await this.meetingStore.checkMeetingExists(meetingId);
      if (!checkMeetingExists) {
        throw new Error(`Meeting with ID: ${meetingId} does not exist`);
      }

      const participants = await db
        .update(meetingParticipantsTable)
        .set({ leftAt: new Date() })
        .where(eq(meetingParticipantsTable.meetingId, meetingId))
        .returning();

      if (!participants) {
        throw new Error(`Failed to remove participant from meeting with ID: ${meetingId}`);
      }

      return;
    } catch (error: unknown) {
      throw new Error(`Failed to remove participant: ${(error as Error).message}`);
    }
  }

  async endMeetingForParticipants(meetingId: TMeetingId): Promise<void> {
    try {
      const participants = await db
        .update(meetingParticipantsTable)
        .set({ status: "left", leftAt: new Date() })
        .where(eq(meetingParticipantsTable.meetingId, meetingId))
        .returning();
  
      if (!participants) {
        throw new Error(`Failed to end meeting for participants with ID: ${meetingId}`);
      }
  
      return;
    } catch (error: unknown) {
      throw new Error(`Failed to end meeting for participants: ${(error as Error).message}`);
    }
  }
}