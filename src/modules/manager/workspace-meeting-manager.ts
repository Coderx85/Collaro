import { TWorkspaceDTO } from "@/types/workspace.types";
import { IParticipantDTO, IParticipantStore, IWorkspaceMeetingDTO, MemoryWorkspaceMeetingStore, ParticipantStore, TeamMeetingDTO, TMeetingId } from "@collaro/meeting";
import { IMemberDTO, IMemberStore, IWorkspaceMemberManager, MemberStore, WorkspaceMemberManager } from "@collaro/member";
import { ID } from "@collaro/utils/generate";
import { Input } from "@collaro/utils/omit";
import { IWorkspaceDTO } from "@collaro/workspace/interface";
import { IRequestMember, RequestMember } from "../workspace";
import { IUser, User } from "../user";
import { MemberSorting } from "../sorting/interface";
import { TMemberId } from "@/types";
import { MeetingNotification } from "../notification/meeting-notification";

export class WorkspaceMeetingManager {
  private memberStore: IMemberStore = new MemberStore();
  participantStore: IParticipantStore = ParticipantStore.getInstance();
  private meetingStore = MemoryWorkspaceMeetingStore.getInstance();
  private notificationService: MeetingNotification = MeetingNotification.getInstance();

  static instance: WorkspaceMeetingManager;
  static getInstance(): WorkspaceMeetingManager {
    if (!WorkspaceMeetingManager.instance) {
      WorkspaceMeetingManager.instance = new WorkspaceMeetingManager();
    }
    return WorkspaceMeetingManager.instance;
  }

  private constructor() {
    if(WorkspaceMeetingManager.instance) {
      throw new Error("Use WorkspaceMeetingManager.getInstance() to get an instance of this class.");
    }
  }

  private async checkMemberAccessToMeeting(meetingId: TMeetingId, memberId: TMemberId): Promise<boolean> {
    const meeting = await this.getMeeting(meetingId);
    if (!meeting) {
      throw new Error(`Meeting with ID: ${meetingId} not found`);
    }

    const checkExists = await this.memberStore.checkMemberExists(meeting.workspaceId, memberId);
    if (!checkExists) {
      throw new Error(`Member with Id ${memberId} does not exist in workspace with ID: ${meeting.workspaceId}`);
    }

    return true;
  }

  private async listMembers(workspaceId: IWorkspaceDTO["id"], sorting?: MemberSorting): Promise<IMemberDTO[]> {
    const members = await this.memberStore.listWorkspaceMembers(workspaceId);
    if (sorting) {
      return sorting.sortByName(members);
    }
    return members;
  }

  private async informMembers(workspaceId: IWorkspaceDTO["id"], exceptMemberId: TMemberId, input: Parameters<MeetingNotification["createNotification"]>[0]) {
    // 1. Get the members of the workspace.
    const members = await this.listMembers(workspaceId);

    // 2. Send notification to workspace members about the new meeting.
    for (const member of members) {
      if (member.id !== exceptMemberId) {
        await this.notificationService.createNotification({
          ...input,
          userId: member.userId,
          memberID: member.id,
        });
      }
    }
  }

  async validateMember(memberId: TMemberId): Promise<IMemberDTO> {
    const member = await this.memberStore.findById(memberId);
    if (!member) {
      throw new Error(`Member with ID: ${memberId} not found`);
    }
    return member;
  }

  async createMeeting(input: Omit<Input<TeamMeetingDTO>, "participants" | "endTime">, workspaceId: IWorkspaceDTO["id"]): Promise<TeamMeetingDTO> {
    try {
      // 1. Check the access.
      const checkExists = await this.memberStore.checkMemberExists(workspaceId, input.createdBy);
      if (!checkExists) {
        throw new Error(`Member with Id ${input.createdBy} does not exist in workspace with ID: ${workspaceId}`);
      }

      // 2. Get the member details.
      const member = await this.validateMember(input.createdBy);
  
      // 3. Create the meeting DTO.
      const meeting: IWorkspaceMeetingDTO = {
        ...input,
        workspaceId: workspaceId,
        id: ID.meetingId(),
        createdAt: new Date(),
        endTime: null,
        participants: {
          [String(member.id)]: member.name,
        },
      };
  
      // 4. Save the meeting to the store.
      await this.meetingStore.save(meeting);
  
      // 5. Add the creator of the meeting.
      await this.participantStore.addParticipant({
        status: "joined",
        meetingId: meeting.id,
        memberId: input.createdBy,
        name: member.name,
        role: member.role,
        joinedAt: new Date(),
        leaveAt: null,
      });

      // 6. Send notification to workspace members about the new meeting.
      await this.informMembers(workspaceId, input.createdBy, {
        type: "meeting_created",
        userId: member.userId,
        workspaceId: workspaceId,
        meetingLink: `/meetings/${meeting.id}`,
        memberID: member.id,
      });

      return meeting;
    } catch (error) {
      console.error("Error creating meeting:", error);
      throw error;
    }
  }

