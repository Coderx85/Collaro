"use server";
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

export async function checkWorkspaceUser(
  userId: string,
  workspaceId: string,
): Promise<WorkspaceCheckResponse> {
  try {
    const [dbUser] = await db
      .select()
      .from(usersTable)
      .where(
        and(
          eq(usersTable.clerkId, userId),
          eq(usersTable.workspaceId, workspaceId),
        ),
      )
      .execute();

    if (!dbUser) {
      redirect("/unauthorized");
    }

    const [workspace] = await db
      .select()
      .from(workspaceUsersTable)
      .where(
        and(
          eq(workspaceUsersTable.workspaceId, workspaceId),
          eq(workspaceUsersTable.userId, dbUser?.id),
        ),
      )
      .execute();

    // console.log('workspace:: \n', workspace[0])

    if (dbUser && workspace) {
      const newMember = db
        .insert(workspaceUsersTable)
        .values({
          name: dbUser?.name,
          userId,
          role: dbUser?.role,
          workspaceId,
          workspaceName: workspace?.name,
        })
        .returning();
      // console.log("newMember \n", newMember);

      return {
        data: `User added to workspace \n ${newMember}`,
        success: true,
        status: 201,
      };
    }

    if (!workspace) redirect("/not-found");

    return {
      data: "Workspace found",
      success: true,
      status: 200,
    };
  } catch (error: unknown) {
    return {
      error: `Failed to check workspace:: \n ${error}`,
      success: false,
      status: 500,
    };
  }
}

export async function validateWorkspaceAccess(
  userId: string,
  workspaceId: string,
) {
  const checkUser = await checkWorkspaceUser(userId, workspaceId);

  if (!checkUser.success) {
    if (checkUser.status === 404) {
      redirect("/not-found");
    } else {
      redirect("/unauthorized");
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
