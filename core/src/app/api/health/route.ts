import { NextResponse } from "next/server";

type HealthStatus = "OK" | "UNHEALTHY";

export const GET = async (): Promise<NextResponse> => {
  try {
    const status: HealthStatus = "OK";
    return NextResponse.json({ success: true, data: status });
  } catch (error: unknown) {
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "An unknown error occurred",
      },
      { status: 500 },
    );
  }
};
