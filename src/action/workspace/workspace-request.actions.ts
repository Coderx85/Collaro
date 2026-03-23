"use server";

import { db, schema } from "@/db";
import { and, eq } from "drizzle-orm";
import { APIResponse } from "@/types";

export interface PendingRequest {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  userFullName: string;
  status: string;
  requestedAt: Date;
}

export async function getPendingJoinRequests(
  orgId: string,
): Promise<APIResponse<{ requests: PendingRequest[] }>> {
  try {
    console.log("[getPendingJoinRequests] orgId:", orgId);

    const joinRequests = await db.query.joinRequestsTable.findMany({
      where: and(
        eq(schema.joinRequestsTable.workspaceId, orgId),
        eq(schema.joinRequestsTable.status, "pending"),
      ),
      with: {
        user: true,
      },
    });

    console.log(
      "[getPendingJoinRequests] matched pending rows:",
      joinRequests.length,
    );

    const pendingRequests: PendingRequest[] = joinRequests.flatMap((req) => {
      if (!req.user) {
        console.log(
          "[getPendingJoinRequests] skip row with missing user:",
          req.id,
        );
        return [];
      }

      return {
        id: req.id,
        userId: req.userId,
        userName: req.user.name || req.user.userName || "",
        userEmail: req.user.email || "",
        userFullName: req.user.name || req.user.userName || "",
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

interface WorkspaceRequestActions {
  getPendingJoinRequests: (orgId: string) => Promise<APIResponse<{ requests: PendingRequest[] }>>;
  approveJoinRequest: (requestId: string, userId: string) => Promise<APIResponse<{ userName: string }>>;
  rejectJoinRequest: (requestId: string, userId: string) => Promise<APIResponse<{ userName: string }>>;
}

export class WorkspaceRequestService implements WorkspaceRequestActions {
  private updateJoinRequestStatus = async (requestId: string, userId: string, status: "approved" | "rejected"): Promise<APIResponse<{ userName: string }>> => {
    try {
      const joinRequest = await db.query.joinRequestsTable.findFirst({
        where: eq(schema.joinRequestsTable.id, requestId),
        with: {
          user: true
        }
      }).then(async (req) => {
        if (!req) throw new Error("Join request not found");

        const [sql] = await db.update(schema.joinRequestsTable).set({
          status,
          respondedAt: new Date(),
          respondedBy: userId,
        }).where(eq(schema.joinRequestsTable.id, requestId)).returning().execute();

        if (!sql) throw new Error("Failed to update join request status");

        return req;
      });

      if (!joinRequest) {
        return { success: false, error: "Join request not found" };
      }

      if (!joinRequest.user) {
        return { success: false, error: "Join request user not found" };
      }

      const userName = joinRequest.user.name || joinRequest.user.userName || "";

      if (!userName) {
        return { success: false, error: "Join request user name missing" };
      }

      return { success: true, data: { userName } };
    } catch (error: unknown) {
      return { success: false, error: error instanceof Error ? error.message : "An unexpected error occurred" };
    }
  };

  async getPendingJoinRequests(orgId: string): Promise<APIResponse<{ requests: PendingRequest[] }>> {
    try {
    const joinRequests = await db.query.joinRequestsTable.findMany({
      where: eq(schema.joinRequestsTable.workspaceId, orgId),
      with: {
        user: true,
      }
    })

    if (!joinRequests) {
      return { success: false, error: "Failed to fetch pending join requests" };
    }
  
    const pendingRequests: PendingRequest[] = joinRequests.flatMap((req) => {
      if (!req.user) {
        return [];
      }

      return {
        id: req.id,
        userId: req.userId,
        userName: req.user?.name || req.user?.userName || "",
        userEmail: req.user?.email || "",
        userFullName: req.user?.name || req.user?.userName || "",
        status: req.status,
        requestedAt: req.requestedAt
      }
    });
  
    return { success: true, data: { requests: pendingRequests } };
  } catch (error) {
    return { success: false, error: "Failed to fetch pending join requests" };
  }
  }

  async approveJoinRequest(requestId: string, userId: string): Promise<APIResponse<{ userName: string }>> {
    return this.updateJoinRequestStatus(requestId, userId, "approved");
  }

  async rejectJoinRequest(requestId: string, userId: string): Promise<APIResponse<{ userName: string }>> {
    return this.updateJoinRequestStatus(requestId, userId, "rejected");
  }
}

export async function approveJoinRequest(
  requestId: string,
  userId: string,
): Promise<APIResponse<{ userName: string }>> {
  try {
    const joinRequest = await db.query.joinRequestsTable.findFirst({
      where: eq(schema.joinRequestsTable.id, requestId),
      with: {
        user: true
      }
    }).then(async (req) => {
      if (!req) throw new Error("Join request not found");

      const [sql] = await db.update(schema.joinRequestsTable).set({
        status: "approved",
        respondedAt: new Date(),
        respondedBy: userId,
      }).where(eq(schema.joinRequestsTable.id, requestId)).returning().execute();

      if (!sql) throw new Error("Failed to update join request status");

      return req;
    });

    if (!joinRequest) {
      return { success: false, error: "Join request not found" };
    }

    if (!joinRequest.user) {
      return { success: false, error: "Join request user not found" };
    }

    const userName = joinRequest.user.name || joinRequest.user.userName || "";

    if (!userName) {
      return { success: false, error: "Join request user name missing" };
    }

    return { success: true, data: { userName } };
  } catch (error: unknown) {
    return { success: false, error: error instanceof Error ? error.message : "An unexpected error occurred" };
  }
}

export async function rejectJoinRequest(requestId: string, userId: string): Promise<APIResponse<{ userName: string }>> {
  try {
    
    const joinRequest = await db.query.joinRequestsTable.findFirst({
      where: eq(schema.joinRequestsTable.id, requestId),
      with: {
        user: true
      }
    }).then(async (req) => {
      if (!req) throw new Error("Join request not found");

      const [sql] = await db.update(schema.joinRequestsTable).set({
        status: "rejected",
        respondedAt: new Date(),
        respondedBy: userId,
      }).where(eq(schema.joinRequestsTable.id, requestId)).returning().execute();

      if (!sql) throw new Error("Failed to update join request status");

      return req;
    });

    if (!joinRequest) {
      return { success: false, error: "Join request not found" };
    }

    if (!joinRequest.user) {
      return { success: false, error: "Join request user not found" };
    }

    const userName = joinRequest.user.name || joinRequest.user.userName || "";

    if (!userName) {
      return { success: false, error: "Join request user name missing" };
    }

    return { success: true, data: { userName } };
  } catch (error: unknown) {
    return { success: false, error: error instanceof Error ? error.message : "An unexpected error occurred" };
  }
}
