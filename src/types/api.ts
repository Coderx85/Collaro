export type APIResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
}

export const UserRole = {
  OWNER: 'owner',
  ADMIN: 'admin',
  MEMBER: 'member'
} as const;

export type UserRoleType = typeof UserRole[keyof typeof UserRole];

export type UserResponse = {
  id: string;
  name: string;
  email: string;
  clerkId: string;
  userName: string;
  role: UserRoleType;
  workspaceId: string | null;
  createdAt: Date;
  updatedAt: Date | null;
}

export type WorkspaceResponse = {
  id: string;
  name: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date | null;
}

export type CreateWorkspaceResponse = {
  id: string;
  name: string;
  members: string[];
  createdBy: string;
  createdAt: Date;
  updatedAt: Date | null;
}

export type MeetingResponse = {
  name: string;
  hostedBy: string;
  description: string;
  meetingId: string;
  startAt: Date;
  endAt?: Date | null;
  createdAt: Date;
}

export type AnalyticsResponse = {
  totalMeetings: number;
  totalUsers: number;
  totalWorkspaces: number;
  createdAt: Date;
}