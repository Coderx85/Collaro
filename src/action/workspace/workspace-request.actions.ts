"use server";

import { db, schema } from "@/db";
import { and, eq } from "drizzle-orm";
import type { APIResponse, PendingRequest } from "@/types";

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

export async function approveJoinRequest(
  requestId: string,
  userId: string,
): Promise<APIResponse<{ userName: string }>> {
  return updateJoinRequestStatus(requestId, userId, "approved");
}

export async function rejectJoinRequest(
  requestId: string,
  userId: string,
): Promise<APIResponse<{ userName: string }>> {
  return updateJoinRequestStatus(requestId, userId, "rejected");
}
