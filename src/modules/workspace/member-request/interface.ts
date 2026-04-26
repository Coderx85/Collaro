import { IMemberDTO, IRequestMemberDTO, IUserDTO, TMemberInviteRole, TRequestStatus } from "@/types";
import { BRAND } from "@collaro/utils/brand";
import { IWorkspaceDTO } from "..";
import { INotificationStore } from "@collaro/notification";

export type TRequestId = BRAND<"RequestId">;

export type TRequestInput<T> = Omit<T, "id" | "createdAt" | "updatedAt" | "status" | "role" | "respondedBy"> ;

export type returnDTO = {
  success: boolean;
  message: string;
}

export interface IRequestMember {
  request: IRequestMemberDTO;
  store: IMemberRequestStore; 

  // methods
  create(request: TRequestInput<IRequestMemberDTO>): Promise<IRequestMemberDTO>;
  getById(id: TRequestId): Promise<IRequestMemberDTO | null>;
  approve(id: TRequestId, role: TMemberInviteRole, responder: IMemberDTO): Promise<returnDTO>;
  reject(id: TRequestId, responder: IMemberDTO): Promise<returnDTO>;
  list(workspaceId: IWorkspaceDTO["id"], query: TRequestStatus): Promise<IRequestMemberDTO[]>;
}

export type MemberRequestParams = {
  query: {
    workspaceId?: IWorkspaceDTO["id"];
    userId?: IUserDTO["id"];
    status?: TRequestStatus;
  }
}

// Store interface for managing member join requests.
export interface IMemberRequestStore {
  notification: INotificationStore;
  
  save(request: IRequestMemberDTO): Promise<void>;
  findById(id: TRequestId): Promise<IRequestMemberDTO | null>;
  update(id: TRequestId, request: IRequestMemberDTO): Promise<void>;
  list(): Promise<IRequestMemberDTO[]>;
  query(params: MemberRequestParams): Promise<IRequestMemberDTO[]>;
}