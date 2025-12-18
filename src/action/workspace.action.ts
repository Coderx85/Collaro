"use server";
import { db } from "@/db/client";
import { workspacesTable, membersTable, usersTable } from "@/db/schema/schema";
import { headers } from "next/headers";
import { auth } from "@/lib/auth-config";
import { and, eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import type { APIResponse } from "@/types/api";
import type { NewWorkspaceFormSchema } from "@/lib/form/new-workspace-form";
import type { z } from "zod";

type NewWorkspaceFormSchemaType = z.infer<typeof NewWorkspaceFormSchema>;

export async function createWorkspace(
  workspaceData: NewWorkspaceFormSchemaType,
) {
  try {
    const response = await auth.api.createOrganization({
      body: {
        name: workspaceData.name,
        slug: workspaceData.slug,
      },
      headers: await headers(),
    });
    if (!response) {
      throw new Error("Failed to create workspace");
    }
    return {
      success: true,
      data: {
        name: workspaceData.name,
        slug: workspaceData.slug,
      },
    };
  } catch (error: unknown) {
    console.error("Failed to create workspace:", error);
    return {
      error: `Failed to create workspace: ${error}`,
      success: false,
    };
  }
}

// Helper to get current authenticated user
async function getCurrentAuthUser() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return session?.user ?? null;
}

// This function is used to get the users of a workspace
export async function getWorkspaceUsers(workspaceId: string) {
  const authUser = await getCurrentAuthUser();
  if (!authUser) {
    return { message: "User not found" };
  }

  // Check if user belongs to this workspace
  const [membership] = await db
    .select()
    .from(membersTable)
    .where(
      and(
        eq(membersTable.userId, authUser.id),
        eq(membersTable.workspaceId, workspaceId),
      ),
    )
    .execute();

  if (!membership)
    return {
      message: "You don't have access to this workspace",
      success: false,
    };

  // Get all members of the workspace
  const members = await db
    .select({
      id: membersTable.id,
      userId: membersTable.userId,
      role: membersTable.role,
      joinedAt: membersTable.createdAt,
      userName: usersTable.userName,
      name: usersTable.name,
      email: usersTable.email,
    })
    .from(membersTable)
    .innerJoin(usersTable, eq(membersTable.userId, usersTable.id))
    .where(eq(membersTable.workspaceId, workspaceId))
    .execute();

  return { data: members, success: true };
}

// This function is used to validate if a user belongs to a workspace
export async function validateWorkspaceAccess(workspaceId: string) {
  const authUser = await getCurrentAuthUser();
  if (!authUser) {
    redirect("/sign-in");
  }

  const [membership] = await db
    .select()
    .from(membersTable)
    .where(
      and(
        eq(membersTable.userId, authUser.id),
        eq(membersTable.workspaceId, workspaceId),
      ),
    )
    .execute();

  if (!membership) {
    redirect("/unauthorized");
  }

  return;
}

// This function is used to get the workspace details with members
export async function getWorkspace(workspaceId: string) {
  try {
    const authUser = await getCurrentAuthUser();
    if (!authUser) {
      return { message: "User not authenticated" };
    }

    // Check if workspace exists
    const [workspace] = await db
      .select()
      .from(workspacesTable)
      .where(eq(workspacesTable.id, workspaceId))
      .execute();

    if (!workspace) {
      return { message: "Workspace not found" };
    }

    // Get workspace members
    const workspaceMember = await getWorkspaceUsers(workspaceId);
    if (!workspaceMember.data) {
      return { message: "No members found for this workspace" };
    }

    const memberData = workspaceMember.data;
    const member = memberData.map((m) => ({
      id: m.userId,
      name: m.name,
      userName: m.userName,
      email: m.email,
      role: m.role,
    }));

    const data = { ...workspace, member };
    return { data };
  } catch (error: unknown) {
    return { error: `Failed to get workspace:: \n ${error}` };
  }
}

// This function is used to get all workspaces
export async function getAllWorkspaces() {
  try {
    const data = await db.select().from(workspacesTable).execute();
    const member = await db.select().from(membersTable).execute();
    return {
      workspaces: data,
      members: member,
    };
  } catch (error: unknown) {
    return { error: `Failed to get workspaces:: \n ${error}` };
  }
}

// This function is used to update the role of a user in a workspace
export async function updateUserRole(
  userId: string,
  workspaceId: string,
  role: "admin" | "member",
): Promise<APIResponse<{ role: string }>> {
  try {
    const updatedMember = await db
      .update(membersTable)
      .set({ role })
      .where(
        and(
          eq(membersTable.userId, userId),
          eq(membersTable.workspaceId, workspaceId),
        ),
      )
      .returning();

    if (updatedMember && updatedMember.length > 0) {
      return { data: { role: updatedMember[0].role }, success: true };
    } else {
      return { error: "Member not found", success: false };
    }
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "An unknown error occurred";
    return {
      error: `Failed to update user role: ${message}`,
      success: false,
    };
  }
}

// New function to fetch and set workspace details from the DB
export async function getWorkspaceById(workspaceId: string) {
  try {
    const [workspace] = await db
      .select()
      .from(workspacesTable)
      .where(eq(workspacesTable.id, workspaceId))
      .execute();

    if (!workspace) {
      return { message: "Workspace not found", success: false };
    }

    return { data: workspace, success: true };
  } catch (error: unknown) {
    return {
      error: `Failed to fetch workspace by id: ${error}`,
      success: false,
    };
  }
}

export async function setWorkspaceFromDB() {
  try {
    const authUser = await getCurrentAuthUser();
    if (!authUser) {
      return { error: "User not found", success: false };
    }

    // Get user's workspace membership
    const [membership] = await db
      .select()
      .from(membersTable)
      .where(eq(membersTable.userId, authUser.id))
      .limit(1)
      .execute();

    if (!membership) {
      return { error: "User does not belong to any workspace", success: false };
    }

    const [workspace] = await db
      .select()
      .from(workspacesTable)
      .where(eq(workspacesTable.id, membership.workspaceId))
      .execute();

    if (!workspace) {
      return { error: "Workspace not found", success: false };
    }

    return { data: workspace, success: true };
  } catch (error: unknown) {
    return {
      error: `Failed to fetch workspace from DB: ${error}`,
      success: false,
    };
  }
}
