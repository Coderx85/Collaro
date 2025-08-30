import { WorkspaceState } from "@/types";
import { create } from "zustand";

export const useWorkspaceStore = create<WorkspaceState>((set) => ({
  workspaceId: null,
  workspaceName: null,
  isInitialized: false,

  setWorkspace: (id, name) =>
    set({
      workspaceId: id,
      workspaceName: name,
    }),

  clearWorkspace: () =>
    set({ workspaceId: null, workspaceName: null }),
  
  setInitialized: (value) => set({ isInitialized: value }),
}));