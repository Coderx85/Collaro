"use server";

import { db, schema } from "@/db";
import { auth } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import type { APIResponse } from "@/types";

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
    // Get the join request with user and workspace details
    const [joinRequest] = await db
      .select({
        id: schema.joinRequestsTable.id,
        userId: schema.joinRequestsTable.userId,
        workspaceId: schema.joinRequestsTable.workspaceId,
        status: schema.joinRequestsTable.status,
        userName: schema.usersTable.userName,
        userFullName: schema.usersTable.name,
        workspaceSlug: schema.workspacesTable.slug,
      })
      .from(schema.joinRequestsTable)
      .innerJoin(
        schema.usersTable,
        eq(schema.joinRequestsTable.userId, schema.usersTable.id)
      )
      .innerJoin(
        schema.workspacesTable,
        eq(schema.joinRequestsTable.workspaceId, schema.workspacesTable.id)
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

    // Add user to the organization using Better Auth API
    await auth.api.addMember({
      headers: await headers(),
      body: {
        organizationId: joinRequest.workspaceId,
        userId: joinRequest.userId,
        role: "member",
      },
    });

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

    const userName = joinRequest.userFullName || joinRequest.userName || "User";

    return {
      success: true,
      data: {
        userName,
        workspaceSlug: joinRequest.workspaceSlug,
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
