import { Router } from "express";
import {
  dashboardSummaryHandler,
  toggleProductAvailabilityHandler,
  approveTableHandler,
  rejectTableHandler,
  editProductHandler,
  deleteProductHandler,
  addProductHandler,
  mergeTablesHandler,
} from "../controllers/dashboard.controller.js";
//console.log(typeof approveTableHandler);
import { validateToggleProductPayload } from "../middleware/validation.js";

const router = Router();

// 1. SCOATEM "/dashboard" din rute (dacă e deja prefixat în app.js)
// Altfel, URL-ul tău ar fi fost: /dashboard/dashboard/summary/...
router.get("/summary/:barId", dashboardSummaryHandler);

// 2. ADĂUGĂM RUTELE POST (Aici era 404-ul!)
router.post("/approve-table", approveTableHandler);
router.post("/reject-table", rejectTableHandler);

// 3. Ruta pentru stoc
router.patch(
  "/products/:productId/toggle",
  validateToggleProductPayload,
  toggleProductAvailabilityHandler
);

router.put("/products/:productId", editProductHandler);
router.delete("/products/:productId", deleteProductHandler);
router.post("/products", addProductHandler);
router.post("/merge-tables", mergeTablesHandler);

router.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});
export default router;
