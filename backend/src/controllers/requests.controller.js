// backend/src/controllers/requests.controller.js
import {
  completeRequest,
  createRequest,
} from "../services/requests.service.js";
import { pool as db } from "../db/pool.js";

function resolveStatus(error, fallback = 500) {
  return Number.isInteger(error?.status) ? error.status : fallback;
}

export async function createRequestHandler(req, res) {
  try {
    const { bar_id, table_id, type, payment_method, session_token } = req.body;

    // Security check
    const tableResult = await db.query(
      "SELECT status, current_session_token FROM tables WHERE id = $1",
      [table_id]
    );

    const table = tableResult.rows[0];

    // Dacă masa nu e deschisă SAU token-ul trimis nu e identic cu cel din DB
    if (
      !table ||
      table.status !== "open" ||
      table.current_session_token !== session_token
    ) {
      console.log(
        `🚫 Cerere refuzată: Masa ${table_id} - Token invalid sau masă închisă.`
      );
      return res
        .status(403)
        .json({ error: "Sesiune invalidă! Scanează din nou QR-ul." });
    }

    // 🚀 2. Dacă e totul OK, creăm cererea în DB
    //console.log(req.body);
    const result = await createRequest(req.body);
    console.log(
      `✅ Cerere creată: Masa ${table_id} - Tip: ${type} - ID Cerere: ${result.id} TOKEN ${session_token}`
    );

    // 📢 3. Anunțăm Dashboard-ul barmanului prin Socket
    const io = req.app.get("io");
    if (io) {
      io.emit("new-data", {
        type: "SERVICE_REQUEST",
        requestType: type,
        tableId: table_id,
        session_token: session_token,
      });
    }
    //console.log(io);
    return res.json(result);
  } catch (error) {
    console.error("💥 Eroare createRequest:", error);
    return res.status(resolveStatus(error)).json({ error: error.message });
  }
}

export async function completeRequestHandler(req, res) {
  try {
    const { id } = req.params;
    const result = await completeRequest(id);
    return res.json(result);
  } catch (error) {
    console.log(error);
    return res.status(resolveStatus(error)).json({ error: error.message });
  }
}
