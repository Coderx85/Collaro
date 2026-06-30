import { TNotificationId } from "@/types";
import { GetNotificationQuery, INotificationStore, INotificationDTO } from "./interface";
import { db } from "@/db";
import { notificationsTable } from "@/db/schema/schema";
import tryCatch from "@/lib/try-catch-wrapper";
import { and, eq, SQL } from "drizzle-orm";

class NotificationStore implements INotificationStore {
  notification: INotificationDTO = {} as INotificationDTO;
  private static instance: NotificationStore;
  
  static getInstance(): NotificationStore {
    if (!NotificationStore.instance) {
      NotificationStore.instance = new NotificationStore();
    }
    return NotificationStore.instance;
  }

  constructor() {
    if (NotificationStore.instance) {
      throw new Error("Use NotificationStore.getInstance() to get the singleton instance.");
    }
  }

  async create(notification: INotificationDTO): Promise<void> {
    const dto: INotificationDTO = {
      ...notification
    }

    return tryCatch({ctx: async () => {
      await db
        .insert(notificationsTable)
        .values({
          message: dto.message,
          read: dto.read,
          type: dto.type,
          userId: dto.userId,
          workspaceId: dto.workspaceId,
          memberId: dto.memberID,
          createdAt: dto.createdAt,
          updatedAt: dto.createdAt,
        })
    }})
  }

  async markAsRead(notificationId: TNotificationId): Promise<void> {
    return tryCatch({ctx: async() => {        
      await db
        .update(notificationsTable)
        .set({ read: true })
        .where(eq(notificationsTable.id, notificationId))
        .execute()
      }
    })
  }

  async findById(notificationId: TNotificationId): Promise<INotificationDTO | null> {
    return tryCatch({
      ctx: async() => {
        const [notification] = await db
          .select()
          .from(notificationsTable)
          .where(eq(notificationsTable.id, notificationId))
          .execute()

        if (!notification) { 
          return null;
        }

        return notification || null;
      }
    })
  }

  async queryNotifications(query: GetNotificationQuery): Promise<INotificationDTO[]> {
    const whereclause: SQL[] = [];

    if(query.userId) {
      whereclause.push(eq(notificationsTable.userId, query.userId));
    }

    if(query.workspaceId) {
      whereclause.push(eq(notificationsTable.workspaceId, query.workspaceId));
    }

    if(query.memberID) {
      whereclause.push(eq(notificationsTable.memberId, query.memberID));
    }

    return tryCatch({
      ctx: async() => {
        const notifications = await db
          .select()
          .from(notificationsTable)
          .where(and(...whereclause))
          .execute()

        return notifications;
      }
    })
  }
}

export const notificationStore = NotificationStore.getInstance();