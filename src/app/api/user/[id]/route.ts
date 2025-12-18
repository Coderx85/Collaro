import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/db/client";
import { membersTable, usersTable } from "@/db/schema/schema";
import { APIResponse } from "@/types";
import { eq } from "drizzle-orm";

type CheckWorkspaceId = {
  workspaceId: string;
};

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  try {
    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, id))
      .execute();

    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" });
    }

    const [membership] = await db
      .select()
      .from(membersTable)
      .where(eq(membersTable.userId, id))
      .limit(1)
      .execute();

    if (!membership?.workspaceId) {
      return NextResponse.json({
        success: false,
        error: "User not in a workspace",
      });
    }

    console.log("Workspace ID found: \n", membership?.workspaceId);
    return NextResponse.json({
      success: true,
      data: { workspaceId: membership?.workspaceId },
    });
  } catch (error: unknown) {
    console.error("Error fetching workspace ID:", error);
    return NextResponse.json({
      success: false,
      error: "Failed to fetch workspace ID",
    });
  }
}
