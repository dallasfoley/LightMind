import { defineConfig } from "drizzle-kit";

if (!process.env.DATABASE_URL)
  throw new Error("DATABASE_URL not found in environment");

export default defineConfig({
  schema: "./drizzle/schema.ts",
  dialect: "postgresql",
  out: "./drizzle",
  strict: true,
  verbose: true,
  dbCredentials: {
    url: process.env.DATABASE_URL as string,
  },
});
