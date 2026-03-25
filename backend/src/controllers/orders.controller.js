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

// orders.controller.js

export async function createOrderHandler(req, res) {
  try {
    const { table_id, bar_id, session_token, items, total_amount } = req.body;

    // 🛡️ 1. Validarea Sesiunii (Rămâne în controller, e treaba de "pază")
    const tableResult = await db.query(
      "SELECT status, current_session_token FROM tables WHERE id = $1",
      [table_id]
    );
    const table = tableResult.rows[0];

    let orderStatus = "pending_approval";
    if (
      table?.status === "open" &&
      table.current_session_token === session_token
    ) {
      orderStatus = "confirmed";
    } else if (
      table?.status === "open" &&
      table.current_session_token !== session_token
    ) {
      console.log(
        "Current table token is different from the one provided in the order request."
      );
      console.log(table.current_session_token, session_token);
      return res.status(403).json({ error: "Sesiune invalidă!" });
    }

    // 🚀 2. Apelăm SERVICIUL (cel cu tranzacția)
    const result = await createOrder({
      bar_id,
      table_id,
      items,
      total_amount,
      status: orderStatus, // Îi dăm statusul calculat
    });

    // 3. Socket-ul rămâne aici
    req.app.get("io").emit("new-data", {
      type: "ORDER_REQUEST",
      tableId: table_id,
      status: orderStatus,
    });

    return res.json(result);
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
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
