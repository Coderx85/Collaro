'use client';

import { useEffect } from 'react';
import { useWorkspaceStore } from '@/store/workspace';

interface WorkspaceInitializerProps {
  workspaceId?: string;
  workspaceName?: string;
  members?: string[];
}

export const WorkspaceInitializer = ({ 
  workspaceId, 
  workspaceName, 
  members
}: WorkspaceInitializerProps) => {
  const { setWorkspace, isInitialized, setInitialized } = useWorkspaceStore();

  useEffect(() => {
    if (!isInitialized && workspaceId && workspaceName) {
      console.log('Initializing workspace in store:', workspaceId, workspaceName);
      
      setWorkspace(workspaceId, workspaceName, members);
      setInitialized(true);
    }
  }, [workspaceId, workspaceName, members, setWorkspace, isInitialized, setInitialized]);

  return null;
};
