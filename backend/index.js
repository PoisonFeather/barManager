import { createApp } from "./src/app.js";
import { logEnvDiagnostics, loadEnv } from "./src/config/env.js";

import { createServer } from "http";
import { Server } from "socket.io";

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

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000", // Portul de Next.js
    methods: ["GET", "POST", "PATCH"],
  },
});

// app.use((req, res, next) => {
//   req.io = io;
//   next();
// });
app.set("io", io);
io.on("connection", (socket) => {
  console.log("🔌 Client conectat la Socket:", socket.id);

  socket.on("disconnect", () => {
    console.log("❌ Client deconectat");
  });
});

// app.listen(PORT, () => {
//   console.log(`🚀 Server pornit pe portul ${PORT}`);
// });

httpServer.listen(PORT, () => {
  console.log(`🚀 Server pornit pe portul ${PORT} cu WebSockets activat`);
});
