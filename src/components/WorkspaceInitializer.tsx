"use client";

import { useEffect, useCallback } from "react";
import { useWorkspaceStore } from "@/store/workspace";
import { WorkspaceInitializerProps } from "@/types";

export const WorkspaceInitializer = ({
  workspaceId,
  workspaceName,
  members,
}: WorkspaceInitializerProps) => {
  const { setWorkspace, isInitialized, setInitialized } = useWorkspaceStore();

  const initializeWorkspace = useCallback(() => {
    if (!isInitialized && workspaceId && workspaceName) {
      console.log(
        "Initializing workspace in store:",
        workspaceId,
        workspaceName,
      );

      setWorkspace(workspaceId, workspaceName, members);
      setInitialized(true);
    }
  }, [
    workspaceId,
    workspaceName,
    members,
    setWorkspace,
    isInitialized,
    setInitialized,
  ]);

  useEffect(() => {
    initializeWorkspace();
  }, [initializeWorkspace]);

  return null;
};
