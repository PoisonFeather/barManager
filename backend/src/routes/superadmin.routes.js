import { Router } from "express";
import { verifyToken } from "../middleware/auth.js";
import { requireSuperAdmin } from "../middleware/superadmin.js";
import {
  getStatsHandler,
  getBarsHandler,
  getRecentOrdersHandler,
  getRevenueTrendHandler,
  getChurnRiskHandler,
  getSystemHealthHandler,
} from "../controllers/superadmin.controller.js";

const router = Router();

// Dublu guard: JWT valid + role superadmin
router.use(verifyToken);
router.use(requireSuperAdmin);

router.get("/stats",          getStatsHandler);
router.get("/bars",           getBarsHandler);
router.get("/orders/recent",  getRecentOrdersHandler);   // ?limit=20
router.get("/revenue",        getRevenueTrendHandler);    // ?days=30
router.get("/churn-risk",     getChurnRiskHandler);
router.get("/system-health",  getSystemHealthHandler);

export default router;
