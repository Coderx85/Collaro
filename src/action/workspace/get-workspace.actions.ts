"use server";

import { db, schema } from "@/db";
import { and, eq } from "drizzle-orm";
import type { APIResponse, PendingRequest } from "@/types";
import { TWorkspaceDTO } from "@/types/workspace.types";
import { auth } from "@/lib/auth/auth-server";
import { headers } from "next/headers";

export async function getWorkspaceBySlug(workspaceSlug: string): Promise<APIResponse<TWorkspaceDTO>> {
  try {
    const workspace = await db
      .query.workspacesTable
      .findFirst({
        where: eq(schema.workspacesTable.slug, workspaceSlug),
      })
      .execute();

    if (!workspace) {
      return {
        success: false,
        error: "Workspace not found",
      }
    }

    return {
      success: true,
      data: {
        createdBy: workspace.createdBy!,
        id: workspace.id,
        name: workspace.name,
        logo: workspace.logo || "",
        slug: workspace.slug
      }
    }
  } catch (error: unknown) {
   throw new Error(error instanceof Error ? error.message : "Failed to get workspace by slug"); 
  }
} 

export async function getWorkspaceById(workspaceId: string): Promise<APIResponse<TWorkspaceDTO>> {
  try {
    const workspace = await db
      .query.workspacesTable
      .findFirst({
        where: eq(schema.workspacesTable.id, workspaceId),
      })
      .execute();

    if (!workspace) {
      return {
        success: false,
        error: "Workspace not found",
      }
    }

    return {
      success: true,
      data: {
        createdBy: workspace.createdBy!,
        id: workspace.id,
        name: workspace.name,
        logo: workspace.logo || "",
        slug: workspace.slug
      }
    }
  } catch (error: unknown) {
   throw new Error(error instanceof Error ? error.message : "Failed to get workspace by id"); 
  }
}