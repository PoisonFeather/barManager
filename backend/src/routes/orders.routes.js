import { Router } from "express";
import { verifyToken } from "../middleware/auth.js";
import {
  closeTableHandler,
  createOrderHandler,
  listActiveOrdersHandler,
  serveOrderItemHandler,
  tableHistoryHandler,
  updateOrderStatusHandler,
} from "../controllers/orders.controller.js";
import { validateCreateOrderPayload } from "../middleware/validation.js";

const router = Router();

// Public route for customers
router.post("/orders", validateCreateOrderPayload, createOrderHandler);
router.get("/table-history/:tableId", tableHistoryHandler);

// Protected routes for admins
router.get("/orders/:barId", verifyToken, listActiveOrdersHandler);
router.patch("/orders/:orderId/status", verifyToken, updateOrderStatusHandler);
router.patch("/order-items/:itemId/serve", verifyToken, serveOrderItemHandler);
router.patch("/tables/:tableId/close", verifyToken, closeTableHandler);

export default router;
