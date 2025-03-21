import { currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server"
import { APIResponse, MeetingResponse } from "@/types";
import { db, usersTable, workspaceMeetingTable } from "@/db";

export async function POST(req: NextRequest): Promise<NextResponse<APIResponse<MeetingResponse>>> {
  try {
    const { data } = await req.json();
    console.log('Data: \n', data);
    const user = await currentUser();
    if(!user) {
      return NextResponse.json({ success: false, error: 'User not found' });
    }
    const username = user.username;

    const dbUser = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.clerkId, user.id))
      .execute();

    const createMeeting = await db
      .insert(workspaceMeetingTable)
      .values({
        workspaceId: data.workspaceId,
        name: data.name,
        hostedBy: dbUser[0]?.id,
        description: data?.description || "Instant Meeting",
        meetingId: data.meetingId || "",
        startAt: new Date(),
        // endAt: data.endAt,
      })
      .returning();

    const meeting = {
      ...createMeeting[0],
      description: createMeeting[0].description || "Instant Meeting"
    };

    if(!meeting) {
      return NextResponse.json({ success: false, error: 'Failed to create meeting' });
    }
      
    console.log(`New meeting created with name: ${data.name} and hosted by: ${username}`);
    console.log(NextResponse.json({ success : true, data: meeting }));
    return NextResponse.json({ success: true, data: meeting });
  } catch (error: unknown) {
    console.error('Error in workspace/new POST:', error);
    return new NextResponse('Internal Server Error', {status: 500});
  }
}