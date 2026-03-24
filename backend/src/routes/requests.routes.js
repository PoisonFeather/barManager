import { Router } from "express";
import { pool } from "../db/pool.js";

const router = Router();

router.post("/requests", async (req, res) => {
  try {
    const { bar_id, table_id, type, payment_method } = req.body;
    const newRequest = await pool.query(
      "INSERT INTO table_requests (bar_id, table_id, type, payment_method) VALUES ($1, $2, $3, $4) RETURNING *",
      [bar_id, table_id, type, payment_method]
    );
    return res.json(newRequest.rows[0]);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

router.patch("/requests/:id/complete", async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query(
      "UPDATE table_requests SET status = 'completed' WHERE id = $1",
      [id]
    );
    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

export default router;
