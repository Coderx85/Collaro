import { db } from "@/db";
import { usersTable, workspacesTable, workspaceUsersTable } from "@/db/schema";
import { APIResponse, Workspace } from "@/types";
import { currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest): Promise<NextResponse<APIResponse<Workspace>>> {
  try {
    const { name } = await req.json();
    const user = await currentUser();
    if(!user) {
      return new NextResponse('User not found', {status: 404});
    }
    
    const username = user.username;
    const userId = user.id;
      
    // Check if user exists
    const dbUser = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.clerkId,userId))
      .execute();
    
    // console.log('User:::: \n', dbUser);
    if(!dbUser || dbUser.length === 0 || !dbUser[0]?.id) {
      console.log('User not found with username:', username);
      return NextResponse.json({success: false,error: `User not found with username: ${username}`});
    }
      
    // Create workspace
    const workspace = await db
      .insert(workspacesTable)
      .values({
        name,
        createdBy: dbUser[0]?.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();
    
    if(!workspace) {
      console.log('Cannot create workspace with Name:', name, 'and createdBy:', username);
      return NextResponse.json({success: false, error: `Cannot create workspace with Name: ${name} and createdBy: ${username}`}, {status: 400});
    }

    // Update user with workspaceId
    const updateUser = await db.update(usersTable).set({
      workspaceId: workspace[0]?.id,
      role: 'admin',
      updatedAt: new Date(),
    })
    .execute();

    if(!updateUser) {
      console.log('Cannot update user with workspaceId:', workspace[0]?.id);
      return NextResponse.json({success: false, error:`Cannot update user with workspaceId: ${workspace[0]?.id}`});
    }

    // Update the worksapceUSersTable
    const workspaceUsers = await db
      .insert(workspaceUsersTable)
      .values({
        name: workspace[0]?.name,
        workspaceId: workspace[0]?.id,
        userId: dbUser[0]?.id,
        role: 'admin',
        updatedAt: new Date(),
      })
      .returning();

    if(!workspaceUsers) {
      console.log('Cannot update workspaceUsersTable with workspaceId:', workspace[0]?.id, 'and userId:', dbUser[0]?.id);
      return NextResponse.json({success:false, error:`Cannot update workspaceUsersTable with workspaceId: ${workspace[0]?.id} and userId: ${dbUser[0]?.id}`});
    }
    
    console.log('Workspace:::: \n', workspace);
    console.log('Workspace created successfully');
    return NextResponse.json({success: true, data: workspace[0]});
  } catch (error: unknown) {
    console.error(error);
    throw new Error(`Failed to create workspace:: \n ${error}`);
  }
}