  async joinMeeting(meetingId: TMeetingId, memberId: TMemberId): Promise<IParticipantDTO> {
    try {
      // Check if meeting exists
      const checkExists = await this.checkMemberAccessToMeeting(
        meetingId,
        memberId,
      );

      if (!checkExists) {
        throw new Error(
          `Member with Id ${memberId} does not exist in workspace with ID: ${meetingId}`,
        );
      }

      const meeting = await this.getMeeting(meetingId);

      const member = await this.validateMember(memberId);

      await this.participantStore.addParticipant({
        status: "joined",
        meetingId,
        memberId,
        name: member.name,
        role: member.role,
        joinedAt: new Date(),
        leaveAt: null,
      });

      // Update meeting participants
      const updatedParticipants = {
        ...meeting!.participants,
        [String(member.id)]: member.name,
      };

      const participantDTO: IParticipantDTO = {
        id: ID.participantId(),
        role: member.role,
        status: "joined",
        leaveAt: null,
        meetingId,
        memberId,
        name: member.name,
        joinedAt: new Date(),
      };

      const updatedMeeting: TeamMeetingDTO = {
        ...meeting!,
        participants: updatedParticipants,
      };

      await this.meetingStore.update(meetingId, updatedMeeting);

      return participantDTO;
    } catch (error) {
      console.error("Error joining meeting:", error);
      throw error;
    }
  }

  async getMeeting(id: TMeetingId): Promise<TeamMeetingDTO | null> {
    const meeting = await this.meetingStore.findById(id);
    return meeting as unknown as TeamMeetingDTO | null;
  }

  async updateMeeting(meetingId: TMeetingId, status: TeamMeetingDTO["status"], ): Promise<void> {
    // 1. Check if meeting exists
    const meeting = await this.getMeeting(meetingId);
    if (!meeting) {
      throw new Error(`Meeting with ID: ${meetingId} not found`);
    }

    // 2. Validate the member trying to update the meeting.
    const member = await this.validateMember(meeting.createdBy);

    // 3. Check if the status transition is valid
    if (meeting.status === "completed" || meeting.status === "active") {
      throw new Error(`Cannot update the ${meeting.status} meeting.`);
    }

    // 4. Update the meeting status
    await this.meetingStore.update(meetingId, { status });

    // 5. Inform members about the meeting update
    await this.informMembers(meeting.workspaceId, meeting.createdBy, {
      type: "meeting_updated",
      userId: member.userId,
      workspaceId: member.workspaceId,
      meetingLink: `/meetings/${meeting.id}`,
      memberID: meeting.createdBy,
    });
  }

  async endMeeting(meetingId: TMeetingId): Promise<void> {
    const meeting = await this.getMeeting(meetingId);
    if (!meeting) {
      throw new Error(`Meeting with ID: ${meetingId} not found`);
    }

    const updatedMeeting: TeamMeetingDTO = {
      ...meeting,
      status: "completed",
      endTime: new Date(),
    }
    
    await this.meetingStore.update(meetingId, updatedMeeting);

    await this.participantStore.endMeetingForParticipants(meetingId);
  }

  async listParticipants(meetingId: TMeetingId): Promise<IParticipantDTO[]> {
    return await this.participantStore.listParticipants(meetingId);
  }

  async listWorkspaceMeetings(workspaceId: TWorkspaceDTO["id"], query: {
    status?: TeamMeetingDTO["status"];
    hostedBy?: TMemberId;
    paricipantId?: TMemberId;
  }): Promise<TeamMeetingDTO[]> {
    const meetings = await this.meetingStore.findWorkspaceMeetings(workspaceId, query);
    return meetings;
  }
}

export const workspaceMeetingManager = WorkspaceMeetingManager.getInstance();