import { neon } from "@neondatabase/serverless";
import { drizzle as drizzleNeon } from "drizzle-orm/neon-http";
import { drizzle as drizzlePg } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

const url = process.env.DATABASE_URL;
if (!url) throw new Error("DATABASE_URL is not set");

// Neon's HTTP driver for deployed envs; node-postgres for the local docker
// Postgres (the HTTP driver only speaks to Neon endpoints). Picked by host so
// the same import works everywhere — see docker-compose.yml + .env.example.
const isNeon = /\.neon\.tech/.test(url);

function createDb() {
  if (isNeon) {
    return drizzleNeon({ client: neon(url as string), schema });
  }
  return drizzlePg({ client: new Pool({ connectionString: url }), schema });
}

// Cache the client on globalThis so Next.js dev HMR doesn't open a new pool on
// every reload. Production gets one instance per process either way.
const globalForDb = globalThis as unknown as {
  db?: ReturnType<typeof createDb>;
};

export const db = globalForDb.db ?? createDb();

if (process.env.NODE_ENV !== "production") globalForDb.db = db;
