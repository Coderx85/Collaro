import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { UserState } from "@/types";

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      email: null,
      name: null,

      // Database Data
      userId: null,
      userName: null,
      currentWorkspaceId: null,
      currentWorkspaceName: null,
      role: null,

      isAuthenticated: false,
      isDataLoaded: false,

      setUserData: (userData) =>
        set({
          email: userData.email,
          name: userData.name,
          userId: userData.userId,
          userName: userData.userName,
          currentWorkspaceId: userData.currentWorkspaceId,
          currentWorkspaceName: userData.currentWorkspaceName,
          role: userData.role,
          isAuthenticated: true,
        }),

      clearUserData: () =>
        set({
          email: null,
          name: null,
          userId: null,
          userName: null,
          currentWorkspaceId: null,
          currentWorkspaceName: null,
          role: null,
          isAuthenticated: false,
          isDataLoaded: false,
        }),

      setDataLoaded: (loaded) => set({ isDataLoaded: loaded }),

      updateWorkspace: (workspaceId, workspaceName) =>
        set({
          currentWorkspaceId: workspaceId,
          currentWorkspaceName: workspaceName,
        }),
    }),
    {
      name: "user-storage", // Key for localStorage
      partialize: (state) => ({
        // Only persist essential data
        email: state.email,
        name: state.name,
        userId: state.userId,
        userName: state.userName,
        currentWorkspaceId: state.currentWorkspaceId,
        currentWorkspaceName: state.currentWorkspaceName,
        role: state.role,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
