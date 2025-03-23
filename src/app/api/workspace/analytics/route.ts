import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { AnalyticsResponse, APIResponse } from "@/types";
import { db, workspaceMeetingTable, workspacesTable, workspaceUsersTable } from "@/db";

export async function GET(): Promise<NextResponse<APIResponse<AnalyticsResponse>>> {
  try {
    const workspaces = await db.select().from(workspacesTable);
    const users = await db.select().from(workspaceUsersTable)
    if (workspaces.length === 0) {
      return NextResponse.json({ error: "No workspaces found", success: false });
    }
    if (users.length === 0) {
      return NextResponse.json({ error: "No users found", success: false });
    }
    
    const analytics = await Promise.all(
      workspaces.map(async (workspace) => {
        const meetingCount = await db
          .select()
          .from(workspaceMeetingTable)
          .where(eq(workspaceMeetingTable.workspaceId, workspace.id));

        const memberCount = await db
          .select()
          .from(workspaceUsersTable)
          .where(eq(workspaceUsersTable.workspaceId, workspace.id));

        return {
          name: workspace.name,
          totalMeetings: meetingCount.length,
          totalMembers: memberCount.length,
          createdAt: workspace.createdAt,
        };
      })
    );
      const totalMeetings = analytics.reduce((sum, workspace) => sum + workspace.totalMeetings, 0);
      const totalMembers = analytics.reduce((sum, workspace) => sum + workspace.totalMembers, 0);
      const totalWorkspaces = workspaces.length;
      const createdAt = new Date();

      return NextResponse.json({
        success: true,
        data: {
          totalMeetings,
          totalUsers: totalMembers,
          totalWorkspaces,
          createdAt,
          workspaces: analytics,
        },
      });
  } catch (error: unknown) {
    return NextResponse.json({ error: `Failed to get user:: \n ${error}`, success: false });
  }
}