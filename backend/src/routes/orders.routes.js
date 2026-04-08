import { Router } from "express";
import { verifyToken } from "../middleware/auth.js";
import {
  closeTableHandler,
  createOrderHandler,
  createStaffOrderHandler,
  getPersonalHistoryHandler,
  listActiveOrdersHandler,
  serveOrderItemHandler,
  tableHistoryHandler,
  updateOrderStatusHandler,
  unlockTableHandler,
} from "../controllers/orders.controller.js";
import { validateCreateOrderPayload } from "../middleware/validation.js";

const router = Router();

// Public route for customers
router.post("/orders", validateCreateOrderPayload, createOrderHandler);
router.get("/table-history/:tableId", tableHistoryHandler);
router.get("/tables/:tableId/my-share", getPersonalHistoryHandler);
router.patch("/tables/:tableId/unlock", unlockTableHandler);

// Protected routes for admins
router.post("/orders/staff", verifyToken, createStaffOrderHandler);
router.get("/orders/:barId", verifyToken, listActiveOrdersHandler);
router.patch("/orders/:orderId/status", verifyToken, updateOrderStatusHandler);
router.patch("/order-items/:itemId/serve", verifyToken, serveOrderItemHandler);
router.patch("/tables/:tableId/close", verifyToken, closeTableHandler);

export default router;
