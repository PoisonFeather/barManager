import { Router } from "express";
import rateLimit from "express-rate-limit";
import { fullSetupHandler } from "../controllers/onboarding.controller.js";
import { validateOnboardingPayload } from "../middleware/validation.js";

const router = Router();

// Rate limit strict direct pe această rută — max 10 înregistrări per 15min per IP
const onboardingLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: "Prea multe cereri de înregistrare. Încearcă mai târziu." },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post("/onboarding/full-setup", onboardingLimiter, validateOnboardingPayload, fullSetupHandler);

export default router;
