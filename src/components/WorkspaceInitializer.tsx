"use client";

import { useEffect } from "react";
import { useWorkspaceStore } from "@/store/workspace";
import { WorkspaceInitializerProps } from "@/types";

export const WorkspaceInitializer = ({
  workspaceId,
  workspaceName,
  members,
}: WorkspaceInitializerProps) => {
  const { setWorkspace, isInitialized, setInitialized } = useWorkspaceStore();

  useEffect(() => {
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

  return null;
};
