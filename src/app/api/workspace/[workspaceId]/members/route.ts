import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { db, usersTable } from "@/db";
import { eq } from "drizzle-orm";
import { aj } from "@/lib";

export async function GET(
  req: NextRequest,
  { params }: { params: { workspaceId: string } },
) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const check = await aj.protect(req, { userId: user.id, requested: 5 });

    if (check.isDenied()) {
      return NextResponse.json({
        success: false,
        error: "Rate limit exceeded",
      });
    }

    const { workspaceId } = (await params) || "";

    const workspaceMembers = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.workspaceId, workspaceId))
      .orderBy(usersTable.createdAt)
      .execute();

    // Format member data to ensure correct structure for Stream Video API
    const formattedMembers = workspaceMembers.map((member) => ({
      id: member.clerkId, // Ensure this matches the field Stream expects
      name: member.userName || "Unknown Member",
      // imageUrl: member.imageUrl || undefined
    }));

    return NextResponse.json({ members: formattedMembers });
  } catch (error) {
    console.error("Error fetching workspace members:", error);
    return NextResponse.json(
      { error: "Failed to fetch workspace members" },
      { status: 500 },
    );
  }
}
