import { pool } from "../src/db/pool.js";

async function runMigration() {
  console.log("Starting analytics tracking migration...");
  try {
    await pool.query(`ALTER TABLE order_items ADD COLUMN IF NOT EXISTS served_at TIMESTAMP;`);
    console.log("✅ Added served_at to order_items");

    await pool.query(`ALTER TABLE orders ADD COLUMN IF NOT EXISTS closed_at TIMESTAMP;`);
    console.log("✅ Added closed_at to orders");
  } catch (error) {
    console.error("Migration failed:", error);
  } finally {
    process.exit(0);
  }
}

runMigration();
