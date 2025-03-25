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
