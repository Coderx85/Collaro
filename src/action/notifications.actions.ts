"use server";

import { db } from "@/db/client";
import { notificationsTable } from "@/db/schema/schema";
import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";
import { and, eq, desc } from "drizzle-orm";
import type { APIResponse } from "@/types/api";
import type { SelectNotificationType } from "@/db/schema/type";
import { TNotificationId, TUserId, TWorkspaceId } from "@/types";

/**
 * Get notifications for the current user
 */
export async function getNotifications(
  workspaceId?: TWorkspaceId,
  status?: "unread" | "read" | "all",
  limit: number = 20,
  offset: number = 0,
): Promise<
  APIResponse<{
    notifications: SelectNotificationType[];
    total: number;
    unreadCount: number;
  }>
> {
  try {
    const user = await getCurrentUser();

    if (!user) {
      redirect("/sign-in");
    }

    // Build where conditions
    const userId = user.id as unknown as TUserId;
    let whereConditions = eq(notificationsTable.userId, userId);

    if (workspaceId) {
      whereConditions = and(
        whereConditions,
        eq(notificationsTable.workspaceId, workspaceId),
      )!;
    }

    if (status && status !== "all") {
      whereConditions = and(
        whereConditions,
        eq(notificationsTable.read, true),
      )!;
    }

    // Get all notifications for count
    const allNotifications = await db
      .select()
      .from(notificationsTable)
      .where(whereConditions)
      .execute();

    // Get unread count
    const unreadCondition = and(
      eq(notificationsTable.userId, userId),
      eq(notificationsTable.read, false),
      workspaceId ? eq(notificationsTable.workspaceId, workspaceId) : undefined,
    );

    const unreadNotifications = await db
      .select()
      .from(notificationsTable)
      .where(unreadCondition)
      .execute();

    // Get paginated results
    const notifications = await db
      .select()
      .from(notificationsTable)
      .where(whereConditions)
      .orderBy(desc(notificationsTable.createdAt))
      .limit(limit)
      .offset(offset)
      .execute();

    return {
      success: true,
      data: {
        notifications,
        total: allNotifications.length,
        unreadCount: unreadNotifications.length,
      },
    };
  } catch (error: unknown) {
    return {
      success: false,
      error: `Failed to fetch notifications: ${
        error instanceof Error ? error.message : "An unknown error occurred"
      }`,
    };
  }
}

/**
 * Mark a notification as read
 */
export async function markNotificationAsRead(
  notificationId: TNotificationId,
): Promise<APIResponse<SelectNotificationType>> {
  try {
    const user = await getCurrentUser();

    if (!user) {
      redirect("/sign-in");
    }

    // Verify notification belongs to user
    const [notification] = await db
      .select()
      .from(notificationsTable)
      .where(eq(notificationsTable.id, notificationId))
      .execute();

    if (!notification) {
      return {
        success: false,
        error: "Notification not found",
      };
    }

    if (notification.userId !== user.id) {
      return {
        success: false,
        error: "Unauthorized to update this notification",
      };
    }

    // Update notification status
    const [updated] = await db
      .update(notificationsTable)
      .set({
        read: true,
      })
      .where(eq(notificationsTable.id, notificationId))
      .returning();

    return {
      success: true,
      data: updated,
    };
  } catch (error: unknown) {
    return {
      success: false,
      error: `Failed to update notification: ${
        error instanceof Error ? error.message : "An unknown error occurred"
      }`,
    };
  }
}

/**
 * Mark all notifications as read for a workspace
 */
export async function markAllNotificationsAsRead(
  workspaceId: TWorkspaceId,
): Promise<APIResponse<{ updatedCount: number }>> {
  try {
    const user = await getCurrentUser();

    if (!user) {
      redirect("/sign-in");
    }

    // Update all unread notifications
    const updated = await db
      .update(notificationsTable)
      .set({
        read: true,
      })
      .where(
        and(
          eq(notificationsTable.userId, user.id),
          eq(notificationsTable.workspaceId, workspaceId),
          eq(notificationsTable.read, false),
        ),
      )
      .returning();

    return {
      success: true,
      data: {
        updatedCount: updated.length,
      },
    };
  } catch (error: unknown) {
    return {
      success: false,
      error: `Failed to mark notifications as read: ${
        error instanceof Error ? error.message : "An unknown error occurred"
      }`,
    };
  }
}

/**
 * Archive a notification
 */
export async function archiveNotification(
  notificationId: TNotificationId,
): Promise<APIResponse<{ archived: boolean }>> {
  try {
    const user = await getCurrentUser();

    if (!user) {
      redirect("/sign-in");
    }

    // Verify notification belongs to user
    const [notification] = await db
      .select()
      .from(notificationsTable)
      .where(eq(notificationsTable.id, notificationId))
      .execute();

    if (!notification) {
      return {
        success: false,
        error: "Notification not found",
      };
    }

    if (notification.userId !== user.id) {
      return {
        success: false,
        error: "Unauthorized to archive this notification",
      };
    }

    // Archive the notification
    await db
      .update(notificationsTable)
      .set({
        read: true,
      })
      .where(eq(notificationsTable.id, notificationId));

    return {
      success: true,
      data: {
        archived: true,
      },
    };
  } catch (error: unknown) {
    return {
      success: false,
      error: `Failed to archive notification: ${
        error instanceof Error ? error.message : "An unknown error occurred"
      }`,
    };
  }
}

/**
 * Get unread notification count for current user
 */
export async function getUnreadNotificationCount(
  workspaceId?: TWorkspaceId,
): Promise<APIResponse<{ count: number }>> {
  try {
    const user = await getCurrentUser();

    if (!user) {
      redirect("/sign-in");
    }

    const userId = user.id as unknown as TUserId;

    let whereCondition = and(
      eq(notificationsTable.userId, userId),
      eq(notificationsTable.read, false),
    );

    if (workspaceId) {
      whereCondition = and(
        whereCondition,
        eq(notificationsTable.workspaceId, workspaceId),
      )!;
    }

    const notifications = await db
      .select()
      .from(notificationsTable)
      .where(whereCondition)
      .execute();

    return {
      success: true,
      data: {
        count: notifications.length,
      },
    };
  } catch (error: unknown) {
    return {
      success: false,
      error: `Failed to get notification count: ${
        error instanceof Error ? error.message : "An unknown error occurred"
      }`,
    };
  }
}
