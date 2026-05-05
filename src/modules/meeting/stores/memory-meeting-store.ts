import { IMeetingDTO, TMeetingId, TeamMeetingDTO, meetingStatus } from "../interface";
import { IMeetingStore } from ".";
import { TUserId , TMemberId, TWorkspaceId } from "@/types";
import { db } from "@/db";
import { privateMeetingsTable, workspaceMeetingTable } from "@/db/schema/schema";
import { and, eq } from "drizzle-orm";
import tryCatch from "@/lib/try-catch-wrapper";

export class MemoryMeetingStore implements IMeetingStore<TUserId> {
  private meetings: IMeetingDTO<TUserId>[] = [];

  async checkMeetingExists(id: TMeetingId): Promise<boolean> {
    const meeting = await db.query.privateMeetingsTable.findFirst({
      where: eq(privateMeetingsTable.meetingId, id)
    });
    
    return !!meeting;
  }

  async save(meeting: IMeetingDTO<TUserId>): Promise<void> {
    await db.insert(privateMeetingsTable).values({
      meetingId: meeting.id,
      hostedBy: meeting.createdBy,
      description: meeting.description,
      endAt: null,
      status: "active"
    })
  }

  findById(id: TMeetingId): Promise<IMeetingDTO<TUserId> | null> {
    const meeting = this.meetings.find((meeting) => meeting.id === id) || null;
    return Promise.resolve(meeting);
  }

  async update(id: TMeetingId, meeting: Partial<IMeetingDTO<TUserId>>): Promise<IMeetingDTO<TUserId>> {
    const [updatedMeeting] = await db
      .update(privateMeetingsTable)
      .set(meeting)
      .where(eq(privateMeetingsTable.meetingId, id))
      .returning();

    if(!updatedMeeting) throw new Error("Meeting not found");

    const dto: IMeetingDTO<TUserId> = {
      id: updatedMeeting.meetingId, 
      title: updatedMeeting.description || "",  
      createdBy: updatedMeeting.hostedBy,
      createdAt: new Date(),
      description: updatedMeeting.description || "",
      endTime: updatedMeeting.endAt,
      participants: {},
      startTime: updatedMeeting.createdAt,
      status: updatedMeeting.status
    }

    return dto;
  }

  updateStatus(id: TMeetingId, status: meetingStatus): Promise<void> {
    const index = this.meetings.findIndex((m) => m.id === id);
    if (index !== -1) {
      this.meetings[index] = { ...this.meetings[index], status } as IMeetingDTO<TUserId>;
    }
    return Promise.resolve();
  }

  delete(id: TMeetingId): Promise<void> {
    this.meetings = this.meetings.filter((meeting) => meeting.id !== id);
    return Promise.resolve();
  }

  list(): Promise<IMeetingDTO<TUserId>[]> {
    return Promise.resolve([...this.meetings]);
  }
}

export type TMeetingQuery = {
  workspaceId?: TWorkspaceId;
  memberId?: TMemberId;
  status?: meetingStatus;
};

export class MemoryWorkspaceMeetingStore implements IMeetingStore<TMemberId> {
  private static instance: MemoryWorkspaceMeetingStore;

  public static getInstance(): MemoryWorkspaceMeetingStore {
    if (!MemoryWorkspaceMeetingStore.instance) {
      MemoryWorkspaceMeetingStore.instance = new MemoryWorkspaceMeetingStore();
    }
    return MemoryWorkspaceMeetingStore.instance;
  }

  /**
   * Checks if a meeting exists with the given ID
   * @param id The ID of the meeting to check
   * @returns A promise resolving to true if the meeting exists, false otherwise
   */
  async checkMeetingExists(id: TMeetingId): Promise<boolean> {
    return tryCatch({
      ctx: async () => {
        const meeting = await db.query.workspaceMeetingTable.findMany({
          where: eq(workspaceMeetingTable.meetingId, id),
        });
    
        return !!meeting.length;
      }
    })
  }

  /**
   * Saves a new meeting to the database
   * @param meeting The meeting DTO to save
   * @returns A promise that resolves when the meeting is saved
   */
  async save(meeting: TeamMeetingDTO): Promise<void> {
    return tryCatch({
      ctx: async () => {
        const result: TeamMeetingDTO = {
          id: meeting.id,
          title: meeting.description || "",
          createdBy: meeting.createdBy,
          createdAt: new Date(),
          status: meeting.status as meetingStatus,
          startTime: meeting.startTime,
          participants: {},
          description: meeting.description || "",
          endTime: meeting.endTime || null,
          workspaceId: meeting.workspaceId,
        };
    
        const [newMeeting] = await db
          .insert(workspaceMeetingTable)
          .values({
            meetingId: result.id,
            workspaceId: result.workspaceId,
            description: result.description,
            status: result.status,
            startTime: result.startTime,
            endAt: result.endTime,
            hostedBy: result.createdBy,
            createdAt: new Date(),
          })
          .returning();
        
        if(!newMeeting) {
          throw new Error("Failed to create meeting");
        }
    
        return;
      }
    })
  }

