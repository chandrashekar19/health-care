import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql", // instead of driver
  schema: "./lib/db/schema.ts",
  out: "./drizzle",
  dbCredentials: {
    url: process.env.NEXT_PUBLIC_DATABASE_URL!, // rename connectionString → url
  },
});
