import { NextRequest, NextResponse } from "next/server";
import { db, usersTable } from "@repo/database";
import { APIResponse } from "@/types";
import { eq } from "drizzle-orm";

type CheckWorkspaceId = {
  workspaceId: string;
}

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse<APIResponse<CheckWorkspaceId>>> {
  const { id } = params;

  try {
    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.clerkId, id))
      .execute();

    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" });
    }

    if (user.workspaceId === null) {
      return NextResponse.json({ success: false, error: "Workspace ID not found" });
    }
    console.log("Workspace ID found: \n", user.workspaceId);
    return NextResponse.json({ success: true, data: { workspaceId: user.workspaceId } });
  } catch (error: unknown) {
    console.error("Error fetching workspace ID:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch workspace ID" });
  }
}
