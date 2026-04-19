import { Router } from "express";
import { verifyToken, allowRoles } from "../middleware/auth.js";
import {
  dashboardSummaryHandler,
  toggleProductAvailabilityHandler,
  approveTableHandler,
  rejectTableHandler,
  editProductHandler,
  deleteProductHandler,
  deleteCategoryHandler,
  addProductHandler,
  mergeTablesHandler,
  getZonesHandler,
  createZoneHandler,
  updateTableZoneHandler,
  extendTableTimerHandler,
} from "../controllers/dashboard.controller.js";
import { getAnalyticsHandler, getWaitTimeAnalyticsHandler } from "../controllers/analytics.controller.js";
import { validateToggleProductPayload } from "../middleware/validation.js";
import { checkProductOwnership, checkCategoryOwnership, checkTableOwnership } from "../middleware/authorization.js";

const router = Router();
router.use(verifyToken);

// 1. SCOATEM "/dashboard" din rute (dacă e deja prefixat în app.js)
// Altfel, URL-ul tău ar fi fost: /dashboard/dashboard/summary/...
router.get("/summary/:barId", dashboardSummaryHandler);
router.get("/analytics/:barId", allowRoles("admin"), getAnalyticsHandler);
router.get("/analytics/wait-times/:barId", allowRoles("admin"), getWaitTimeAnalyticsHandler);

// ZONE MANAGEMENT
router.get("/zones/:barId", getZonesHandler);
router.post("/zones", createZoneHandler);
router.patch("/tables/:tableId/zone", checkTableOwnership, updateTableZoneHandler);

// 2. ADĂUGĂM RUTELE POST (Tabele)
router.post("/approve-table", checkTableOwnership, approveTableHandler);
router.post("/reject-table", checkTableOwnership, rejectTableHandler);
router.post("/tables/:tableId/extend-timer", checkTableOwnership, extendTableTimerHandler);

// 3. Ruta pentru stoc
router.patch(
  "/products/:productId/toggle",
  checkProductOwnership,
  validateToggleProductPayload,
  toggleProductAvailabilityHandler
);

router.put("/products/:productId", checkProductOwnership, editProductHandler);
router.delete("/products/:productId", checkProductOwnership, deleteProductHandler);
router.delete("/categories/:categoryId", checkCategoryOwnership, deleteCategoryHandler);
router.post("/products", checkCategoryOwnership, addProductHandler);
router.post("/merge-tables", checkTableOwnership, mergeTablesHandler);

router.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});
export default router;
