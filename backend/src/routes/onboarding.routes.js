import { Router } from "express";
import { fullSetupHandler } from "../controllers/onboarding.controller.js";

const router = Router();

router.post("/onboarding/full-setup", fullSetupHandler);

export default router;
