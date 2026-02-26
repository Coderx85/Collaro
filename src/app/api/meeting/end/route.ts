import { db } from "@/db/client";
import { membersTable, workspaceMeetingTable } from "@/db/schema/schema";
import { SelectMeetingType } from "@/db/schema/type";
import { usersTable } from "@/db/schema/schema";
import { headers } from "next/headers";
import { auth } from "@/lib/auth-config";
import { eq } from "drizzle-orm";
import { type NextRequest, NextResponse } from "next/server";
import type { APIResponse } from "@/types";

type Response<T> = Promise<NextResponse<APIResponse<T>>>;

export async function POST(request: NextRequest): Response<SelectMeetingType> {
  const { meetingId } = await request.json();
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

    const [meeting] = await db
      .update(workspaceMeetingTable)
      .set({
        endAt: new Date(),
      })
      .where(eq(workspaceMeetingTable.meetingId, meetingId))
      .returning();

    return NextResponse.json({
      success: true,
      data: meeting,
    });
  } catch (error: unknown) {
    console.error("Error ending meeting:", error);
    return NextResponse.json({
      success: false,
      error: (error as Error).message,
    });
  }
}
