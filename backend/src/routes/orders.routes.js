import { Router } from "express";
import { pool } from "../db/pool.js";

const router = Router();

router.post("/orders", async (req, res) => {
  const client = await pool.connect();

  try {
    const { bar_id, table_id, items, total_amount } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ error: "Coșul e gol!" });
    }

    await client.query("BEGIN");

    const orderRes = await client.query(
      "INSERT INTO orders (bar_id, table_id, total_amount, status) VALUES ($1, $2, $3, $4) RETURNING id",
      [bar_id, table_id, total_amount, "pending"]
    );
    const orderId = orderRes.rows[0].id;

    const itemQueries = items.map((item) =>
      client.query(
        "INSERT INTO order_items (order_id, product_id, quantity, price_at_time) VALUES ($1, $2, $3, $4)",
        [orderId, item.id, item.quantity, item.price]
      )
    );

    await Promise.all(itemQueries);
    await client.query("COMMIT");

    return res.json({
      success: true,
      orderId,
      message: "Comanda a ajuns la barman! 🍻",
    });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error(err);
    return res.status(500).json({ error: "Eroare la procesarea comenzii." });
  } finally {
    client.release();
  }
});

router.get("/orders/:barId", async (req, res) => {
  try {
    const { barId } = req.params;
    const query = `
        SELECT o.*, t.table_number,
        (SELECT jsonb_agg(jsonb_build_object(
          'name', p.name,
          'qty', oi.quantity
        )) FROM order_items oi JOIN products p ON oi.product_id = p.id WHERE oi.order_id = o.id) as items
        FROM orders o
        JOIN tables t ON o.table_id = t.id
        WHERE o.bar_id = $1 AND o.status != 'completed'
        ORDER BY o.created_at DESC;
      `;
    const result = await pool.query(query, [barId]);
    return res.json(result.rows);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

router.patch("/orders/:orderId/status", async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    await pool.query("UPDATE orders SET status = $1 WHERE id = $2", [
      status,
      orderId,
    ]);
    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

router.get("/table-history/:tableId", async (req, res) => {
  try {
    const { tableId } = req.params;
    const query = `
        SELECT oi.quantity, p.name, oi.price_at_time as price
        FROM orders o
        JOIN order_items oi ON oi.order_id = o.id
        JOIN products p ON oi.product_id = p.id
        WHERE o.table_id = $1 AND o.is_paid = FALSE
        ORDER BY oi.id ASC;
      `;
    const result = await pool.query(query, [tableId]);
    return res.json(result.rows);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

router.patch("/order-items/:itemId/serve", async (req, res) => {
  try {
    const { itemId } = req.params;
    await pool.query("UPDATE order_items SET status = 'served' WHERE id = $1", [
      itemId,
    ]);
    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

router.patch("/tables/:tableId/close", async (req, res) => {
  try {
    const { tableId } = req.params;
    await pool.query(
      "UPDATE orders SET is_paid = TRUE WHERE table_id = $1 AND is_paid = FALSE",
      [tableId]
    );
    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

export default router;
