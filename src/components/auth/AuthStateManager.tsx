"use client";

import { useSession } from "@/lib/auth-client";
import { useUserStore } from "@/store/user";
import { useWorkspaceStore } from "@/store/workspace";
import { useEffect, useCallback } from "react";

/**
 * AuthStateManager - Handles post-signin data fetchings
 *
 * WHY: This component runs immediately after better-auth authentication
 * WHEN: Triggered when session becomes available
 * HOW: Fetches user data from database and updates stores
 */
export const AuthStateManager = () => {
  const { data: session, isPending } = useSession();
  const {
    setUserData,
    clearUserData,
    setDataLoaded,
    isAuthenticated,
    isDataLoaded,
  } = useUserStore();
  const { setWorkspace, clearWorkspace } = useWorkspaceStore();

  const fetchUserData = useCallback(async () => {
    if (!session?.user?.id) return;

    try {
      const response = await fetch("/api/user/me");
      const result = await response.json();

      if (result.success && result.data) {
        const userData = result.data;

        // Update user store with all data including workspaceName
        setUserData({
          email: userData.email || session.user.email || "",
          name: userData.name || session.user.name || "",
          userId: userData.userId || session.user.id,
          userName: userData.userName || session.user.userName,
          currentWorkspaceId: userData.currentWorkspaceId,
          currentWorkspaceName: userData.currentWorkspaceName,
          role: userData.role,
        });

        // Also update workspace store if user has a workspace
        if (userData.currentWorkspaceId && userData.currentWorkspaceName) {
          setWorkspace(
            userData.currentWorkspaceId,
            userData.currentWorkspaceName
          );
        }

        setDataLoaded(true);
        console.log("✅ User data loaded successfully:", {
          userName: userData.userName,
          workspaceName: userData.currentWorkspaceName,
        });
      } else {
        // Use session data directly if API failed
        setUserData({
          email: session.user.email || "",
          name: session.user.name || "",
          userId: session.user.id,
          userName: session.user.userName || "",
          currentWorkspaceId: null,
          currentWorkspaceName: null,
          role: "member",
        });
        setDataLoaded(true);
        console.warn("⚠️ Using session data, API fetch failed:", result.error);
      }
    } catch (error) {
      console.error("❌ Error fetching user data:", error);
    }
  }, [session?.user, setUserData, setWorkspace, setDataLoaded]);

  const handleSignOut = useCallback(() => {
    clearUserData();
    clearWorkspace();
    console.log("🔄 User data cleared on sign out");
  }, [clearUserData, clearWorkspace]);

  // Effect: Handle authentication state changes
  useEffect(() => {
    if (isPending) return;

    if (session?.user) {
      // User signed in - check if we need to fetch data
      if (!isAuthenticated || !isDataLoaded) {
        console.log("🔄 Fetching user data after sign in...");
        fetchUserData();
      }
    } else {
      // User signed out
      if (isAuthenticated) {
        handleSignOut();
      }
    }
  }, [
    isPending,
    session,
    isAuthenticated,
    isDataLoaded,
    fetchUserData,
    handleSignOut,
  ]);

  // This component doesn't render anything
  return null;
};
