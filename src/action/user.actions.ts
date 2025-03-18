"use server"

import { db } from "@/db";
import { usersTable, workspaceUsersTable } from "@/db/schema";
import { clerkClient, currentUser } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function getUserWorkspaceId() {
  try {
    const cookieStore = await cookies();
    const cachedWorkspaceId = cookieStore.get("workspaceId");

    // Get the current user first
    const clerkUser = await currentUser();
    if (!clerkUser) {
      return redirect("/sign-in");
    }

    // Get user from database
    const user = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.clerkId, clerkUser.id))
      .execute();

      // If cached workspaceId matches user's workspaceId, use it
      if (cachedWorkspaceId?.value && user[0]?.workspaceId === cachedWorkspaceId.value) {
        return { 
          data: {
            workspaceId: cachedWorkspaceId.value,
            workspaceName: user[0].name,
            userName: user[0].userName,
            role: user[0].role,
            userId: user[0].id
          } 
        };
      }

    // Create new user if doesn't exist
    if (user.length === 0) {
      const newUser = await db
        .insert(usersTable)
        .values({
          clerkId: clerkUser.id,
          email: clerkUser.primaryEmailAddress?.emailAddress || "",
          name: clerkUser.fullName || "",
          userName: clerkUser.username || "",
          role: 'member'
        })
        .returning();

      await (await clerkClient()).users.updateUserMetadata(clerkUser.id, {
        publicMetadata: { role: newUser[0]?.role }
      });
      
      return { error: "User does not belong to any workspace" };
    }
    
    // Update existing user's Clerk metadata
    await (await clerkClient()).users.updateUserMetadata(clerkUser.id, {
      publicMetadata: { role: user[0].role }
    });
    
    const workspaceId = user[0]?.workspaceId;
    if (!workspaceId) {
      return { error: "User does not belong to any workspace" };
    }

    // Check if the user is a member of the workspace
    const workspaceMember = await db
      .select()
      .from(workspaceUsersTable)
      .where(and(eq(workspaceUsersTable.userId, user[0]?.id), eq(workspaceUsersTable.workspaceId, workspaceId)))
      .execute();

    if (workspaceMember.length === 0) {
      const updateWorjspaceMember = await db
        .insert(workspaceUsersTable)
        .values({
          userId: user[0]?.id,
          workspaceId: workspaceId,
          role: user[0]?.role,
          name: user[0]?.name
        })
        .returning();
        if (updateWorjspaceMember.length === 0) {
          return { error: "User does not belong to any workspace" };
        }
      // return { error: "User does not belong to any workspace" };  
    }
    
    return { 
      data: {
        workspaceId,
        workspaceName: user[0].name,
        userName: user[0].userName,
        role: user[0].role,
        id: user[0].id
      }
    };

  } catch (error) {
    console.error("Failed to get user workspace:", error);
    return { 
      error: error instanceof Error 
        ? error.message 
        : "Failed to get user workspace"
    };
  }
}

export async function getUser() {
  try {
    // Get the current user
    const clerkUser = await currentUser();
    if (!clerkUser) {
      console.log("User not found");
      return redirect("/sign-in");
    }

    const clerkId = clerkUser.id.toString();
  
    // Check if the user exists in the database
    const user = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.clerkId, clerkId))
      .execute()
    
    // If the user does not exist,
    if(!user.length) return { error: "User does not exist" }

    return { data: user[0] };
  }
  catch (error: unknown) {
    return { error: `Failed to get user:: \n ${error}`} 
  }
}

export async function getAllUsers(){
  try {
    const data = await db
      .select()
      .from(usersTable)
      .execute();
    return {data};
  } catch (error: unknown) {
    return { error: `Failed to get all users:: \n ${error}`} 
  }
}