"use server";
import { workspaceMeetingManager, workspaceMemberManager } from "@/modules/manager";
import { IParticipantDTO, TeamMeetingDTO, TMeetingId } from "@/modules/meeting";
import { APIResponse, MeetingResponse, TMemberId } from "@/types";

export async function getCallsBySlug(slug: string): Promise<APIResponse<TeamMeetingDTO[]>> {
  try {
    const workspace = await workspaceMemberManager.findWorkspaceBySlug(slug);

    if (!workspace) {
      return {
        success: false,
        error: `Workspace with slug ${slug} not found`,
      };
    }

    const meetings = await workspaceMeetingManager.listWorkspaceMeetings(
      workspace.id, 
      { status: "scheduled" }
    );

    return {
      data: meetings,
      success: true,
    };
  } catch (error: unknown) {
    return { success: false, error: `Failed to get call by slug: ${error}` };
  }
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
      endAt: new Date(),
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
