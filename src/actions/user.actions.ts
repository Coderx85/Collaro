"use server"

import { db } from "@/db";
import { usersTable } from "@/db/schema";
import { clerkClient, currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

export async function getUserWorkspaceId() {
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

    // If the user does not exist, create a new user
    if (user.length === 0) {
      const newUser = await db.insert(usersTable).values({
        clerkId: clerkId!,
        email: clerkUser.primaryEmailAddress?.emailAddress as string,
        name: clerkUser.fullName!,
        userName: clerkUser.username!,
        role: 'member'        
      }).returning();

      (await clerkClient()).users.updateUserMetadata(
        clerkUser.id,
        { publicMetadata: {
          role: `${newUser[0]?.role}`
        } }
      )

      console.log("User created: \n", newUser[0]);
      const workspaceId = newUser[0]?.workspaceId;
      if (!workspaceId || workspaceId.length < 1) {
        return { message: "User does not belong to any workspace" }
      }
      // const workspaceName = newUser[0]?.name;
      return { workspaceId };
    }

    (await clerkClient()).users.updateUserMetadata(
      clerkUser.id,
      { publicMetadata: {
        role: `${user[0]?.role}`
      } }
    )
    // const userExists = (await user).values();
    console.log("User: \n", JSON.stringify(user));
    const workspaceId = user[0]?.workspaceId;
    const workspaceName = user[0]?.name;

    if (!workspaceId) {
      return { message: "User does not belong to any workspace" }
    }
    console.log("WorkspaceId: \n", workspaceId);
    return { workspaceId, workspaceName };
  } catch (error: unknown) {
    return { error: `Failed to get user:: \n ${error}`} 
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
    if(!user.length) return { message: "User does not exist" }

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