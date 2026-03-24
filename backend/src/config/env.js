import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const backendRoot = path.resolve(__dirname, "../..");
const envPath = path.resolve(backendRoot, ".env");
let envLoaded = false;

/**
 * Loads environment variables for the backend process.
 * Keeps all env bootstrapping in one place to avoid leaking
 * configuration concerns into app/domain modules.
 */
export function loadEnv() {
  if (envLoaded) {
    return;
  }

  dotenv.config({ path: envPath });

  if (!process.env.DATABASE_URL) {
    throw new Error(
      "DATABASE_URL is missing. Define it in backend/.env before starting the API."
    );
  }

  envLoaded = true;
}

/**
 * Optional startup diagnostics, useful for local debugging.
 */
export function logEnvDiagnostics() {
  console.log("-----------------------------------------");
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, "utf8");
    console.log(
      "📄 Raw .env preview (first 20 chars):",
      content.substring(0, 20) + "..."
    );
    console.log("📄 .env file length:", content.length, "chars");
  } else {
    console.log("❌ .env file does not exist at:", envPath);
  }
  console.log(
    "🔗 DATABASE_URL:",
    process.env.DATABASE_URL ? "✅ LOADED" : "❌ MISSING"
  );
  console.log("-----------------------------------------");
}
