import express from "express";
import cors from "cors";
import menuRoutes from "./routes/menu.routes.js";
import onboardingRoutes from "./routes/onboarding.routes.js";
import ordersRoutes from "./routes/orders.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import requestsRoutes from "./routes/requests.routes.js";
import healthRoutes from "./routes/health.routes.js";
import authRoutes from "./routes/auth.routes.js";

/**
 * Express app factory.
 * This module owns HTTP/middleware composition only.
 */
export function createApp() {
  const app = express();

  app.use(
    cors({
      origin: "*",
      methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS", "PUT"],
      allowedHeaders: ["Content-Type", "Authorization"],
    })
  );
  app.use(express.json());
  app.use("/dashboard", dashboardRoutes);
  // Domain route modules
  app.use(menuRoutes);
  app.use(onboardingRoutes);
  app.use(ordersRoutes);
  //app.use(dashboardRoutes);
  app.use(requestsRoutes);
  app.use(healthRoutes);
  app.use("/auth", authRoutes);

  return app;
}
