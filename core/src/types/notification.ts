import { IMemberDTO } from "./member.types";
import { TNotificationId } from "./id.types";
import { IUserDTO } from "./user.types";
import { IWorkspaceDTO } from "./workspace.types";

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
