"use server"

import { db } from "@/db";
import { usersTable } from "@/db/schema";
import { currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";

export async function getUser() {
  try {

    const clerkUser = await currentUser();
    if (!clerkUser) {
      throw new Error("Unauthorized");
    }

    const clerkId = clerkUser.id.toString();
  
    const user = await db
      .select({ 
        clerkId: usersTable.clerkId, 
        workspaceId: usersTable.workspaceId, 
        name: usersTable.name 
      })
      .from(usersTable)
      .where(eq(usersTable.clerkId, clerkId))
      .execute()

    if (user.length==0) {
      const newUser = await db.insert(usersTable).values({
        clerkId: clerkId!,
        email: clerkUser.primaryEmailAddress?.emailAddress as string,
        name: clerkUser.firstName + " " + clerkUser.lastName!,
        userName: clerkUser.username!,        
      }).returning();

      console.log("User created: \n", newUser[0]);
      const workspaceId = newUser[0]?.workspaceId;
      const workspaceName = newUser[0]?.name;
      return { workspaceId, workspaceName };
    }
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