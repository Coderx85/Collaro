"use server"
import { db, usersTable, workspacesTable, workspaceUsersTable } from "@/db";
import { currentUser } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { redirect } from "next/navigation";

export interface WorkspaceCheckResponse {
  data?: string;
  error?: string;
  success: boolean;
  status: number;
}

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
  if(!user.length) {
    return { message: "User not found" }
  }

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
    .from(workspacesTable)
    .innerJoin(
      usersTable,
      eq(usersTable.workspaceId, workspacesTable.id)
    )
    .where(and(eq(workspacesTable.id, workspaceId), eq(usersTable.workspaceId, workspaceId)))
    .execute();
  
  console.log('workspaceUsers \n', workspaceUsers)
  
  if(workspaceUsers.length < 1) 
    return { message: "No users found for this workspace" }

  return workspaceUsers;
}

export async function checkWorkspaceUser(userId: string, workspaceId: string): Promise<WorkspaceCheckResponse> {
  try {
    const dbUser = await db
      .select()
      .from(usersTable)
      .where(
        and(
          eq(usersTable.clerkId, userId), 
          eq(usersTable.workspaceId, workspaceId)
        )
      )
      .execute(); 

    console.log('dbUser:: \n', dbUser[0])

    if(!dbUser[0]) {
      return {
        error: "User not found",
        success: false,
        status: 403
      }
    }

    const workspace = await db
      .select()
      .from(workspaceUsersTable)
      .where(
        and(
          eq(workspaceUsersTable.workspaceId, workspaceId), 
          eq(workspaceUsersTable.userId, dbUser[0]?.id)
        )
      )
      .execute();

    console.log('workspace:: \n', workspace[0])

    if(dbUser && workspace.length < 1) {
      const newMember = db
        .insert(workspaceUsersTable)
        .values({
          name: dbUser[0]?.name,
          userId,
          workspaceId,
          role: dbUser[0]?.role,
        })
        .returning();
        console.log('newMember \n', newMember)

      return { 
        data: `User added to workspace \n ${newMember}`, 
        success: true, 
        status: 201
      }
    }

    if(!workspace || workspace.length < 1) return { data: "Workspace not found", success: false, status: 404 }
    
    return { 
      data: "Workspace found", 
      success: true,
      status: 200 
    }
  } catch (error: unknown) {
    return { error: `Failed to check workspace:: \n ${error}`, success: false, status: 500 } 
  }
}

export async function validateWorkspaceAccess(userId: string, workspaceId: string) {
  const checkUser = await checkWorkspaceUser(userId, workspaceId);

  if (!checkUser?.success) {
    if (checkUser.status === 404) {
      redirect('/not-found');
    } else {
      redirect('/unauthorized');
    }
  }

  return checkUser;
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
    const memberArray = await db.select().from(workspaceUsersTable).execute();
    const member = memberArray[0]
    return {
      ...data,
      member
    };
  } catch (error: unknown) {
    return { error: `Failed to get workspaces:: \n ${error}`} 
  }
}