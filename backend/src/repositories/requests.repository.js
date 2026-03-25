import { pool } from "../db/pool.js";

export async function createTableRequest({
  bar_id,
  table_id,
  session_token,
  type,
  payment_method,
}) {
  const newRequest = await pool.query(
    "INSERT INTO requests (bar_id, table_id,session_token, type, payment_method, status) VALUES ($1, $2, $3, $4,$5, 'pending') RETURNING *",
    [bar_id, table_id, session_token, type, payment_method]
  );
  return newRequest.rows[0];
}

export async function completeTableRequest(id) {
  await pool.query("UPDATE requests SET status = 'completed' WHERE id = $1", [
    id,
  ]);
}
