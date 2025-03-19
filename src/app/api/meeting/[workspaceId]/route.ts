import { db, workspaceMeetingTable } from "@/db";
import { APIResponse, MeetingResponse } from "@/types";
import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest, props: {params: Promise<{workspaceId: string}>}): Promise<NextResponse<APIResponse<MeetingResponse>>> {
  const params = await props.params;
  try {
    const { data } = await req.json();
    const workspaceId = params.workspaceId;
    const user = await currentUser();
    if(!user) {
      return NextResponse.json({ success: false, error: 'User not found' });
    }

    const username = user.username;

    const createMeeting = await db
      .insert(workspaceMeetingTable)
      .values({
        workspaceId,
        name: data?.name,
        hostedBy: username || "",
        description: data?.description || "Instant Meeting",
        meetingId: data?.meetingId || "",
        startAt: new Date(data.startAt),
        endAt: new Date(data.endAt),
      })
      .returning();

    const meeting = {
      ...createMeeting[0],
      description: createMeeting[0].description || "Instant Meeting"
    };

    if(!meeting) {
      return NextResponse.json({ success: false, error: 'Failed to create meeting' });
    }

    return NextResponse.json({ success: true, data: meeting });
  } catch (error: unknown) {
    console.error('Error in workspace/new POST:', error);
    return new NextResponse('Internal Server Error', {status: 500});
  }
}