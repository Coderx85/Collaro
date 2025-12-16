import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/db/client";
import { usersTable, workspacesTable } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const { userId: clerkUserId } = await auth();

    if (!clerkUserId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch user data from database using clerkId
    const user = await db
      .select({
        id: usersTable.id,
        name: usersTable.name,
        userName: usersTable.userName,
        email: usersTable.email,
        workspaceId: usersTable.workspaceId,
        role: usersTable.role,
      })
      .from(usersTable)
      .where(eq(usersTable.clerkId, clerkUserId))
      .limit(1);

    if (!user.length) {
      return NextResponse.json(
        { error: "User not found in database" },
        { status: 404 }
      );
    }

    const userData = user[0];
    let workspaceName = null;

    // If user has a workspace, fetch workspace name
    if (userData.workspaceId) {
      const workspace = await db
        .select({
          name: workspacesTable.name,
        })
        .from(workspacesTable)
        .where(eq(workspacesTable.id, userData.workspaceId))
        .limit(1);

      if (workspace.length) {
        workspaceName = workspace[0].name;
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        clerkId: clerkUserId,
        userId: userData.id,
        name: userData.name,
        userName: userData.userName,
        email: userData.email,
        currentWorkspaceId: userData.workspaceId,
        currentWorkspaceName: workspaceName,
        role: userData.role,
      },
    });
  } catch (error) {
    console.error("Error fetching user data:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
