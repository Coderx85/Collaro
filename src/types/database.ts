export const UserRole = {
  OWNER: 'owner',
  ADMIN: 'admin',
  MEMBER: 'member'
} as const;

export type UserRoleType = typeof UserRole[keyof typeof UserRole];

export interface User {
  id: string;
  name: string;
  email: string;
  userName: string;
  clerkId: string;
  role: UserRoleType;
  workspaceId: string;
  createdAt: Date;
  updatedAt: Date | null;
}

// Type guard for checking valid user roles
export const isValidUserRole = (role: string): role is UserRoleType => {
  return Object.values(UserRole).includes(role as UserRoleType);
};

// Utility type for creating new users
export type CreateUserInput = Omit<User, 'id' | 'createdAt' | 'updatedAt'>;

// Utility type for updating users
export type UpdateUserInput = Partial<Omit<User, 'id' | 'clerkId' | 'createdAt'>>;

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
  role: UserRoleType;
  createdAt: Date;
  updatedAt: Date | null;
}

export interface Meeting {
  workspaceId: string;
  name: string;
  hostedBy: string;
  description: string | null;
  startAt: Date;
  endAt: Date;
  meetingId: string;
}

export type CreateMeetingInput = Omit<Meeting, 'endAt'>;

export interface AnalyticsData {
  totalUsers: number;
  activeUsers: number;
  totalWorkspaces: number;
  totalMeetings: number;
  userGrowth: { date: string; count: number }[]; // For graphing user growth
}