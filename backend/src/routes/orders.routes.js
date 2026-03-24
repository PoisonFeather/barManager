import { Router } from "express";
import {
  closeTableHandler,
  createOrderHandler,
  listActiveOrdersHandler,
  serveOrderItemHandler,
  tableHistoryHandler,
  updateOrderStatusHandler,
} from "../controllers/orders.controller.js";

const router = Router();

router.post("/orders", createOrderHandler);
router.get("/orders/:barId", listActiveOrdersHandler);
router.patch("/orders/:orderId/status", updateOrderStatusHandler);
router.get("/table-history/:tableId", tableHistoryHandler);
router.patch("/order-items/:itemId/serve", serveOrderItemHandler);
router.patch("/tables/:tableId/close", closeTableHandler);

export default router;
