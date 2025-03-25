import { create } from "zustand";

type WorkspaceState = {
  workspaceId: string | null;
  workspaceName: string | null;
  members?: string[];
  isInitialized: boolean;

  setWorkspace: (id: string, name: string, members?: string[]) => void;
  clearWorkspace: () => void;
  setInitialized: (value: boolean) => void;
};

export const useWorkspaceStore = create<WorkspaceState>((set) => ({
  workspaceId: null,
  workspaceName: null,
  members: [],
  isInitialized: false,

  setWorkspace: (id, name, members) =>
    set({
      workspaceId: id,
      workspaceName: name,
      members,
    }),
  clearWorkspace: () =>
    set({ workspaceId: null, workspaceName: null, members: [] }),

  setInitialized: (value) => set({ isInitialized: value }),
}));
