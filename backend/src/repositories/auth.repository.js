import { pool } from "../db/pool.js";

export async function getUserByUsername(username) {
  const query = `
    SELECT u.id as user_id, u.username, u.password_hash, u.bar_id, b.slug as bar_slug
    FROM users u
    JOIN bars b ON u.bar_id = b.id
    WHERE u.username = $1
  `;
  const result = await pool.query(query, [username]);
  return result.rows[0]; // Va fi undefined dacă nu există userul
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
