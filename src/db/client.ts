import { drizzle } from "drizzle-orm/neon-http";
import { drizzle as drizzlePG } from "drizzle-orm/node-postgres";
import { neon } from "@neondatabase/serverless";
import * as Basicschema from "./schema/schema";
import * as AuthSchema from "./schema/auth-schema";
import { config } from "@/lib/config";
import { Pool } from "pg";

let createDB;

const schema = {
  ...Basicschema,
  ...AuthSchema,
};

// Detect local PostgreSQL by checking the connection string
// const isLocalDatabase =
//   config.database.includes("localhost") ||
//   config.database.includes("127.0.0.1");

// if (isLocalDatabase) {
//   // Use node-postgres Pool for local development
//   const pg = new Pool({ connectionString: config.database });
//   createDB = drizzlePG(pg, { schema });
// } else {
// Use Neon HTTP for remote/production
const sql = neon(config.database);
createDB = drizzle(sql, { schema });
// }

export const db = createDB;
