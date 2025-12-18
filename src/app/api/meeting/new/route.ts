import { db } from "@/db/client";
import {
  type SelectMeetingType,
  membersTable,
  usersTable,
  workspaceMeetingTable,
} from "@/db/schema/schema";
import { headers } from "next/headers";
import { auth } from "@/lib/auth-config";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import type { APIResponse } from "@/types";

type Response<T> = Promise<NextResponse<APIResponse<T>>>;

export async function POST(): Response<SelectMeetingType> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json({
        success: false,
        error: "User not authenticated",
      });
    }

    // Get user data from auth table
    const [dbUser] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, session.user.id))
      .execute();

    if (!dbUser) {
      return NextResponse.json({ success: false, error: "User not found" });
    }

    // Get user's workspace membership
    const [membership] = await db
      .select()
      .from(membersTable)
      .where(eq(membersTable.userId, session.user.id))
      .limit(1)
      .execute();

    if (!membership?.workspaceId) {
      return NextResponse.json({
        success: false,
        error: "User not in a workspace",
      });
    }

    // Let the database generate the meetingId automatically
    const [meeting] = await db
      .insert(workspaceMeetingTable)
      .values({
        workspaceId: membership.workspaceId,
        hostedBy: dbUser.userName || session.user.name,
      })
      .returning();

    return NextResponse.json({ success: true, user: dbUser, meeting });
  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
