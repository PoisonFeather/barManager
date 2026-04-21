import { pool } from "../src/db/pool.js";

async function runMigration() {
  console.log("Starting user permissions migration...");
  try {
    await pool.query(`
      ALTER TABLE users ADD COLUMN IF NOT EXISTS allowed_categories TEXT[] DEFAULT '{}';
    `);
    console.log("✅ Added allowed_categories to users");
  } catch (error) {
    console.error("Migration failed:", error);
  } finally {
    process.exit(0);
  }
}

runMigration();
