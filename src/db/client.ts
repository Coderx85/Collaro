import { config } from "@/lib/config";
import { Pool } from "pg";
import { drizzle, type NodePgDatabase } from "drizzle-orm/node-postgres";
import * as Basicschema from "./schema/schema";
import * as AuthSchema from "./schema/auth-schema";
import * as rel from "./schema/relation";

const schema = {
  ...Basicschema,
  ...AuthSchema,
  ...rel,
};

type DbSchema = typeof schema;
type UnifiedDb = NodePgDatabase<DbSchema>;

let db: UnifiedDb;

switch (config.environment) {
  case "production":
  case "development":
  case "test":
    console.log(`Using ${config.environment} database (node-postgres)`);
    const pool = new Pool({
      connectionString: config.database,
      max: parseInt(process.env.DB_POOL_MAX || "10"),
      idleTimeoutMillis: parseInt(process.env.DB_IDLE_TIMEOUT || "30000"),
      connectionTimeoutMillis: parseInt(process.env.DB_CONNECT_TIMEOUT || "5000"),
    });
    db = drizzle({ client: pool, schema });
    break;
  default:
    throw new Error("Invalid database configuration");
}

export { db };
export type { UnifiedDb, DbSchema };