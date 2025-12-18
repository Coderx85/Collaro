import { db } from "@/db/client";
import { workspacesTable, membersTable, usersTable } from "@/db/schema/schema";
import type { APIResponse, CreateWorkspaceResponse } from "@/types";
import { headers } from "next/headers";
import { auth } from "@/lib/auth-config";
import { eq } from "drizzle-orm";
import { type NextRequest, NextResponse } from "next/server";

type Response<T> = Promise<NextResponse<APIResponse<T>>>;

export async function POST(
  req: NextRequest
): Response<CreateWorkspaceResponse> {
  try {
    const { name } = await req.json();
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json({
        success: false,
        error: "User not authenticated",
      });
    }

    const userId = session.user.id;

    // Check if user exists in auth table
    const [dbUser] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, userId))
      .execute();

    if (!dbUser) {
      return NextResponse.json({
        success: false,
        error: "User not found in database",
      });
    }

    const [checkWorkspace] = await db
      .select()
      .from(workspacesTable)
      .where(eq(workspacesTable.name, name))
      .execute();

    if (checkWorkspace) {
      return NextResponse.json({
        success: false,
        error: `Workspace already exists with Name: ${name}`,
      });
    }

    // validate request data
    if (!name || typeof name !== "string") {
      return NextResponse.json({
        success: false,
        error: "Invalid workspace name",
      });
    }

    const userName = dbUser.userName || session.user.name;
    if (!userName) {
      return NextResponse.json({
        success: false,
        error: "Invalid user name",
      });
    }

    // Generate slug from name
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

    const [workspace] = await db
      .insert(workspacesTable)
      .values({
        name,
        slug,
        createdBy: userName,
      })
      .returning();

    if (!workspace) {
      return NextResponse.json({
        success: false,
        error: `Cannot create workspace with Name: ${name}`,
      });
    }

    // Add user to members table as admin
    const [member] = await db
      .insert(membersTable)
      .values({
        userId: userId,
        workspaceId: workspace.id,
        role: "admin",
      })
      .returning();

    if (!member) {
      return NextResponse.json({
        success: false,
        error: `Cannot add user to workspace: ${workspace.id}`,
      });
    }

    const responseData: CreateWorkspaceResponse = {
      ...workspace,
      createdBy: userName,
      members: [userId],
    };
    return NextResponse.json({ success: true, data: responseData });
  } catch (error: unknown) {
    return NextResponse.json({
      success: false,
      error: `Failed to create workspace:: \n ${error}`,
    });
  }
}
