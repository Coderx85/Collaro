import { db, usersTable, workspacesTable, workspaceUsersTable } from "@/db";
import { APIResponse, CreateWorkspaceResponse } from "@/types";
import { clerkClient, currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

type Response<T> = Promise<NextResponse<APIResponse<T>>>

export async function POST(
  req: NextRequest
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

    const [workspace] = await db
      .insert(workspacesTable)
      .values({
        name,
        createdBy: dbUser.userName,
      })
      .returning();

    if (!workspace) {
      return NextResponse.json({
        success: false,
        error: `Cannot create workspace with Name: ${name}`,
      });
    }
    
    // Update user metadata
    (await clerkClient()).users.updateUserMetadata(dbUser.clerkId, {
      publicMetadata: {
        role: "member",
      },
    });

    // Update the worksapceUSersTable
    const [workspaceUsers] = await db
      .insert(workspaceUsersTable)
      .values({
        userName: dbUser.userName,
        workspaceName: workspace.name,
        role: "admin",
        updatedAt: new Date(),
      })
      .returning();

    if (!workspaceUsers) {
      return NextResponse.json({ 
        success: false, 
        error: `Cannot update workspaceUsersTable with workspaceId: ${workspace.id} and userId: ${dbUser.id}` 
      });
    }

    const responseData: CreateWorkspaceResponse = {
      ...workspace,
      createdBy: dbUser.userName,
      members: [workspaceUsers.userName],
    };
    return NextResponse.json({ success: true, data: responseData });
  } catch (error: unknown) {
    return NextResponse.json({ success: false, error: `Failed to create workspace:: \n ${error}` });
  }
}