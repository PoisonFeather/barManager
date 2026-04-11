import { pool } from "../db/pool.js";

export async function getAnalyticsDataByBar(barId, period) {
  let dateFilter = "";
  if (period === "today") {
    dateFilter = "AND o.created_at >= CURRENT_DATE";
  } else if (period === "week") {
    dateFilter = "AND o.created_at >= date_trunc('week', CURRENT_DATE)";
  } else if (period === "month") {
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

  // Facem un query suplimentar pentru breakdown pe metode de plată (doar pentru ziua de azi)
  let paymentMethodsQuery = null;
  let paymentMethodsResult = { rows: [] };

  if (period === "today") {
    paymentMethodsQuery = `
      SELECT 
        payment_method, 
        COALESCE(SUM(total_amount), 0) as amount
      FROM orders o
      WHERE o.bar_id = $1 AND o.is_paid = TRUE ${dateFilter}
      GROUP BY payment_method
    `;
    paymentMethodsResult = await pool.query(paymentMethodsQuery, [barId]);
  }

  const [summaryResult, productsResult] = await Promise.all([
    pool.query(summaryQuery, [barId]),
    pool.query(productsQuery, [barId]),
  ]);

  return {
    summary: summaryResult.rows[0],
    topProducts: productsResult.rows,
    zReport: period === "today" ? paymentMethodsResult.rows : null, // Trimitem Raportul Z doar azi
  };
}

export async function getWaitTimeAnalytics(barId, period) {
  let dateFilter = "";
  if (period === "today") {
    dateFilter = "AND o.created_at >= CURRENT_DATE";
  } else if (period === "week") {
    dateFilter = "AND o.created_at >= date_trunc('week', CURRENT_DATE)";
  } else if (period === "month") {
    dateFilter = "AND o.created_at >= date_trunc('month', CURRENT_DATE)";
  }

  const waitTimesQuery = `
    SELECT 
      EXTRACT(EPOCH FROM AVG(oi.served_at - o.created_at))::integer as avg_product_wait_time_seconds,
      EXTRACT(EPOCH FROM MAX(oi.served_at - o.created_at))::integer as max_wait_time_seconds
    FROM order_items oi
    JOIN orders o ON o.id = oi.order_id
    WHERE o.bar_id = $1 AND oi.served_at IS NOT NULL ${dateFilter}
  `;

  const stayTimesQuery = `
    SELECT
      EXTRACT(EPOCH FROM AVG(session_duration))::integer as avg_table_stay_seconds
    FROM (
      SELECT 
        o.session_token,
        MAX(o.closed_at) - MIN(o.created_at) as session_duration
      FROM orders o
      WHERE o.bar_id = $1 AND o.closed_at IS NOT NULL ${dateFilter}
      GROUP BY o.session_token
    ) sessions
  `;

  const productPaceQuery = `
    SELECT 
      p.name,
      EXTRACT(EPOCH FROM AVG(oi.served_at - o.created_at))::integer as avg_wait_seconds,
      COUNT(oi.id) as total_servings
    FROM order_items oi
    JOIN orders o ON o.id = oi.order_id
    JOIN products p ON p.id = oi.product_id
    WHERE o.bar_id = $1 AND oi.served_at IS NOT NULL ${dateFilter}
    GROUP BY p.id, p.name
    ORDER BY avg_wait_seconds DESC
  `;

  const rushHoursQuery = `
    SELECT 
      EXTRACT(HOUR FROM o.created_at) as hour,
      COUNT(o.id) as orders_count
    FROM orders o
    WHERE o.bar_id = $1 ${dateFilter}
    GROUP BY EXTRACT(HOUR FROM o.created_at)
    ORDER BY hour ASC
  `;

  const [waitTimesResult, stayTimesResult, productPaceResult, rushHoursResult] = await Promise.all([
    pool.query(waitTimesQuery, [barId]),
    pool.query(stayTimesQuery, [barId]),
    pool.query(productPaceQuery, [barId]),
    pool.query(rushHoursQuery, [barId]),
  ]);

  const rawPace = productPaceResult.rows || [];

  return {
    globalMins: {
      avgProductSeconds: waitTimesResult.rows[0]?.avg_product_wait_time_seconds || 0,
      maxWaitSeconds: waitTimesResult.rows[0]?.max_wait_time_seconds || 0,
      avgStaySeconds: stayTimesResult.rows[0]?.avg_table_stay_seconds || 0,
    },
    slowestProducts: rawPace.slice(0, 5),
    fastestProducts: [...rawPace].reverse().slice(0, 5),
    rushHours: rushHoursResult.rows,
  };
}
