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

export type TUserRole = "owner" | "admin" | "member";

export type TInviteMemberRole = "admin" | "member";

export interface TOrganizationMember {
  id: string;
  userId: string;
  workspaceId: string;
  role: TUserRole;
  createdAt: Date;
  updatedAt: Date;
}
