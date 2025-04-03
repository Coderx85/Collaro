import { WorkspaceState } from "@/types";
import { create } from "zustand";

export const useWorkspaceStore = create<WorkspaceState>((set) => ({
  workspaceId: null,
  workspaceName: null,
  members: [
    {
      id: "",
      name: "",
      userName: "",
      email: "",
      role: "",
    },
  ],
  isInitialized: false,

  setWorkspace: (id, name, members) =>
    set({
      workspaceId: id,
      workspaceName: name,
      members: members
        ? members
        : [
            {
              id: "",
              name: "",
              userName: "",
              email: "",
              role: "",
            },
          ],
    }),
  clearWorkspace: () =>
    set({ workspaceId: null, workspaceName: null, members: [] }),

  setInitialized: (value) => set({ isInitialized: value }),
}));
