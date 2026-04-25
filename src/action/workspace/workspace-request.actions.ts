"use server";
import type { 
  APIResponse,
  JoinRequest,
  TWorkspaceId 
} from "@/types";
import { workspaceMemberManager } from "@/modules/member";
import { userService } from "@/modules/user";
import { getCurrentUser } from "../user.actions";
import tryCatch from "@/lib/try-catch-wrapper";


export async function getPendingJoinRequests(
  orgId: TWorkspaceId,
): Promise<APIResponse<{ requests: JoinRequest[] }>> {
  try {
    const dto: JoinRequest[] = [];

    const joinRequests = await workspaceMemberManager.listJoinRequests(orgId);

    if (!joinRequests) {
      return {
        success: false,
        error: `Failed to fetch join requests for workspace with ID: ${orgId}`, 
      };
    }

    for (const req of joinRequests) {
      const user = await userService.getUser(req.userId);
      
      if (!user) {
        throw new Error(`User not found for join request with ID: ${req.id}`);
      }
      
      // Combine request data with user data into a single DTO
      dto.push({
        ...req,
        user,
      });
    }

    return { success: true, data: { requests: dto } };
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