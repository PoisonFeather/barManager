import { Router } from "express";
import { verifyToken } from "../middleware/auth.js";
import {
  completeRequestHandler,
  createRequestHandler,
} from "../controllers/requests.controller.js";
import { validateCreateRequestPayload } from "../middleware/validation.js";

const router = Router();

router.post("/requests", validateCreateRequestPayload, createRequestHandler);
router.patch("/requests/:id/complete", verifyToken, completeRequestHandler);

export default router;
