import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";

import menuRoutes from "./routes/menu.routes.js";
import onboardingRoutes from "./routes/onboarding.routes.js";
import ordersRoutes from "./routes/orders.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import requestsRoutes from "./routes/requests.routes.js";
import healthRoutes from "./routes/health.routes.js";
import authRoutes from "./routes/auth.routes.js";
import superadminRoutes from "./routes/superadmin.routes.js";

/**
 * Express app factory.
 * This module owns HTTP/middleware composition only.
 */

// Limiter global (fallback pentru toate rutele)
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 400,
  message: {
    error: "Prea multe cereri de la acest IP. Te rugăm să încerci din nou.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Limiter strict DOAR pentru auth/onboarding (brute-force protection)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    error: "Prea multe încercări. Cont blocat temporar! Încearcă peste 15 minute.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export function createApp() {
  const app = express();

  app.set("trust proxy", 1);

  app.use(
    cors({
      origin: "*",
      methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS", "PUT"],
      allowedHeaders: ["Content-Type", "Authorization"],
    })
  );

  app.use(express.json());

  // Limiter global ca baza
  app.use(globalLimiter);

  // Limiter strict EXPLICIT pe rutele de auth — montate cu prefix clar
  app.use("/auth", authLimiter, authRoutes);

  // SuperAdmin routes — protejate de verifyToken + requireSuperAdmin în interiorul routerului
  app.use("/superadmin", superadminRoutes);

  // Rutele publice și de dashboard — montate simplu, fără authLimiter
  app.use("/dashboard", dashboardRoutes);
  app.use(onboardingRoutes);
  app.use(menuRoutes);
  app.use(ordersRoutes);
  app.use(requestsRoutes);
  app.use(healthRoutes);

  return app;
}
