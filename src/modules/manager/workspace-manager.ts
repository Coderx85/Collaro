import { ID } from "@collaro/utils/generate";
import { IMemberDTO, IMemberStore, IWorkspaceMemberManager, MemberStore, TMemberId } from "../member/index";
import { IWorkspaceDTO, IWorkspaceStore, MemoryWorkspaceStore } from "@collaro/workspace";
import { IUser, IUserDTO, User } from "@collaro/user";
import { MemberSorting } from "@collaro/sorting/interface";
import { Input } from "@collaro/utils/omit";

export class WorkspaceMemberManager implements IWorkspaceMemberManager {
  memberStore: IMemberStore = new MemberStore();
  workspaceStore: IWorkspaceStore = new MemoryWorkspaceStore();
  user: IUser = new User();

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
      name: `${user.name} Owner`,
      role: 'admin',
      createdAt: new Date(),
      updatedAt: null,
    };
    this.memberStore.save(ownerMember);

    return newWorkspace;
  }
  
  async joinWorkspace(workspaceId: IWorkspaceDTO["id"], userId: IUserDTO["id"]): Promise<void> {
    const workspace = await this.findWorkspaceById(workspaceId);
    if (!workspace) {
      console.log(`Workspace with ID: ${workspaceId} not found. Cannot add member.`);
      return;
    }

    const user = await this.user.getUser(userId);
    if (!user) {
      console.log(`User with ID: ${userId} not found. Cannot add member to workspace.`);
      return;
    }

    const newMember: IMemberDTO = {
      id: ID.memberId(),
      name: user.name,
      workspaceId,
      role: 'member',
      createdAt: new Date(),
      updatedAt: null,
      userId,
    };

    this.memberStore.save(newMember);
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
}

export const workspaceMemberManager = WorkspaceMemberManager.getInstance();