import { pool } from "../db/pool.js";

/**
 * Global SaaS KPI-uri — un singur query agregat pentru toate barurile.
 */
export async function getGlobalStats() {
  const result = await pool.query(`
    SELECT
      (SELECT COUNT(*) FROM bars)::integer                                        AS total_bars,
      (SELECT COUNT(*) FROM users WHERE role != 'superadmin')::integer           AS total_users,
      (SELECT COUNT(*) FROM tables)::integer                                      AS total_tables,
      (SELECT COUNT(*) FROM tables WHERE status = 'open')::integer               AS tables_open_now,

      (SELECT COUNT(*) FROM orders WHERE created_at >= CURRENT_DATE)::integer    AS orders_today,
      (SELECT COUNT(*) FROM orders WHERE created_at >= date_trunc('week',  NOW()))::integer AS orders_week,
      (SELECT COUNT(*) FROM orders WHERE created_at >= date_trunc('month', NOW()))::integer AS orders_month,

      COALESCE((SELECT SUM(total_amount) FROM orders
                WHERE is_paid = TRUE AND created_at >= CURRENT_DATE), 0)::numeric          AS revenue_today,
      COALESCE((SELECT SUM(total_amount) FROM orders
                WHERE is_paid = TRUE AND created_at >= date_trunc('week',  NOW())), 0)::numeric AS revenue_week,
      COALESCE((SELECT SUM(total_amount) FROM orders
                WHERE is_paid = TRUE AND created_at >= date_trunc('month', NOW())), 0)::numeric AS revenue_month,
      COALESCE((SELECT SUM(total_amount) FROM orders WHERE is_paid = TRUE), 0)::numeric    AS revenue_all_time,

      -- Baruri active = au cel puțin o comandă în ultimele 7 zile
      (SELECT COUNT(DISTINCT bar_id) FROM orders
       WHERE created_at >= NOW() - INTERVAL '7 days')::integer                             AS active_bars_7d
  `);
  return result.rows[0];
}

/**
 * Toate barurile cu metrici individuale.
 */
export async function getAllBars() {
  const result = await pool.query(`
    SELECT
      b.id,
      b.name,
      b.slug,
      b.primary_color,
      (SELECT COUNT(*) FROM tables t WHERE t.bar_id = b.id)::integer              AS table_count,
      (SELECT COUNT(*) FROM tables t WHERE t.bar_id = b.id AND t.status = 'open')::integer AS tables_open,
      (SELECT COUNT(*) FROM users u WHERE u.bar_id = b.id)::integer               AS user_count,
      (SELECT COUNT(*) FROM orders o WHERE o.bar_id = b.id)::integer              AS total_orders,
      (SELECT COUNT(*) FROM orders o WHERE o.bar_id = b.id AND o.created_at >= CURRENT_DATE)::integer AS orders_today,
      COALESCE((SELECT SUM(o.total_amount) FROM orders o
                WHERE o.bar_id = b.id AND o.is_paid = TRUE), 0)::numeric          AS revenue_total,
      COALESCE((SELECT SUM(o.total_amount) FROM orders o
                WHERE o.bar_id = b.id AND o.is_paid = TRUE
                AND o.created_at >= date_trunc('month', NOW())), 0)::numeric      AS revenue_month,
      (SELECT MAX(o.created_at) FROM orders o WHERE o.bar_id = b.id)             AS last_order_at,
      b.created_at                                                                 AS bar_created_at,
      b.features
    FROM bars b
    ORDER BY revenue_total DESC
  `);
  return result.rows;
}

/**
 * Ultimele N comenzi din tot sistemul (cross-bar).
 */
export async function getRecentOrders(limit = 20) {
  const result = await pool.query(`
    SELECT
      o.id,
      o.total_amount,
      o.status,
      o.is_paid,
      o.payment_method,
      o.created_at,
      b.name  AS bar_name,
      b.slug  AS bar_slug,
      t.table_number
    FROM orders o
    JOIN bars b   ON o.bar_id   = b.id
    JOIN tables t ON o.table_id = t.id
    ORDER BY o.created_at DESC
    LIMIT $1
  `, [limit]);
  return result.rows;
}

