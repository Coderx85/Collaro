import { ID } from "@collaro/utils/generate";
import { MemberStore } from "../member/member-store";
import type { IMemberDTO, IMemberStore, IWorkspaceMemberManager, JoinWorkspaceParams } from "../member";
import { IRequestMember, IWorkspaceDTO, IWorkspaceStore, MemoryWorkspaceStore, RequestMember } from "@collaro/workspace";
import { IUser, User } from "@collaro/user";
import { MemberSorting } from "@collaro/sorting/interface";
import { Input } from "@collaro/utils/omit";
import { IUserDTO, TMemberInviteRole, TMemberId, TRequestId, IRequestMemberDTO, TJoinRequest, TWorkspaceWithMembers, TWorkspaceSlug } from "@/types";
import tryCatch from "@/lib/try-catch-wrapper";
import { WorkspaceNotification, workspaceNotification } from "../notification";
import { auth } from "@/lib/auth/auth-server";

export class WorkspaceMemberManager implements IWorkspaceMemberManager {
  private memberStore: IMemberStore = new MemberStore();
  private workspaceStore: IWorkspaceStore = new MemoryWorkspaceStore();
  private user: IUser = new User();
  private requestService: IRequestMember = new RequestMember();
  private notificationService: WorkspaceNotification = workspaceNotification;

  private static instance: WorkspaceMemberManager;
  static getInstance(): WorkspaceMemberManager {
    if (!WorkspaceMemberManager.instance) {
      WorkspaceMemberManager.instance = new WorkspaceMemberManager();
    }
    return WorkspaceMemberManager.instance;
  }

  private constructor() {
    if(WorkspaceMemberManager.instance) {
      throw new Error("Use WorkspaceMemberManager.getInstance() to get an instance of this class.");
    }
  }

