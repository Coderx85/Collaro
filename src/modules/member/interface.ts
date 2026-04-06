import { IUser, IUserDTO } from "@collaro/user";
import { Input } from "@collaro/utils/omit";
import { IWorkspaceDTO, IWorkspaceStore } from "@collaro/workspace";
import { BRAND } from "zod";

export type TMemberId = BRAND<"MemberId">;

export interface IMemberDTO {
  id: TMemberId;
  name: string;
  userId: IUserDTO["id"];
  workspaceId: IWorkspaceDTO["id"];
  role: 'owner' | 'admin' | 'member';
  createdAt: Date;
  updatedAt: Date | null;
}

export interface IMember {
  member: IMemberDTO;
  store: IMemberStore;

  // methods
  addMemberToWorkspace(member: IMemberDTO, workspaceId: IWorkspaceDTO["id"]): void;
  getMember(id: TMemberId): IMemberDTO | null;
  updateMember(id: TMemberId, member: Partial<IMemberDTO>): void;
  removeMember(id: TMemberId): void;
  readonly listMembers: IMemberDTO[];
  removeFromWorkspace(workspaceId: IWorkspaceDTO["id"], memberId: TMemberId): void;
}

export interface IMemberStore {
  save(member: IMemberDTO): Promise<void>;
  findById(id: TMemberId): Promise<IMemberDTO | null>;
  update(id: TMemberId, member: Partial<IMemberDTO>): Promise<void>;
  delete(id: TMemberId): Promise<void>;
  list(): Promise<IMemberDTO[]>;
  checkMemberExists(workspaceId: IWorkspaceDTO["id"], memberId: TMemberId): Promise<boolean>;
}

export interface IWorkspaceMemberManager {
  memberStore: IMemberStore;
  workspaceStore: IWorkspaceStore;
  user: IUser;

  createWorkspace(workspace: Input<IWorkspaceDTO>): Promise<IWorkspaceDTO>;
  joinWorkspace(workspaceId: IWorkspaceDTO["id"], userId: IUserDTO["id"]): Promise<void>;
  listMembers(workspaceId: IWorkspaceDTO["id"]): Promise<IMemberDTO[]>;
  banMember(workspaceId: IWorkspaceDTO["id"], memberId: TMemberId): Promise<void>;
  removeMemberFromWorkspace(workspaceId: IWorkspaceDTO["id"], memberId: TMemberId): Promise<void>;
}