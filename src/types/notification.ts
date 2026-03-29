import { createNotificationSchema } from "@/db/schema/type";
import { schema } from "@/db";

import z from "zod";

type NotificationType = (typeof schema.pgNotificationType.enumValues)[number];

export interface INotification extends z.infer<typeof createNotificationSchema> {
  createdAt: Date;
  id: string;
  type: NotificationType;
}

const n: INotification = {
  createdAt: new Date(),
  id: "123",
  type: "general",
  userId: "user123",
  message: "You have a new message!",
  workspaceId: "workspace123",
  readAt: null,
  read: false,
};