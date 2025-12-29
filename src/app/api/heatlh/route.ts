import { APIResponse } from "@/types";

type HealthStatus = "OK" | "UNHEALTHY";

export const GET = async (): Promise<APIResponse<HealthStatus>> => {
  try {
    const status: HealthStatus = "OK";
    return { success: true, data: status };
  } catch (error: unknown) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
};
