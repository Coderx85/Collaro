import { NextResponse } from "next/server";
import { getWorkspaceById } from "@/action/workspace.action";

export async function GET(
  _: Request,
  { params }: { params: Promise<{ workspaceId: string }> }
) {
  const { workspaceId } = await params;
  const res = await getWorkspaceById(workspaceId);
  if (res?.data) return NextResponse.json(res.data);
  return NextResponse.json({ error: "Workspace not found" }, { status: 404 });
}
