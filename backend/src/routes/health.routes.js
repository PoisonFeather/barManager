import { Router } from "express";
import { pool } from "../db/pool.js";

const router = Router();

/**
 * Basic liveness + DB readiness probe.
 * Useful for local debugging and deployment health checks.
 */
router.get("/health/db", async (_req, res) => {
  try {
    const result = await pool.query("SELECT NOW() as now");
    return res.status(200).json({
      status: "ok",
      database: "connected",
      timestamp: result.rows[0]?.now ?? null,
    });
  } catch (err) {
    return res.status(503).json({
      status: "error",
      database: "disconnected",
      error: err.message,
    });
  }
});

export default router;
