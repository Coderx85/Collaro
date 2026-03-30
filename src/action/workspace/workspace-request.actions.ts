"use server";

import { db, schema } from "@/db";
import { and, eq } from "drizzle-orm";
import type { APIResponse, PendingRequest } from "@/types";
import { joinRequestsTable, membersTable, workspacesTable } from "@/db/schema/schema";
import { getCurrentAuthUser } from "./workspace.actions";

export async function getPendingJoinRequests(
  orgId: string,
): Promise<APIResponse<{ requests: PendingRequest[] }>> {
  try {
    console.log("[getPendingJoinRequests] orgId:", orgId);

    const joinRequests = await db
      .select({
        id: schema.joinRequestsTable.id,
        userId: schema.joinRequestsTable.userId,
        status: schema.joinRequestsTable.status,
        requestedAt: schema.joinRequestsTable.requestedAt,
        userName: schema.usersTable.userName,
        userFullName: schema.usersTable.name,
        userEmail: schema.usersTable.email,
      })
      .from(schema.joinRequestsTable)
      .innerJoin(
        schema.usersTable,
        eq(schema.joinRequestsTable.userId, schema.usersTable.id),
      )
      .where(
        and(
          eq(schema.joinRequestsTable.workspaceId, orgId),
          eq(schema.joinRequestsTable.status, "pending"),
        ),
      );

    console.log(
      "[getPendingJoinRequests] matched pending rows:",
      joinRequests.length,
    );

    const pendingRequests: PendingRequest[] = joinRequests.map((req) => {
      const displayName = req.userFullName || req.userName || "";
      return {
        id: req.id,
        userId: req.userId,
        userName: req.userName || displayName,
        userEmail: req.userEmail || "",
        userFullName: displayName,
        status: req.status,
        requestedAt: req.requestedAt,
      };
    });

    console.log(
      "[getPendingJoinRequests] mapped requests:",
      pendingRequests.length,
    );

    return { success: true, data: { requests: pendingRequests } };
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

async function updateJoinRequestStatus(
  requestId: string,
  userId: string,
  status: "approved" | "rejected",
): Promise<APIResponse<{ userName: string }>> {
  try {
    const [joinRequest] = await db
      .select({
        id: schema.joinRequestsTable.id,
        userName: schema.usersTable.userName,
        userFullName: schema.usersTable.name,
      })
      .from(schema.joinRequestsTable)
      .innerJoin(
        schema.usersTable,
        eq(schema.joinRequestsTable.userId, schema.usersTable.id),
      )
      .where(eq(schema.joinRequestsTable.id, requestId))
      .limit(1)
      .execute();

    if (!joinRequest) {
      return { success: false, error: "Join request not found" };
    }

    const [sql] = await db
      .update(schema.joinRequestsTable)
      .set({
        status,
        respondedAt: new Date(),
        respondedBy: userId,
      })
      .where(eq(schema.joinRequestsTable.id, requestId))
      .returning()
      .execute();

    if (!sql) {
      return { success: false, error: "Failed to update join request status" };
    }

    const userName = joinRequest.userFullName || joinRequest.userName || "";

    if (!userName) {
      return { success: false, error: "Join request user name missing" };
    }

    return { success: true, data: { userName } };
  } catch (error: unknown) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "An unexpected error occurred",
    };
  }
}

/**
 * @deprecated Use `approveJoinRequestAction` from `@/action/notification` instead.
 * This function only updates status but does NOT add the member to the organization.
 */
export async function approveJoinRequest(
  requestId: string,
  userId: string,
): Promise<APIResponse<{ userName: string }>> {
  return updateJoinRequestStatus(requestId, userId, "approved");
}

/**
 * @deprecated Use `rejectJoinRequestAction` from `@/action/notification` instead.
 */
export async function rejectJoinRequest(
  requestId: string,
  userId: string,
): Promise<APIResponse<{ userName: string }>> {
  return updateJoinRequestStatus(requestId, userId, "rejected");
}

export async function sendJoinWorkspaceRequest(
  workspaceSlug: string,
  workspaceName: string,
): Promise<APIResponse<{ workspaceName: string }>> {
  try {
    console.log("[sendJoinWorkspaceRequest] input:", {
      workspaceSlug,
      workspaceName,
    });

    const authUser = await getCurrentAuthUser();

    if (!authUser) {
      return { error: "User not authenticated", success: false };
    }

    // First check if workspace exists with this slug
    const workspace = await db
      .select()
      .from(workspacesTable)
      .where(eq(workspacesTable.slug, workspaceSlug))
      .execute();

    if (!workspace || workspace.length === 0) {
      return { error: "Workspace not found", success: false };
    }

    const workspaceId = workspace[0].id;

    console.log("[sendJoinWorkspaceRequest] workspace found:", {
      id: workspaceId,
      slug: workspace[0].slug,
      name: workspace[0].name,
    });

    // Check if user is already a member
    const existingMember = await db
      .select()
      .from(membersTable)
      .where(
        and(
          eq(membersTable.userId, authUser.id),
          eq(membersTable.workspaceId, workspaceId),
        ),
      )
      .execute();

    if (existingMember && existingMember.length > 0) {
      return { error: "You are already a member of this workspace", success: false };
    }

    // Check if request already exists
    const existingRequest = await db
      .select()
      .from(joinRequestsTable)
      .where(
        and(
          eq(joinRequestsTable.userId, authUser.id),
          eq(joinRequestsTable.workspaceId, workspaceId),
          eq(joinRequestsTable.status, "pending"),
        ),
      )
      .execute();

    if (existingRequest && existingRequest.length > 0) {
      return { error: "You have already sent a request to join this workspace", success: false };
    }

    const [res] = await db
      .insert(joinRequestsTable)
      .values({
        userId: authUser.id || "",
        workspaceId: workspaceId,
        status: "pending",
        requestedAt: new Date(),
      })
      .returning()
      .execute();

    console.log("[sendJoinWorkspaceRequest] inserted join request:", res?.id);

    if (!res) {
      return {
        success: false,
        error: `Failed to create join request in DB for workspace: ${workspaceName}`,
      };
    }

    return {
      success: true,
      data: {
        workspaceName: workspace[0].name,
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