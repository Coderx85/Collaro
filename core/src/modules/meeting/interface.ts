import { TWorkspaceId } from "../workspace";
import { BRAND } from "@collaro/utils/brand";
import { Input } from "@collaro/utils/omit";
import { IParticipantStore } from "./stores";
import { TMemberId, TUserId } from "@/types";
import { z } from "zod";

export type TMeetingId = BRAND<"MeetingId">;

export enum MeetingType {
  team = "Team Meeting",
  private = "Private Meeting",
}

export type meetingStatus = "scheduled" | "active" | "completed" | "cancelled";

export interface IMeetingDTO<T> {
  participants: Record<string, string>;
  id: TMeetingId;
  title: string;
  createdBy: T;
  status: meetingStatus;
  description: string;
  startTime: Date;
  endTime: Date | null;
  createdAt: Date;
}

export interface IPersonalMeetingDTO extends IMeetingDTO<TUserId> {};

export interface IWorkspaceMeetingDTO extends IMeetingDTO<TMemberId> {
  workspaceId: TWorkspaceId;
}

export const TeamMeetingSchema =  z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string()
    .max(500, "Description must be less than 500 characters"),
  createdBy: z.string().min(1, "CreatedBy is required").transform(
    (value) => value as unknown as TMemberId
  ),
}).strict();

export interface IMeeting<T> {
  meeting: IMeetingDTO<T>;
  
  // methods
  createMeeting(meeting: T): void;
  getMeeting(id: TMeetingId): T | null;
  updateMeeting(id: TMeetingId, meeting: Partial<T>): void;
  deleteMeeting(id: TMeetingId): void;
}

/**
 * @field workspaceId: The ID of the workspace to which the meeting belongs.
 * @field participants: A record of participant IDs and their corresponding names.
 * @field createdBy: The ID of the member who created the meeting.
 * @field status: The current status of the meeting (scheduled, active, completed, cancelled).
 * @field description: A brief description of the meeting.
 * @field startTime: The scheduled start time of the meeting.
 * @field endTime: The scheduled end time of the meeting (can be null if not set). 
 */
export type TeamMeetingDTO = IMeetingDTO<TMemberId> & { workspaceId: TWorkspaceId };

const createMeetingSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  startTime: z.date(),
  endTime: z.date().optional(),
})

export interface IWorkspaceMeeting {
  meeting: IWorkspaceMeetingDTO;
  participantStore: IParticipantStore;

  // methods
  createMeeting(input: Input<TeamMeetingDTO>, name: string): Promise<IWorkspaceMeetingDTO>;
  getMeeting(id: TMeetingId): Promise<IWorkspaceMeetingDTO | null>;
  updateMeeting(id: TMeetingId, meeting: Partial<IWorkspaceMeetingDTO>): Promise<void>;
  deleteMeeting(id: TMeetingId): Promise<void>;
}