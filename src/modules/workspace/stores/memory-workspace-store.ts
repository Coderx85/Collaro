import { db } from "@/db";
import { IWorkspaceDTO, IWorkspaceStore, TWorkspaceId } from "./../interface";
import { workspacesTable } from "@/db/schema/schema";
import { eq } from "drizzle-orm";

export class MemoryWorkspaceStore implements IWorkspaceStore {
  private workspaces: IWorkspaceDTO[] = [];

  async save(workspace: IWorkspaceDTO): Promise<void> {
    try {
      const w: IWorkspaceDTO = {
        id: workspace.id,
        name: workspace.name,
        slug: workspace.slug,
        logoUrl: workspace.logoUrl,
        ownerId: workspace.ownerId,
        description: workspace.description,
        createdAt: workspace.createdAt,
        updatedAt: workspace.updatedAt,
      };
      
      await db
        .insert(workspacesTable)
        .values(w)
        .execute();
    } catch (error: unknown) {
      throw new Error(`Failed to save workspace: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  async findById(id: TWorkspaceId): Promise<IWorkspaceDTO | null> {
    const workspaces = await db.query.workspacesTable.findFirst({
      where: eq(workspacesTable.id, id),
    })

    if (!workspaces) {
      return null;
    }

    return {
      id: workspaces.id,
      name: workspaces.name,
      slug: workspaces.slug,
      logoUrl: workspaces.logo ?? "",
      ownerId: workspaces.createdBy!,
      description: "",
      createdAt: workspaces.createdAt,
      updatedAt: workspaces.updatedAt,
    };
  }

  async update(id: TWorkspaceId, workspace: Partial<IWorkspaceDTO>): Promise<void> {
    const index = this.workspaces.findIndex((w) => w.id === id);
    if (index !== -1) {
      this.workspaces[index] = { ...this.workspaces[index], ...workspace } as IWorkspaceDTO;
    }
  }

  async delete(id: TWorkspaceId): Promise<void> {
    this.workspaces = this.workspaces.filter((workspace) => workspace.id !== id);
  }

  async list(): Promise<IWorkspaceDTO[]> {
    return [...this.workspaces];
  }
}
