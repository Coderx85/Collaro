import { db } from "@/db";
import { usersTable, workspacesTable } from "@/db/schema";
import { currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { name } = await req.json();
    const user = await currentUser();
    if(!user) {
      return new NextResponse('User not found', {status: 404});
    }
    const username = user.username;
    const userId = user.id;
    // console.log('Creating workspace with Name:', name, 'and createdBy:', username );

    const dbUser = await db
      .select({ clerkId: usersTable.clerkId, id: usersTable.id })
      .from(usersTable)
      .where(eq(usersTable.clerkId,userId))
    
    // console.log('User:::: \n', dbUser);
    if(!dbUser || dbUser.length === 0 || !dbUser[0]?.id) {
      console.log('User not found with username:', username);
      return new NextResponse(`User not found with username: ${username}`, {status: 404});
    }
      
    const workspace = await db.insert(workspacesTable).values({
      name,
      createdBy: dbUser[0]?.id as string
    }).returning();
    
    if(!workspace) {
      console.log('Cannot create workspace with Name:', name, 'and createdBy:', username);
      return new NextResponse(`Cannot create workspace with Name: ${name} and createdBy: ${username}`, {status: 400});
    }

    const updateUser = await db.update(usersTable).set({
      workspaceId: workspace[0]?.id
    }).execute();

    if(!updateUser) {
      console.log('Cannot update user with workspaceId:', workspace[0]?.id);
      return new NextResponse(`Cannot update user with workspaceId: ${workspace[0]?.id}`, {status: 400});
    }
    
    console.log('Workspace:::: \n', workspace);
    console.log('Workspace created successfully');
    return NextResponse.json({workspace}, {status: 201});
  } catch (error: unknown) {
    console.error(error);
    throw new Error(`Failed to create workspace:: \n ${error}`);
  }
}