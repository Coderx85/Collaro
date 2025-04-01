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

export interface WorkspaceCheckResponse {
  data?: string;
  error?: string;
  success: boolean;
  status: number;
}
