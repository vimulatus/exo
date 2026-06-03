import { neon } from "@neondatabase/serverless";
import { drizzle as drizzleNeon } from "drizzle-orm/neon-http";
import { drizzle as drizzlePg } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

const url = process.env.DATABASE_URL;
if (!url) throw new Error("DATABASE_URL is not set");

const isNeon = /\.neon\.tech/.test(url);

const globalForDb = globalThis as unknown as {
  db?: ReturnType<typeof drizzleNeon> | ReturnType<typeof drizzlePg>;
};

export const db =
  globalForDb.db ??
  (isNeon
    ? drizzleNeon({ client: neon(url), schema })
    : drizzlePg({ client: new Pool({ connectionString: url }), schema }));

if (process.env.NODE_ENV !== "production") globalForDb.db = db;
