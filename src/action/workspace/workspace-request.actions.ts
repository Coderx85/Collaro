"use server";
import type { 
  APIResponse,
  TJoinRequest,
  TWorkspaceId 
} from "@/types";
import { workspaceMemberManager } from "@/modules/member";
import { getCurrentUser } from "../user.actions";
import tryCatch from "@/lib/try-catch-wrapper";


export async function getPendingJoinRequests(
  orgId: TWorkspaceId,
): Promise<APIResponse<{ requests: TJoinRequest[] }>> {
  const joinRequests = await workspaceMemberManager.listJoinRequests(orgId);
  try {
    const res = await workspaceMemberManager.listJoinRequests(orgId);
    if (!res) {
      return {
        success: false,
        error: `Failed to fetch join requests for workspace with ID: ${orgId}`, 
      };
    }

    return { success: true, data: { requests: res } };
  } catch (error: unknown) {
    console.error("[getPendingJoinRequests] error:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to fetch pending join requests",
    };
  }
}

export async function sendJoinWorkspaceRequest(
  workspaceSlug: string,
  workspaceName: string,
): Promise<APIResponse<{ workspaceName: string }>> {
  return tryCatch({
    ctx: async () => {
      const authUser = await getCurrentUser();
      if (!authUser) {
        return {
          success: false,
          error: "User must be authenticated to send join request",
        }
      }

      const workspace = await workspaceMemberManager.findWorkspaceBySlug(workspaceSlug);
      if (!workspace) {
        return {
          success: false,
          error: `Workspace with slug "${workspaceSlug}" not found`,
        };
      }

      await workspaceMemberManager.requestWorkspace(workspace.id, authUser.user.id);

      return {
        success: true,
        data: {
          workspaceName: workspace.name,
        },
      }
    },
    errorMessage: `Failed to send join request for workspace with slug: ${workspaceName}`,
  })
}