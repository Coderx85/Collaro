import { NextRequest, NextResponse } from 'next/server';
import { db, workspaceMeetingTable } from '@/db';
import { eq } from 'drizzle-orm';
// import { APIResponse, MeetingIdOnly } from '@/types';

export async function PATCH(req: NextRequest, { params }: { params: { meetingId: string } }) {
  // const meetingId = await req.query;
  const { meetingId } = await params;
  console.log('MeetingId: \n', meetingId);
  // console.log(req.query);
  try {
    // Get the meetingId from the URL parameters
    // const meetingId = await params.meetingId;
    // console.log('MeetingId: \n', meetingId);

    // Update the meeting in the database with end time
    const updatedMeeting = await db
      .update(workspaceMeetingTable)
      .set({
        endAt: new Date(),
      })
      .where(eq(workspaceMeetingTable.meetingId, meetingId))
      .returning();
    console.log('Updated Meeting: \n', updatedMeeting);
    if (!updatedMeeting) {
      console.log('Failed to end the meeting');
      return NextResponse.json({ error: 'Failed to end the meeting' }, { status: 400 });
    }
    
    return NextResponse.json(
      {data: updatedMeeting[0], success: true},
      { status: 200 }
    );
  } catch (error) {
    console.error("Error ending meeting:", error);
    return NextResponse.json(
      { error: "Failed to end the meeting" },
      { status: 500 }
    );
  }
}