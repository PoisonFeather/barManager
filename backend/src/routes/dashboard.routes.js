import { Router } from "express";
import {
  dashboardSummaryHandler,
  toggleProductAvailabilityHandler,
} from "../controllers/dashboard.controller.js";
import { validateToggleProductPayload } from "../middleware/validation.js";

const router = Router();

router.get("/dashboard/summary/:barId", dashboardSummaryHandler);
router.patch(
  "/products/:productId/toggle",
  validateToggleProductPayload,
  toggleProductAvailabilityHandler
);

export default router;
