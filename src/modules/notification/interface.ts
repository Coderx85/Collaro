import {
  INotificationDTO as dto,
  IUserDTO,
  TNotificationId,
  IWorkspaceDTO,
  IMemberDTO,
} from "@/types";

export interface INotificationDTO extends dto {}

export interface INotification<T extends INotificationDTO, TInput> {
  notification: T;

  createNotification(notification: TInput): Promise<INotificationDTO>;

  markAsRead(notificationId: TNotificationId): Promise<boolean>;

  getNotificationsforUser(userId: IUserDTO["id"]): Promise<INotificationDTO[]>;
}

export type GetNotificationQuery = {
  workspaceId?: IWorkspaceDTO["id"];
  userId?: IUserDTO["id"];
  memberID?: IMemberDTO["id"];
};

export interface INotificationStore {
  notification: INotificationDTO;

  create(notification: INotificationDTO): Promise<void>;

  markAsRead(notificationId: TNotificationId): Promise<void>;

  findById(notificationId: TNotificationId): Promise<INotificationDTO | null>;

  queryNotifications(query: GetNotificationQuery): Promise<INotificationDTO[]>;
}
