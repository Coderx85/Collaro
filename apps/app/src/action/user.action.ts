"use server";

import { db, usersTable, workspaceUsersTable, workspacesTable } from "@repo/database";
import { APIResponse, UserResponse } from "@/types";
import { clerkClient, currentUser } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { redirect } from "next/navigation";

export async function checkUserWorkspaceId() {
  // Get the current user first
  const clerkUser = await currentUser();
  console.log("clerkUser exist: \n", clerkUser);

  if (!clerkUser) throw redirect("/sign-in");

  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.clerkId, clerkUser.id))
    .execute();

  if (!user) throw redirect("/sign-in");

  if(user.workspaceId) redirect(`/workspace/${user.workspaceId}`);

  return null;
}

export async function getUserWorkspaceId() {
  // Get the current user first
  const clerkUser = await currentUser();
  console.log("clerkUser exist: \n", clerkUser);
  if (!clerkUser) throw redirect("/sign-in");

  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.clerkId, clerkUser.id))
    .execute();
    
  if (!user) throw redirect("/sign-in");

  if (user.workspaceId === null) {
    console.log("Workspace ID is null");
    return { error: "Workspace ID is null", success: false };
  }

  console.log("user exist: \n", user);

  const workspaceId = user.workspaceId;

  return {
    data: {
      workspaceId
    },
    success: true,
  };
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