export default async function tryCatch<T>({ctx}: {ctx: () => Promise<T>}): Promise<T> {
  try {
    
    return await ctx();

  } catch (error: unknown) {
    throw new Error(`An error occurred: ${(error as Error).message}`);
  }
}