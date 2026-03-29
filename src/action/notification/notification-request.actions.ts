"user server";

import { db } from "@/db/client";
import { notificationsTable } from "@/db/schema/schema";
import { APIResponse, INotification } from "@/types";
import { eq } from "drizzle-orm";

interface CreateNotificationRequestInput {
  workspaceId: string;
  recipientId: string;
  message: string;
}

export const createNotificationRequestAction = async ({
  workspaceId,
  recipientId,
  message,
}: CreateNotificationRequestInput): Promise<APIResponse<INotification>> => {
  try {
    const [notification] = await db.insert(notificationsTable).values({
      workspaceId,
      createdAt: new Date(),
      read: false,
      type: "join_request",
      userId: recipientId,
      message,
    }).returning();

    if (!notification) return { error: "Failed to create notification", success: false };

    return { success: true, data: notification };
  } catch (error: unknown) {
    return { error: `Failed to create notification: ${error}`, success: false };
  }
}

export async function getUserNotificationsAction(userId: string): Promise<APIResponse<INotification[]>> {
  try {
    const notifications = await db.select().from(notificationsTable).where(eq(notificationsTable.userId, userId)).execute();

    if (!notifications) return { error: "Failed to get notifications", success: false };

    return { success: true, data: notifications} ;
  }
  catch (error: unknown) {
    return { error: `Failed to get notifications: ${error}`, success: false };
  }
}

export const markNotificationAsReadAction = async (notificationId: string): Promise<APIResponse<null>> => {
  try {
    await db.update(notificationsTable).set({ read: true }).where(eq(notificationsTable.id, notificationId)).execute();
    return { success: true, data: null };
  } catch (error: unknown) {
    return { error: `Failed to mark notification as read: ${error}`, success: false };
  }
}