/**
 * Revenue per zi, ultimele N zile — pentru graficul de trend.
 */
export async function getRevenueTrend(days = 30) {
  const result = await pool.query(`
    SELECT
      DATE(o.created_at)                        AS day,
      COUNT(o.id)::integer                      AS orders_count,
      COALESCE(SUM(o.total_amount) FILTER (WHERE o.is_paid = TRUE), 0)::numeric AS revenue
    FROM orders o
    WHERE o.created_at >= NOW() - ($1 || ' days')::interval
    GROUP BY DATE(o.created_at)
    ORDER BY day ASC
  `, [days]);
  return result.rows;
}

/**
 * Baruri fără nicio activitate (comenzi) în ultimele 7 zile — churn risk.
 */
export async function getChurnRiskBars() {
  const result = await pool.query(`
    SELECT
      b.id,
      b.name,
      b.slug,
      b.created_at,
      (SELECT MAX(o.created_at) FROM orders o WHERE o.bar_id = b.id) AS last_order_at,
      (SELECT COUNT(*) FROM orders o WHERE o.bar_id = b.id)::integer  AS total_orders_ever
    FROM bars b
    WHERE b.id NOT IN (
      SELECT DISTINCT bar_id FROM orders
      WHERE created_at >= NOW() - INTERVAL '7 days'
    )
    ORDER BY last_order_at DESC NULLS LAST
  `);
  return result.rows;
}

/**
 * Sistem health: orders/minute ultimele 10 minute + DB connectivity.
 */
export async function getSystemHealth() {
  const result = await pool.query(`
    SELECT
      COUNT(*)::integer AS orders_last_10min
    FROM orders
    WHERE created_at >= NOW() - INTERVAL '10 minutes'
  `);
  return {
    db_ok: true,
    orders_last_10min: result.rows[0]?.orders_last_10min ?? 0,
    checked_at: new Date().toISOString(),
  };
}

// -------------------------------------------------------------
// Bar Management endpoints
// -------------------------------------------------------------

export async function getBarDetails(barId) {
  const barResult = await pool.query(
    "SELECT id, name, slug, primary_color, logo_url, created_at, features FROM bars WHERE id = $1",
    [barId]
  );
  const bar = barResult.rows[0];
  if (!bar) return null;
  
  const statsResult = await pool.query(
    `SELECT
      (SELECT COUNT(*) FROM tables WHERE bar_id = $1)::integer AS total_tables,
      (SELECT COUNT(*) FROM orders WHERE bar_id = $1)::integer AS total_orders,
      COALESCE((SELECT SUM(total_amount) FROM orders WHERE bar_id = $1 AND is_paid = TRUE), 0)::numeric AS total_revenue
    `,
    [barId]
  );
  
  return {
    ...bar,
    stats: statsResult.rows[0],
  };
}

export async function updateBarFeatures(barId, features) {
  const result = await pool.query(
    "UPDATE bars SET features = $1 WHERE id = $2 RETURNING features",
    [JSON.stringify(features), barId]
  );
  return result.rows[0];
}

export async function getBarUsers(barId) {
  const result = await pool.query(
    "SELECT id, username, role, created_at, allowed_categories FROM users WHERE bar_id = $1 ORDER BY created_at DESC",
    [barId]
  );
  return result.rows;
}

export async function createBarUser(barId, username, passwordHash, role, allowedCategories = []) {
  const result = await pool.query(
    `INSERT INTO users (bar_id, username, password_hash, role, allowed_categories)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, username, role, created_at, allowed_categories`,
    [barId, username, passwordHash, role, allowedCategories]
  );
  return result.rows[0];
}

export async function updateUserPassword(userId, passwordHash) {
  await pool.query("UPDATE users SET password_hash = $1 WHERE id = $2", [passwordHash, userId]);
}

export async function updateUserRoleAndCategories(userId, role, allowedCategories = []) {
  const result = await pool.query(
    "UPDATE users SET role = $1, allowed_categories = $2 WHERE id = $3 RETURNING id, username, role, allowed_categories",
    [role, allowedCategories, userId]
  );
  return result.rows[0];
}
