import {
  closeTableOrders,
  getActiveOrdersByBar,
  getPersonalHistory,
  getUnpaidTableHistory,
  insertOrder,
  insertOrderItems,
  markOrderItemServed,
  updateOrderStatus,
  withTransaction,
  insertRequest,
  updateRequestStatus,
} from "../repositories/orders.repository.js";

export async function createOrder(payload) {
  const { bar_id, table_id, items, total_amount, status, session_token, personal_token, placed_by_staff = false } = payload;

  if (!items || items.length === 0) {
    const error = new Error("Coșul e gol!");
    error.status = 400;
    throw error;
  }

  const orderId = await withTransaction(async (client) => {
    const createdOrderId = await insertOrder(client, {
      bar_id,
      table_id,
      total_amount,
      status: status || "pending_approval",
      session_token,
      personal_token,
      placed_by_staff,
    });

    await insertOrderItems(client, createdOrderId, items);
    return createdOrderId;
  });

  return {
    success: true,
    orderId,
    message:
      status === "confirmed"
        ? "Comandă preluată!"
        : "Așteaptă aprobarea barmanului! 🍻",
  };
}

export async function listActiveOrders(barId) {
  return getActiveOrdersByBar(barId);
}

export async function changeOrderStatus(orderId, status) {
  await updateOrderStatus(orderId, status);
  return { success: true };
}

export async function getTableHistory(tableId) {
  return getUnpaidTableHistory(tableId);
}

export async function getMyShare(tableId, sessionToken) {
  return getPersonalHistory(tableId, sessionToken);
}

export async function serveOrderItem(itemId) {
  await markOrderItemServed(itemId);
  return { success: true };
}

export async function closeTable(tableId, paymentMethod = 'cash') {
  await closeTableOrders(tableId, paymentMethod);
  return { success: true };
}
