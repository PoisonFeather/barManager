import {
  changeOrderStatus,
  closeTable,
  createOrder,
  getTableHistory,
  listActiveOrders,
  serveOrderItem,
} from "../services/orders.service.js";
import {
  createRequest,
  completeRequest,
} from "../services/requests.service.js";

import { unlockTable_db } from "../repositories/orders.repository.js";

import { pool as db } from "../db/pool.js";
function resolveStatus(error, fallback = 500) {
  return Number.isInteger(error?.status) ? error.status : fallback;
}

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
      //console.log(table.current_session_token, session_token);
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
    //console.log(result);
    // 3. Socket-ul rămâne aici
    req.app.get("io").emit("new-data", {
      type: "ORDER_REQUEST",
      tableId: table_id,
      status: orderStatus,
    });
    // Socket-ul pentru CLIENȚI (Sincronizare live la masă)
    // Emitem un eveniment fix pe ID-ul mesei, ca doar ei să audă
    req.app.get("io").emit(`table-updated-${table_id}`, {
      type: "HISTORY_UPDATE",
      message: "Altcineva a adăugat produse!",
    });
    //console.log("added order and emitted socket event");
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

export async function unlockTableHandler(req, res) {
  try {
    const { tableId } = req.params;
    const { session_token } = req.body;

    // A. Verificăm dacă clientul are token-ul corect pentru masa respectivă
    const tableResult = await db.query(
      "SELECT status, current_session_token FROM tables WHERE id = $1",
      [tableId]
    );
    const table = tableResult.rows[0];

    if (!table || table.status !== "open" || table.current_session_token !== session_token) {
      return res.status(403).json({ error: "Sesiune invalidă pentru deblocare!" });
    }

    // B. Re-setăm cronometrul cu data/ora curentă pentru a extinde fereastra
    await unlockTable_db(tableId);

    // C. Notificăm realtime toate telefoanele să dea refresh dacă cumva unele stăteau în fața lacătului
    req.app.get("io").emit(`table-unlocked-${tableId}`, { message: "Masa a fost deblocată!" });

    return res.json({ success: true, message: "Timpul mesei a fost prelungit!" });
  } catch (error) {
    return res.status(resolveStatus(error)).json({ error: error.message });
  }
}
