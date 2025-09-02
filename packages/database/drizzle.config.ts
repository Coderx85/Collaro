import { config } from "dotenv";
import type { Config } from "drizzle-kit";

config({
  path: ".env",
});

export default {
  schema: "./drizzle/schema.ts",
  out: "./drizzle/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
} satisfies Config;
