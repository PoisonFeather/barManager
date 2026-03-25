import { pool } from "../db/pool.js";

export async function withTransaction(work) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const result = await work(client);
    await client.query("COMMIT");
    return result;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

export async function insertOrder(
  client,
  { bar_id, table_id, total_amount, status }
) {
  const orderRes = await client.query(
    "INSERT INTO orders (bar_id, table_id, total_amount, status) VALUES ($1, $2, $3, $4) RETURNING id",
    [bar_id, table_id, total_amount, status] // <--- Aici folosim status-ul din payload!
  );
  return orderRes.rows[0].id;
}

export async function insertOrderItems(client, orderId, items) {
  const itemQueries = items.map((item) =>
    client.query(
      "INSERT INTO order_items (order_id, product_id, quantity, price_at_time) VALUES ($1, $2, $3, $4)",
      [orderId, item.id, item.quantity, item.price]
    )
  );
  await Promise.all(itemQueries);
}

export async function getActiveOrdersByBar(barId) {
  const query = `
    SELECT 
      t.id as table_id, 
      t.table_number, 
      t.status as table_status,
      -- Verificăm dacă există vreo comandă neaprobată pentru această masă
      (SELECT status FROM orders WHERE table_id = t.id AND status = 'pending_approval' LIMIT 1) as pending_status,
      (SELECT id FROM orders WHERE table_id = t.id AND status = 'pending_approval' LIMIT 1) as last_order_id,
      ... restul query-ului tău ...
    FROM tables t
    WHERE t.bar_id = $1
  `;
  const result = await pool.query(query, [barId]);
  return result.rows;
}

export async function updateOrderStatus(orderId, status) {
  await pool.query("UPDATE orders SET status = $1 WHERE id = $2", [
    status,
    orderId,
  ]);
}

export async function getUnpaidTableHistory(tableId) {
  const query = `
    SELECT oi.quantity, p.name, oi.price_at_time as price
    FROM orders o
    JOIN order_items oi ON oi.order_id = o.id
    JOIN products p ON oi.product_id = p.id
    WHERE o.table_id = $1 AND o.is_paid = FALSE
    ORDER BY oi.id ASC;
  `;
  const result = await pool.query(query, [tableId]);
  return result.rows;
}

export async function markOrderItemServed(itemId) {
  await pool.query("UPDATE order_items SET status = 'served' WHERE id = $1", [
    itemId,
  ]);
}

export async function closeTableOrders(tableId) {
  // Folosim un mic query multiplu sau o tranzacție
  // Trebuie să închidem comenzile ȘI să resetăm masa
  await pool.query(
    "UPDATE orders SET is_paid = TRUE WHERE table_id = $1 AND is_paid = FALSE",
    [tableId]
  );
  await pool.query(
    "UPDATE tables SET status = 'closed', current_session_token = NULL WHERE id = $1",
    [tableId]
  );
}