  /**
   * Finds a meeting by its ID
   * @param id The ID of the meeting to find
   * @returns The IMeetingDTO with the participants as a record of member names to their IDs, or null if not found
   * @throws Error if there is an issue querying the database
   */
  async findById(id: TMeetingId): Promise<IMeetingDTO<TMemberId> | null> {
    try {
      const meeting = await db.query.workspaceMeetingTable.findFirst({
        where: eq(workspaceMeetingTable.meetingId, id),
        with: {
          workspace: true,
          participants: true,
        },
      });

      if (!meeting || !meeting.workspace || !meeting.participants) {
        return null;
      }

      const participantsRecord: Record<string, string> = {
        ...meeting.participants.reduce(
          (acc, participant) => {
            acc[participant.name] = String(participant.memberId);
            return acc;
          },
          {} as Record<string, string>,
        ),
      };

      const result: IMeetingDTO<TMemberId> = {
        id: meeting.meetingId,
        title: meeting.description || "",
        createdBy: meeting.hostedBy as unknown as TMemberId,
        createdAt: new Date(),
        status: meeting.status as meetingStatus,
        startTime: meeting.createdAt,
        participants: {
          ...participantsRecord,
        },
        description: meeting.description || "",
        endTime: meeting.endAt,
      };

      return result;
    } catch (error: unknown) {
      throw new Error(`Failed to find meeting: ${(error as Error).message}`);
    }
  }

  /**
   * Queries meetings based on the provided parameters.
   * @param query An object containing optional workspaceId, memberId, and status to filter meetings by.
   * @returns
   */
  public async queryMeetings(
    query: TMeetingQuery,
  ): Promise<IMeetingDTO<TMemberId>[]> {
    return tryCatch({
      ctx: async () => {
        let whereClause = [];

        if (query.workspaceId) {
          whereClause.push(
            eq(workspaceMeetingTable.workspaceId, query.workspaceId),
          );
        }

        if (query.memberId) {
          whereClause.push(eq(workspaceMeetingTable.hostedBy, query.memberId));
        }

        if (query.status) {
          whereClause.push(eq(workspaceMeetingTable.status, query.status));
        }

        const meetings = await db.query.workspaceMeetingTable.findMany({
          where: and(...whereClause),
          with: {
            participants: true,
          },
        });

        return meetings.map((meeting) => ({
          id: meeting.meetingId,
          title: meeting.description || "",
          createdBy: meeting.hostedBy as unknown as TMemberId,
          createdAt: new Date(),
          status: meeting.status as meetingStatus,
          startTime: meeting.createdAt,
          participants: {
            ...meeting.participants.reduce(
              (acc, participant) => {
                acc[participant.name] = String(participant.memberId);
                return acc;
              },
              {} as Record<string, string>,
            ),
          },
          description: meeting.description || "",
          endTime: meeting.endAt,
          workspaceId: meeting.workspaceId,
        }));
      },
    });
  }

  /**
   * Updates a meeting with the given ID using the provided partial meeting data
   * @param id The ID of the meeting to update
   * @param status The new status to set for the meeting
   * @returns A promise that resolves when the update is complete
   * @throws Error if the meeting is not found or if there is an issue updating the database
   */
  async updateStatus(id: TMeetingId, status: meetingStatus): Promise<void> {
    try {
      const result = await db
        .update(workspaceMeetingTable)
        .set({ status })
        .where(eq(workspaceMeetingTable.meetingId, id))
        .returning();

      if (!result) throw new Error("Meeting not found");

      return;
    } catch (error) {
      throw new Error(
        `Failed to update meeting status: ${(error as Error).message}`,
      );
    }
  }

  /**
   * This method updates a meeting with the given ID
   * @param id The ID of the meeting
   * @param meeting A partial meeting object
   * @returns A promise that resolves when the update is complete
   */
  async update(
    id: TMeetingId,
    meeting: Partial<IMeetingDTO<TMemberId>>,
  ): Promise<IMeetingDTO<TMemberId>> {
    try {
      const [result] = await db
        .update(workspaceMeetingTable)
        .set({
          description: meeting.description,
          endAt: meeting.endTime,
          status: meeting.status,
        })
        .where(eq(workspaceMeetingTable.meetingId, id))
        .returning();

      if (!result) throw new Error("Meeting not found");

      const dto: IMeetingDTO<TMemberId> = {
        id: result.meetingId,
        title: result.description || "",
        createdBy: result.hostedBy,
        createdAt: new Date(),
        status: result.status,
        startTime: result.createdAt,
        participants: {},
        description: result.description || "",
        endTime: result.endAt,
      };

      return dto;
    } catch (error: unknown) {
      throw new Error(`Failed to update meeting: ${(error as Error).message}`);
    }
  }

