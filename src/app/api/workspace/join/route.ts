import { db, usersTable, workspacesTable, workspaceUsersTable  } from "@/db";
import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { eq, and } from "drizzle-orm";
import { APIResponse, WorkspaceResponse,  } from "@/types";
import { redirect } from "next/navigation";

export async function POST(req: NextRequest): Promise<NextResponse<APIResponse<WorkspaceResponse>>> {
  try {
    const { name } = await req.json();
    if (!name) {
      console.error("Workspace name is required");
      return NextResponse.json({ error: "Workspace name is required", success: false }, { status: 400 });
    }

    // Get the current user
    const clerkUser = await currentUser();
    if (!clerkUser) {
      console.error("Clerk User not found");
      redirect("/sign-in");
    }
    // console.log("✅ Clerk User exist", clerkUser);

    // Check if the user exists
    const dbUser = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.clerkId, clerkUser.id))
      .execute();
    console.log("✅ DB User exist");
    
    if (!dbUser.length) {
      redirect('/sign-in')
    }

    // Check if the workspace exists
    const workspace = await db
      .select()
      .from(workspacesTable)
      .where(eq(workspacesTable.name, name))
      .execute();

      console.log("✅ Workspace exist");
    if (!workspace.length) {
      return NextResponse.json({ error: "Workspace not found", success: false }, { status: 404 });
    }

    console.log('Workspace:', workspace);

    // Check if the user is already in the workspace
    const user = await db
      .select()
      .from(usersTable)
      .where(
        and(
          eq(usersTable.clerkId, clerkUser.id), 
          eq(usersTable.workspaceId, workspace[0].id)
      ))
      .execute();
      console.log("✅ User exist in workspace");
    if (user.length) {
      console.log('User:', clerkUser.username, 'already in workspace:', workspace[0].id);
      return NextResponse.json({ error: `User Already exist in the Workspace`, success: false }, { status: 400 });
    }

    // Update the user's workspace
    await db
      .update(usersTable)
      .set({ workspaceId: workspace[0].id, role: 'member' })
      .where(eq(usersTable.clerkId, clerkUser.id))
      .execute();
    
    await db
      .insert(workspaceUsersTable)
      .values({
        userId: dbUser[0].id,
        workspaceId: workspace[0].id,
        name: user[0].userName,
        workspaceName: workspace[0].name,
        role: 'member',
      })
      .execute();      

    console.log('User:', clerkUser.id, 'joined workspace:', workspace[0].id);
    const data = workspace[0]
    console.log("✅ Data:", data);
    return NextResponse.json({ data, success: true }, { status: 200 });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error(`Failed to join workspace: \n ${errorMessage}`);
    return NextResponse.json({ error: `Failed to join workspace: ${errorMessage}`, success: false }, { status: 500 });
  }
}