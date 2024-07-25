import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as entities from "@entities/index";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const db = drizzle(pool, {
  schema: entities,
});
