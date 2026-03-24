import { Router } from "express";
import { pool } from "../db/pool.js";

const router = Router();

router.post("/onboarding/full-setup", async (req, res) => {
  const client = await pool.connect();

  try {
    const { bar_name, slug, primary_color, bar_number_tables, menu } = req.body;
    await client.query("BEGIN");

    const barRes = await client.query(
      "INSERT INTO bars (name, slug, primary_color) VALUES ($1, $2, $3) RETURNING id",
      [bar_name, slug, primary_color]
    );
    const barId = barRes.rows[0].id;

    for (const item of menu) {
      const catRes = await client.query(
        "INSERT INTO categories (bar_id, name) VALUES ($1, $2) RETURNING id",
        [barId, item.category]
      );
      const catId = catRes.rows[0].id;

      for (const prod of item.products) {
        await client.query(
          "INSERT INTO products (category_id, name, price, description) VALUES ($1, $2, $3, $4)",
          [catId, prod.name, prod.price, prod.description]
        );
      }
    }

    const tableCount =
      bar_number_tables && bar_number_tables > 0 ? bar_number_tables : 10;

    for (let i = 1; i <= tableCount; i += 1) {
      await client.query(
        "INSERT INTO tables (bar_id, table_number) VALUES ($1, $2)",
        [barId, i]
      );
    }

    await client.query("COMMIT");
    return res.json({
      success: true,
      barId,
      message: "Cont creat cu succes, mesele 1-10 generate!",
    });
  } catch (err) {
    await client.query("ROLLBACK");
    return res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
});

export default router;
