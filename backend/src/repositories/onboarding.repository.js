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

export async function insertBar(client, { bar_name, slug, primary_color, logo_url, logo_url_light }) {
  const barRes = await client.query(
    "INSERT INTO bars (name, slug, primary_color, logo_url, logo_url_light) VALUES ($1, $2, $3, $4, $5) RETURNING id",
    [bar_name, slug, primary_color, logo_url || null, logo_url_light || null]
  );
  return barRes.rows[0].id;
}

export async function insertCategory(client, { barId, category }) {
  const catRes = await client.query(
    "INSERT INTO categories (bar_id, name) VALUES ($1, $2) RETURNING id",
    [barId, category]
  );
  return catRes.rows[0].id;
}

export async function insertProduct(client, { categoryId, product }) {
  await client.query(
    "INSERT INTO products (category_id, name, price, description) VALUES ($1, $2, $3, $4)",
    [categoryId, product.name, product.price, product.description]
  );
}

export async function insertTable(client, { barId, tableNumber }) {
  await client.query(
    "INSERT INTO tables (bar_id, table_number) VALUES ($1, $2)",
    [barId, tableNumber]
  );
}

export async function insertUser(client, { barId, username, passwordHash }) {
  const query = `
    INSERT INTO users (bar_id, username, password_hash)
    VALUES ($1, $2, $3)
    RETURNING id
  `;
  const values = [barId, username, passwordHash];
  const result = await client.query(query, values);
  return result.rows[0].id;
}
