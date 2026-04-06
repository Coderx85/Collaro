"use server";

import { db, schema } from "@/db";
import { auth } from "@/lib/auth/auth-server";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import type { APIResponse } from "@/types";
import { addMember } from "../member/general-member.actions";
import { getUser } from "../user.actions";

interface ApproveJoinRequestInput {
  requestId: string;
  responderId: string;
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
}: ApproveJoinRequestInput): Promise<APIResponse<ApproveJoinRequestResult>> {
  try {
    // Update join request status to approved
    const [updatedRequest] = await db
      .update(schema.joinRequestsTable)
      .set({
        status: "approved",
        respondedAt: new Date(),
        respondedBy: responderId,
      })
      .where(eq(schema.joinRequestsTable.id, requestId))
      .returning()
      .execute();

    if (!updatedRequest) {
      return { success: false, error: "Failed to update join request status" };
    }

    const memberResult = await addMember({
      userId: updatedRequest.userId,
      workspaceId: updatedRequest.workspaceId,
      role: "member",
    });

    if (!memberResult.success || !memberResult.data) {
      return { success: false, error: "Failed to add member to workspace" };
    }

    // user - org relationship

    const member = await db.query.membersTable.findFirst({
      where: eq(schema.membersTable.userId, updatedRequest.userId),
      with: {
        user: true,
        workspace: true,
      }
    });

    if (!member) {
      return { success: false, error: "Member not found after approval" };
    }

    return {
      success: true,
      data: {
        userName: member.user.userName,
        workspaceSlug: member.workspace.slug,
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
  responderId: string;
}

interface RejectJoinRequestResult {
  userName: string;
}

/**
 * Reject a join request
 */
export async function rejectJoinRequestAction({
  requestId,
  responderId,
}: RejectJoinRequestInput): Promise<APIResponse<RejectJoinRequestResult>> {
  try {
    // Get the join request with user details
    const [joinRequest] = await db
      .select({
        id: schema.joinRequestsTable.id,
        status: schema.joinRequestsTable.status,
        userName: schema.usersTable.userName,
        userFullName: schema.usersTable.name,
      })
      .from(schema.joinRequestsTable)
      .innerJoin(
        schema.usersTable,
        eq(schema.joinRequestsTable.userId, schema.usersTable.id)
      )
      .where(eq(schema.joinRequestsTable.id, requestId))
      .limit(1)
      .execute();

    if (!joinRequest) {
      return { success: false, error: "Join request not found" };
    }

    if (joinRequest.status !== "pending") {
      return { success: false, error: "Join request has already been processed" };
    }

    // Update join request status to rejected
    const [updatedRequest] = await db
      .update(schema.joinRequestsTable)
      .set({
        status: "rejected",
        respondedAt: new Date(),
        respondedBy: responderId,
      })
      .where(eq(schema.joinRequestsTable.id, requestId))
      .returning()
      .execute();

    if (!updatedRequest) {
      return { success: false, error: "Failed to update join request status" };
    }

    const userName = joinRequest.userFullName || joinRequest.userName || "User";

    return {
      success: true,
      data: { userName },
    };
  } catch (error: unknown) {
    console.error("[rejectJoinRequestAction] error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to reject join request",
    };
  }
}
