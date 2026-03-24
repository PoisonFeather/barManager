import { Router } from "express";
import { pool } from "../db/pool.js";

const router = Router();

// Test endpoint: validate bar existence and basic menu categories
router.get("/menu/:slug", async (req, res) => {
  try {
    const { slug } = req.params;
    const bar = await pool.query("SELECT * FROM bars WHERE slug = $1", [slug]);

    if (bar.rows.length === 0) {
      return res.status(404).json({ error: "Barul nu există" });
    }

    const categories = await pool.query(
      "SELECT * FROM categories WHERE bar_id = $1",
      [bar.rows[0].id]
    );

    return res.json({
      bar: bar.rows[0],
      menu: categories.rows,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

router.post("/categories", async (req, res) => {
  try {
    const { bar_id, name, display_order } = req.body;
    const newCategory = await pool.query(
      "INSERT INTO categories (bar_id, name, display_order) VALUES ($1, $2, $3) RETURNING *",
      [bar_id, name, display_order || 0]
    );
    return res.json(newCategory.rows[0]);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

router.post("/products", async (req, res) => {
  try {
    const { category_id, name, price, description, image_url } = req.body;
    const newProduct = await pool.query(
      "INSERT INTO products (category_id, name, price, description, image_url) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [category_id, name, price, description, image_url]
    );
    return res.json(newProduct.rows[0]);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

router.get("/menu-complete/:slug", async (req, res) => {
  try {
    const { slug } = req.params;
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

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Barul nu există" });
    }

    return res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Eroare de server" });
  }
});

export default router;
