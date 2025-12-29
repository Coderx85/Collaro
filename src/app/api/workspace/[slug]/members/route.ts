import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/client";
import { membersTable, usersTable } from "@/db/schema/schema";
import { account, session } from "@/db/schema/auth-schema";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth-config";
import { headers } from "next/headers";
import { TUser, TWorkspaceMembersTableRow, TWorkspaceUser } from "@/types";

export const GET = async (
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) => {
  try {
    const { slug } = await params;

    if (!slug) {
      return NextResponse.json(
        { success: false, error: "Missing slug" },
        { status: 400 }
      );
    }

    const workspace = await auth.api.getFullOrganization({
      query: {
        organizationSlug: slug,
      },
      headers: await headers(),
    });

    if (!workspace) {
      return NextResponse.json(
        { success: false, error: "Workspace not found" },
        { status: 404 }
      );
    }

    // Fetch members from DB with user details, as well as their accounts and sessions
    const rows = await db
      .select({ member: membersTable, user: usersTable })
      .from(membersTable)
      .leftJoin(usersTable, eq(membersTable.userId, usersTable.id))
      .where(eq(membersTable.workspaceId, workspace.id));

    const members: TWorkspaceMembersTableRow = rows.map(({ member, user }) => ({
      id: member.id,
      userId: member.userId,
      workspaceId: member.workspaceId,
      role: member.role,
      createdAt: member.createdAt,
      updatedAt: member.updatedAt,
      name: user?.name || "",
      email: user?.email || "",
      emailVerified: user?.emailVerified || false,
      userName: user?.userName || "",
    }));

    return NextResponse.json({ success: true, data: members });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 }
    );
  }
};
