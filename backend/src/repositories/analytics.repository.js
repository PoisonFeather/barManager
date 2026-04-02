import { pool } from "../db/pool.js";

export async function getAnalyticsDataByBar(barId, period) {
  let dateFilter = "";
  if (period === 'today') {
    dateFilter = "AND o.created_at >= CURRENT_DATE";
  } else if (period === 'week') {
    dateFilter = "AND o.created_at >= date_trunc('week', CURRENT_DATE)";
  } else if (period === 'month') {
    dateFilter = "AND o.created_at >= date_trunc('month', CURRENT_DATE)";
  }

  const summaryQuery = `
    SELECT 
      COUNT(DISTINCT o.id) as total_orders,
      COALESCE(SUM(o.total_amount), 0) as total_revenue
    FROM orders o
    WHERE o.bar_id = $1 AND o.is_paid = TRUE ${dateFilter}
  `;

  const productsQuery = `
    SELECT 
      p.name,
      p.id,
      SUM(oi.quantity)::integer as total_quantity,
      SUM(oi.quantity * oi.price_at_time)::numeric as total_revenue
    FROM order_items oi
    JOIN orders o ON o.id = oi.order_id
    JOIN products p ON p.id = oi.product_id
    WHERE o.bar_id = $1 AND o.is_paid = TRUE ${dateFilter}
    GROUP BY p.id, p.name
    ORDER BY total_quantity DESC, total_revenue DESC
  `;

  const [summaryResult, productsResult] = await Promise.all([
    pool.query(summaryQuery, [barId]),
    pool.query(productsQuery, [barId])
  ]);

  return {
    summary: summaryResult.rows[0],
    topProducts: productsResult.rows
  };
}
