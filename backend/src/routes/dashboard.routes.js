import { Router } from "express";
import { pool } from "../db/pool.js";

const router = Router();

router.get("/dashboard/summary/:barId", async (req, res) => {
  try {
    const { barId } = req.params;
    const query = `
    SELECT 
      t.id as table_id,
      t.table_number,
      (
        SELECT jsonb_agg(jsonb_build_object(
          'id', tr.id,
          'type', tr.type,
          'method', tr.payment_method,
          'time', tr.created_at
        ))
        FROM table_requests tr
        WHERE tr.table_id = t.id AND tr.status = 'pending'
      ) as active_requests,
      COALESCE(
        jsonb_agg(jsonb_build_object(
          'item_id', oi.id,
          'name', p.name,
          'qty', oi.quantity
        )) FILTER (WHERE oi.status = 'pending'), 
        '[]'
      ) as pending_items,
      SUM(oi.quantity * oi.price_at_time) as total_to_pay
    FROM tables t
    JOIN orders o ON o.table_id = t.id
    JOIN order_items oi ON oi.order_id = o.id
    JOIN products p ON oi.product_id = p.id
    WHERE o.bar_id = $1 AND o.is_paid = FALSE
    GROUP BY t.id, t.table_number
    ORDER BY t.table_number ASC;
`;
    const result = await pool.query(query, [barId]);
    return res.json(result.rows);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

router.patch("/products/:productId/toggle", async (req, res) => {
  try {
    const { productId } = req.params;
    const { is_available } = req.body;
    await pool.query("UPDATE products SET is_available = $1 WHERE id = $2", [
      is_available,
      productId,
    ]);
    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

export default router;
