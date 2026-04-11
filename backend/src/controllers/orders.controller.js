import {
  changeOrderStatus,
  closeTable,
  createOrder,
  getMyShare,
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
import { v4 as uuidv4 } from "uuid";
function resolveStatus(error, fallback = 500) {
  return Number.isInteger(error?.status) ? error.status : fallback;
}

// Staff order — barman/chelner plasează comanda direct, fără session_token
export async function createStaffOrderHandler(req, res) {
  try {
    const { table_id, bar_id, items, total_amount } = req.body;
    if (!table_id || !bar_id || !items?.length) {
      return res.status(400).json({ error: "Câmpuri obligatorii lipsă: table_id, bar_id, items" });
    }

    // Dacă masa e închisă o deschidem automat cu un session_token fresh
    const tableResult = await db.query(
      "SELECT status, current_session_token, merged_into_id FROM tables WHERE id = $1",
      [table_id]
    );
    const table = tableResult.rows[0];
    if (!table) return res.status(404).json({ error: "Masa nu există" });

    let sessionToken = table.current_session_token;
    if (table.status === "closed" || !sessionToken) {
      sessionToken = uuidv4();
      await db.query(
        "UPDATE tables SET status = 'open', current_session_token = $1 WHERE id = $2",
        [sessionToken, table_id]
      );
    }

    const result = await createOrder({
      bar_id,
      table_id,
      // Remapăm product_id → id (format cerut de insertOrderItems)
      items: items.map((i) => ({ id: i.product_id || i.id, quantity: i.quantity, price: i.price })),
      total_amount,
      status: "confirmed",
      session_token: sessionToken,
      personal_token: null,
      placed_by_staff: true,
    });

    const rootTableId = table.merged_into_id || table_id;
    const groupResult = await db.query(
      "SELECT id FROM tables WHERE id = $1 OR merged_into_id = $1",
      [rootTableId]
    );

    req.app.get("io").emit("new-data", { type: "ORDER_REQUEST", tableId: rootTableId, status: "confirmed" });
    
    groupResult.rows.forEach(({ id }) => {
      req.app.get("io").emit(`table-updated-${id}`, { type: "HISTORY_UPDATE" });
    });

    return res.json({ success: true, orderId: result.orderId });
  } catch (error) {
    return res.status(resolveStatus(error)).json({ error: error.message });
  }
}

export async function createOrderHandler(req, res) {
  try {
    const { table_id, bar_id, session_token, personal_token, items, total_amount } = req.body;

    // 🛡️ 1. Validarea Sesiunii (Rămâne în controller, e treaba de "pază")
    const tableResult = await db.query(
      "SELECT status, current_session_token, merged_into_id FROM tables WHERE id = $1",
      [table_id]
    );
    const table = tableResult.rows[0];

    let orderStatus = "pending_approval";
    let newTokenProvided = null;

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
    } else if (table?.status === "closed") {
      // Daca masa e inchisa si cineva plaseaza prima comanda, noi ar trebui
      // sa ii pre-alocam un session token clientului ca sa nu si-l piarda daca
      // se deconecteaza de la socket.
      if (!table.current_session_token) {
        newTokenProvided = uuidv4();
        await db.query("UPDATE tables SET current_session_token = $1 WHERE id = $2", [newTokenProvided, table_id]);
      } else {
        newTokenProvided = table.current_session_token;
      }
    }

    //  2. Apelăm SERVICIUL (cel cu tranzacția)
    const result = await createOrder({
      bar_id,
      table_id,
      items,
      total_amount,
      status: orderStatus,
      session_token,
      personal_token,   // 🧍 Token unic per browser — pentru "Contribuția Ta"
    });
    //console.log(result);
    const rootTableId = table.merged_into_id || table_id;
    const groupResult = await db.query(
      "SELECT id FROM tables WHERE id = $1 OR merged_into_id = $1",
      [rootTableId]
    );

    // 3. Socket-ul rămâne aici
    req.app.get("io").emit("new-data", {
      type: "ORDER_REQUEST",
      tableId: rootTableId, // Trimitem doar spre tabela mare in dashboard
      status: orderStatus,
    });
    
    // Socket-ul pentru CLIENȚI (Sincronizare live la masă)
    // Emitem un eveniment către TOATE mesele care alcătuiesc masa combinată
    groupResult.rows.forEach(({ id }) => {
      req.app.get("io").emit(`table-updated-${id}`, {
        type: "HISTORY_UPDATE",
        message: "Altcineva a adăugat produse!",
      });
    });
    //console.log("added order and emitted socket event");
    return res.json({
      success: true,
      orderId: result.orderId,
      sessionToken: newTokenProvided, // Returnam pre-tokenul ca barmanul să poată aproba, iar clientul să aibă deja cheia!
      message: result.message,
    });
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
    const { paymentMethod } = req.body; // cash or card
    const response = await closeTable(tableId, paymentMethod);
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
      "SELECT status, current_session_token, merged_into_id FROM tables WHERE id = $1",
      [tableId]
    );
    const table = tableResult.rows[0];

    console.log("Unlock Attempt:", { provided: session_token, db: table?.current_session_token, status: table?.status });

    if (!table || table.status !== "open" || table.current_session_token !== session_token) {
      return res.status(403).json({ error: "Sesiune invalidă pentru deblocare!" });
    }

    // B. Re-setăm cronometrul cu data/ora curentă pentru a extinde fereastra
    await unlockTable_db(tableId);

    // C. Notificăm realtime toate telefoanele să dea refresh dacă cumva unele stăteau în fața lacătului
    const rootTableId = table.merged_into_id || tableId;
    const groupResult = await db.query("SELECT id FROM tables WHERE id = $1 OR merged_into_id = $1", [rootTableId]);
    groupResult.rows.forEach(({ id }) => {
      req.app.get("io").emit(`table-unlocked-${id}`, { message: "Masa a fost deblocată!" });
    });

    return res.json({ success: true, message: "Timpul mesei a fost prelungit!" });
  } catch (error) {
    return res.status(resolveStatus(error)).json({ error: error.message });
  }
}

export async function getPersonalHistoryHandler(req, res) {
  try {
    const { tableId } = req.params;
    const { personal_token } = req.query;
    if (!personal_token) return res.status(400).json({ error: "personal_token lipsă" });
    const items = await getMyShare(tableId, personal_token);
    return res.json(items);
  } catch (error) {
    return res.status(resolveStatus(error)).json({ error: error.message });
  }
}
