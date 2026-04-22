import { IUserDTO, TNotificationId } from "@/types";
import { IMemberDTO } from "@collaro/member";
import { IWorkspaceDTO } from "@collaro/workspace";

export interface INotificationDTO {
  id: TNotificationId;
  userId: IUserDTO["id"];
  workspaceId: IWorkspaceDTO["id"];
  memberID?: IMemberDTO["id"];
  type: string;
  message: string;
  read: boolean;
  createdAt: Date;
  updatedAt: Date | null;
}

export interface INotification {
  notification: INotificationDTO;

  createNotification(notification: INotificationDTO): Promise<INotificationDTO>;

  markAsRead(notificationId: TNotificationId): Promise<boolean>;

  getNotificationsforUser(userId: IUserDTO["id"]): Promise<INotificationDTO[]>;
}

export type GetNotificationQuery = {
  workspaceId?: IWorkspaceDTO["id"];
  userId?: IUserDTO["id"];
  memberID?: IMemberDTO["id"]
};

export interface INotificationStore {
  notification: INotificationDTO;

  create(notification: INotificationDTO): Promise<void>;

  markAsRead(notificationId: TNotificationId): Promise<void>;

  findById(notificationId: TNotificationId): Promise<INotificationDTO | null>;

  queryNotifications(query: GetNotificationQuery): Promise<INotificationDTO[]>;
}