import type { WorkspaceState } from "@/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useWorkspaceStore = create<WorkspaceState>()(
  persist(
    (set) => ({
      workspaceId: null,
      workspaceName: null,
      workspaceSlug: null,
      members: [],
      isInitialized: false,

      setWorkspace: (id, name, slug, members) =>
        set({
          workspaceId: id,
          workspaceName: name,
          workspaceSlug: slug,
          members: members || [],
          isInitialized: true,
        }),

      updateWorkspaceSlug: (slug) =>
        set({
          workspaceSlug: slug,
        }),

      clearWorkspace: () =>
        set({
          workspaceId: null,
          workspaceName: null,
          workspaceSlug: null,
          members: [],
          isInitialized: false,
        }),

      setInitialized: (value) => set({ isInitialized: value }),
    }),
    {
      name: "workspace-storage", // localStorage key
      partialize: (state) => ({
        // Persist workspace info across sessions
        workspaceId: state.workspaceId,
        workspaceName: state.workspaceName,
        workspaceSlug: state.workspaceSlug,
        isInitialized: state.isInitialized,
      }),
    }
  )
);

// Re-export user store for convenience
export { useUserStore } from "./user";
