export type memberstore = {
  id: string;
  name: string;
  userName: string;
  email: string;
  role: string;
};

export type WorkspaceState = {
  workspaceId: string | null;
  workspaceName: string | null;
  members?: memberstore[];
  isInitialized: boolean;

  setWorkspace: (
    id: string,
    name: string,
    members?: {
      id: string;
      name: string;
      userName: string;
      email: string;
      role: string;
    }[],
  ) => void;
  clearWorkspace: () => void;
  setInitialized: (value: boolean) => void;
};