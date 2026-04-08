import { IWorkspaceDTO } from "@/modules/workspace";
import { TRequestId } from "./id.types";
import { IUserDTO } from "./user.types";


export interface IRequestMemberDTO {
  id: TRequestId;
  name: string;
  userId: IUserDTO["id"];
  workspaceId: IWorkspaceDTO["id"];
  role: 'admin' | 'member';
  createdAt: Date;
  updatedAt: Date | null;
}

export type JoinRequest = IRequestMemberDTO  & { user: IUserDTO };