import { pool } from "../db/pool.js";

export async function getZonesByBarId(barId) {
  const result = await pool.query(
    "SELECT * FROM zones WHERE bar_id = $1 ORDER BY list_order ASC",
    [barId]
  );
  return result.rows;
}

export async function createZone(barId, name, listOrder = 0) {
  const result = await pool.query(
    "INSERT INTO zones (bar_id, name, list_order) VALUES ($1, $2, $3) RETURNING *",
    [barId, name, listOrder]
  );
  return result.rows[0];
}

export async function updateTableZone(tableId, zoneId) {
  // zoneId can be null to move back to "Unassigned" / "Main"
  await pool.query("UPDATE tables SET zone_id = $1 WHERE id = $2", [
    zoneId, 
    tableId
  ]);
}
