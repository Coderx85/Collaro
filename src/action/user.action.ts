"use server";

import { db, usersTable, workspaceUsersTable, workspacesTable } from "@/db";
import { APIResponse, UserResponse } from "@/types";
import { clerkClient, currentUser } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";

export async function getUserWorkspaceId() {
  try {
    // Get the current user first
    const clerkUser = await currentUser();
    if (!clerkUser) {
      return redirect("/sign-in");
    }

    // Get user from database
    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.clerkId, clerkUser.id))
      .execute();

    // Create new user if doesn't exist
    if (!user) {
      const [newUser] = await db
        .insert(usersTable)
        .values({
          clerkId: clerkUser.id,
          email: clerkUser.primaryEmailAddress?.emailAddress || "",
          name: clerkUser.fullName || "",
          userName: clerkUser.username || "",
          role: "member",
        })
        .returning();

      await (
        await clerkClient()
      ).users.updateUserMetadata(clerkUser.id, {
        publicMetadata: { role: newUser?.role },
      });

      revalidateTag("user");
      return {
        data: {
          ...newUser,
          workspaceId: "",
          workspaceName: "",
        },
        success: true,
      };
    } else {
      // Update existing user's Clerk metadata
      await (
        await clerkClient()
      ).users.updateUserMetadata(clerkUser.id, {
        publicMetadata: { role: user.role },
      });
    }

    if (!user.workspaceId)
      return {
        data: { ...user, workspaceId: "", workspaceName: "" },
        success: true,
      };

    // if (workspaceId) {
    // Check if the workspace exists
    const [workspace] = await db
      .select()
      .from(workspacesTable)
      .where(eq(workspacesTable.id, user.workspaceId))
      .execute();

    // if (!workspace) return redirect("/not-found");

    // Check if the user is a member of the workspace
    const [workspaceMember] = await db
      .select()
      .from(workspaceUsersTable)
      .where(
        and(
          eq(workspaceUsersTable.userId, user.id),
          eq(workspaceUsersTable.workspaceId, user.workspaceId),
        ),
      )
      .execute();

    if (!workspaceMember) {
      await db
        .insert(workspaceUsersTable)
        .values({
          userId: user.id,
          workspaceId: workspace.id,
          workspaceName: workspace.name,
          role: user?.role,
          name: user?.name,
        })
        .returning();

      if (!workspaceMember) {
        redirect("/not-found");
      }
    }

    return {
      data: {
        ...user,
        workspaceName: workspace.name,
        workspaceId: workspace.id,
      },
      success: true,
    };
  } catch (error) {
    console.error("Failed to get user workspace:", error);
    return {
      error:
        error instanceof Error ? error.message : "Failed to get user workspace",
      success: false,
    };
  }
}

export async function getWorkspaceMembers(workspaceId: string) {
  try {
    const members = await db
      .select()
      .from(workspaceUsersTable)
      .where(eq(workspaceUsersTable.workspaceId, workspaceId))
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
