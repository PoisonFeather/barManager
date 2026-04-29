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
  { bar_id, table_id, total_amount, status, session_token, personal_token, placed_by_staff = false }
) {
  const orderRes = await client.query(
    `INSERT INTO orders (bar_id, table_id, total_amount, status, session_token, personal_token, placed_by_staff) 
     VALUES (
       $1, 
       COALESCE((SELECT merged_into_id FROM tables WHERE id = $2), $2), 
       $3, 
       $4,
       $5,
       $6,
       $7
     ) RETURNING id`,
    [bar_id, table_id, total_amount, status, session_token || null, personal_token || null, placed_by_staff]
  );
  return orderRes.rows[0].id;
}

export async function insertOrderItems(client, orderId, items) {
  const itemQueries = items.map((item) =>
    client.query(
      "INSERT INTO order_items (order_id, product_id, quantity, price_at_time, notes) VALUES ($1, $2, $3, $4, $5)",
      [orderId, item.id, item.quantity, item.price, item.notes || null]
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
    SELECT oi.id as item_id, oi.quantity, p.name, oi.price_at_time as price, o.placed_by_staff, oi.notes
    FROM orders o
    JOIN order_items oi ON oi.order_id = o.id
    JOIN products p ON oi.product_id = p.id
    WHERE o.table_id = COALESCE(
      (SELECT merged_into_id FROM tables WHERE id = $1), 
      $1
    ) 
    AND o.is_paid = FALSE
    ORDER BY oi.id ASC;
  `;
  const result = await pool.query(query, [tableId]);
  return result.rows;
}

export async function getPersonalHistory(tableId, personalToken) {
  const query = `
    SELECT oi.quantity, p.name, oi.price_at_time as price, oi.notes
    FROM orders o
    JOIN order_items oi ON oi.order_id = o.id
    JOIN products p ON oi.product_id = p.id
    WHERE o.table_id = COALESCE(
      (SELECT merged_into_id FROM tables WHERE id = $1),
      $1
    )
    AND o.personal_token = $2
    AND o.is_paid = FALSE
    ORDER BY oi.id ASC;
  `;
  const result = await pool.query(query, [tableId, personalToken]);
  return result.rows;
}

export async function markOrderItemServed(itemId) {
  await pool.query("UPDATE order_items SET status = 'served', served_at = NOW() WHERE id = $1", [
    itemId,
  ]);
}

export async function markOrderItemDelivered(itemId) {
  // Delivered meaning taken to the table by waiter
  await pool.query("UPDATE order_items SET status = 'delivered', served_at = NOW() WHERE id = $1", [
    itemId,
  ]);
}

export async function deleteOrderItem_db(itemId) {
  await pool.query("DELETE FROM order_items WHERE id = $1", [itemId]);
}

export async function closeTableOrders(tableId, paymentMethod = "cash") {
  // 1. Închidem comenzile nerezolvate (pentru Părinte + potențiale resturi de pe Copii)
  await pool.query(
    "UPDATE orders SET is_paid = TRUE, payment_method = $2, closed_at = NOW() WHERE (table_id = $1 OR table_id IN (SELECT id FROM tables WHERE merged_into_id = $1)) AND is_paid = FALSE",
    [tableId, paymentMethod]
  );

  // 2. Ștergem TOATE cererile active (dacă există) pentru masa Părinte și Copii
  await pool.query(
    "DELETE FROM requests WHERE table_id = $1 OR table_id IN (SELECT id FROM tables WHERE merged_into_id = $1)", 
    [tableId]
  );

  // 3. Resetăm Părintele și toți Copiii (Să fim siguri că la eliberare, Copiii reapar ca mese ÎNCHISE)
  await pool.query(
    "UPDATE tables SET status = 'closed', current_session_token = NULL, session_started_at = NULL WHERE id = $1 OR merged_into_id = $1",
    [tableId]
  );

  // 4. Abia acum eliberăm mesele Copil (rupem legătura)
  await pool.query(
    "UPDATE tables SET merged_into_id = NULL WHERE merged_into_id = $1",
    [tableId]
  );
}

export async function unlockTable_db(tableId) {
  // Resetăm cronometrul cu timpul curent pentru a da un nou "boost" de 15 minute
  await pool.query(
    "UPDATE tables SET session_started_at = NOW() WHERE id = $1",
    [tableId]
  );
}

export async function insertRequest({
  bar_id,
  table_id,
  type,
  payment_method,
  session_token,
}) {
  const query = `
    INSERT INTO requests (bar_id, table_id, type, payment_method, session_token, status)
    VALUES (
      $1, 
      --  Redirecționăm cererea (Ospătar/Notă) direct pe masa Părinte
      COALESCE((SELECT merged_into_id FROM tables WHERE id = $2), $2), 
      $3, 
      $4, 
      $5, 
      'pending'
    )
    RETURNING id;
  `;
  const result = await pool.query(query, [
    bar_id,
    table_id,
    type,
    payment_method,
    session_token,
  ]);
  return result.rows[0].id;
}

// Funcție pentru a marca cererea ca rezolvată (când barmanul apasă OK)
export async function updateRequestStatus(requestId, status = "completed") {
  await pool.query("UPDATE requests SET status = $1 WHERE id = $2", [
    status,
    requestId,
  ]);
}
