"use server";

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