"use server";

import { db, usersTable, workspaceUsersTable, workspacesTable } from "@/db";
import { APIResponse, UserResponse } from "@/types";
import { clerkClient, currentUser } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { redirect } from "next/navigation";

export async function getUserWorkspaceId() {
  try {
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

    // Create new user if doesn't exist
    if (user.length === 0) {
      const newUser = await db
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
        publicMetadata: { role: newUser[0]?.role },
      });

      return {
        data: {
          workspaceId: "",
          workspaceName: "",
          userName: newUser[0].userName,
          role: newUser[0].role,
          id: newUser[0].id,
        },
        success: true,
      };
      // redirect('/unauthorised');
    } else {
      // Update existing user's Clerk metadata
      await (
        await clerkClient()
      ).users.updateUserMetadata(clerkUser.id, {
        publicMetadata: { role: user[0].role },
      });
    }

    const workspaceId = user[0]?.workspaceId || "";
    // if (!workspaceId) {
    //   redirect('/unauthorised');
    // }

    if (workspaceId) {
      // Check if the workspace exists
      const workspace = await db
        .select()
        .from(workspacesTable)
        .where(eq(workspacesTable.id, workspaceId))
        .execute();

      if (workspace.length === 0) {
        redirect("/not-found");
      }

      // Check if the user is a member of the workspace
      const workspaceMember = await db
        .select()
        .from(workspaceUsersTable)
        .where(
          and(
            eq(workspaceUsersTable.userId, user[0]?.id),
            eq(workspaceUsersTable.workspaceId, workspaceId),
          ),
        )
        .execute();

      if (workspaceMember.length === 0) {
        const updateWorkspaceMember = await db
          .insert(workspaceUsersTable)
          .values({
            userId: user[0]?.id,
            workspaceId,
            workspaceName: workspace[0]?.name,
            role: user[0]?.role,
            name: user[0]?.name,
          })
          .returning();

        if (updateWorkspaceMember.length === 0) {
          redirect("/not-found");
        }
      }

      return {
        data: {
          workspaceId,
          workspaceName: workspace[0]?.name,
          userName: user[0].userName,
          role: user[0].role,
          id: user[0].id,
        },
        success: true,
      };
    }

    return {
      data: {
        workspaceId: "",
        workspaceName: "",
        userName: user[0].userName,
        role: user[0].role,
        id: user[0].id,
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

interface getUserResponse {
  data?: UserResponse;
  error?: string;
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

export async function getUser(): Promise<getUserResponse> {
  try {
    // Get the current user
    const clerkUser = await currentUser();
    if (!clerkUser) return redirect("/sign-in");

    const clerkId = clerkUser.id.toString();

    // Check if the user exists in the database
    const user = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.clerkId, clerkId))
      .execute();

    // If the user does not exist,
    if (!user.length) return { error: "User does not exist" };

    return { data: user[0] };
  } catch (error: unknown) {
    return { error: `Failed to get user:: \n ${error}` };
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
