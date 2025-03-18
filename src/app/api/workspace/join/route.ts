import { db, usersTable, workspacesTable, workspaceUsersTable  } from "@/db";
import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { eq, and } from "drizzle-orm";
import { APIResponse, CreateWorkspaceResponse  } from "@/types";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function POST(req: NextRequest): Promise<NextResponse<APIResponse<CreateWorkspaceResponse>>> {
  try {
    const cookieStore = await cookies();
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
      return NextResponse.json({ error: "Clerk User not foxund", success: false }, { status: 404 });
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
      return NextResponse.json({ error: `User not found with username: ${clerkUser.username}`, success: false }, { status: 404 });
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

    const workspaceId = workspace[0].id;

    // Check if the user is already in the workspace
    const user = await db
      .select()
      .from(usersTable)
      .where(and(
        eq(usersTable.clerkId, clerkUser.id), 
        eq(usersTable.workspaceId, workspaceId)
      ))
      .execute();
      console.log("✅ User exist in workspace");
    if (user.length) {
      console.log('User:', clerkUser.id, 'already in workspace:', workspaceId);
      return NextResponse.json({ error: `User Already exist in the Workspace`, success: false }, { status: 400 });
    }

    // Update the user's workspace
    await db
      .update(usersTable)
      .set({ workspaceId, role: 'member', updatedAt: new Date() })
      .where(eq(usersTable.clerkId, clerkUser.id))
      .execute();
    console.log("✅ User updated");

    await db
      .insert(workspaceUsersTable)
      .values({
        userId: dbUser[0].id,
        workspaceId,
        role: 'member',
        name: user[0].name,
      })
      .execute();      
    console.log("✅ Workspace User created");

    console.log('User:', clerkUser.id, 'joined workspace:', workspaceId);
    cookieStore.set('workspaceId', workspaceId);
    console.log("✅ Set Workspace ID in cookie");
    const data = {
      ...workspace[0],
      members: [dbUser[0].id],
    }
    console.log("✅ Data:", data);
    return NextResponse.json({ data, success: true }, { status: 200 });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error(`Failed to join workspace: \n ${errorMessage}`);
    return NextResponse.json({ error: `Failed to join workspace: ${errorMessage}`, success: false }, { status: 500 });
  }
}