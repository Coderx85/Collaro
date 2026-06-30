import { type TMemberId } from "./id.types";
import { type IUserDTO } from "./user.types";
import { type IWorkspaceDTO } from "./workspace.types";

export interface IMemberDTO {
  id: TMemberId;
  name: string;
  userId: IUserDTO["id"];
  workspaceId: IWorkspaceDTO["id"];
  role: TUserRole;
  createdAt: Date;
  updatedAt: Date | null;
}

export type TUserRole = TAdminRole | TMemberRole | TMemberInviteRole;

export type TAdminRole = "owner" | "admin";

export type TMemberRole = "member";

export type TMemberInviteRole = "admin" | "member";
