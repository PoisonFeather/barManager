import { pool } from "../src/db/pool.js";

async function runMigration() {
  console.log("Starting zones tracking migration...");
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS zones (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        bar_id UUID REFERENCES bars(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        list_order INTEGER DEFAULT 0
      );
    `);
    console.log("✅ Created zones table");

    await pool.query(`
      ALTER TABLE tables ADD COLUMN IF NOT EXISTS zone_id UUID REFERENCES zones(id) ON DELETE SET NULL;
    `);
    console.log("✅ Added zone_id to tables");
  } catch (error) {
    console.error("Migration failed:", error);
  } finally {
    process.exit(0);
  }
}

runMigration();
