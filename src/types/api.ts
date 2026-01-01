import type {
  CreateUserType,
  SelectMeetingType,
  SelectMemberType,
  UpdateMeetingSchema,
} from "@/db/schema/schema";
import z from "zod";

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

export type MeetingIdOnly = Pick<MeetingResponse, "description">;

export type MeetingResponse = SelectMeetingType;

export type UpdateMeetingType = z.infer<typeof UpdateMeetingSchema>;

export type TWorkspaceUser = SelectMemberType;

export type TWorkspaceMember = TUser & TWorkspaceUser;

export type TWorkspaceMembersTableRow = TWorkspaceMember[];
