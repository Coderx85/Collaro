import { db } from "@/db/client";
import {
  type SelectMeetingType,
  membersTable,
  usersTable,
  workspaceMeetingTable,
  meetingParticipantsTable,
} from "@/db/schema/schema";
import { headers } from "next/headers";
import { auth } from "@/lib/auth-config";
import { eq } from "drizzle-orm";
import { NextResponse, type NextRequest } from "next/server";
import type { APIResponse } from "@/types";

type Response<T> = Promise<NextResponse<APIResponse<T>>>;

export async function POST(request: NextRequest): Response<SelectMeetingType> {
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

    // Parse the request body to get the meetingId from Stream
    const body = await request.json();
    const streamMeetingId = body?.data?.meetingId;

    if (!streamMeetingId) {
      return NextResponse.json({
        success: false,
        error: "Meeting ID is required",
      });
    }

    // Get user data from auth table
    const [dbUser] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, session.user.id))
      .execute();

    if (!dbUser) {
      console.error("User not found in database:", session.user.id);
      return NextResponse.json({ success: false, error: "User not found" });
    }

    // Ensure userName exists
    if (!dbUser.userName) {
      console.error("User has no userName:", session.user.id);
      return NextResponse.json({
        success: false,
        error: "User profile incomplete - missing username",
      });
    }

    // Get user's workspace membership
    const [membership] = await db
      .select()
      .from(membersTable)
      .where(eq(membersTable.userId, session.user.id))
      .limit(1)
      .execute();

    if (!membership?.workspaceId) {
      console.error("User not in any workspace:", session.user.id);
      return NextResponse.json({
        success: false,
        error: "User not in a workspace",
      });
    }

    console.log("Creating meeting:", {
      meetingId: streamMeetingId,
      workspaceId: membership.workspaceId,
      hostedBy: dbUser.userName,
    });

    // Use the Stream call ID as the meetingId in the database
    // Use onConflictDoNothing to handle duplicate meeting IDs gracefully
    const [meeting] = await db
      .insert(workspaceMeetingTable)
      .values({
        meetingId: streamMeetingId,
        workspaceId: membership.workspaceId,
        hostedBy: dbUser.userName,
      })
      .onConflictDoNothing()
      .returning();

    // If meeting wasn't created (already exists), try to fetch it
    if (!meeting) {
      console.log("Meeting already exists, fetching...");
      const [existingMeeting] = await db
        .select()
        .from(workspaceMeetingTable)
        .where(eq(workspaceMeetingTable.meetingId, streamMeetingId))
        .execute();

      if (existingMeeting) {
        return NextResponse.json({
          success: true,
          user: dbUser,
          data: existingMeeting,
        });
      }

      return NextResponse.json({
        success: false,
        error: "Failed to create or find meeting",
      });
    }

    console.log("Meeting created:", meeting);

    // Add the meeting host as a participant
    await db
      .insert(meetingParticipantsTable)
      .values({
        meetingId: meeting.meetingId,
        memberId: membership.id,
      })
      .onConflictDoNothing(); // Ignore if already a participant

    return NextResponse.json({ success: true, user: dbUser, data: meeting });
  } catch (error: unknown) {
    console.error("Error creating meeting:", error);

    // Log more specific error info
    if (error instanceof Error) {
      console.error("Error name:", error.name);
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    }

    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
