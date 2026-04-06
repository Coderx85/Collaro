import { defineConfig } from "drizzle-kit";
import { config } from "@/lib/config";

const PROD_MIGRATION_PATH = "./src/db/drizzle/migrations";

const DEV_MIGRATION_PATH = "./src/db/supabase/migrations";

const isDev = config.environment === "development";

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/db/schema",
  out: (isDev) ? DEV_MIGRATION_PATH : PROD_MIGRATION_PATH,
  dbCredentials: {
    url: config.database,
  },
  casing: "snake_case",
});
