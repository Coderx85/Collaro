import { SelectCallSchema } from "@/db/schema/schema";
import z from "zod";

export type clientCall = {
  id: string;
  name: string;
  team: string;
  role: string;
  custom?: {
    callType: string;
    description: string;
    scheduled?: boolean;
  };
};

export interface Response<T> {
  data?: T;
  error?: string;
  success: boolean;
  status: number;
}

export type TUserRole = TAdminRole | TMemberRole | TInviteMemberRole;

export type TAdminRole = "owner" | "admin";

export type TMemberRole = "member";

export type TInviteMemberRole = "admin" | "member";

export interface TOrganizationMember {
  id: string;
  userId: string;
  workspaceId: string;
  role: TUserRole;
  createdAt: Date;
  updatedAt: Date;
}

export type Call = z.infer<typeof SelectCallSchema>;
