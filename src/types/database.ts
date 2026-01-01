import { TUserRole } from "./action";

export interface Workspace {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date | null;
}

export interface WorkspaceUser {
  id: string;
  name: string;
  workspaceId: string;
  userId: string;
  role: TUserRole;
  createdAt: Date;
  updatedAt: Date | null;
}

export interface Meeting {
  workspaceId: string;
  name: string;
  hostedBy: string;
  description: string | null;
  startAt: Date;
  endAt: Date | null;
  meetingId: string;
}

export type CreateMeetingInput = Omit<Meeting, "endAt">;

export interface AnalyticsData {
  totalUsers: number;
  activeUsers: number;
  totalWorkspaces: number;
  totalMeetings: number;
  userGrowth: { date: string; count: number }[]; // For graphing user growth
}
