import { ID } from "@collaro/utils/generate";
import { IWorkspace, IWorkspaceDTO, IWorkspaceStore, TWorkspaceId } from "./interface";
import { MemoryWorkspaceStore } from "./stores/memory-workspace-store";
import { Input } from "../utils/omit";

export class Workspace implements IWorkspace {
  workspace: IWorkspaceDTO = {} as IWorkspaceDTO;
  store: IWorkspaceStore = new MemoryWorkspaceStore();

  async createWorkspace(workspace: Input<IWorkspaceDTO>): Promise<IWorkspaceDTO> {
    
    try {
      const newWorkspace: IWorkspaceDTO = {
        ...workspace,
        id: ID.workspaceId(),
        createdAt: new Date(),
        updatedAt: null,
      };
  
      await this.store.save(newWorkspace);
      return newWorkspace;
    } catch (error: unknown) {
      throw new Error(`Failed to create workspace: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  async getWorkspace(id: TWorkspaceId): Promise<IWorkspaceDTO | null> {
    try {
      const workspace = await this.store.findById(id);
      return workspace;
    } catch (error: unknown) {
      throw new Error(`Failed to get workspace: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  async updateWorkspace(id: TWorkspaceId, workspace: Partial<IWorkspaceDTO>): Promise<void> {
    try {
      console.log(`Updating workspace with ID: ${id} with data: ${JSON.stringify(workspace)}`);
      await this.store.update(id, workspace);
    } catch (error: unknown) {
      throw new Error(`Failed to update workspace: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  async deleteWorkspace(id: TWorkspaceId): Promise<void> {
    try {
      console.log(`Deleting workspace with ID: ${id}`);
      await this.store.delete(id);
    } catch (error: unknown) {
      throw new Error(`Failed to delete workspace: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  async uploadLogo(id: TWorkspaceId, logo: string): Promise<void> {
    try {
      const workspace = await this.store.findById(id);
      if (!workspace) {
        throw new Error(`Workspace with ID: ${id} not found for logo upload.`);
      }
      workspace.logoUrl = logo;
      await this.store.update(id, workspace);
    } catch (error: unknown) {
      throw new Error(`Failed to upload logo: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}