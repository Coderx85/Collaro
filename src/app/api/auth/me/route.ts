import { NextResponse } from "next/server";
import { verifySession } from "@/lib/dal";
import { getCurrentUserDTO } from "@/lib/dto";

/**
 * GET /api/auth/me
 * Returns the current authenticated user's data
 */
export async function GET() {
  try {
    const session = await verifySession();

    if (!session) {
      return NextResponse.json(
        { user: null, error: "Not authenticated" },
        { status: 401 },
      );
    }

    const user = await getCurrentUserDTO();

    if (!user) {
      return NextResponse.json(
        { user: null, error: "User not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Error fetching current user:", error);
    return NextResponse.json(
      { user: null, error: "Internal server error" },
      { status: 500 },
    );
  }
}
