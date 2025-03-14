export type APIResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
}

export type UserResponse = {
  id: string;
  name: string;
  email: string;
  userName: string;
  role: string;
  workspaceId: string;
  createdAt: string;
  updatedAt: string | null;
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