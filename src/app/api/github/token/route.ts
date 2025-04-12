import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ message: "User not found" });
  }

  const provider = "github";

  const client = await clerkClient();

  try {
    const a = await client.users.getUserOauthAccessToken(userId, provider);
    const tokens = a.data[0].token;
    console.log("Access token:: \n", tokens);

    if (!tokens || tokens.length === 0) {
      return NextResponse.json(
        { message: "No OAuth tokens found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ message: "Access token found", tokens });
  } catch (error) {
    console.error("Error fetching OAuth token:", error);
    return NextResponse.json(
      { message: "Failed to fetch OAuth token" },
      { status: 500 },
    );
  }
}
