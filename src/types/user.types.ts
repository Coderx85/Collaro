import { TUserId } from "./id.types";
import { IWorkspaceDTO } from "./workspace.types";
import { IMemberDTO } from "./member.types";

type Input<T> = Omit<T, "id" | "createdAt" | "updatedAt">;

export type TCreateUserInput = Input<IUserDTO> & { password: string };

export interface IUserDTO {
  id: TUserId;
  name: string;
  userName: string;
  email: string;
  createdAt: Date;
  updatedAt: Date | null;
}

export type TFullUserWorkspaceDetail = ( IWorkspaceDTO & { userDetail: IMemberDTO; });
