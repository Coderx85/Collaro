"use server"

import { db } from "@/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function getWorkspaces({ workspaceId }: {workspaceId: string}) {
  try {
    const { userId } = auth();
    if (!userId) {
      throw new Error("Unauthorized");
    }
  
    const workspaces = await db.workspace.findUnique({
      where: { id: workspaceId },
    });
    if (!workspaces) {
      throw new Error("No workspaces found");
    }
    
    return NextResponse.json(workspaces);
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to get workspaces"}, { status: 500 }
    );
  }
}