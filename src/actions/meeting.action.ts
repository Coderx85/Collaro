"use server"

import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { Call } from "@stream-io/video-react-sdk";
import { NextRequest, NextResponse } from "next/server";

export async function setMeeting(Call: Call, description: string) {
  try {
    const authUser = auth()
    const user = await db.user.findFirst({
      where: {
        clerkId: authUser.userId,
      },
    });
    if (!user) {
      throw new Error('User not found');
    }

    const workspace = await db.workspace.findFirst({
      where: {
        members: 
          {
            some: {
              id: user.id,
            },
          },
      },
    });
    if (!workspace) {
      throw new Error('Workspace not found');
    }
    
    const meeting = db.meeting.create ({
      data: {
        id: Call.id,
        description,
        meetingLink: `meeting/${Call.id}`,
        workspace: { connect: { id: workspace.id } },
        workspaceid: workspace.id,
      }
    })

    return NextResponse.json(meeting);
  } catch (error: any) {
    return NextResponse.error();
  }
}