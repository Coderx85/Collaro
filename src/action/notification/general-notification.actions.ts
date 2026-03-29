import { eq } from "drizzle-orm";
import { db } from "@/db/client";
import { notificationsTable } from "@/db/schema/schema";
import { APIResponse, INotification } from "@/types";

export const markNotificationAsReadAction = async (notificationId: string): Promise<APIResponse<null>> => {
  try {
    await db.update(notificationsTable).set({ read: true }).where(eq(notificationsTable.id, notificationId)).execute();
    return { success: true, data: null };
  } catch (error: unknown) {
    return { error: `Failed to mark notification as read: ${error}`, success: false };
  }
}

export const getUserNotificationsAction = async (workspaceId: string): Promise<APIResponse<INotification[]>> => {
  try {
    const user = await db.select().from(notificationsTable).where(eq(notificationsTable.workspaceId, workspaceId)).execute();

    if (!user) return { error: "Failed to get notifications", success: false };

    return { success: true, data: user as INotification[] } ;

  } catch (error: unknown) {
    return { error: `Failed to get notifications: ${error}`, success: false };
  }
}