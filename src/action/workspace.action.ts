"use server";
import { db, usersTable, workspacesTable, workspaceUsersTable } from "@/db";
import { currentUser } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { APIResponse } from "@/types/api";
import { WorkspaceCheckResponse } from "@/types/workspace";

// This function is used to get the users of a workspace
export async function getWorkspaceUsers(workspaceId: string) {
  const clerkUser = await currentUser();
  if (!clerkUser) {
    return { message: "User not found" };
  }

  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.clerkId, clerkUser.id))
    .execute();

  if (!user) return { message: "User not found in the database" };

  // Check if workspace exists and user belongs to it
  const [workspaceUsers] = await db
    .select()
    .from(workspaceUsersTable)
    .where(
      and(
        eq(workspaceUsersTable.workspaceId, workspaceId),
        eq(workspaceUsersTable.userId, user.id),
      ),
    )
    .execute();

  if (!workspaceUsers) return { message: "No users found for this workspace" };

  const members = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.workspaceId, workspaceId))
    .execute();

  return { data: members };
}

// This function is used to check if a user belongs to a workspace
export async function checkWorkspaceUser(
  userId: string,
  workspaceId: string,
): Promise<WorkspaceCheckResponse> {
  try {
    console.log(
      `Checking access for user ${userId} to workspace ${workspaceId}`,
    );

    // First check if the user exists
    const [dbUser] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.clerkId, userId))
      .execute();

    if (!dbUser) {
      console.log("User not found in database");
      return {
        error: "User not found",
        success: false,
        status: 401,
      };
    }

    // Check if user belongs to the workspace in users table
    const userHasAccess = dbUser.workspaceId === workspaceId;

    if (!userHasAccess) {
      console.log(
        `User ${dbUser.id} does not have access to workspace ${workspaceId}`,
      );
      return {
        error: "User does not have access to this workspace",
        success: false,
        status: 403,
      };
    }

    // Check if workspace exists
    const [workspace] = await db
      .select()
      .from(workspacesTable)
      .where(eq(workspacesTable.id, workspaceId))
      .execute();

    if (!workspace) {
      console.log(`Workspace ${workspaceId} not found`);
      return {
        error: "Workspace not found",
        success: false,
        status: 404,
      };
    }

    // Check if user is already in workspace_users table
    const [workspaceUser] = await db
      .select()
      .from(workspaceUsersTable)
      .where(
        and(
          eq(workspaceUsersTable.workspaceId, workspaceId),
          eq(workspaceUsersTable.userId, dbUser.id),
        ),
      )
      .execute();

    // Only insert if user is not already in workspace_users table
    if (!workspaceUser) {
      console.log(
        `Adding user ${dbUser.id} to workspace_users table for workspace ${workspaceId}`,
      );
      // Add user to workspace_users table
      await db
        .insert(workspaceUsersTable)
        .values({
          name: dbUser.name,
          userId: dbUser.id,
          role: dbUser.role,
          workspaceId,
          workspaceName: workspace.name,
        })
        .execute();

      return {
        data: "User added to workspace",
        success: true,
        status: 201,
      };
    }

    return {
      data: "User has access to workspace",
      success: true,
      status: 200,
    };
  } catch (error: unknown) {
    console.error("Error checking workspace access:", error);
    return {
      error: `Failed to check workspace: ${error}`,
      success: false,
      status: 500,
    };
  }
}

// This function is used to validate if a user belongs to a workspace
export async function validateWorkspaceAccess(
  userId: string,
  workspaceId: string,
  isPageReload = false,
) {
  const checkUser = await checkWorkspaceUser(userId, workspaceId);

  // Don't redirect on page reloads to avoid "not found" errors
  if (!checkUser.success && !isPageReload) {
    if (checkUser.status === 404) {
      redirect("/not-found");
    } else if (checkUser.status === 401) {
      redirect("/login");
    } else {
      redirect("/unauthorized");
    }
  }
  return checkUser;
}

// This function is used to get the workspace of a user
export async function getWorkspace(userId: string) {
  try {
    const user = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.clerkId, userId))
      .execute();

    if (!user || user.length < 1) return { message: "User not found" };

    if (!user[0]?.workspaceId)
      return { message: "User does not belong to any workspace" };

    const workspace = await db
      .select()
      .from(workspacesTable)
      .where(eq(workspacesTable.id, user[0]?.workspaceId))
      .execute();

    const workspaceMember = await getWorkspaceUsers(user[0]?.workspaceId);
    if (!workspaceMember.data)
      return { message: "No members found for this workspace" };

    const memberData = workspaceMember.data;
    // console.log("memberData:: \n", memberData);
    const member = memberData.map((member) => {
      return {
        id: member.id,
        name: member.name,
        userName: member.userName,
        // imageUrl: member.imageUrl,
        email: member.email,
        role: member.role,
      };
    });
    const data = { ...workspace[0], member };
    return { data };
  } catch (error: unknown) {
    return { error: `Failed to get workspace:: \n ${error}` };
  }
}

// This function is used to get all workspaces
export async function getAllWorkspaces() {
  try {
    const data = await db.select().from(workspacesTable).execute();
    const memberArray = [await db.select().from(workspaceUsersTable).execute()];
    const member = memberArray[0];
    return {
      ...data,
      member,
    };
  } catch (error: unknown) {
    return { error: `Failed to get workspaces:: \n ${error}` };
  }
}

// This function is used to update the role of a user in a workspace
export async function updateUserRole(
  userId: string,
  workspaceId: string,
  role: string,
): Promise<APIResponse<{ role: string }>> {
  try {
    const updatedUser = await db
      .update(usersTable)
      .set({ role })
      .where(
        and(eq(usersTable.id, userId), eq(usersTable.workspaceId, workspaceId)),
      )
      .returning({ role: usersTable.role });

    if (updatedUser && updatedUser.length > 0) {
      return { data: updatedUser[0], success: true };
    } else {
      return { error: "User not found", success: false };
    }
  } catch (error: any) {
    return {
      error: `Failed to update user role: ${error.message}`,
      success: false,
    };
  }
}
