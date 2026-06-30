export type memberstore = {
  id: string;
  name: string;
  userName: string;
  email: string;
  role: string;
};

// New User/Auth Store Type
export type UserState = {
  email: string | null;
  name: string | null;

  // Database Data
  userId: string | null; // Database user ID
  userName: string | null;
  currentWorkspaceId: string | null;
  currentWorkspaceName: string | null;
  role: string | null;

  // State Management
  isAuthenticated: boolean;
  isDataLoaded: boolean;

  // Actions
  setUserData: (userData: {
    email: string;
    name: string;
    userId: string;
    userName: string;
    currentWorkspaceId: string | null;
    currentWorkspaceName: string | null;
    role: string;
  }) => void;
  clearUserData: () => void;
  setDataLoaded: (loaded: boolean) => void;
  updateWorkspace: (workspaceId: string, workspaceName: string) => void;
};

export type WorkspaceState = {
  workspaceId: string | null;
  workspaceName: string | null;
  workspaceSlug: string | null;
  members?: memberstore[];
  isInitialized: boolean;

  setWorkspace: (
    id: string,
    name: string,
    slug: string,
    members?: memberstore[]
  ) => void;
  updateWorkspaceSlug: (slug: string) => void;
  clearWorkspace: () => void;
  setInitialized: (value: boolean) => void;
};
