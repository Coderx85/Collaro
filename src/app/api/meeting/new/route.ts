import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const user = await req.json();
    if (!user) {
      throw new Error('User not found');
    }

    
  } catch (error: any) {
    return NextResponse.error();
  }
}