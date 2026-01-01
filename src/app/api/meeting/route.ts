import { db } from "@/db/client";
import {
  meetingParticipantsTable,
  workspaceMeetingTable,
  workspacesTable,
} from "@/db/schema/schema";
import { APIResponse, Call } from "@/types";
import { and, eq } from "drizzle-orm";
import { NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const searchParams = request.nextUrl.searchParams;
    const page = searchParams.get("page");

    if (!page) {
      return new Response(
        JSON.stringify({ success: false, error: "page is required" }),
        { status: 400 }
      );
    }

    if (!slug) {
      return new Response(
        JSON.stringify({ success: false, error: "slug is required" }),
        { status: 400 }
      );
    }

    const workspace = await db.query.workspacesTable.findFirst({
      where: (ws) => eq(ws.slug, slug),
    });

    if (!workspace) {
      return new Response(
        JSON.stringify({
          success: false,
          error: `Workspace with slug ${slug} not found`,
        }),
        { status: 404 }
      );
    }

    const meeting = await db
      .select()
      .from(workspaceMeetingTable)
      .where(eq(workspaceMeetingTable.workspaceId, workspace.id))
      .innerJoin(
        meetingParticipantsTable,
        eq(workspaceMeetingTable.meetingId, meetingParticipantsTable.meetingId)
      )
      .execute();

    return new Response(
      JSON.stringify({
        success: true,
        data: meeting,
      })
    );
  } catch (error: unknown) {
    return new Response(
      JSON.stringify({ success: false, error: String(error) }),
      { status: 500 }
    );
  }
}
