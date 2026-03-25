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
