import { currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { APIResponse, MeetingResponse } from "@/types";
import { db, usersTable, workspaceMeetingTable, workspacesTable } from "@/db";
import { aj } from "@/lib";

export async function POST(
  req: NextRequest,
): Promise<NextResponse<APIResponse<MeetingResponse>>> {
  try {
    const { data } = await req.json();
    console.log("Data: \n", data);
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" });
    }

    const check = await aj.protect(req, { userId: user.id, requested: 5 });

    if (check.isDenied()) {
      return NextResponse.json({
        success: false,
        error: "Rate limit exceeded",
      });
    }

    const username = user.username;

    const dbUser = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.clerkId, user.id))
      .execute();

    const workspace = await db
      .select()
      .from(workspacesTable)
      .where(eq(workspacesTable.id, data.workspaceId))
      .execute();

    if (!workspace) {
      return NextResponse.json({
        success: false,
        error: "Workspace not found",
      });
    }

    const createMeeting = await db
      .insert(workspaceMeetingTable)
      .values({
        workspaceId: data.workspaceId,
        workspacName: workspace[0]?.name,
        title: data.name,
        hostedBy: dbUser[0]?.id,
        description: data?.description || "Instant Meeting",
        meetingId: data.meetingId || "",
        startAt: new Date(),
        // endAt: data.endAt,
      })
      .returning();

    const meeting = {
      ...createMeeting[0],
      description: createMeeting[0].description || "Instant Meeting",
    };

    if (!meeting) {
      return NextResponse.json({
        success: false,
        error: "Failed to create meeting",
      });
    }

    // Transform to match MeetingResponse type
    const meetingResponse: MeetingResponse = {
      ttile: meeting.title, // Note: 'ttile' appears to be a typo in the MeetingResponse interface
      workspaceName: meeting.workspacName, // Fix property name to match expected interface
      description: meeting.description,
      meetingId: meeting.meetingId,
      hostedBy: meeting.hostedBy,
      workspaceId: meeting.workspaceId,
      startAt: meeting.startAt,
      endAt: meeting.endAt,
      createdAt: meeting.createdAt,
    };

    console.log(
      `New meeting created with name: ${data.name} and hosted by: ${username}`,
    );
    console.log(NextResponse.json({ success: true, data: meetingResponse }));
    return NextResponse.json({ success: true, data: meetingResponse });
  } catch (error: unknown) {
    console.error("Error in workspace/new POST:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
