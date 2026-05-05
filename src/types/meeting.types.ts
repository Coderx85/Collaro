import { TeamMeetingDTO } from "@/modules/meeting";
import { IMemberDTO } from "./member.types";
import { IWorkspaceDTO } from "./workspace.types";

export type TCreateMeetingAuthResponse = TeamMeetingDTO & { hostData: IMemberDTO, workspace: IWorkspaceDTO };

export type TCreateMeetingInput = {
  workspaceSlug: string;
  title: string;
  description: string;
  startTime: Date;
  endTime: Date | null;
}