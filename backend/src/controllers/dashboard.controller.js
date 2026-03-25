// backend/src/controllers/dashboard.controller.js
import * as dashboardService from "../services/dashboard.service.js";

/**
 * Funcție helper pentru gestionarea codurilor de eroare
 */
function resolveStatus(error, fallback = 500) {
  return Number.isInteger(error?.status) ? error.status : fallback;
}

// 1. SUMAR DASHBOARD (Mesele colorate)
export async function dashboardSummaryHandler(req, res) {
  try {
    const { barId } = req.params;
    const result = await dashboardService.getDashboardSummary(barId);
    return res.json(result);
  } catch (error) {
    return res.status(resolveStatus(error)).json({ error: error.message });
  }
}

// 2. APROBARE MASĂ (Când apeși pe butonul verde/galben)
export const approveTableHandler = async (req, res) => {
  try {
    const { tableId } = req.body;

    // Delegăm logica de DB către Service
    const { token } = await dashboardService.approveTable(tableId);

    console.log(`✅ Masa ${tableId} a fost aprobată via Service.`);

    // 📢 NOTIFICĂRI SOCKET.IO
    const io = req.app.get("io");
    if (io) {
      // Trimitem token-ul clientului (telefonului) ca să poată comanda în continuare
      io.emit(`table-approved-${tableId}`, { token });
      // Notificăm dashboard-ul (tableta) să actualizeze culorile
      io.emit("new-data", { type: "TABLE_APPROVED", tableId });
    }

    return res.json({ success: true, message: "Masa a fost aprobată!", token });
  } catch (error) {
    console.error("💥 Eroare approveTableHandler:", error);
    res.status(500).json({ error: error.message });
  }
};

// 3. RESPINGERE MASĂ (Când dai X la o comandă pending)
export const rejectTableHandler = async (req, res) => {
  try {
    const { tableId } = req.body;

    await dashboardService.rejectTable(tableId);

    const io = req.app.get("io");
    if (io) {
      io.emit("new-data", { type: "ORDER_REJECTED", tableId });
    }

    return res.json({ success: true, message: "Cererea a fost respinsă." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 4. ÎNCHIDERE MASĂ (Final de ședere / Checkout)
export const closeTableHandler = async (req, res) => {
  try {
    const { tableId } = req.params;

    // Delegăm resetarea token-ului și statusului către Service
    await dashboardService.closeTable(tableId);

    const io = req.app.get("io");
    if (io) {
      io.emit("new-data", { type: "TABLE_CLOSED", tableId });
    }

    res.json({ success: true, message: "Masa a fost închisă." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 5. TOGGLE DISPONIBILITATE PRODUS (Stoc)
export async function toggleProductAvailabilityHandler(req, res) {
  try {
    const { productId } = req.params;
    const { is_available } = req.body;

    const result = await dashboardService.toggleProductAvailability(
      productId,
      is_available
    );
    return res.json(result);
  } catch (error) {
    return res.status(resolveStatus(error)).json({ error: error.message });
  }
}

// 6. DESCHIDERE MANUALĂ (Dacă barmanul deschide masa fără comandă prealabilă)
export const openTableHandler = async (req, res) => {
  try {
    const { tableId } = req.params;
    const { token } = await dashboardService.openTable(tableId);

    req.app.get("io")?.emit("table-opened", { tableId, token });

    res.json({ success: true, token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
