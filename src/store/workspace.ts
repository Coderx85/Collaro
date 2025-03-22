import { create } from "zustand";

// Define a type for workspace members with roles
type WorkspaceMember = {
  user_id: string;
  role?: string;
};

type WorkspaceState = {
  workspaceId: string | null;
  workspaceName: string | null;
  members?: string[];
  membersWithRoles?: WorkspaceMember[];
  isInitialized: boolean;

  setWorkspace: (id: string, name: string, members?: string[], membersWithRoles?: WorkspaceMember[]) => void;
  clearWorkspace: () => void;
  setInitialized: (value: boolean) => void;
  updateMemberRole: (userId: string, role: string) => void;
};

export const useWorkspaceStore = create<WorkspaceState>((set) => ({
  workspaceId: null,
  workspaceName: null,
  members: [],
  membersWithRoles: [],
  isInitialized: false,
  
  setWorkspace: (id, name, members) => set(
    { 
      workspaceId: id, 
      workspaceName: name, 
      members,
    }
  ),
  clearWorkspace: () => set(
    { workspaceId: null, workspaceName: null, members: [], membersWithRoles: [] }
  ),
  
  setInitialized: (value) => set({ isInitialized: value }),
}));
