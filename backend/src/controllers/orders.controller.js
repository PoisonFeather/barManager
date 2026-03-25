import {
  changeOrderStatus,
  closeTable,
  createOrder,
  getTableHistory,
  listActiveOrders,
  serveOrderItem,
} from "../services/orders.service.js";

import { pool as db } from "../db/pool.js";
function resolveStatus(error, fallback = 500) {
  return Number.isInteger(error?.status) ? error.status : fallback;
}

export async function createOrderHandler(req, res) {
  try {
    const { table_id, session_token } = req.body;

    // 1. Validăm sesiunea înainte de orice
    const tableCheck = await db.query(
      "SELECT current_session_token FROM tables WHERE id = $1",
      [table_id]
    );

    const activeToken = tableCheck.rows[0]?.current_session_token;

    if (!activeToken || activeToken !== session_token) {
      return res.status(403).json({
        success: false,
        error:
          "Sesiune expirată! Te rugăm să scanezi din nou codul QR de pe masă.",
      });
    }

    // 2. Dacă e valid, procesăm comanda (codul tău existent)
    const response = await createOrder(req.body);

    // 3. Trimitem semnalul prin Socket (cum am făcut anterior)
    const io = req.app.get("io");
    if (response?.success && io) {
      io.emit("new-data", { type: "ORDER", tableId: table_id });
    }

    return res.json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function listActiveOrdersHandler(req, res) {
  try {
    const { barId } = req.params;
    const orders = await listActiveOrders(barId);
    return res.json(orders);
  } catch (error) {
    return res.status(resolveStatus(error)).json({ error: error.message });
  }
}

export async function updateOrderStatusHandler(req, res) {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    const response = await changeOrderStatus(orderId, status);
    return res.json(response);
  } catch (error) {
    return res.status(resolveStatus(error)).json({ error: error.message });
  }
}

export async function tableHistoryHandler(req, res) {
  try {
    const { tableId } = req.params;
    const history = await getTableHistory(tableId);
    return res.json(history);
  } catch (error) {
    return res.status(resolveStatus(error)).json({ error: error.message });
  }
}

export async function serveOrderItemHandler(req, res) {
  try {
    const { itemId } = req.params;
    const response = await serveOrderItem(itemId);
    return res.json(response);
  } catch (error) {
    return res.status(resolveStatus(error)).json({ error: error.message });
  }
}

export async function closeTableHandler(req, res) {
  try {
    const { tableId } = req.params;
    const response = await closeTable(tableId);
    return res.json(response);
  } catch (error) {
    return res.status(resolveStatus(error)).json({ error: error.message });
  }
}
