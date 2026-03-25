export async function getTableStatus(tableId) {
  const result = await pool.query("SELECT status FROM tables WHERE id = $1", [
    tableId,
  ]);
  return result.rows[0]?.status; // ex: 'active' sau 'available'
}
