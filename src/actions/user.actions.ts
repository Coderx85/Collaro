"use server"

import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function getUser({ userId }: {userId: string}) {
  try {
    const clerkUser = await currentUser();
    if (!clerkUser) {
      throw new Error("Unauthorized");
    }
  
    const user = await db.user.findFirst({
      where: { 
        clerkId: clerkUser.id,
       },
    });
    if (!user) {
      await db.user.create({
        data: {
          clerkId: clerkUser.id,
          email: clerkUser?.primaryEmailAddress as unknown as string,
          name: clerkUser?.fullName as string,
        },
      });
      return NextResponse.json({ "User created": clerkUser?.fullName });
    }
    
    return NextResponse.json(user);
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to get user"}, { status: 500 }
    );
  }
}