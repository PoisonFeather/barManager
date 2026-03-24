import { Router } from "express";
import {
  createCategoryHandler,
  createProductHandler,
  getCompleteMenuHandler,
  getMenuHandler,
} from "../controllers/menu.controller.js";

const router = Router();

router.get("/menu/:slug", getMenuHandler);
router.post("/categories", createCategoryHandler);
router.post("/products", createProductHandler);
router.get("/menu-complete/:slug", getCompleteMenuHandler);

export default router;
