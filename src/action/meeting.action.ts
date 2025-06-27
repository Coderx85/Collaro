"use server";
import { CreateMeetingType, db, meetingTable } from "@/db";
import { currentUser } from "@clerk/nextjs/server";
import { Response } from "@/types";

export async function createMeetingAction(
  meetiing: CreateMeetingType,
): Promise<Response<CreateMeetingType>> {
  // Ensure the user is logged in
  const user = await currentUser();

  if (!user) {
    return {
      success: false,
      error: "User not found",
      status: 404,
    };
  }

  // Validate the meeting data
  if (!meetiing || !meetiing.workspaceId) {
    return {
      success: false,
      error: "Invalid meeting data",
      status: 403,
    };
  }

  // Validate the hostedBy field
  if (meetiing.hostedBy === user.id) {
    return {
      success: false,
      error: "Invalid hostedBy field",
      status: 404,
    };
  }

  // Insert the meeting into the database
  const [data] = await db
    .insert(meetingTable)
    .values({
      workspaceId: meetiing.workspaceId,
      hostedBy: user.id,
      description: meetiing.description || "Instant Meeting",
      id: meetiing.id || crypto.randomUUID(),
    })
    .returning();

  return {
    success: true,
    data,
    status: 201,
  };
}
