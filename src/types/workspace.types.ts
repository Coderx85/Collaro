import { SelectWorkspaceType } from "@/db/schema/type";
import { TUserId, TWorkspaceId } from "./id.types";
import { IUserDTO } from "./user.types";

export type TWorkspace = SelectWorkspaceType

export type TWorkspaceDTO = Omit<TWorkspace, "createdAt" | "updatedAt"> & {
  createdBy: TUserId;
} 

/**
 * IWorkspaceDTO represents the data transfer object for a workspace, 
 * containing properties such as id, name, description, createdAt, and updatedAt.
 */
export interface IWorkspaceDTO {
  id: TWorkspaceId;
  name: string;
  slug: string;
  logoUrl?: string;
  ownerId: IUserDTO["id"];
  description: string;
  createdAt: Date;
  updatedAt: Date | null;
}