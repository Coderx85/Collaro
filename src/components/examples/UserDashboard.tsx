"use client";

import { useAuthData } from "@/hooks/useAuthData";
import { useEffect } from "react";

/**
 * Example component showing how to use the auth data
 */
export const UserDashboard = () => {
  const { userInfo, workspaceInfo, isReady } = useAuthData();

  useEffect(() => {
    if (isReady) {
      console.log("🎉 User is ready with data:", {
        userName: userInfo.userName,
        workspaceName: workspaceInfo.currentWorkspaceName,
        role: userInfo.role,
      });
    }
  }, [isReady, userInfo, workspaceInfo]);

  if (!isReady) {
    return <div>Loading user data...</div>;
  }

  return (
    <div className="p-6">
      <h1>Welcome, {userInfo.name}!</h1>
      <div className="mt-4 space-y-2">
        <p>
          <strong>Username:</strong> {userInfo.userName}
        </p>
        <p>
          <strong>Email:</strong> {userInfo.email}
        </p>
        <p>
          <strong>Role:</strong> {userInfo.role}
        </p>
        {workspaceInfo.currentWorkspaceName && (
          <p>
            <strong>Current Workspace:</strong>{" "}
            {workspaceInfo.currentWorkspaceName}
          </p>
        )}
      </div>
    </div>
  );
};
