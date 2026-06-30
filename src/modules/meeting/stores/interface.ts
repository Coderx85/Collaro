import { IMember, IMemberDTO } from "@collaro/member";
import { IMeetingDTO, meetingStatus, TMeetingId } from "..";
import { TMemberId, TParticipantId } from "@/types";
import { Input } from "@collaro/utils/omit";
import { BRAND } from "@/modules/utils/brand";

export interface IMeetingStore<T> {
  checkMeetingExists(id: TMeetingId): Promise<boolean>;
  save(meeting: IMeetingDTO<T>): Promise<void>;
  findById(id: TMeetingId): Promise<IMeetingDTO<T> | null>;
  update(
    id: TMeetingId,
    meeting: Partial<IMeetingDTO<T>>,
  ): Promise<IMeetingDTO<T>>;
  updateStatus(id: TMeetingId, status: meetingStatus): Promise<void>;
  delete(id: TMeetingId): Promise<void>;
}

export type TParticipantStatus = "joined" | "left" | "invited" | "declined";

export interface IParticipantDTO {
  id: TParticipantId;
  meetingId: TMeetingId;
  memberId: TMemberId;
  name: string;
  role: IMemberDTO["role"];
  joinedAt: Date;
  leaveAt: Date | null;
  status: TParticipantStatus;
}

export type TParticipantsInput= Omit<IParticipantDTO, 
  "participants" | "joinedAt" | "id" > 

export interface IParticipantStore {
  member: IMember;
  meetingStore: IMeetingStore<TMemberId>;

  addParticipant(participant: Input<IParticipantDTO>): Promise<void>;
  removeParticipant(meetingId: TMeetingId, memberId: TMemberId): Promise<void>;
  listParticipants(meetingId: TMeetingId): Promise<IParticipantDTO[]>;
  endMeetingForParticipants(meetingId: TMeetingId): Promise<void>;
}
