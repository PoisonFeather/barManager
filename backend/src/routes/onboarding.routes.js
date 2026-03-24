import { Router } from "express";
import { fullSetupHandler } from "../controllers/onboarding.controller.js";
import { validateOnboardingPayload } from "../middleware/validation.js";

const router = Router();

router.post("/onboarding/full-setup", validateOnboardingPayload, fullSetupHandler);

export default router;
