import { ID } from "@collaro/utils/generate";
import { IMemberDTO, IMemberStore, IWorkspaceMemberManager, JoinWorkspaceParams, MemberStore } from "../member/index";
import { IRequestMember, IRequestMemberDTO, IWorkspaceDTO, IWorkspaceStore, MemoryWorkspaceStore, RequestMember } from "@collaro/workspace";
import { IUser, User } from "@collaro/user";
import { MemberSorting } from "@collaro/sorting/interface";
import { Input } from "@collaro/utils/omit";
import { IUserDTO, TInviteMemberRole, TMemberId, TRequestId } from "@/types";
import tryCatch from "@/lib/try-catch-wrapper";

export class WorkspaceMemberManager implements IWorkspaceMemberManager {
  private memberStore: IMemberStore = new MemberStore();
  private workspaceStore: IWorkspaceStore = new MemoryWorkspaceStore();
  private user: IUser = new User();
  private requestService: IRequestMember = new RequestMember();

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

  async findWorkspaceBySlug(slug: IWorkspaceDTO["slug"]): Promise<IWorkspaceDTO | null> {
    try {
      const workspaces = await this.workspaceStore.list();
      const workspace = workspaces.find(ws => ws.slug === slug);
      
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
    // Fetch the owner user details to ensure the owner exists before creating the workspace.
    const user = await this.user.getUser(workspace.ownerId);
    if (!user) {
      console.log(`Owner with ID: ${workspace.ownerId} not found. Cannot create workspace.`);
      throw new Error(`Owner with ID: ${workspace.ownerId} not found.`);
    }
    
    // Implementation to create a new workspace.
    const newWorkspace: IWorkspaceDTO = {
      ...workspace,
      id: ID.workspaceId(),
      createdAt: new Date(),
      updatedAt: null,
    };
    this.workspaceStore.save(newWorkspace);
        
    // Implementation to create a default admin member for the new workspace.
    const ownerMember: IMemberDTO = {
      userId: workspace.ownerId,
      id: ID.memberId(),
      workspaceId: newWorkspace.id,
      name: `${user.name}`,
      role: 'admin',
      createdAt: new Date(),
      updatedAt: null,
    };
    this.memberStore.save(ownerMember);

    return newWorkspace;
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

    const workspace = await this.findWorkspaceById(params.workspaceId);
    if (!workspace) {
      console.log(`Workspace with ID: ${params.workspaceId} not found. Cannot add member.`);
      throw new Error(`Workspace with ID: ${params.workspaceId} not found.`);
    }

    const user = await this.user.getUser(params.userId);
    if (!user) {
      console.log(`User with ID: ${params.userId} not found. Cannot add member to workspace.`);
      throw new Error(`User with ID: ${params.userId} not found.`);
    }

    const newMember: IMemberDTO = {
      id: ID.memberId(),
      name: user.name,
      workspaceId: params.workspaceId,
      role: params.role,
      createdAt: new Date(),
      updatedAt: null,
      userId: params.userId,
    };

    this.memberStore.save(newMember);

    return workspace;
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

  removeMemberFromWorkspace(workspaceId: IWorkspaceDTO["id"], memberId: TMemberId): Promise<void> {
    // Implementation to remove a member from a workspace.
    const member = this.memberStore;
    
    member.delete(memberId);
    console.log(`Removing member with ID: ${memberId} from workspace ID: ${workspaceId}`);
    return Promise.resolve();
  }

  async getMemberDetails(
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

  async getMemberRole(workspaceSlug: IWorkspaceDTO["slug"], userId: IUserDTO["id"]): Promise<IMemberDTO["role"] | null> {
    return await tryCatch({
      ctx: async () => {
        const workspace = await this.findWorkspaceBySlug(workspaceSlug);
        if (!workspace) {
          console.log(`Workspace with slug: ${workspaceSlug} not found. Cannot fetch member role.`);
          throw new Error(`Workspace with slug: ${workspaceSlug} not found.`);
        }

        const memberDetails = await this.getMemberDetails({ userId, workspaceId: workspace.id });
        if (!memberDetails) {
          console.log(`Member details for user ID: ${userId} in workspace slug: ${workspaceSlug} not found. Cannot fetch member role.`);
          return null;
        }

        return memberDetails.role;
      },
    });
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
      throw new Error(`Member with ID: ${memberId} does not belong to workspace ID: ${workspaceId}.`);
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
    const workspace = await this.findWorkspaceById(workspaceId);
    if (!workspace) {
      console.log(`Workspace with ID: ${workspaceId} not found. Cannot request to join.`);
      throw new Error(`Workspace with ID: ${workspaceId} not found.`);
    }

    const user = await this.user.getUser(userId);
    if (!user) {
      console.log(`User with ID: ${userId} not found. Cannot request to join workspace.`);
      throw new Error(`User with ID: ${userId} not found.`);
    }

    const request = await this.requestService.createRequest({
      userId,
      workspaceId,
      name: user.name,
      role: "member",
    });
  }
  
  async approveJoinRequest(requestId: TRequestId, approvedBy: TMemberId, role: TInviteMemberRole): Promise<IMemberDTO> {
    try {
      // 1. Fetch the join request details.
      const request = await this.requestService.getRequest(requestId);
      if (!request) {
        throw new Error(`Join request with ID: ${requestId} not found.`);
      }
      
      // 2. Validate if the approver is a member of the workspace 
      const approver = await this.memberStore.checkMemberExists(request.workspaceId, approvedBy);
      if (!approver) {
        throw new Error("Approver is not a member of the workspace. Cannot approve join request.");
      }

      // 3. Validate if the approver has sufficient permissions to approve the join request (e.g., admin or owner).
      const approverDetails = await this.memberStore.findById(approvedBy);
      if (!approverDetails || approverDetails.role === "member") {
        throw new Error("Approver does not have sufficient permissions to approve join requests.");
      }
  
      // 4. Approve the join request and update the request status in the store.
      const result = await this.requestService.approveRequest(requestId);  
      if (!result || !result.success) {
        throw new Error(`Failed to approve join request with ID: ${requestId}.`);
      }
  
      // 5. Add the user as a member of the workspace.
      const newMember = await this.joinWorkspace({ 
        workspaceId: request.workspaceId, 
        userId: request.userId, 
        role: role 
      });
      if (!newMember) {
        throw new Error(`Failed to add user with ID: ${request.userId} to workspace with ID: ${request.workspaceId} after approving join request.`);
      }

      const memberDetails = await this.getMemberDetails({ userId: request.userId, workspaceId: request.workspaceId });
      if (!memberDetails) {
        throw new Error(`Failed to retrieve member details for user ID: ${request.userId} in workspace ID: ${request.workspaceId} after approving join request.`);
      }

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
      const request = await this.requestService.getRequest(requestId);
      if (!request) {
        throw new Error(`Join request with ID: ${requestId} not found.`);
      }

      // 2. Validate if the rejector is a member of the workspace
      const rejector = await this.memberStore.checkMemberExists(request.workspaceId, rejectedBy);
      if (!rejector) {
        throw new Error("Rejector is not a member of the workspace. Cannot reject join request.");
      }
      
      // 3. Validate if the rejector has sufficient permissions to reject the join request (e.g., admin or owner). 
      const rejectorDetails = await this.memberStore.findById(rejectedBy);
      if (!rejectorDetails || rejectorDetails.role === "member") {
        throw new Error("Rejector does not have sufficient permissions to reject join requests.");
      }

      const workspace = await this.findWorkspaceById(request.workspaceId);

      // 4. Reject the join request and update the request status in the store.
      await this.requestService.rejectRequest(requestId);

      // await this.notificationService.createMemberNotification({
      //   type: "request_rejected",
      //   userName: request.name,
      //   workspaceName: workspace!.name,
      //   userId: request.userId,
      //   workspaceId: request.workspaceId,
      // });

    } catch (error: unknown) {
      throw new Error(`Error rejecting join request: ${(error as Error).message}`, {
        cause: error,
      });
    }
  }

  async listJoinRequests(workspaceId: IWorkspaceDTO["id"]): Promise<IRequestMemberDTO[]> {
    try {
      const requests = await this.requestService.listRequests(workspaceId);
      return requests;
    } catch (error: unknown) {
      throw new Error(`Error listing join requests for workspace ID: ${workspaceId}. ${(error as Error).message}`, {
        cause: error,
      });
    }
  }
}

export const workspaceMemberManager = WorkspaceMemberManager.getInstance();