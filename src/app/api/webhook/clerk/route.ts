import { db } from '@/db';
import { usersTable } from '@/db/schema';
import { NextRequest, NextResponse } from 'next/server';
// import { eq } from 'drizzle-orm';

// Email Address: work.priyanshu085@gmail.com

// First Name: Priyanshu

// Clerk ID: user_2u8ZvmbIa6ZQgvxqJ5cGgOmXqW2

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
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

    if (!emailAddresses || emailAddresses.length === 0) {
      throw new Error('No email addresses provided');
    }

    const email = emailAddresses[0]?.email_address!;
    console.log('✅', body?.data);

    const user = await db.insert(usersTable).values({
      clerkId: id,
      email,
      name: fullName!,
      userName: userName!
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