import { db } from "@/db";
import { usersTable, workspacesTable } from "@/db/schema";
import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { eq, and } from "drizzle-orm";

export async function POST(req: NextRequest) {
  try {
    const { name } = await req.json();
    if (!name) {
      return NextResponse.json({ error: "Workspace name is required" }, { status: 400 });
    }

    // Get the current user
    const clerkUser = await currentUser();
    if (!clerkUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    // Check if the workspace exists
    const workspace = await db
      .select()
      .from(workspacesTable)
      .where(eq(workspacesTable.name, name))
      .execute();

    if (!workspace.length) {
      return NextResponse.json({ error: "Workspace not found" }, { status: 404 });
    }

    console.log('Workspace:', workspace);

    const workspaceId = workspace[0].id;

    // Check if the user is already in the workspace
    const user = await db
      .select()
      .from(usersTable)
      .where(and(eq(usersTable.clerkId, clerkUser.id), eq(usersTable.workspaceId, workspaceId)))
      .execute();

    if (user.length) {
      return NextResponse.json({ message: "User already in the workspace", workspace }, { status: 200 });
    }

    // Update the user's workspace
    await db
      .update(usersTable)
      .set({ workspaceId })
      .where(eq(usersTable.clerkId, clerkUser.id))
      .execute();
    
    console.log('User:', clerkUser.id, 'joined workspace:', workspaceId);

    return NextResponse.json({ workspace });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: `Failed to join workspace: ${errorMessage}` }, { status: 500 });
  }
}