  private sorting = new MemberSorting();
  async findWorkspaceBySlug(slug: TWorkspaceSlug): Promise<IWorkspaceDTO | null> {
    try {
      const workspaces = await this.workspaceStore.list();
      const workspace = workspaces.find(ws => ws.slug === String(slug));
      
      if (!workspace) {
        console.log(`Workspace with slug: ${slug} not found.`);
        return null;
      }

      return workspace;
    } catch (error: unknown) {
      throw new Error(`Failed to find workspace with slug: ${slug}. ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  async findWorkspaceById(id: IWorkspaceDTO["id"]): Promise<IWorkspaceDTO | null> {
    try {
      const workspace = await this.workspaceStore.findById(id);
      if (!workspace) {
        console.log(`Workspace with ID: ${id} not found.`);
        return null;
      }

      return workspace;
    } catch (error: unknown) {
      throw new Error(`Failed to find workspace with ID: ${id}. ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  
  async createWorkspace(workspace: Input<IWorkspaceDTO>): Promise<IWorkspaceDTO> {
    return tryCatch({
      ctx: async () => {
        // 1. Validate if the owner exists.
        const user = await this.user.getUser(workspace.ownerId);
        if (!user) {
          console.log(`User with ID: ${workspace.ownerId} not found. Cannot create workspace.`);
          throw new Error(`User with ID: ${workspace.ownerId} not found.`);
        }

        // 2. Implementation to create a new workspace.
        const newWorkspace: IWorkspaceDTO = {
          ...workspace,
          id: ID.workspaceId(),
          createdAt: new Date(),
          updatedAt: null,
        };
        await this.workspaceStore.save(newWorkspace);
            
        // 3. Add the owner to the workspace.
        const ownerMember: IMemberDTO = {
          userId: workspace.ownerId,
          id: ID.memberId(),
          workspaceId: newWorkspace.id,
          name: `${user.name}`,
          role: "owner",
          createdAt: new Date(),
          updatedAt: null,
        };
        await this.memberStore.save(ownerMember);
    
        // 4. Create a notification for the workspace creation.
        await this.notificationService.createWorkspaceNotification({
          type: "workspace_created",
          userName: user.name,
          workspaceName: newWorkspace.name,
          userId: workspace.ownerId,
          workspaceId: newWorkspace.id,
        })
    
        return newWorkspace;
      },
      errorMessage: `Failed to create workspace with name ${workspace.name}`
    })
  }
  
  /**
   * Joins a user to a workspace.
   * @param params.workspaceId: The ID of the workspace to join.
   * @param params.userId: The ID of the user joining the workspace.
   * @param params.role: The role of the user in the workspace.
   * 
   * @returns The workspace that the user has joined.
   * @throws Error if the workspace or user is not found, or if there is an issue adding the member to the workspace.
   */
  async joinWorkspace(params: JoinWorkspaceParams): Promise<IWorkspaceDTO> {
    return await tryCatch({
      ctx: async () => {
        // 1. Validate if the workspace exists.
        const workspace = await this.findWorkspaceById(params.workspaceId);
        if (!workspace) {
          console.log(`Workspace with ID: ${params.workspaceId} not found. Cannot add member.`);
          throw new Error(`Workspace with ID: ${params.workspaceId} not found.`);
        }
    
        // 2. Validate if the user exists.
        const user = await this.user.getUser(params.userId);
        if (!user) {
          console.log(`User with ID: ${params.userId} not found. Cannot add member to workspace.`);
          throw new Error(`User with ID: ${params.userId} not found.`);
        }
    
        // 3. Add the user as a member of the workspace
        const newMember: IMemberDTO = {
          id: ID.memberId(),
          name: user.name,
          workspaceId: params.workspaceId,
          role: params.role,
          createdAt: new Date(),
          updatedAt: null,
          userId: params.userId,
        };
    
        // 4. Save the new member to the member store.
        await this.memberStore.save(newMember);
    
        // 5. Create a notification for the new member joining the workspace.
        await this.notificationService.createMemberNotification({
          type: "request_approved",
          userName: user.name,
          workspaceName: workspace.name,
          userId: params.userId,
          workspaceId: params.workspaceId,
        });

        return workspace;
      },
      errorMessage: `Failed to join workspace with ID ${params.workspaceId} for user ID ${params.userId}`
    })
  }

  banMember(workspaceId: IWorkspaceDTO["id"], memberId: TMemberId): Promise<void> {
    // Implementation to ban a member from a workspace.
    console.log(`Banning member with ID: ${memberId} from workspace ID: ${workspaceId}`);
    return Promise.resolve();
  }

  async listMembers(workspaceId: IWorkspaceDTO["id"]): Promise<IMemberDTO[]> {
    try {
      // Implementation to get a list of members in a workspace.
      const member = await this.memberStore;
      const workspace = await this.findWorkspaceById(workspaceId);
  
      if (!workspace) {
        console.log(`Workspace with ID: ${workspaceId} not found. Cannot fetch members.`);
        throw new Error(`Workspace with ID: ${workspaceId} not found.`);
      }
  
      const list = await member.list();
      const workspaceMembers = list.filter(m => m.workspaceId === workspaceId);
  
      const sortedWorkspaceMembers = this.sorting.sortByName(workspaceMembers, "asc");
  
      return sortedWorkspaceMembers;
    } catch (error) {
      console.error(`Error fetching members for workspace ID: ${workspaceId}.`, error);
      throw error;
    }
  }

  async removeMemberFromWorkspace(workspaceId: IWorkspaceDTO["id"], memberId: TMemberId): Promise<void> {
    return tryCatch({
      ctx: async () => {
        // 1. Validate if the member belongs to the workspace.
        const check = await this.validateMember(workspaceId, memberId);
        if (!check) {
          console.log(`Member with ID: ${memberId} does not belong to workspace ID: ${workspaceId}. Cannot remove member.`);
          throw new Error(`Member with ID: ${memberId} does not belong to workspace ID: ${workspaceId}.`);
        }

        // 2. Fetch member details for notification purposes before removing the member from the workspace.
        const member = await this.memberStore.findById(memberId);
        if(!member) {
          console.log(`Member with ID: ${memberId} not found. Cannot remove member from workspace.`);
          throw new Error(`Member with ID: ${memberId} not found. Cannot remove member from workspace.`);
        }

        // 3. Fetch workspace details for notification
        const workspace = await this.findWorkspaceById(workspaceId);
        if (!workspace) {
          console.log(`Workspace with ID: ${workspaceId} not found. Cannot remove member.`);
          throw new Error(`Workspace with ID: ${workspaceId} not found.`);
        }
        
        // 4. Remove the member from the workspace.
        await this.memberStore.delete(memberId);
        
        // 5. Create a notification for the member being removed from the workspace.
        await this.notificationService.createMemberNotification({
          type: "member_removed",
          userName: member.name,
          workspaceId: workspaceId,
          userId: member.userId,
          workspaceName: workspace.name,
        })
      }
    })
  }

  async getMemberDetail(
    query: {
      userId: IUserDTO["id"], 
      workspaceId: IWorkspaceDTO["id"]
    }): Promise<IMemberDTO | null> {
    // Implementation to get member details based on user ID and workspace ID.
    const { userId, workspaceId } = query;

    const user = await this.user.getUser(userId);
    if (!user) {
      throw new Error(`User with ID: ${userId} not found. Cannot fetch member details.`);
    }

    const members = await this.memberStore.list();
    const memberDetails = members.find(member => member.userId === userId && member.workspaceId === workspaceId);
    
    if (!memberDetails) {
      console.log(`Member details for user ID: ${userId} not found.`);
      return null;
    }
    
    return memberDetails;
  }

  async getMemberRole(slug: TWorkspaceSlug, userId: IUserDTO["id"]): Promise<IMemberDTO["role"] | null> {
    return await tryCatch({
      ctx: async () => {
        const workspace = await this.findWorkspaceBySlug(slug);
        if (!workspace) {
          console.log(`Workspace with slug: ${slug} not found. Cannot fetch member role.`);
          throw new Error("WORKSPACE_NOT_FOUND",{
              cause: `Workspace with slug: ${slug} not found.`
          });
        }

        const memberDetails = await this.getMemberDetail({ userId, workspaceId: workspace.id });
        if (!memberDetails) {
          throw new Error("MEMBER_NOT_FOUND", {
            cause: `Member details for user ID: ${userId} in workspace slug: ${slug} not found. Cannot fetch member role.`
          });
        }

        return memberDetails.role;
      },
    });
  }

  async getFullWorkspaceDetail(id: IWorkspaceDTO["id"]): Promise<TWorkspaceWithMembers | null> {
    try {
      // 1. Validate if the workspace exists.
      const workspace = await this.findWorkspaceById(id);
      if (!workspace) {
        console.log(`Workspace with ID: ${id} not found. Cannot fetch workspace details.`);
        return null;
      }
  
      // 2. Fetch members of the workspace.
      const members = await this.memberStore.listWorkspaceMembers(id);
  
      // 3. Combine workspace details with member details and return.
      const workspaceWithMembers: TWorkspaceWithMembers = {
        ...workspace,      
        members,
      };
  
      return workspaceWithMembers;
    } catch (error) {
      throw error;
    }
  }

  async updateMemberRole(workspaceId: IWorkspaceDTO["id"], memberId: TMemberId, newRole: IMemberDTO["role"]): Promise<void> {
    // verify member exists
    const member = await this.memberStore.findById(memberId);

    if (!member) {
      console.log(`Member with ID: ${memberId} not found. Cannot update role.`);
      throw new Error(`Member with ID: ${memberId} not found.`);
    }

    if (member.workspaceId !== workspaceId) {
      console.log(`Member with ID: ${memberId} does not belong to workspace ID: ${workspaceId}. Cannot update role.`);
      throw new Error("MEMBER_NOT_FOUND", {
        cause: `Member with ID: ${memberId} does not belong to workspace ID: ${workspaceId}. Cannot update role.`
      } );
    }

    // Update the member's role
    this.memberStore.update(memberId, { role: newRole });
    console.log(`Updated member with ID: ${memberId} to role: ${newRole} in workspace ID: ${workspaceId}`);
  }

  async validateMember(workspaceId: IWorkspaceDTO["id"], memberId: TMemberId): Promise<boolean> {
    await this.findWorkspaceById(workspaceId);

    const member = await this.memberStore.findById(memberId);

    if (!member) {
      console.log(`Member with ID: ${memberId} not found. Cannot validate member.`);
      return false;
    }

    if (member.workspaceId !== workspaceId) {
      console.log(`Member with ID: ${memberId} does not belong to workspace ID: ${workspaceId}. Cannot validate member.`);
      return false;
    }

    return true;
  }

  async listUserWorkspaces(userId: IUserDTO["id"]): Promise<IWorkspaceDTO[] | null> {
    try {
      const user = await this.user.getUser(userId);
  
      if (!user) {
        console.log(`User with ID: ${userId} not found. Cannot list workspaces.`);
        throw new Error(`User with ID: ${userId} not found.`);
      }
  
      const members = await this.memberStore.list();
      const userMemberships = members.filter(member => member.userId === userId);
      const workspaceIds = userMemberships.map(member => member.workspaceId);
  
      const workspaces = await Promise.all(workspaceIds.map(id => this.findWorkspaceById(id)));
  
      const validWorkspaces = workspaces.filter((workspace): workspace is IWorkspaceDTO => workspace !== null);
  
      return validWorkspaces;
      
    } catch (error: unknown) {
      console.error(`Error fetching workspaces for user ID: ${userId}.`, error);
      throw error;
    }
  }

  async requestWorkspace(workspaceId: IWorkspaceDTO["id"], userId: IUserDTO["id"]): Promise<void> {
    // 1. Validate if the workspace exists.
    const workspace = await this.findWorkspaceById(workspaceId);
    if (!workspace || workspace.ownerId) {
      console.log(`Workspace with ID: ${workspaceId} not found. Cannot request to join.`);
      throw new Error("WORKSPACE_NOT_FOUND", {
        cause: `Workspace with ID: ${workspaceId} not found.`
      });
    }
    
    const owner = await this.user.getUser(workspace.ownerId);
    if (!owner) {
      throw new Error("WORKSPACE_OWNER_NOT_FOUND", {
        cause: `Owner with ID: ${workspace.ownerId} not found for workspace ID: ${workspaceId}. Cannot request to join workspace.`
      });
    }

    // 2. Validate if the user exists.
    const user = await this.user.getUser(userId);
    if (!user) {
      console.log(`User with ID: ${userId} not found. Cannot request to join workspace.`);
      throw new Error("USER_NOT_FOUND", {
        cause: `User with ID: ${userId} not found.`
      });
    }

    // 3. Create a join request for the user to join the workspace.
    await this.requestService.create({
      userId,
      workspaceId,
      name: user.name,
    });

    await this.notificationService.createMemberNotification({
      type: "join_request",
      userName: user.name,
      workspaceName: workspace.name,
      userId,
      workspaceId,
    })
  }
  
  async approveJoinRequest(requestId: TRequestId, approvedBy: TMemberId, role: TMemberInviteRole): Promise<IMemberDTO> {
    try {
      // 1. Fetch the join request details.
      const request = await this.requestService.getById(requestId);
      if (!request) {
        throw new Error("JOIN_REQUEST_NOT_FOUND", {
          cause: `Join request with ID: ${requestId} not found.`
        });
      }
      
      // 2. Validate if the approver is a member of the workspace 
      const approver = await this.memberStore.checkMemberExists(request.workspaceId, approvedBy);
      if (!approver) {
        throw new Error("APPROVER_NOT_MEMBER", {
          cause: `Approver with ID: ${approvedBy} is not a member of the workspace with ID: ${request.workspaceId}.`
        });
      }

      // 3. Validate if the approver has sufficient permissions to approve the join request (e.g., admin or owner).
      const approverDetails = await this.memberStore.findById(approvedBy);
      if (!approverDetails || approverDetails.role === "member") {
        throw new Error("APPROVER_INSUFFICIENT_PERMISSIONS", {
          cause: `Approver with ID: ${approvedBy} does not have sufficient permissions to approve join requests.`
        });
      }
  
      // 4. Approve the join request and update the request status in the store.
      const result = await this.requestService.approve(requestId, role, approverDetails);  
      if (!result || !result.success) {
        throw new Error("FAILED_TO_APPROVE_JOIN_REQUEST", {
          cause: `Failed to approve join request with ID: ${requestId}.`
        });
      }
  
      // 5. Add the user as a member of the workspace.
      const newMember = await this.joinWorkspace({ 
        workspaceId: request.workspaceId, 
        userId: request.userId, 
        role: role 
      });
      if (!newMember) {
        throw new Error("FAILED_TO_ADD_MEMBER", {
          cause: `Failed to add user with ID: ${request.userId} to workspace with ID: ${request.workspaceId} after approving join request.`
        });
      }

      const memberDetails = await this.getMemberDetail({ userId: request.userId, workspaceId: request.workspaceId });
      if (!memberDetails) {
        throw new Error("FAILED_TO_RETRIEVE_MEMBER_DETAILS", {
          cause: `Failed to retrieve member details for user ID: ${request.userId} in workspace ID: ${request.workspaceId} after approving join request.`
        });
      }

      // 6. Create a notification for the user whose join request was approved.
      await this.notificationService.createMemberNotification({
        type: "request_approved",
        userName: request.name,
        workspaceName: newMember.name,
        userId: request.userId,
        workspaceId: request.workspaceId,
      });

      return memberDetails;
    } catch (error: unknown) {
      throw new Error(`Error approving join request: ${(error as Error).message}`, {
        cause: error,
      });
    }
  }

  async rejectJoinRequest(requestId: TRequestId, rejectedBy: TMemberId): Promise<void> {
    try {
      // 1. Fetch the join request details.
      const request = await this.requestService.getById(requestId);
      if (!request) {
        throw new Error("JOIN_REQUEST_NOT_FOUND", {
          cause: `Join request with ID: ${requestId} not found.`
        });
      }

      // 2. Validate if the rejector is a member of the workspace and validate the workspace exists.
      const workspace = await this.findWorkspaceById(request.workspaceId);
      const rejector = await this.memberStore.checkMemberExists(request.workspaceId, rejectedBy);
      if (!rejector) {
        throw new Error("REJECTOR_NOT_MEMBER", {
          cause: `Rejector with ID: ${rejectedBy} is not a member of the workspace with ID: ${request.workspaceId}.`
        });
      }
      
      // 3. Validate if the rejector has sufficient permissions to reject the join request (e.g., admin or owner). 
      const rejectorDetails = await this.memberStore.findById(rejectedBy);
      if (!rejectorDetails || rejectorDetails.role === "member") {
        
        throw new Error("REJECTOR_INSUFFICIENT_PERMISSIONS", {
          cause: `Rejector with ID: ${rejectedBy} does not have sufficient permissions to reject join requests.`
        });
      }

      // 4. Reject the join request and update the request status in the store.
      await this.requestService.reject(requestId, rejectorDetails);

      // 5. Create a notification for the user whose join request was rejected.
      await this.notificationService.createMemberNotification({
        type: "request_rejected",
        userName: request.name,
        workspaceName: workspace ? workspace.name : "the workspace",
        userId: request.userId,
        workspaceId: request.workspaceId,
      });

    } catch (error: unknown) {
      throw new Error("FAILED_TO_REJECT_JOIN_REQUEST", {
        cause: `Error rejecting join request: ${(error as Error).message}`,
      });
    }
  }

  async listJoinRequests(workspaceId: IWorkspaceDTO["id"]): Promise<TJoinRequest[]> {
    try {
      const requests = await this.requestService.list(workspaceId, "pending");

      const result: TJoinRequest[] = [];

      for (const request of requests) {
        const user = await this.user.getUser(request.userId);
        if (!user) {
          throw new Error("USER_NOT_FOUND", {
            cause: `User with ID: ${request.userId} not found for join request ID: ${request.id}.`
          });
        }
        result.push({
          ...request,
          userDetail: user,
        });
      }

      return result;
    } catch (error: unknown) {
      throw new Error("FAILED_TO_LIST_JOIN_REQUESTS", {
        cause: `Error listing join requests for workspace ID: ${workspaceId}. ${(error as Error).message}`,
      });
    }
  }

  async deleteWorkspace(workspaceId: IWorkspaceDTO["id"]): Promise<{ success: boolean }> {
    return tryCatch({
      ctx: async () => {
        // 1. Validate if the workspace exists.
        const workspace = await this.getFullWorkspaceDetail(workspaceId);
        if (!workspace) {
          throw new Error("WORKSPACE_NOT_FOUND", {
            cause: `Workspace with ID: ${workspaceId} not found. Cannot delete workspace.`
          });
        }

        // 2. Delete the workspace from the store.
        await this.workspaceStore.delete(workspaceId);
        
        // 3. Create a notification for the workspace deletion.
        await this.notificationService.createWorkspaceNotification({
          type: "workspace_deleted",
          userName: "A workspace owner or admin",
          workspaceName: workspace.name,
          userId: workspace.ownerId,
          workspaceId: workspace.id,
        });

        // 4. Delete all members associated with the workspace
        for (const member of workspace.members) {
          await this.memberStore.delete(member.id);

          await this.notificationService.createMemberNotification({
            type: "member_removed",
            userName: member.name,
            workspaceId: workspaceId,
            userId: member.userId,
            workspaceName: workspace.name,
          })
        }
        
        return { success: true };
      }
    })
  }
}

export const workspaceMemberManager = WorkspaceMemberManager.getInstance();