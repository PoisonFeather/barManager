import { pool } from "../src/db/pool.js";

async function runMigration() {
  console.log("Starting order_items notes migration...");
  try {
    await pool.query(`ALTER TABLE order_items ADD COLUMN IF NOT EXISTS notes TEXT;`);
    console.log("✅ Added notes to order_items");
  } catch (error) {
    console.error("Migration failed:", error);
  } finally {
    process.exit(0);
  }
}

runMigration();
