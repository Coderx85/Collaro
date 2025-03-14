"use server"
import { db } from "@/db";
import { usersTable, workspaceUsersTable } from "@/db/schema";
import { currentUser } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";

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
    .where(eq(workspaceUsersTable.workspaceId, workspaceId))
    .execute();

  if(user.length === 0) {
    return { message: "User not found" }
  }

  // Check if workspace exists and user belongs to it
  const workspaceUsers = await db
    .select()
    .from(workspaceUsersTable)
    .where(and(eq(workspaceUsersTable.workspaceId, workspaceId), eq(workspaceUsersTable.userId, user[0]?.id)))
    .execute();
  
  if(workspaceUsers.length < 1) 
    return { message: "No users found for this workspace" }

  return workspaceUsers;
}