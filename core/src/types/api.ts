import type {
  CreateUserType,
  SelectMeetingType,
  SelectMemberType,
  UpdateMeetingSchema,
} from "@/db/schema/type";
import z from "zod";
import { TUserId } from "./id.types";
import { Prettify } from "better-auth/types";

export type APIResponse<T> = APISuccessResponse<T> | APIErrorResponse;

export type APISuccessResponse<T> = {
  success: true;
  data: T;
};

type APIErrorResponse = {
  success: false;
  error: string;
};

export type UserResponse = Omit<CreateUserType, "password"> & { id: TUserId};

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
