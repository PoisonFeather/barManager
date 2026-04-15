import { pool } from "../db/pool.js";

export async function getUserByUsername(username) {
  // LEFT JOIN: superadmin users have bar_id = NULL and no bar row
  const query = `
    SELECT u.id as user_id, u.username, u.password_hash, u.bar_id,
           u.role, b.slug as bar_slug
    FROM users u
    LEFT JOIN bars b ON u.bar_id = b.id
    WHERE u.username = $1
  `;
  const result = await pool.query(query, [username]);
  return result.rows[0]; // undefined dacă userul nu există
}

export async function getBarWithUserCount(slug) {
  const query = `
    SELECT b.id as bar_id, b.slug as bar_slug, 
           (SELECT COUNT(*) FROM users u WHERE u.bar_id = b.id) as user_count
    FROM bars b
    WHERE b.slug = $1
  `;
  const result = await pool.query(query, [slug]);
  return result.rows[0];
}
