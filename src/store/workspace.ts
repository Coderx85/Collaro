import { create } from "zustand";

type WorkspaceState = {
  workspaceId: string | null;
  workspaceName: string | null;
  members: string[];

  setWorkspace: (id: string, name: string, members: string[]) => void;
  clearWorkspace: () => void;
};

export const useWorkspaceStore = create<WorkspaceState>((set) => ({
  workspaceId: null,
  workspaceName: null,
  members: [],
  
  setWorkspace: (id, name, members) => set(
    { workspaceId: id, workspaceName: name, members }
  ),
  clearWorkspace: () => set(
    { workspaceId: null, workspaceName: null, members: [] }
  ),
}));
