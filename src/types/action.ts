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

export type userRole = "owner" | "admin" | "member";

export interface OrganizationMember {
  id: string;
  userId: string;
  workspaceId: string;
  role: userRole;
  createdAt: Date;
  updatedAt: Date;
}
