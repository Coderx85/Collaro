import { IWorkspaceDTO } from "@/modules/workspace";
import { TMemberId, TRequestId } from "./id.types";
import { IUserDTO } from "./user.types";
import { TMemberInviteRole } from "./member.types";

export type TJoinRequest = IRequestMemberDTO & { 
  userDetail: IUserDTO;
}

export const DEFAULT_MEMBER_INVITE_ROLE: TMemberInviteRole = "member";

export type TRequestStatus = "pending" | "approved" | "rejected";

export interface IRequestMemberDTO {
  id: TRequestId;
  name: string;
  userId: IUserDTO["id"];
  workspaceId: IWorkspaceDTO["id"];
  role: TMemberInviteRole;
  status: TRequestStatus;
  respondedBy: TMemberId | null;
  createdAt: Date;
  updatedAt: Date | null;
}