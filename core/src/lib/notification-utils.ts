import type { INotificationDTO } from "@/modules/notification";

export type NotificationTransportDTO = Omit<INotificationDTO, "createdAt"> & {
  createdAt: string | number | Date;
};

export type NotificationSnapshotPayload = {
  notifications: NotificationTransportDTO[];
};

export const sortNotificationsByCreatedAt = <
  T extends { createdAt: string | number | Date },
>(notifications: T[]): T[] => {
  return [...notifications].sort(
    (left, right) =>
      new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime(),
  );
};

export const normalizeNotification = (
  notification: NotificationTransportDTO,
): INotificationDTO => {
  return {
    ...notification,
    createdAt: new Date(notification.createdAt),
  } as INotificationDTO;
};

export const normalizeNotifications = (
  notifications: NotificationTransportDTO[],
): INotificationDTO[] => {
  return sortNotificationsByCreatedAt(notifications).map(normalizeNotification);
};

export const serializeNotification = (
  notification: INotificationDTO,
): NotificationTransportDTO => {
  return {
    ...notification,
    createdAt: notification.createdAt.toISOString(),
  };
};