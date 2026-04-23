import { IUserDTO, TMemberId } from "@/types";
import { Input } from "@collaro/utils/omit";
import { IMemberDTO as dto, IWorkspaceDTO } from "@/types";

export type TMemberRole = 'owner' | 'admin' | 'member';
export type TInviteMemberRole = Exclude<TMemberRole, 'owner'>;

export interface IMemberDTO extends dto {}

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
  listWorkspaceMembers(workspaceId: IWorkspaceDTO["id"]): Promise<IMemberDTO[]>;
  checkMemberExists(
    workspaceId: IWorkspaceDTO["id"],
    memberId: TMemberId,
  ): Promise<boolean>;
}

export type JoinWorkspaceParams = {
  workspaceId: IWorkspaceDTO["id"];
  userId: IUserDTO["id"];
  role: TInviteMemberRole;
};

export interface IWorkspaceMemberManager {
  createWorkspace(workspace: Input<IWorkspaceDTO>): Promise<IWorkspaceDTO>;
  joinWorkspace(params: JoinWorkspaceParams): Promise<IWorkspaceDTO>;

  listMembers(workspaceId: IWorkspaceDTO["id"]): Promise<IMemberDTO[]>;
  banMember(workspaceId: IWorkspaceDTO["id"], memberId: TMemberId): Promise<void>;
  removeMemberFromWorkspace(workspaceId: IWorkspaceDTO["id"], memberId: TMemberId): Promise<void>;
}