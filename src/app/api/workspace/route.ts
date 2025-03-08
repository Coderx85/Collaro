import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';

export async function POST(req: NextRequest, res: NextResponse) {
  const { workspaceName, username } = await req.json();

  try {
    const user = auth()
    if(!user){
      throw new Error('User not found')
    }

    const userdb = await db.user.findFirst({
      where: {
        name: username,
      },
    });
    if (!userdb) {
      throw new Error('User not found');
    }

    const workspace = await db.workspace.create({
      data: {
        name: workspaceName,
        createdBy: userdb.name,
        members: {
          connect: {
            id: userdb?.id,
          },
        }
      },
    });

    if (!workspace) {
      throw new Error('Workspace not found');
    }

    return NextResponse.json(workspace);
  } catch (error: any) {
    console.error(error.message);
    return NextResponse.error();
  }
  
}