import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit"; // 👈 Importul

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

// 1. Definim limitatoarele SUS (în afara funcției e ok, că nu depind de `app`)
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minute
  max: 150, // Maxim 150 request-uri per IP
  message: {
    error:
      "Prea multe cereri de la acest IP. Te rugăm să încerci din nou peste 15 minute.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// (Bonus) Limitator strict pentru Login/Înregistrare ca să nu-ți spargă parolele
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10, // Doar 10 încercări la 15 minute
  message: {
    error:
      "Prea multe încercări. Cont blocat temporar! Încearcă peste 15 minute.",
  },
});

export function createApp() {
  const app = express();

  // 2. AICI activăm trust proxy, DUPĂ ce `app` a fost creat!
  app.set("trust proxy", 1);

  app.use(
    cors({
      origin: "*", // Când treci în producție, schimbă "*" cu domeniul tău real (ex: "https://barmanager.ro")
      methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS", "PUT"],
      allowedHeaders: ["Content-Type", "Authorization"],
    })
  );

  app.use(express.json());

  // 3. AICI activăm limitatorul global pe TOATE rutele, înainte să definim rutele
  app.use(globalLimiter);

  // 4. (Opțional dar recomandat) Aplicăm limitatorul strict pe rutele sensibile
  app.use("/auth", authLimiter);
  app.use("/onboarding", authLimiter);

  // 5. Domain route modules
  app.use("/dashboard", dashboardRoutes);
  app.use(menuRoutes, authLimiter); // Protejăm rutele de meniu cu limitatorul strict, că sunt sensibile la abuz
  app.use(onboardingRoutes, authLimiter); // Protejăm rutele de onboarding cu limitatorul strict, că sunt sensibile la abuz
  app.use(ordersRoutes, authLimiter); // Protejăm rutele de comenzi cu limitatorul strict, că sunt sensibile la abuz
  app.use(requestsRoutes, authLimiter); // Protejăm rutele de cereri cu limitatorul strict, că sunt sensibile la abuz
  app.use(healthRoutes, authLimiter); // Protejăm rutele de health check cu limitatorul strict, că sunt sensibile la abuz
  app.use("/auth", authRoutes, authLimiter); // Protejăm rutele de autentificare cu limitatorul strict, că sunt cele mai sensibile la abuz

  return app;
}
