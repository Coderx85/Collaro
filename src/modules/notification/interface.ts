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
}

export interface INotification<T extends INotificationDTO, TInput> {
  notification: T;

  createNotification(notification: TInput): Promise<INotificationDTO>;

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