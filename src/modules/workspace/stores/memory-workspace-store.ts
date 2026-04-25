import { db } from "@/db";
import { IWorkspaceDTO, IWorkspaceStore, TWorkspaceId } from "./../interface";
import { workspacesTable } from "@/db/schema/schema";
import { eq } from "drizzle-orm";
import tryCatch from "@/lib/try-catch-wrapper";

export class MemoryWorkspaceStore implements IWorkspaceStore {
  async save(workspace: IWorkspaceDTO): Promise<void> {
    return await tryCatch({
      ctx: async () => {
        await db
          .insert(workspacesTable)
          .values({
            id: workspace.id,
            name: workspace.name,
            slug: workspace.slug,
            logo: workspace.logoUrl,
            createdBy: workspace.ownerId,
            createdAt: workspace.createdAt,
            updatedAt: workspace.updatedAt,
          })
          .execute();
      }, 
      errorMessage: `Failed to save workspace with id ${workspace.id}`
    })
  }

  async findById(id: TWorkspaceId): Promise<IWorkspaceDTO | null> {
    const workspaces = await tryCatch({
      ctx: async () => {
        const result = await db
          .select()
          .from(workspacesTable)
          .where(eq(workspacesTable.id, id))
          .execute();

        return result[0] || null;
      }, 
      errorMessage: `Failed to find workspace with id ${id}`
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

  async update(id: TWorkspaceId, workspace: IWorkspaceDTO): Promise<void> {
    return await tryCatch({
      ctx: async () => {
        await db
          .update(workspacesTable)
          .set({
            name: workspace.name,
            slug: workspace.slug,
            logo: workspace.logoUrl,
            updatedAt: new Date(),
          })
          .where(eq(workspacesTable.id, id))
          .execute();
      }, 
      errorMessage: `Failed to update workspace with id ${id}`
    })
  }

  async delete(id: TWorkspaceId): Promise<void> {
    return await tryCatch({
      ctx: async () => {
        await db
          .delete(workspacesTable)
          .where(eq(workspacesTable.id, id))
          .execute();
      }, 
      errorMessage: `Failed to delete workspace with id ${id}`
    })
  }

  async list(): Promise<IWorkspaceDTO[]> {
    const workspaces = await tryCatch({
      ctx: async () => {
        const result = await db
          .select()
          .from(workspacesTable)
          .execute();

        return result;
      }, 
      errorMessage: `Failed to list workspaces`
    })

    return workspaces.map((workspace) => ({
      id: workspace.id,
      name: workspace.name,
      slug: workspace.slug,
      logoUrl: workspace.logo ?? "",
      ownerId: workspace.createdBy!,
      description: "",
      createdAt: workspace.createdAt,
      updatedAt: workspace.updatedAt,
    }));
  }
}
