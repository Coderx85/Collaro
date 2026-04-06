import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as Basicschema from "../schema/schema";
import * as AuthSchema from "../schema/auth-schema";
import * as rel from "../schema/relation";
import { config } from "@/lib/config";

const schema = {
  ...Basicschema,
  ...AuthSchema,
  ...rel,
};

export const Proddb = drizzle(neon(config.database), { schema: schema });