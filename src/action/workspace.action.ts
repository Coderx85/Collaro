"use server";
import { db } from "@/db/client";
import {
  workspacesTable,
  membersTable,
  usersTable,
  workspaceMeetingTable,
} from "@/db/schema/schema";
import { headers } from "next/headers";
import { auth } from "@/lib/auth-config";
import { and, eq, isNull } from "drizzle-orm";
import { redirect } from "next/navigation";
import { canDeleteWorkspace } from "@/lib/workspace-auth";
import { getCurrentUser } from "@/lib/session";
import type { APIResponse } from "@/types/api";
import type { z } from "zod";
import type { NewWorkspaceFormSchema, TUserRole } from "@/types";

type NewWorkspaceFormSchemaType = z.infer<typeof NewWorkspaceFormSchema>;

export async function createWorkspace(
  workspaceData: NewWorkspaceFormSchemaType
): Promise<APIResponse<NewWorkspaceFormSchemaType>> {
  try {
    const user = await getCurrentUser();

    if (!user) {
      redirect("/sign-in");
    }

    const [res] = await db
      .insert(workspacesTable)
      .values({
        createdAt: new Date(),
        createdBy: user.userName || "",
        name: workspaceData.name,
        slug: workspaceData.slug,
        logo: workspaceData.logo || "",
      })
      .returning();

    const [addMember] = await db
      .insert(membersTable)
      .values({
        createdAt: new Date(),
        userId: user.id || "",
        workspaceId: res.id,
        role: "owner",
      })
      .returning();

    if (!res || !addMember) {
      return {
        success: false,
        error: `Failed to create workspace in DB with Name: ${workspaceData.name}`,
      };
    }

    return {
      success: true,
      data: {
        name: workspaceData.name,
        slug: workspaceData.slug,
        logo: workspaceData.logo || "",
      },
    };
  } catch (error: unknown) {
    return {
      success: false,
      error: `Failed to create workspace: ${
        error instanceof Error ? error.message : "An unknown error occurred"
      }`,
    };
  }
}

/**
 * Update a workspace's details
 * Only owners and admins can update workspaces
 */
export async function updateWorkspace(
  workspaceId: string,
  data: { name?: string; slug?: string; logo?: string }
): Promise<APIResponse<{ name: string; slug: string; logo: string }>> {
  try {
    // Use better-auth's API to update the organization
    const result = await auth.api.updateOrganization({
      headers: await headers(),
      body: {
        organizationId: workspaceId,
        data: {
          name: data.name,
          slug: data.slug,
        },
      },
    });

    if (!result) {
      return {
        error: "Failed to update workspace",
        success: false,
      };
    }

    return {
      success: true,
      data: {
        logo: data.logo || "",
        name: result.name,
        slug: result.slug,
      },
    };
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "An unknown error occurred";
    return {
      error: `Failed to update workspace: ${message}`,
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
  const [membership] = await (
    await db
  )
    .select()
    .from(membersTable)
    .where(
      and(
        eq(membersTable.userId, authUser.id),
        eq(membersTable.workspaceId, workspaceId)
      )
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
        eq(membersTable.workspaceId, workspaceId)
      )
    )
    .execute();

  if (!membership) {
    redirect("/unauthorized");
  }

  return;
}

/*
 * `workspaceSlug` - slug of the workspace.
 * `authUser` - authenticated user.
 * This function is used to get the workspace details with members.
 */

export async function getWorkspace(workspaceSlug: string) {
  try {
    const authUser = await getCurrentAuthUser();
    if (!authUser) {
      return { message: "User not authenticated" };
    }

    const workspace = await auth.api.listOrganizations({
      query: {
        slug: workspaceSlug,
      },
      headers: await headers(),
    });

    if (!workspace || !(workspace.length > 0)) {
      return { message: "Workspace not found", success: false };
    }

    const [member] = await db
      .select()
      .from(membersTable)
      .where(
        and(
          eq(membersTable.userId, authUser.id),
          eq(membersTable.workspaceId, workspaceSlug)
        )
      )
      .execute();

    const data = { ...workspace, member };
    return { data, success: true };
  } catch (error: unknown) {
    return { error: `Failed to get workspace:: \n ${error}`, success: false };
  }
}

// This function is used to get all workspaces
export async function getAllWorkspaces() {
  const user = await getCurrentUser();

  const data = db.query.workspacesTable.findMany({
    where: (workspace, { eq, inArray }) =>
      inArray(
        workspace.id,
        db
          .select({
            workspaceId: membersTable.workspaceId,
          })
          .from(membersTable)
          .where(eq(membersTable.userId, user.id ?? ""))
      ),
  });

  return data;
}

// This function is used to update the role of a user in a workspace
export async function updateUserRole(
  userId: string,
  workspaceId: string,
  role: TUserRole
): Promise<APIResponse<{ role: string }>> {
  try {
    const updatedMember = await db
      .update(membersTable)
      .set({ role })
      .where(
        and(
          eq(membersTable.userId, userId),
          eq(membersTable.workspaceId, workspaceId)
        )
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

export async function getWorkspaceTUserRole(workspaceSlug: string) {
  try {
    const authUser = await getCurrentAuthUser();
    if (!authUser) {
      return {
        error: "User not authenticated",
        success: false,
      };
    }
    const org = await auth.api.getActiveMemberRole({
      query: {
        userId: authUser.id,
        organizationSlug: workspaceSlug,
      },
      headers: await headers(),
    });

    if (!org || !org.role) {
      return {
        error: "Failed to retrieve user role",
        success: false,
      };
    }

    return org.role;
  } catch (error: unknown) {
    return {
      error: `Failed to get user role:\n ${error}`,
      success: false,
    };
  }
}

/**
 * Delete a workspace
 * Only owners can delete workspaces
 */
export async function deleteWorkspace(
  workspaceId: string
): Promise<APIResponse<{ deleted: boolean }>> {
  try {
    // Check if user has permission to delete
    const permission = await canDeleteWorkspace();

    if (!permission.allowed) {
      return {
        error:
          "You don't have permission to delete this workspace. Only owners can delete workspaces.",
        success: false,
      };
    }

    // Use better-auth's API to delete the organization
    await auth.api.deleteOrganization({
      headers: await headers(),
      body: {
        organizationId: workspaceId,
      },
    });

    return { data: { deleted: true }, success: true };
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "An unknown error occurred";
    return {
      error: `Failed to delete workspace: ${message}`,
      success: false,
    };
  }
}

export async function getActiveMeetingForWorkspace(workspaceSlug: string) {
  try {
    const [workspace] = await db
      .select()
      .from(workspacesTable)
      .where(eq(workspacesTable.slug, workspaceSlug))
      .execute();

    if (!workspace) {
      return { message: "Workspace not found", success: false };
    }

    const [activeMeeting] = await db
      .select()
      .from(workspaceMeetingTable)
      .where(
        and(
          eq(workspaceMeetingTable.workspaceId, workspace.id),
          isNull(workspaceMeetingTable.endAt)
        )
      )
      .execute();

    if (!activeMeeting) {
      return { message: "No active meeting found", success: false };
    }

    return { meeting: activeMeeting, success: true };
  } catch (error: unknown) {
    return {
      error: `Failed to get active meeting for workspace: ${
        error instanceof Error ? error.message : "An unknown error occurred"
      }`,
      success: false,
    };
  }
}
