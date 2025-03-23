import { db, usersTable } from '@/db';
import { clerkClient } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const clerk = await clerkClient();
    console.log(
      `
      Clerk webhook received:: \n
      Email Address: ${body.data.email_addresses[0].email_address} \n
      Name: ${body.data.full_name} \n
      UserName: ${body.data.user_name}}\n
      Clerk ID: ${body.data.id}
      `
    );
    const { 
      id, 
      email_addresses: emailAddresses , 
      full_name: fullName,
      user_name: userName
    } = body?.data;
    
    await clerk.users.updateUserMetadata(
      id,
      {
        publicMetadata: {
          role: 'admin',
        }
      }
    )

    if (!emailAddresses || emailAddresses.length === 0) {
      throw new Error('No email addresses provided');
    }

    const email = emailAddresses[0]?.email_address;
    console.log('✅', body?.data);

    const user = await db.insert(usersTable).values({
      clerkId: id,
      email,
      name: fullName!,
      userName: userName!,
      updatedAt: new Date(),
    }).returning();

    if (!user) throw new Error('Error inserting user into database');
    
    return new NextResponse('User updated in database successfully', {
      status: 200,
    });
  } catch (error) {
    console.error('Error updating database:', error);
    return new NextResponse('Error updating user in database', { status: 500 });
  }
}