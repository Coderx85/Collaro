import { APIResponse } from "@/types";

interface TryCatchOptions<T> {
  ctx: () => Promise<T>;
  errorMessage?: string;
}

export default async function tryCatch<T>(
  {ctx, errorMessage}: TryCatchOptions<T>
): Promise<T> {
  try {
    return await ctx();
  } catch (error: unknown) {
    throw new Error(errorMessage || "An error occurred", {
      cause: error,
    });
  }
}

export async function tryCatchAction<T>(
  {ctx, errorMessage}: TryCatchOptions<T>
): Promise<APIResponse<T>> {
  try{
    const data = await ctx();
    return { data, success: true };
  } catch (error: unknown) {
    return {
      success: false,
      error: errorMessage || (error instanceof Error ? error.message : "An unexpected error occurred"),
    };
  }
}