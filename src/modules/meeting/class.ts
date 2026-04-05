import { Input } from "@collaro/utils/omit";
import { 
  IMeetingDTO, 
  IWorkspaceMeetingDTO, 
  TMeetingId, 
  IMeetingStore,
  MemoryMeetingStore,
  TWorkspaceId,
  IWorkspaceMeeting,
  IParticipantStore,
  ParticipantStore,
  MemoryWorkspaceMeetingStore,
  TeamMeetingDTO,
  IParticipantDTO,
} from "./index";
import { ID } from "@collaro/utils/generate";
import { TMemberId } from "@collaro/member/interface";
import { TUserId } from "@collaro/user";

export type TMeetingInput<T> = Omit<Input<T>, "participants">

abstract class MeetingBase<T, TMeetingInput = T> {
  abstract createMeeting(input: TMeetingInput): Promise<T>;
  abstract getMeeting(id: TMeetingId): Promise<T | null>;
  abstract updateMeeting(id: TMeetingId, data: Partial<T>): Promise<void>;
  abstract deleteMeeting(id: TMeetingId): Promise<void>;
}

type PrivateMeetingDTO = IMeetingDTO<TUserId>;

export class PrivateMeeting extends MeetingBase<PrivateMeetingDTO> {
  store: IMeetingStore<TUserId> = new MemoryMeetingStore();

  constructor(public meeting: PrivateMeetingDTO) {
    super();
  }

  override async createMeeting(input: PrivateMeetingDTO): Promise<PrivateMeetingDTO> {
    await this.store.save(input);
    return input;
  }

  override async getMeeting(id: TMeetingId): Promise<PrivateMeetingDTO | null> {
    const meeting = await this.store.findById(id);
    if (!meeting) {
      return null;
    }
    return meeting as PrivateMeetingDTO;
  }

  override async deleteMeeting(id: TMeetingId): Promise<void> {
    await this.store.delete(id);
  }

  override async updateMeeting(id: TMeetingId, data: Partial<PrivateMeetingDTO>): Promise<void> {
    await this.store.update(id, data);
  }
}

export class TeamMeeting extends MeetingBase<IWorkspaceMeetingDTO, Input<TeamMeetingDTO>> implements IWorkspaceMeeting {
  store: IMeetingStore<TMemberId> = new MemoryWorkspaceMeetingStore();
  participantStore: IParticipantStore = new ParticipantStore();
  meeting: IWorkspaceMeetingDTO = {} as IWorkspaceMeetingDTO;

  private async findMemberById(id: TMemberId): Promise<TeamMeetingDTO | null> {
    const participant = await this.participantStore.listParticipants(this.meeting.id)
    
    if (!participant) {
      console.log(`Member with ID ${id} is not a participant of this meeting.`);
      return null;
    }
    return {
      ...this.meeting,
      workspaceId: this.meeting.workspaceId,
    } as TeamMeetingDTO;
  }

  override async createMeeting(input: Input<TeamMeetingDTO>): Promise<IWorkspaceMeetingDTO> {
    const Id = ID.meetingId();

    // Check if meeting with the same ID already exists
    const newMeeting: IWorkspaceMeetingDTO = {
      id: Id,
      title: input.title,
      createdBy: input.createdBy,
      workspaceId: input.workspaceId,
      status: "Scheduled",
      createdAt: new Date(),
      description: input.description,
      startTime: input.startTime,
      endTime: null,
      participants: {
        [String(input.createdBy)]: input.createdBy
      }
    };

    // console.log(`Creating meeting with ID: ${newMeeting.id} and title: ${newMeeting.title}`);
    
    await this.participantStore.addParticipant({
      status: "joined",
      meetingId: newMeeting.id,
      memberId: input.createdBy,
      name: "Creator",
      role: "admin",
      joinedAt: new Date(),
      leaveAt: null,
    })

    await this.store.save(newMeeting);

    return newMeeting;
  }

  override async deleteMeeting(id: TMeetingId): Promise<void> {
    await this.store.delete(id);
  }

  override async getMeeting(id: TMeetingId): Promise<IWorkspaceMeetingDTO | null> {
    const meeting = await this.store.findById(id);

    if (!meeting) {
      return null;
    }

    return meeting as IWorkspaceMeetingDTO;
  }

  override async updateMeeting(id: TMeetingId, data: Partial<IWorkspaceMeetingDTO>): Promise<void> {
    await this.store.update(id, data);
  }

  joinMeeting(memberId: string, workspaceId: TWorkspaceId): void {
    // check if member is already a participant
    if (this.meeting.participants[memberId]) {
      console.log(`Member ${memberId} is already a participant.`);
      return;
    }

    // check is the member belongs to the workspace
    if (String(this.meeting.id) !== String(workspaceId)) {
      console.log(`Member ${memberId} does not belong to workspace ${workspaceId}.`);
      return;
    }

    console.log(`Member ${memberId} joined the meeting ${this.meeting.title}.`);
  }

  async addParticipant(participant: IParticipantDTO): Promise<void> {
    await this.updateMeeting(this.meeting.id, {
      participants: {
        [String(participant.memberId)]: participant.memberId
      }
    })

    await this.participantStore.addParticipant(participant);
  }
}
