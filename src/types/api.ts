import type { CreateUserType, SelectMemberType } from "@/db/schema/schema";

export type APIResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
};

export type APISuccessResponse<T> = {
  success: true;
  data: T;
};

type APIErrorResponse = {
  success: false;
  error: string;
};

export type UserResponse = Omit<CreateUserType, "password">;

export type TUser = UserResponse;

export type WorkspaceResponse = {
  id: string;
  name: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date | null;
};

export type CreateWorkspaceResponse = {
  id: string;
  name: string;
  members: string[];
  createdBy: string;
  createdAt: Date;
  updatedAt: Date | null;
};

export type MeetingIdOnly = Pick<MeetingResponse, "meetingId">;

export type MeetingResponse = {
  ttile: string;
  hostedBy: string;
  workspaceId: string;
  workspaceName: string;
  description: string;
  meetingId: string;
  startAt: Date;
  endAt?: Date | null;
  createdAt: Date;
};

export type AnalyticsResponse = {
  totalMeetings: number;
  totalUsers: number;
  totalWorkspaces: number;
  createdAt: Date;
};

export type TWorkspaceUser = SelectMemberType;

export type TWorkspaceMember = TUser & TWorkspaceUser;

export type TWorkspaceMembersTableRow = TWorkspaceMember[];
