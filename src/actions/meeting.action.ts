"use server"

import { db } from "@/db";
import { usersTable, workspacesTable } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { Call } from "@stream-io/video-react-sdk";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function setMeeting(Call: Call, description: string) {
  try {
    const authUser = auth()
    const user = await db
      .select({clerkId: usersTable.clerkId, id: usersTable.id, workspaceId: usersTable.workspaceId})
      .from(usersTable)
      .where(eq(usersTable.clerkId, authUser.userId!))
      .execute()

    if (!user) {
      throw new Error('User not found');
    }

    const workspace = await db
      .select({id: usersTable.workspaceId})
      .from(workspacesTable)
      .where(eq(workspacesTable.id, user[0]?.workspaceId!))
      .execute()

    if (!workspace) {
      throw new Error('Workspace not found');
    }
    
    // const meeting = db
    //   .insert()
    //   data: {
    //     description,
    //     meeting_link: `meeting/${Call.id}`,
    //     workspace: { connect: { id: workspace.id } },
    //     workspaceId: workspace.id,
    //   }
    // })

    return NextResponse.json({message: 'Meeting created successfully'}, {status: 201});
  } catch (error: any) {
    return NextResponse.error();
  }
}