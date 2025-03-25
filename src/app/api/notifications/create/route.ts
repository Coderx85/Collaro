import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { db, notificationsTable } from "@/db";

export async function POST(req: NextRequest) {
  try {
    // Verify the current user is authenticated
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const {
      title,
      message,
      meetingId,
      workspaceId,
      scheduledFor,
      userIds,
      type = "meeting",
    } = await req.json();

    if (!title || !message || !userIds || !Array.isArray(userIds)) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Create notifications for all specified users
    const notifications = [];
    for (const userId of userIds) {
      const notification = await db
        .insert(notificationsTable)
        .values({
          userId,
          title,
          message,
          meetingId,
          workspaceId,
          scheduledFor: scheduledFor ? new Date(scheduledFor) : undefined,
          type,
        })
        .returning();

      notifications.push(notification[0]);
    }

    return NextResponse.json({
      success: true,
      message: "Notifications created",
      count: notifications.length,
    });
  } catch (error) {
    console.error("Error creating notifications:", error);
    return NextResponse.json(
      { error: "Failed to create notifications" },
      { status: 500 },
    );
  }
}
