import { ID } from "@collaro/utils/generate";
import { IMemberRequestStore, TRequestInput, IRequestMember, returnDTO, TRequestId,  } from "./interface";
import { memberRequestStore } from "./store";
import { IWorkspaceDTO } from "../interface";
import { DEFAULT_MEMBER_INVITE_ROLE, IMemberDTO, IRequestMemberDTO, TMemberInviteRole, TRequestStatus } from "@/types";

export const DEFAULT_MEMBER_STATUS: TRequestStatus = "pending";

/**
 * The RequestMember class is responsible for handling member join requests for a workspace. 
 * It provides methods to create a new join request, retrieve an existing request by its ID, approve a request, and reject a request.
 * The class interacts with the IMemberRequestStore to persist and manage the join requests.
 */
export class RequestMember implements IRequestMember {
  store: IMemberRequestStore = memberRequestStore;
  request: IRequestMemberDTO = {} as IRequestMemberDTO;

  async create(request: TRequestInput<IRequestMemberDTO>): Promise<IRequestMemberDTO> {
    const dto: IRequestMemberDTO = {
      ...request,
      role: DEFAULT_MEMBER_INVITE_ROLE,
      status: DEFAULT_MEMBER_STATUS,
      id: ID.requestId(),
      createdAt: new Date(),
      updatedAt: null,
      respondedBy: null,
    }

    await this.store.save(dto);
    return dto;
  }

  async getById(id: TRequestId): Promise<IRequestMemberDTO | null> {
    return await this.store.findById(id).catch(error => {
      console.error(`Error fetching request with ID ${id}:`, error);
      return null;
    });
  }

  async approve(id: TRequestId, role: TMemberInviteRole, responder: IMemberDTO): Promise<returnDTO> {
    // find the request by ID
    const request = await this.store.findById(id);

    if (!request) {
      return Promise.resolve({
        success: false,
        message: `Request with ID ${id} not found.`
      });
    }

    if (request.status !== "pending" ) {
      return {
        success: false,
        message: `Request with ID ${id} cannot be approved because it is already ${request.status}.`
      }
    }

    const updatedRequest: IRequestMemberDTO = {
      ...request,
      role: role, // set the role based on the input parameter
      status: "approved",
      respondedBy: responder.id,
      updatedAt: new Date(),
    };

    // update the request status to approved
    return this.store.update(id, updatedRequest).then(() => {
      return {
        success: true,
        message: `Request with ID ${id} has been approved.`
      };
    }).catch(error => {
      console.error(`Error approving request with ID ${id}:`, error);
      return {
        success: false,
        message: `Failed to approve request with ID ${id}.`
      };
    });
  }
  
  async reject(id: TRequestId, responder: IMemberDTO): Promise<returnDTO> {
    const request = await this.store.findById(id);
    if (!request) {
      return {
        success: false,
        message: `Request with ID ${id} not found.`
      };
    }

    const updatedRequest: IRequestMemberDTO = {
      ...request,
      status: "rejected",
      updatedAt: new Date(),
    };

    await this.store.update(id, updatedRequest).catch(error => {
      console.error(`Error rejecting request with ID ${id}:`, error);
      return {
        success: false,
        message: `Failed to reject request with ID ${id}.`
      };
    });

    return {
      success: true,
      message: `Request with ID ${id} has been rejected.`
    };
  }
  
  async list(workspaceId: IWorkspaceDTO["id"], query: TRequestStatus): Promise<IRequestMemberDTO[]> {
    try {
      const requests = await this.store.query({
        query: { workspaceId, status: query }
      });
      
      return requests;
    } catch (error: unknown) {
      console.error(`Error listing requests for workspace ${workspaceId}:`, error);
      throw new Error(`Failed to list requests for workspace with ID ${workspaceId}.`, {
        cause: error
      });
    }
  }
}