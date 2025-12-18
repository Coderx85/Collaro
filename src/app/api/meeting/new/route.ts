import { db } from "@/db/client";
import {
  type SelectMeetingType,
  usersTable,
  workspaceMeetingTable,
} from "@/db/schema/schema";
import { currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import type { APIResponse } from "@/types";

type Response<T> = Promise<NextResponse<APIResponse<T>>>;

export async function POST(): Response<SelectMeetingType> {
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

    // Let the database generate the meetingId automatically
    const [meeting] = await db
      .insert(workspaceMeetingTable)
      .values({
        workspaceId: dbUser.workspaceId,
        hostedBy: dbUser.userName,
      })
      .returning();

    return NextResponse.json({ success: true, user: dbUser, meeting });
  } catch (error: unknown) {
    // Removed console.log to satisfy lint rules
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 },
    );
  }
}
