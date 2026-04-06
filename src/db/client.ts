import { Proddb } from "./drizzle/client";
import { DevDB } from "./supabase/client";
import { config } from "@/lib/config";

let db: typeof Proddb | typeof DevDB;

switch (config.environment) {
  case "production":
    console.log("Using production database");
    db = Proddb;
    break;
  case "development":
    console.log("Using development database");
    db = DevDB;
    break;
  case "test":
    break
  default:
    throw new Error("Invalid database configuration");
}

export { db };