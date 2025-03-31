import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db, usersTable, workspacesTable } from "@/db";
import { aj } from "@/lib";

export async function POST(req: NextRequest) {
  try {
    const clerkUser = await currentUser();
    if (!clerkUser) {
      return NextResponse.error();
    }

    // Check if user is in a workspace
    const user = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.clerkId, clerkUser.id))
      .execute();

    if (!user || user.length < 1 || !user[0].workspaceId) {
      console.log("User is not in a workspace");
      return NextResponse.json(
        { message: "You are not in a workspace" },
        { status: 400 },
      );
    }

    // Check if user is the creator of the workspace
    const check = await aj.protect(req, {
      userId: user[0].clerkId,
      requested: 5,
    });

    if (check.isDenied()) {
      return NextResponse.json({
        success: false,
        error: "Rate limit exceeded",
      });
    }

    // Check if workspace exists
    const workspace = await db
      .select()
      .from(workspacesTable)
      .where(eq(workspacesTable.id, user[0].workspaceId))
      .execute();
    if (!workspace || workspace.length < 1) {
      console.log("Workspace does not exist");
      return NextResponse.json(
        { message: "Workspace does not exist" },
        { status: 400 },
      );
    }

    // Check if the user is the creator of the workspace
    if (workspace[0].createdBy === user[0].id) {
      console.log("User is the creator of the workspace");
      // Delete the workspace
      await db
        .delete(workspacesTable)
        .where(eq(workspacesTable.id, user[0].workspaceId))
        .execute();
      console.log("Workspace deleted:", user[0].workspaceId);
    }

    // const workspaceId = user[0].workspaceId
    const updateUser = await db
      .update(usersTable)
      .set({ workspaceId: null, updatedAt: new Date() })
      .where(eq(usersTable.clerkId, clerkUser.id))
      .execute();
    if (!updateUser) {
      console.log("Failed to leave workspace");
      return NextResponse.json(
        { message: "Failed to leave workspace" },
        { status: 500 },
      );
    }

    console.log("User left workspace:", user[0].workspaceId);
    return NextResponse.json(
      { message: "Successfully left workspace" },
      { status: 200 },
    );
  } catch (error: unknown) {
    console.error(error);
    return {
      status: 500,
      body: { message: `Failed to execute Remove Operation: ${error}` },
    };
  }
}
