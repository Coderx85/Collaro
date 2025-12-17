"use client";

import { useUserStore } from "@/store/user";
import { useWorkspaceStore } from "@/store/workspace";

/**
 * Custom hook to access user signin and workspace data
 *
 * Usage:
 * const { userInfo, workspaceInfo, isReady } = useAuthData();
 */
export const useAuthData = () => {
  const userStore = useUserStore();
  const workspaceStore = useWorkspaceStore();

  return {
    // User Information
    userInfo: {
      clerkId: userStore.clerkId,
      userId: userStore.userId,
      email: userStore.email,
      name: userStore.name,
      userName: userStore.userName,
      role: userStore.role,
    },

    // Workspace Information
    workspaceInfo: {
      currentWorkspaceId: userStore.currentWorkspaceId,
      currentWorkspaceName: userStore.currentWorkspaceName,
      // Also available from workspace store
      workspaceId: workspaceStore.workspaceId,
      workspaceName: workspaceStore.workspaceName,
      members: workspaceStore.members,
    },

    // State
    isAuthenticated: userStore.isAuthenticated,
    isDataLoaded: userStore.isDataLoaded,
    isReady: userStore.isAuthenticated && userStore.isDataLoaded,

    // Actions
    actions: {
      updateWorkspace: userStore.updateWorkspace,
      clearUserData: userStore.clearUserData,
      setWorkspace: workspaceStore.setWorkspace,
      clearWorkspace: workspaceStore.clearWorkspace,
    },
  };
};
