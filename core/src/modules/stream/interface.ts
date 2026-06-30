import { IUserDTO, TUserId } from "@/types";
import { StreamVideoClientOptions } from "@stream-io/video-react-sdk";
import { IMeetingDTO, TeamMeetingDTO } from "../meeting";
import { type streamClientConfig } from "./client";

export type StreamClientConfig = {
  tokenProvider: StreamVideoClientOptions["tokenProvider"];
  user: IUserDTO;
}

type TPersonalMeeting = IMeetingDTO<TUserId>;
type TTeamMeeting = TeamMeetingDTO;

export interface IStreamContext {
  /**
   * Creates a team meeting with the given input.
   * @param input - The input data for creating a team meeting.
   * @returns A promise that resolves when the team meeting is created.
   * @throws An error if the team meeting creation fails.
   * @example
   * const input: TeamMeetingDTO = {
   *   title: "Team Sync",
   *   description: "Weekly team sync meeting",
   *   startTime: new Date(),
   *   endTime: new Date(Date.now() + 3600000), // 1 hour later
   * };
   * await streamClient.createTeamMeeting(input);
   */
  createTeamMeeting(input: TTeamMeeting): void;

/**
 * Creates a personal meeting with the given input.
 * @param input - The input data for creating a personal meeting.
 * @returns A promise that resolves when the personal meeting is created.
 * @throws An error if the personal meeting creation fails.
 * @example
 * const input: IMeetingDTO<TUserId> = {
 *   title: "Personal Meeting",
 *   description: "One-on-one meeting",
 *   startTime: new Date(),
 *   endTime: new Date(Date.now() + 3600000), // 1 hour later
 * };
 * await streamClient.createPersonalMeeting(input);
 */
  createPersonalMeeting(input: TPersonalMeeting): void;
}
