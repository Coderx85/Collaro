"use server";
import { db } from "@/db/client";
import {
  workspacesTable,
  workspaceMeetingTable,
  meetingParticipantsTable,
  membersTable,
  SelectUserType,
  usersTable,
  SelectParticipantType,
  SelectWorkspaceType,
  SelectMemberType,
} from "@/db/schema/schema";
import { APIResponse, Call, MeetingResponse } from "@/types";
import { eq, and } from "drizzle-orm";

type Response<T> = Promise<APIResponse<T>>;

export async function getCallsBySlug(slug: string) {
  try {
    const [workspace] = await db
      .select()
      .from(workspacesTable)
      .where(eq(workspacesTable.slug, slug))
      .execute();

    if (!workspace) {
      return {
        error: `Workspace with slug ${slug} not found`,
        success: false,
      };
    }

    const meeting = await db
      .select()
      .from(workspaceMeetingTable)
      .where(eq(workspaceMeetingTable.workspaceId, workspace.id))
      .execute();

    if (!meeting)
      return {
        error: `No meeting found for workspace with slug ${slug}`,
        success: false,
      };

    return {
      data: meeting,
      success: true,
    };
  } catch (error: unknown) {
    return { success: false, error: `Failed to get call by slug: ${error}` };
  }
}

type TParticipant = Omit<
  SelectParticipantType,
  "id" | "updatedAt" | "createdAt"
>;
type TMember = Omit<SelectMemberType, "id" | "updatedAt" | "createdAt">;
type TUser = Pick<SelectUserType, "id" | "name" | "email">;
// type TWorkspace = Omit<SelectWorkspaceType, "id">;

type WorkspaceAccess = TParticipant & TMember & TUser;

/*
@params meeting: string
@params workspaceId: string
@returns { data: { access: boolean }, success: boolean }

*/
export async function checkWorkspaceMeetingAcces(
  meeting: string,
  workspaceId: string,
  userId: string
): Response<WorkspaceAccess> {
  try {
    // First check if the current user is a member of the workspace
    const [memberData] = await db
      .select()
      .from(membersTable)
      .where(
        and(
          eq(membersTable.workspaceId, workspaceId),
          eq(membersTable.userId, userId)
        )
      )
      .execute();

    if (!memberData) {
      return {
        success: false,
        error: "You are not a member of this workspace",
      };
    }

    // Get user data
    const [userData] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, userId))
      .execute();

    if (!userData) {
      return {
        success: false,
        error: `User with ID ${userId} not found`,
      };
    }

    // Check if meeting exists in database (optional - meeting might be created on-the-fly)
    const [meetingData] = await db
      .select()
      .from(workspaceMeetingTable)
      .where(
        and(
          eq(workspaceMeetingTable.workspaceId, workspaceId),
          eq(workspaceMeetingTable.meetingId, meeting)
        )
      )
      .execute();

    // If meeting exists in DB and is completed, don't allow joining
    if (meetingData && meetingData.status === "completed") {
      return {
        success: false,
        error: `Meeting with ID ${meeting} has ended`,
      };
    }

    // Check if the user is already a participant
    let [participantData] = await db
      .select()
      .from(meetingParticipantsTable)
      .where(
        and(
          eq(meetingParticipantsTable.meetingId, meeting),
          eq(meetingParticipantsTable.memberId, memberData.id)
        )
      )
      .execute();

    // If not already a participant, create a mock participant data
    // (they are joining for the first time)
    if (!participantData) {
      participantData = {
        id: "",
        meetingId: meeting,
        memberId: memberData.id,
        joinedAt: new Date(),
        leftAt: null,
        status: "joined",
      } as SelectParticipantType;
    }

    // User is a workspace member - allow them to join the meeting
    return {
      data: { ...participantData, ...memberData, ...userData },
      success: true,
    };
  } catch (error: unknown) {
    return {
      success: false,
      error: `Failed to check workspace meeting access: ${error}`,
    };
  }
}

export async function getMeetingsData() {
  try {
    const [meetingData] = await db
      .select()
      .from(workspaceMeetingTable)
      .execute();
    if (!meetingData) return { message: "No meetings found", status: 404 };
    console.log(`Meetings found: ${meetingData}`);
    return { meetingData };
  } catch (error: unknown) {
    console.log(error);
    return { message: `Failed to operate function \n`, status: 500 };
  }
}

export async function addMemberToMeeting(meetingId: string, memberId: string) {
  try {
    const participant = await db
      .insert(meetingParticipantsTable)
      .values({
        meetingId,
        memberId,
      })
      .returning();

    return {
      success: true,
      message: "Member added to meeting",
      participant: participant[0],
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
  meetingId: string,
  memberId: string
) {
  try {
    await db
      .update(meetingParticipantsTable)
      .set({ leftAt: new Date() })
      .where(
        and(
          eq(meetingParticipantsTable.meetingId, meetingId),
          eq(meetingParticipantsTable.memberId, memberId)
        )
      );

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

export async function getMeetingParticipants(meetingId: string) {
  try {
    const participants = await db
      .select({
        participant: meetingParticipantsTable,
        member: membersTable,
      })
      .from(meetingParticipantsTable)
      .innerJoin(
        membersTable,
        eq(meetingParticipantsTable.memberId, membersTable.id)
      )
      .where(eq(meetingParticipantsTable.meetingId, meetingId));

    return {
      success: true,
      participants,
    };
  } catch (error: unknown) {
    console.error(error);
    return {
      success: false,
      message: `Failed to fetch meeting participants: ${error}`,
      status: 500,
    };
  }
}

export async function endMeeting(
  meetingId: string,
  owner: boolean
): Promise<APIResponse<MeetingResponse>> {
  try {
    //

    // Update meeting status and end time
    const [meeting] = await db
      .update(workspaceMeetingTable)
      .set({ status: "completed", endAt: new Date() })
      .where(eq(workspaceMeetingTable.meetingId, meetingId))
      .returning();

    if (!meeting) {
      return {
        success: false,
        error: `Meeting with ID ${meetingId} not found`,
      };
    }

    await db
      .update(meetingParticipantsTable)
      .set({
        leftAt: new Date(),
      })
      .where(eq(meetingParticipantsTable.meetingId, meetingId));

    return {
      success: true,
      data: meeting,
    };
  } catch (error: unknown) {
    console.error(error);
    return {
      success: false,
      error: `Failed to end meeting: ${error}`,
    };
  }
}
