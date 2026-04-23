import { IUserDTO } from "@collaro/user";
import { BRAND } from "@collaro/utils/brand";
import { Input } from "../utils/omit";
import { IWorkspaceDTO as dto } from "@/types";

export type TWorkspaceId = BRAND<"WorkspaceId">;

export interface IWorkspaceDTO extends dto {}

export interface IWorkspace {
  workspace: IWorkspaceDTO;

  // methods
  createWorkspace(workspace: Input<IWorkspaceDTO>): Promise<IWorkspaceDTO>;
  getWorkspace(id: TWorkspaceId): Promise<IWorkspaceDTO | null>;
  updateWorkspace(id: TWorkspaceId, workspace: Partial<IWorkspaceDTO>): Promise<void>;
  deleteWorkspace(id: TWorkspaceId): Promise<void>;
  uploadLogo(id: TWorkspaceId, logo: string): Promise<void>;
}

export interface IWorkspaceStore {
  save(workspace: IWorkspaceDTO): Promise<void>;
  findById(id: TWorkspaceId): Promise<IWorkspaceDTO | null>;
  update(id: TWorkspaceId, workspace: Partial<IWorkspaceDTO>): Promise<void>;
  delete(id: TWorkspaceId): Promise<void>;
  list(): Promise<IWorkspaceDTO[]>;
}
