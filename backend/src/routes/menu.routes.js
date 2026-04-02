import { Router } from "express";
import { verifyToken } from "../middleware/auth.js";
import {
  createCategoryHandler,
  createProductHandler,
  getCompleteMenuHandler,
  getMenuHandler,
  getTableStatusHandler,
} from "../controllers/menu.controller.js";
import { getTableStatus } from "../repositories/table.repository.js";

const router = Router();

// Public routes
router.get("/menu/:slug", getMenuHandler);
router.get("/menu-complete/:slug", getCompleteMenuHandler);
router.get("/table-status/:tableId", getTableStatusHandler);

// Admin routes
router.post("/categories", verifyToken, createCategoryHandler);
router.post("/products", verifyToken, createProductHandler);

export default router;
