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