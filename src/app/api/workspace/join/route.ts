import { db } from "@/db/client";
import {
  usersTable,
  workspacesTable,
  workspaceUsersTable,
} from "@/db/schema/schema";
import type { APIResponse, CreateWorkspaceResponse } from "@/types";
import { clerkClient, currentUser } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { type NextRequest, NextResponse } from "next/server";

type Response<T> = Promise<NextResponse<APIResponse<T>>>;

export async function POST(
  req: NextRequest,
): Response<CreateWorkspaceResponse> {
  try {
    const { name } = await req.json();
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({
        success: false,
        error: "User not found",
      });
    }

    const userId = user.id;

    // Check if user exists, create if not
    let [dbUser] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.clerkId, userId))
      .execute();

    if (!dbUser) {
      // Create user if they don't exist
      const [newUser] = await db
        .insert(usersTable)
        .values({
          clerkId: userId,
          name: user.firstName + " " + user.lastName,
          email: user.emailAddresses[0].emailAddress,
          role: "member",
          workspaceId: null,
          userName: user.username!,
          updatedAt: new Date(),
        })
        .returning();

      if (!newUser) {
        return NextResponse.json({
          success: false,
          error: "Failed to create user",
        });
      }

      dbUser = newUser;
    }

    // Check if workspace exists
    const [workspace] = await db
      .select()
      .from(workspacesTable)
      .where(eq(workspacesTable.name, name))
      .execute();

    if (!workspace) {
      return NextResponse.json({
        success: false,
        error: `Workspace not found with Name: ${name}`,
      });
    }

    // Check if user is already a member
    const [existingMember] = await db
      .select()
      .from(workspaceUsersTable)
      .where(
        and(
          eq(workspaceUsersTable.userName, dbUser.userName),
          eq(workspaceUsersTable.workspaceName, workspace.name),
        ),
      )
      .execute();

    if (existingMember) {
      return NextResponse.json({
        success: false,
        error: `You are already a member of workspace: ${name}`,
      });
    }

    // validate request data and db user id to satisfy Drizzle's non-null typings
    if (!name || typeof name !== "string") {
      return NextResponse.json({
        success: false,
        error: "Invalid workspace name",
      });
    }

    if (!dbUser.userName) {
      return NextResponse.json({
        success: false,
        error: "Invalid user name",
      });
    }

    // Update user metadata
    (await clerkClient()).users.updateUserMetadata(dbUser.clerkId, {
      publicMetadata: {
        role: "member",
      },
    });

    // Add user to workspace
    const [workspaceUsers] = await db
      .insert(workspaceUsersTable)
      .values({
        userName: dbUser.userName,
        workspaceName: workspace.name,
        role: "member",
        updatedAt: new Date(),
      })
      .returning();

    if (!workspaceUsers) {
      return NextResponse.json({
        success: false,
        error: `Cannot join workspace: ${workspace.name}`,
      });
    }

    // Get all workspace members
    const allMembers = await db
      .select()
      .from(workspaceUsersTable)
      .where(eq(workspaceUsersTable.workspaceName, workspace.name))
      .execute();

    const responseData: CreateWorkspaceResponse = {
      ...workspace,
      createdBy: workspace.createdBy || "",
      members: allMembers.map((member) => member.userName),
    };
    return NextResponse.json({ success: true, data: responseData });
  } catch (error: unknown) {
    return NextResponse.json({
      success: false,
      error: `Failed to join workspace: ${error}`,
    });
  }
}
