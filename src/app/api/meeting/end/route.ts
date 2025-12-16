import { db } from "@/db/client";
import {
  SelectMeetingType,
  usersTable,
  workspaceMeetingTable,
} from "@/db/schema";
import { currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { APIResponse } from "@/types";

type Response<T> = Promise<NextResponse<APIResponse<T>>>;

export async function POST(request: NextRequest): Response<SelectMeetingType> {
  const { meetingId } = await request.json();
  try {
    const clerkUser = await currentUser();
    if (!clerkUser) {
      return NextResponse.json({
        success: false,
        error: "User not authenticated",
      });
    }

    const [dbUser] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.clerkId, clerkUser?.id))
      .execute();

    if (!dbUser) {
      return NextResponse.json({ success: false, error: "User not found" });
    }

    if (!dbUser.workspaceId) {
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

    return NextResponse.json({ success: true, user: dbUser, meeting });
  } catch (error: unknown) {
    console.log("Error creating meeting:", error);
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
