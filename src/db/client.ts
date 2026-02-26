import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as Basicschema from "./schema/schema";
import * as AuthSchema from "./schema/auth-schema";
import { config } from "@/lib/config";

let createDB;

const schema = {
  ...Basicschema,
  ...AuthSchema,
};

const sql = neon(config.database);
createDB = drizzle(sql, { schema });

export const db = createDB;
