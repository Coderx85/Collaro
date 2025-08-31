"use server";

import { db, usersTable, workspaceUsersTable, workspacesTable } from "@/db";
import { APIResponse, UserResponse } from "@/types";
import { clerkClient, currentUser } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { redirect } from "next/navigation";

export async function getUserWorkspaceId() {
  // Get the current user first
  const clerkUser = await currentUser();
  if (!clerkUser) throw redirect("/sign-in");

  // Get user from database
  let [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.clerkId, clerkUser.id))
    .execute();

  // Create user if missing instead of redirecting
  if (!user) {
    const created = await setUser();
    if (!created.success || !created.data) throw redirect("/sign-in");
    user = created.data as typeof user;
  }

  // Update existing user's Clerk metadata
  await (await clerkClient()).users.updateUserMetadata(clerkUser.id, {
    publicMetadata: { role: user.role },
  });

  if (!user.workspaceId) {
    return {
      data: { ...user, workspaceId: "", workspaceName: "" },
      success: true,
    };
  }

  // Check if the workspace exists
  const [workspace] = await db
    .select()
    .from(workspacesTable)
    .where(eq(workspacesTable.id, user.workspaceId))
    .execute();

  // Check if the user is a member of the workspace
  const [workspaceMember] = await db
    .select()
    .from(workspaceUsersTable)
    .where(
      and(
        eq(workspaceUsersTable.userName, user.userName),
        eq(workspaceUsersTable.workspaceName, workspace.name)
      )
    )
    .execute();

  if (!workspaceMember) {
    await db
      .insert(workspaceUsersTable)
      .values({
        userName: user.userName,
        workspaceName: workspace.name,
        role: user?.role,
      })
      .returning();
  }

  return {
    data: {
      ...user,
      workspaceName: workspace.name,
      workspaceId: workspace.id,
    },
    success: true,
  };
}

/**
 * Ensure a Clerk user exists in the database and return the user record.
 * @returns {Promise<APIResponse<UserResponse>>} The user data or an error response.
 */
export async function setUser(): Promise<APIResponse<UserResponse>> {
  try {
    const clerkUser = await currentUser();
    if (!clerkUser) throw redirect("/sign-in");

    const clerkId = clerkUser.id.toString();

    let data: UserResponse;

    // Check if the user exists in the database
    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.clerkId, clerkId))
      .execute();

    // If the user does not exist, create it and return the newly created row
    if (!user) {
      const [newUser] = await db
        .insert(usersTable)
        .values({
          clerkId,
          name: clerkUser.firstName + " " + clerkUser.lastName,
          email: clerkUser.emailAddresses[0].emailAddress,
          role: "member",
          workspaceId: null,
          userName: clerkUser.username!,
          updatedAt: new Date(),
        })
        .returning();
      data = newUser;
    } else {
      data = user;
    }

    return { data, success: true };
  } catch (error: unknown) {
    return { error: `Failed to get user:: \n ${error}`, success: false };
  }
}

export async function getWorkspaceMembers(workspaceId: string) {
  try {
    // Check if workspace exists
    const [workspace] = await db
      .select()
      .from(workspacesTable)
      .where(eq(workspacesTable.id, workspaceId))
      .execute();

    if (!workspace) {
      return { error: `Workspace not found with ID: ${workspaceId}`, success: false };
    }

    const members = await db
      .select()
      .from(workspaceUsersTable)
      .where(eq(workspaceUsersTable.workspaceName, workspace.name))
      .execute();
      
    return { data: members };
  } catch (error: unknown) {
    return { error: `Failed to get workspace members:: \n ${error}` };
  }
}

export async function getUser(): Promise<APIResponse<UserResponse>> {
  try {
    // Get the current user
    const clerkUser = await currentUser();
    if (!clerkUser) return redirect("/sign-in");

    const clerkId = clerkUser.id.toString();

    // Check if the user exists in the database
    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.clerkId, clerkId))
      .execute();

    // If the user does not exist,
    if (!user) return { error: "User does not exist", success: false };

    return { data: user, success: true };
  } catch (error: unknown) {
    return { error: `Failed to get user:: \n ${error}`, success: false };
  }
}

export async function getAllUsers(): Promise<APIResponse<UserResponse[]>> {
  try {
    const data = await db.select().from(usersTable).execute();
    return { data, success: true };
  } catch (error: unknown) {
    return { error: `Failed to get all users:: \n ${error}`, success: false };
  }
}