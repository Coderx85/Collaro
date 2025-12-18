export const config = {
  betterAuthUrl: process.env.BETTER_AUTH_URL || "http://localhost:3000",
  database:
    process.env.DATABASE_URL ||
    "postgresql://user:password@localhost:5432/mydb",
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
  betterSecret: process.env.BETTER_AUTH_SECRET,
  lokiUrl: process.env.LOKI_URL,
};
