import pg from "pg";
import { loadEnv } from "../config/env.js";

const { Pool } = pg;
loadEnv();

/**
 * Shared PostgreSQL connection pool.
 * Data-access modules import this pool instead of constructing
 * their own clients, which keeps connection lifecycle centralized.
 */
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});
