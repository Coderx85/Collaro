import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { id, emailAddresses, firstName } = body?.data

    const email = emailAddresses[0]?.email_address
    console.log('✅', body)

    await db.user.upsert({
      where: { clerkId: id },
      update: {
        email,
        name: firstName
      },
      create: {
        clerkId: id,
        email,
        name: firstName || '',
        workspace: undefined,
        workspaceId: 0,
      },
    })
    return new NextResponse('User updated in database successfully', {
      status: 200,
    })
  } catch (error) {
    console.error('Error updating database:', error)
    return new NextResponse('Error updating user in database', { status: 500 })
  }
}