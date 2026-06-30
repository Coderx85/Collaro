export async function register() {
  if (process.env.NODE_ENV === "development") {
    await import("pino");
  }
}
