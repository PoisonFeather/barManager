import { pool } from "../db/pool.js";

export async function findBarBySlug(slug) {
  const bar = await pool.query("SELECT * FROM bars WHERE slug = $1", [slug]);
  return bar.rows[0] || null;
}

export async function findCategoriesByBarId(barId) {
  const categories = await pool.query(
    "SELECT * FROM categories WHERE bar_id = $1",
    [barId]
  );
  return categories.rows;
}

export async function insertCategory({ bar_id, name, display_order }) {
  const newCategory = await pool.query(
    "INSERT INTO categories (bar_id, name, display_order) VALUES ($1, $2, $3) RETURNING *",
    [bar_id, name, display_order || 0]
  );
  return newCategory.rows[0];
}

export async function insertProduct({
  category_id,
  name,
  price,
  description,
  image_url,
}) {
  const newProduct = await pool.query(
    "INSERT INTO products (category_id, name, price, description, image_url) VALUES ($1, $2, $3, $4, $5) RETURNING *",
    [category_id, name, price, description, image_url]
  );
  return newProduct.rows[0];
}

export async function findCompleteMenuBySlug(slug) {
  const query = `
    SELECT 
      b.*,
      (
        SELECT jsonb_agg(jsonb_build_object(
          'id', t.id,
          'table_number', t.table_number
        )) FROM tables t WHERE t.bar_id = b.id
      ) as tables,
      (
        SELECT jsonb_agg(jsonb_build_object(
          'id', c.id,
          'name', c.name,
          'display_order', c.display_order,
          'products', (
            SELECT jsonb_agg(jsonb_build_object(
              'id', p.id,
              'name', p.name,
              'price', p.price,
              'description', p.description,
              'is_available', p.is_available,
              'image_url', p.image_url
            ) ORDER BY p.name)
            FROM products p
            WHERE p.category_id = c.id
          )
        ) ORDER BY c.display_order)
        FROM categories c
        WHERE c.bar_id = b.id
      ) as categories
    FROM bars b
    WHERE b.slug = $1;
  `;
  const result = await pool.query(query, [slug]);
  return result.rows[0] || null;
}
