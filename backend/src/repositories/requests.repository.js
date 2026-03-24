import { pool } from "../db/pool.js";

export async function createTableRequest({
  bar_id,
  table_id,
  type,
  payment_method,
}) {
  const newRequest = await pool.query(
    "INSERT INTO table_requests (bar_id, table_id, type, payment_method) VALUES ($1, $2, $3, $4) RETURNING *",
    [bar_id, table_id, type, payment_method]
  );
  return newRequest.rows[0];
}

export async function completeTableRequest(id) {
  await pool.query(
    "UPDATE table_requests SET status = 'completed' WHERE id = $1",
    [id]
  );
}
