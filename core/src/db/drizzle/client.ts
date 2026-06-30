import { config } from "@/lib/config";
import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import * as Basicschema from "../schema/schema";
import * as AuthSchema from "../schema/auth-schema";
import * as rel from "../schema/relation";

const schema = {
  ...Basicschema,
  ...AuthSchema,
  ...rel,
};

const pool = new Pool({
  connectionString: config.database,
  max: parseInt(process.env.DB_POOL_MAX || "10"),
  idleTimeoutMillis: parseInt(process.env.DB_IDLE_TIMEOUT || "30000"),
  connectionTimeoutMillis: parseInt(process.env.DB_CONNECT_TIMEOUT || "5000"),
});

export const Proddb = drizzle({ client: pool, schema });