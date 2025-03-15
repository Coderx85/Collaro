"use server"
import { db } from "@/db";
import { usersTable, workspacesTable } from "@/db/schema";
import { currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";

export async function getWorkspaceUsers(workspaceId: string)  {
  const clerkUser = await currentUser();
  if (!clerkUser) {
    console.log("User not found");
    return { message: "User not found" }
  }
  
  // Check if user exists and verify workspaceId
  const user = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.workspaceId, workspaceId))
    .execute();

  console.log('user \n', user)
  // if(user.length === 0) {
  //   return { message: "User not found" }
  // }

  // Check if workspace exists and user belongs to it
  const workspaceUsers = await db
      .select({
        id: usersTable.id,
        name: usersTable.name,
        email: usersTable.email,
        userId: usersTable.clerkId,
        userName: usersTable.userName,
        role: usersTable.role,
        workspaceName: workspacesTable.name,
        joinedAt: usersTable.createdAt
      })
      .from(usersTable)
      .innerJoin(
        workspacesTable,
        eq(usersTable.workspaceId, workspacesTable.id)
      )
      .where(eq(workspacesTable.id, workspaceId))
      .execute();
  
  console.log('workspaceUsers \n', workspaceUsers)
  
  if(workspaceUsers.length < 1) 
    return { message: "No users found for this workspace" }

  return workspaceUsers;
}

export async function getWorkspace(userId: string) {
  try {
    const user = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.clerkId, userId))
      .execute();

    if(!user || user.length < 1) return { message: "User not found" }

    if(!user[0]?.workspaceId) return { message: "User does not belong to any workspace" }

    const workspace = await db
      .select()
      .from(workspacesTable)
      .where(eq(workspacesTable.id, user[0]?.workspaceId))
      .execute();

    return {data: workspace[0]};
  } catch (error: unknown) {
    return { error: `Failed to get workspace:: \n ${error}`} 
  }
}

export async function getAllWorkspaces() {
  try {
    const data = await db.select().from(workspacesTable).execute();
    return {data};
  } catch (error: unknown) {
    return { error: `Failed to get workspaces:: \n ${error}`} 
  }
}