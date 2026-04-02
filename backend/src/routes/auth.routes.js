import { Router } from "express";
import { loginHandler, demoLoginHandler } from "../controllers/auth.controller.js";

const router = Router();

router.post("/login", loginHandler);
router.post("/demo-login", demoLoginHandler);

export default router;
