import { TMemberRole, TUserRole } from "./action";
import { TMemberId } from "./id.types";
import { IUserDTO } from "./user.types";
import { IWorkspaceDTO } from "./workspace.types";

export interface IMemberDTO {
  id: TMemberId;
  name: string;
  userId: IUserDTO["id"];
  workspaceId: IWorkspaceDTO["id"];
  role: TUserRole;
  createdAt: Date;
  updatedAt: Date | null;
}
