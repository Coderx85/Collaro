"use server";

import type { APIResponse, TInviteMemberRole, TMemberId, TRequestId, TUserId, TWorkspaceId } from "@/types";
import { workspaceMemberManager } from "@/modules/member";

interface ApproveJoinRequestInput {
  requestId: string;
  responderId: TMemberId;
  workspaceId: TWorkspaceId;
  role: TInviteMemberRole;
}

interface ApproveJoinRequestResult {
  userName: string;
  workspaceSlug: string;
}

/**
 * Approve a join request and add the user to the organization
 * Uses Better Auth's addMember API for proper member management
 */
export async function approveJoinRequestAction({
  requestId,
  responderId,
  role,
  workspaceId
}: ApproveJoinRequestInput): Promise<APIResponse<ApproveJoinRequestResult>> {
  try {
    const requestID = requestId as unknown as TRequestId;

    const member = await workspaceMemberManager.getMemberDetails({
      userId: responderId as unknown as TUserId,
      workspaceId: workspaceId!,
    })

    if (!member) {
      return { success: false, error: "Member not found after approval" };
    }

    const result = await workspaceMemberManager.approveJoinRequest(requestID, member.id, role);

    const workspace = await workspaceMemberManager.findWorkspaceById(workspaceId);

    return {
      success: true,
      data: {
        userName: result.name,
        workspaceSlug: workspace!.slug,
      },
    };
  } catch (error: unknown) {
    console.error("[approveJoinRequestAction] error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to approve join request",
    };
  }
}

interface RejectJoinRequestInput {
  requestId: string;
  responderId: TMemberId;
}

interface RejectJoinRequestResult {
  message: string;
}

/**
 * Reject a join request
 */
export async function rejectJoinRequestAction({
  requestId,
  responderId
}: RejectJoinRequestInput): Promise<APIResponse<RejectJoinRequestResult>> {
  try {
    // Get the join request with user details

    const requestID = requestId as unknown as TRequestId;

    await workspaceMemberManager.rejectJoinRequest(requestID, responderId);



    return {
      success: true,
      data: { message: "Join request rejected successfully" },
    };
  } catch (error: unknown) {
    console.error("[rejectJoinRequestAction] error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to reject join request",
    };
  }
}
