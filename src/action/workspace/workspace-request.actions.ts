"use server";
import type { 
  APIResponse,
  JoinRequest,
  TUserId,
  TWorkspaceId 
} from "@/types";
import { workspaceRequestTable, membersTable, workspacesTable } from "@/db/schema/schema";
import { getCurrentAuthUser } from "./workspace.actions";
import { workspaceMemberManager } from "@/modules/member";
import { userService } from "@/modules/user";


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
  try {
    const authUser = await getCurrentAuthUser();

    if (!authUser) {
      return { error: "User not authenticated", success: false };
    }

    const workspace = await workspaceMemberManager.findWorkspaceBySlug(workspaceSlug);

    const authID = authUser.id as unknown as TUserId;

    await workspaceMemberManager.requestWorkspace(workspace!.id, authID);

    return {
      success: true,
      data: {
        workspaceName: workspace!.name,
      },
    };
  } catch (error: unknown) {
    return {
      success: false,
      error: `Failed to send join request: ${
        error instanceof Error ? error.message : "An unknown error occurred"
      }`,
    };
  }
}