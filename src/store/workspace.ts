import { create } from "zustand";

type WorkspaceState = {
  workspaceId: string | null;
  workspaceName: string | null;
  members?: {
    id: string;
    name: string;
    userName: string;
    email: string;
    role: string;
  }[];
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
