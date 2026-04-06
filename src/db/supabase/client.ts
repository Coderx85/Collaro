import { config } from "@/lib/config";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as Basicschema from "../schema/schema";
import * as AuthSchema from "../schema/auth-schema";
import * as rel from "../schema/relation";

const client = postgres(config.database);

const schema = {
  ...Basicschema,
  ...AuthSchema,
  ...rel,
};

export const DevDB = drizzle({ client, schema: schema});