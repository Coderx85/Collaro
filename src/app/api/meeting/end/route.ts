import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest,) {
  const { callId } = await req.json();
  if (!callId) {
    throw new Error('Call ID is required');
  }
  try {
    const call = await db.meeting.update({
      where: {
        id: callId,
      },
      data: {
        status: 'ended',
      }
    });
    if (!call) {
      throw new Error('Call not found');
    }
  } catch (error: any) {
    return NextResponse.error()
  }
}