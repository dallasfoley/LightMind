import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "@/drizzle/schema";
import { neon } from "@neondatabase/serverless";

if (!process.env.DATABASE_URL)
  throw new Error("DATABASE_URL not found in environment");

const sql = neon(process.env.DATABASE_URL);
export const db = drizzle({ client: sql, schema, logger: true });
