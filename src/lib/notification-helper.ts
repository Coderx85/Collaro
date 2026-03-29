import { db } from "@/db/client";
import { notificationsTable, membersTable } from "@/db/schema/schema";
import { INotification } from "@/types";
import { eq, and } from "drizzle-orm";

/**
 * Create a single notification for a user
 */
export async function createNotification(
  data: INotification
): Promise<{ success: boolean; id?: string; error?: string }> {
  try {
    const [notification] = await db
      .insert(notificationsTable)
      .values(data)
      .returning({ id: notificationsTable.id });

    if (!notification) {
      return { success: false, error: "Failed to create notification" };
    }

    return { success: true, id: notification.id };
  } catch (error: unknown) {
    return {
      success: false,
      error: `Failed to create notification: ${
        error instanceof Error ? error.message : "An unknown error occurred"
      }`,
    };
  }
}

/**
 * Create notifications for multiple users
 */
export async function createNotificationsForUsers(
  userIds: string[],
  data: Omit<INotification, "userId">
): Promise<{
  success: boolean;
  created: number;
  error?: string;
}> {
  try {
    const notifications = userIds.map((userId) => ({
      ...data,
      userId,
    }));

    const created = await db
      .insert(notificationsTable)
      .values(notifications)
      .returning({ id: notificationsTable.id });

    return { success: true, created: created.length };
  } catch (error: unknown) {
    return {
      success: false,
      created: 0,
      error: `Failed to create notifications: ${
        error instanceof Error ? error.message : "An unknown error occurred"
      }`,
    };
  }
}

/**
 * Create notifications for all workspace admins
 */
export async function createNotificationForWorkspaceAdmins(
  workspaceId: string,
  data: Omit<INotification, "userId" | "workspaceId">
): Promise<{
  success: boolean;
  created: number;
  error?: string;
}> {
  try {
    // Get all admins and owners in the workspace
    const admins = await db
      .select({ userId: membersTable.userId })
      .from(membersTable)
      .where(
        and(
          eq(membersTable.workspaceId, workspaceId),
          // Note: adjust based on your actual role names (owner/admin/etc)
        )
      )
      .execute();

    // Filter for admins and owners (you might need to adjust this)
    const adminUserIds = admins.map((admin) => admin.userId);

    if (adminUserIds.length === 0) {
      return { success: true, created: 0 };
    }

    const notifications = adminUserIds.map((userId) => ({
      ...data,
      userId,
      workspaceId,
    }));

    const created = await db
      .insert(notificationsTable)
      .values(notifications)
      .returning({ id: notificationsTable.id });

    return { success: true, created: created.length };
  } catch (error: unknown) {
    return {
      success: false,
      created: 0,
      error: `Failed to create admin notifications: ${
        error instanceof Error ? error.message : "An unknown error occurred"
      }`,
    };
  }
}

/**
 * Build action URL for different notification types
 */
export function buildNotificationActionUrl(
  type: string,
  workspaceSlug: string,
  relatedEntityId?: string
): string {
  const baseUrl = `/workspace/${workspaceSlug}`;

  switch (type) {
    case "join_request_sent":
    case "join_request_approved":
    case "join_request_rejected":
      return `${baseUrl}/settings/members`;
    case "member_joined":
    case "member_left":
    case "member_removed":
      return `${baseUrl}/settings/members`;
    case "workspace_settings_changed":
      return `${baseUrl}/settings`;
    default:
      return baseUrl;
  }
}

/**
 * Get notification title and message based on type
 */
export function getNotificationContent(
  type: string,
  data: {
    requesterName?: string;
    requesterEmail?: string;
    workspaceName?: string;
  }
): { title: string; message: string } {
  switch (type) {
    case "join_request_sent":
      return {
        title: "Join Request Sent",
        message: `Your request to join ${data.workspaceName} has been sent to the workspace admins.`,
      };
    case "join_request_approved":
      return {
        title: "Request Approved",
        message: `Your request to join ${data.workspaceName} has been approved!`,
      };
    case "join_request_rejected":
      return {
        title: "Request Rejected",
        message: `Your request to join ${data.workspaceName} has been rejected.`,
      };
    case "member_joined":
      return {
        title: "New Member Joined",
        message: `${data.requesterName} (${data.requesterEmail}) has joined ${data.workspaceName}.`,
      };
    case "member_left":
      return {
        title: "Member Left",
        message: `${data.requesterName} has left ${data.workspaceName}.`,
      };
    case "member_removed":
      return {
        title: "Member Removed",
        message: `${data.requesterName} has been removed from ${data.workspaceName}.`,
      };
    case "workspace_settings_changed":
      return {
        title: "Settings Updated",
        message: `${data.workspaceName} settings have been updated.`,
      };
    default:
      return {
        title: "Notification",
        message: "You have a new notification.",
      };
  }
}
