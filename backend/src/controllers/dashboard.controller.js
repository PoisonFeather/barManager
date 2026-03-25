import {
  getDashboardSummary,
  toggleProductAvailability,
} from "../services/dashboard.service.js";

function resolveStatus(error, fallback = 500) {
  return Number.isInteger(error?.status) ? error.status : fallback;
}

export async function dashboardSummaryHandler(req, res) {
  try {
    const { barId } = req.params;
    const result = await getDashboardSummary(barId);
    return res.json(result);
  } catch (error) {
    return res.status(resolveStatus(error)).json({ error: error.message });
  }
}

export async function toggleProductAvailabilityHandler(req, res) {
  try {
    const { productId } = req.params;
    const { is_available } = req.body;
    const result = await toggleProductAvailability(productId, is_available);
    return res.json(result);
  } catch (error) {
    return res.status(resolveStatus(error)).json({ error: error.message });
  }
}
export const closeTableHandler = async (req, res) => {
  const { tableId } = req.params;

  try {
    // 1. Ștergem token-ul de sesiune din baza de date
    // Asta face ca orice token deținut de client în LocalStorage să devină INVALID
    await db.query(
      "UPDATE tables SET current_session_token = NULL WHERE id = $1",
      [tableId]
    );

    // 2. Opțional: Poți marca și comenzile ca fiind arhivate/plătite aici
    // await db.query("UPDATE orders SET status = 'paid' WHERE table_id = $1", [tableId]);

    // 3. Trimitem semnalul prin Socket
    const io = req.app.get("io");
    if (io) {
      io.emit("new-data", { type: "TABLE_CLOSED", tableId });
    }

    res.json({
      success: true,
      message: "Masa a fost închisă și sesiunea a expirat.",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// backend/src/controllers/dashboard.controller.js

export const openTableHandler = async (req, res) => {
  try {
    const { tableId } = req.params;
    const newToken = uuidv4(); // Generăm token-ul DOAR aici

    await db.query(
      "UPDATE tables SET status = 'open', current_session_token = $1 WHERE id = $2",
      [newToken, tableId]
    );

    // Anunțăm prin Socket că masa s-a deschis
    // Clientul care "ascultă" va primi semnalul și va face refresh
    req.app.get("io")?.emit("table-opened", { tableId, token: newToken });

    res.json({ success: true, token: newToken });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
export const approveTableAndOrder = async (req, res) => {
  const { tableId, orderId } = req.body;
  const newToken = uuidv4();

  try {
    // 1. Deschidem masa oficial în baza de date
    await db.query(
      "UPDATE tables SET status = 'open', current_session_token = $1 WHERE id = $2",
      [newToken, tableId]
    );

    // 2. Confirmăm comanda care stătea în așteptare
    await db.query("UPDATE orders SET status = 'confirmed' WHERE id = $1", [
      orderId,
    ]);

    // 3. 📢 ANUNȚĂM CLIENTUL (prin Socket)
    // Îi trimitem token-ul direct prin "țeavă" ca să nu mai facă el fetch
    req.app.get("io")?.emit(`table-approved-${tableId}`, {
      token: newToken,
    });

    res.json({ success: true, token: newToken });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
