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
