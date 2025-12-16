"use client";

import { useUser } from "@clerk/nextjs";
import { useUserStore } from "@/store/user";
import { useWorkspaceStore } from "@/store/workspace";
import { useEffect, useCallback } from "react";

/**
 * AuthStateManager - Handles post-signin data fetching
 * 
 * WHY: This component runs immediately after Clerk authentication
 * WHEN: Triggered when user.isSignedIn becomes true
 * HOW: Fetches user data from database and updates stores
 */
export const AuthStateManager = () => {
  const { user, isSignedIn, isLoaded } = useUser();
  const { 
    setUserData, 
    clearUserData, 
    setDataLoaded,
    isAuthenticated,
    isDataLoaded,
    clerkId 
  } = useUserStore();
  const { setWorkspace, clearWorkspace } = useWorkspaceStore();

  const fetchUserData = useCallback(async () => {
    if (!user?.id) return;

    try {
      const response = await fetch("/api/user/me");
      const result = await response.json();

      if (result.success && result.data) {
        const userData = result.data;
        
        // Update user store with all data including workspaceName
        setUserData({
          clerkId: userData.clerkId,
          email: userData.email || user.primaryEmailAddress?.emailAddress || "",
          name: userData.name || user.fullName || "",
          userId: userData.userId,
          userName: userData.userName,
          currentWorkspaceId: userData.currentWorkspaceId,
          currentWorkspaceName: userData.currentWorkspaceName,
          role: userData.role,
        });

        // Also update workspace store if user has a workspace
        if (userData.currentWorkspaceId && userData.currentWorkspaceName) {
          setWorkspace(userData.currentWorkspaceId, userData.currentWorkspaceName);
        }

        setDataLoaded(true);
        console.log("✅ User data loaded successfully:", {
          userName: userData.userName,
          workspaceName: userData.currentWorkspaceName,
        });
      } else {
        console.error("❌ Failed to fetch user data:", result.error);
      }
    } catch (error) {
      console.error("❌ Error fetching user data:", error);
    }
  }, [user?.id, user?.primaryEmailAddress?.emailAddress, user?.fullName, setUserData, setWorkspace, setDataLoaded]);

  const handleSignOut = useCallback(() => {
    clearUserData();
    clearWorkspace();
    console.log("🔄 User data cleared on sign out");
  }, [clearUserData, clearWorkspace]);

  // Effect: Handle authentication state changes
  useEffect(() => {
    if (!isLoaded) return;

    if (isSignedIn && user) {
      // User signed in - check if we need to fetch data
      if (!isAuthenticated || clerkId !== user.id || !isDataLoaded) {
        console.log("🔄 Fetching user data after sign in...");
        fetchUserData();
      }
    } else {
      // User signed out
      if (isAuthenticated) {
        handleSignOut();
      }
    }
  }, [isLoaded, isSignedIn, user, isAuthenticated, clerkId, isDataLoaded, fetchUserData, handleSignOut]);

  // This component doesn't render anything
  return null;
};
