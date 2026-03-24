import { pool } from "../db/pool.js";

export async function getDashboardSummaryByBar(barId) {
  const query = `
    SELECT 
      t.id as table_id,
      t.table_number,
      (
        SELECT jsonb_agg(jsonb_build_object(
          'id', tr.id,
          'type', tr.type,
          'method', tr.payment_method,
          'time', tr.created_at
        ))
        FROM table_requests tr
        WHERE tr.table_id = t.id AND tr.status = 'pending'
      ) as active_requests,
      COALESCE(
        jsonb_agg(jsonb_build_object(
          'item_id', oi.id,
          'name', p.name,
          'qty', oi.quantity
        )) FILTER (WHERE oi.status = 'pending'),
        '[]'
      ) as pending_items,
      SUM(oi.quantity * oi.price_at_time) as total_to_pay
    FROM tables t
    JOIN orders o ON o.table_id = t.id
    JOIN order_items oi ON oi.order_id = o.id
    JOIN products p ON oi.product_id = p.id
    WHERE o.bar_id = $1 AND o.is_paid = FALSE
    GROUP BY t.id, t.table_number
    ORDER BY t.table_number ASC;
  `;
  const result = await pool.query(query, [barId]);
  return result.rows;
}

export async function updateProductAvailability(productId, isAvailable) {
  await pool.query("UPDATE products SET is_available = $1 WHERE id = $2", [
    isAvailable,
    productId,
  ]);
}
