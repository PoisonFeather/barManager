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
  getBarDetailsHandler,
  updateBarFeaturesHandler,
  getBarUsersHandler,
  createBarUserHandler,
  updateUserPasswordHandler,
  updateUserRoleAndCategoriesHandler,
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

// Bar Management
router.get("/bars/:barId/details", getBarDetailsHandler);
router.patch("/bars/:barId/features", updateBarFeaturesHandler);
router.get("/bars/:barId/users", getBarUsersHandler);
router.post("/bars/:barId/users", createBarUserHandler);

// User Management specifically for bars under superadmin
router.put("/users/:userId/password", updateUserPasswordHandler);
router.put("/users/:userId/role", updateUserRoleAndCategoriesHandler);

export default router;
