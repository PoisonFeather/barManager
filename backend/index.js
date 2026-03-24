import { createApp } from "./src/app.js";
import { logEnvDiagnostics, loadEnv } from "./src/config/env.js";

/**
 * SRP bootstrap entrypoint:
 * - env/config bootstrap
 * - app composition
 * - process startup
 */
loadEnv();
logEnvDiagnostics();

const app = createApp();
const PORT = Number(process.env.PORT || 3001);

app.listen(PORT, () => {
  console.log(`🚀 Server pornit pe portul ${PORT}`);
});