  /**
   * Deletes a meeting with the given ID
   * @param id The ID of the meeting to delete
   * @returns A promise that resolves when the deletion is complete
   * @throws Error if there is an issue deleting the meeting from the database.
   */
  async delete(id: TMeetingId): Promise<void> {
    return tryCatch({
      ctx: async () => {
        const result = await db
          .delete(workspaceMeetingTable)
          .where(eq(workspaceMeetingTable.meetingId, id))
          .returning();

        if (!result) throw new Error("Meeting not found");

        return;
      }
    })
  }

  /**
   * Queries meetings based on the provided parameters.
   * @param query An object containing optional workspaceId and memberId to filter meetings by. If workspaceId is provided, it will return meetings for that workspace. If memberId is provided, it will return meetings hosted by that member. If both are provided, it will return meetings that match both criteria.
   * @returns A promise that resolves to an array of meeting DTOs matching the query parameters.
   */
  private async listMeetings(query: {
    workspaceId?: TWorkspaceId;
    memberId?: TMemberId;
  }): Promise<IMeetingDTO<TMemberId>[]> {
    try {
      let whereClause = [];

      if (query.workspaceId) {
        whereClause.push(
          eq(workspaceMeetingTable.workspaceId, query.workspaceId),
        );
      }

      if (query.memberId) {
        whereClause.push(eq(workspaceMeetingTable.hostedBy, query.memberId));
      }

      const meetings = await db.query.workspaceMeetingTable.findMany({
        where: and(...whereClause),
      });

      const result: IMeetingDTO<TMemberId>[] = meetings.map((meeting) => ({
        id: meeting.meetingId,
        title: meeting.description || "",
        createdBy: meeting.hostedBy as unknown as TMemberId,
        createdAt: new Date(),
        status: meeting.status as meetingStatus,
        startTime: meeting.createdAt,
        participants: {},
        description: meeting.description || "",
        endTime: meeting.endAt,
      }));

      return result;
    } catch (error: unknown) {
      throw new Error(`Failed to list meetings: ${(error as Error).message}`);
    }
  }

  /**
   * Lists meetings for a specific workspace
   * @param workspaceId The ID of the workspace for which to list meetings
   * @returns A promise that resolves to an array of meeting DTOs for the specified workspace
   */
  async listworkspaceMeetings(
    workspaceId: TWorkspaceId,
  ): Promise<IMeetingDTO<TMemberId>[]> {
    try {
      return await this.listMeetings({ workspaceId });
    } catch (error: unknown) {
      throw new Error(
        `Failed to list workspace meetings: ${(error as Error).message}`,
      );
    }
  }

  /**
   * Lists meetings for a specific member
   * @param memberId The ID of the member for which to list meetings
   * @returns A promise that resolves to an array of meeting DTOs for the specified member
   */
  async listMemberMeetings(
    memberId: TMemberId,
  ): Promise<IMeetingDTO<TMemberId>[]> {
    try {
      return await this.listMeetings({ memberId });
    } catch (error: unknown) {
      throw new Error(
        `Failed to list member meetings: ${(error as Error).message}`,
      );
    }
  }

  public async findWorkspaceMeetings(
    workspaceId: TWorkspaceId,
    query: {
      status?: TeamMeetingDTO["status"];
      hostedBy?: TMemberId;
      paricipantId?: TMemberId;
    },
  ): Promise<TeamMeetingDTO[]> {
    let whereClause = [eq(workspaceMeetingTable.workspaceId, workspaceId)];

    if (query.status) {
      whereClause.push(eq(workspaceMeetingTable.status, query.status));
    }

    if (query.hostedBy) {
      whereClause.push(eq(workspaceMeetingTable.hostedBy, query.hostedBy));
    }

    if (query.paricipantId) {
      whereClause.push(eq(workspaceMeetingTable.hostedBy, query.paricipantId));
    }

    try {
      const meetings = await db.query.workspaceMeetingTable.findMany({
        where: and(...whereClause),
        with: {
          participants: true,
        },
      });

      const dtos: TeamMeetingDTO[] = [];

      for (const meeting of meetings) {
        const participantsRecord: Record<string, string> = {
          ...meeting.participants.reduce(
            (acc, participant) => {
              acc[participant.name] = String(participant.memberId);
              return acc;
            },
            {} as Record<string, string>,
          ),
        };

        dtos.push({
          id: meeting.meetingId,
          title: meeting.description || "",
          createdBy: meeting.hostedBy as unknown as TMemberId,
          createdAt: new Date(),
          status: meeting.status as meetingStatus,
          startTime: meeting.createdAt,
          participants: {
            ...participantsRecord,
          },
          description: meeting.description || "",
          endTime: meeting.endAt,
          workspaceId: meeting.workspaceId,
        });
      }

      return dtos;
    } catch (error: unknown) {
      throw new Error(
        `Failed to find workspace meetings: ${(error as Error).message}`,
      );
    }
  }
}