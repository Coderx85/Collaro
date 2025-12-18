import { type NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth-config";
import { db } from "@/db/client";
import { membersTable, workspacesTable } from "@/db/schema/schema";
import { usersTable } from "@/db/schema/schema";
import { eq } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // Fetch user data from better-auth user table
    const [userData] = await db
      .select({
        id: usersTable.id,
        name: usersTable.name,
        userName: usersTable.userName,
        email: usersTable.email,
      })
      .from(usersTable)
      .where(eq(usersTable.id, userId))
      .limit(1);

    if (!userData) {
      return NextResponse.json(
        { error: "User not found in database" },
        { status: 404 },
      );
    }

    // Get user's first workspace membership
    const [membership] = await db
      .select({
        workspaceId: membersTable.workspaceId,
        role: membersTable.role,
      })
      .from(membersTable)
      .where(eq(membersTable.userId, userId))
      .limit(1);

    let workspaceName = null;
    let workspaceId = null;
    let role = "member";

    // If user has a workspace, fetch workspace name
    if (membership?.workspaceId) {
      workspaceId = membership.workspaceId;
      role = membership.role;

      const [workspace] = await db
        .select({
          name: workspacesTable.name,
        })
        .from(workspacesTable)
        .where(eq(workspacesTable.id, workspaceId))
        .limit(1);

      if (workspace) {
        workspaceName = workspace.name;
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        clerkId: userId, // Legacy field name, now stores better-auth user id
        userId: userData.id,
        name: userData.name,
        userName: userData.userName,
        email: userData.email,
        currentWorkspaceId: workspaceId,
        currentWorkspaceName: workspaceName,
        role: role,
      },
    });
  } catch (error) {
    console.error("Error fetching user data:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
