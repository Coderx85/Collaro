import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { db, notificationsTable } from "@/db";
import { eq, desc, and, gte } from "drizzle-orm";

export async function GET(req: NextRequest) {
  try {
    // Verify the current user is authenticated
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") || "10");
    const unreadOnly = searchParams.get("unread") === "true";
    const upcomingOnly = searchParams.get("upcoming") === "true";

    const conditions = [eq(notificationsTable.userId, user.id)];

    if (unreadOnly) {
      conditions.push(eq(notificationsTable.isRead, false));
    }

    if (upcomingOnly) {
      conditions.push(gte(notificationsTable.scheduledFor, new Date()));
    }

    const notifications = await db
      .select()
      .from(notificationsTable)
      .where(and(...conditions))
      .orderBy(desc(notificationsTable.createdAt))
      .limit(limit);

    return NextResponse.json({ notifications });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return NextResponse.json(
      { error: "Failed to fetch notifications" },
      { status: 500 },
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    // Verify the current user is authenticated
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, isRead = true } = await req.json();

    if (!id) {
      return NextResponse.json(
        { error: "Notification ID is required" },
        { status: 400 },
      );
    }

    // Update notification read status
    await db
      .update(notificationsTable)
      .set({ isRead })
      .where(
        and(
          eq(notificationsTable.id, id),
          eq(notificationsTable.userId, user.id),
        ),
      )
      .execute();

    return NextResponse.json({
      success: true,
      message: "Notification updated",
    });
  } catch (error) {
    console.error("Error updating notification:", error);
    return NextResponse.json(
      { error: "Failed to update notification" },
      { status: 500 },
    );
  }
}
