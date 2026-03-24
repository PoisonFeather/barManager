import {
  changeOrderStatus,
  closeTable,
  createOrder,
  getTableHistory,
  listActiveOrders,
  serveOrderItem,
} from "../services/orders.service.js";

function resolveStatus(error, fallback = 500) {
  return Number.isInteger(error?.status) ? error.status : fallback;
}

export async function createOrderHandler(req, res) {
  try {
    const response = await createOrder(req.body);
    return res.json(response);
  } catch (error) {
    console.error(error);
    return res
      .status(resolveStatus(error))
      .json({ error: error.message || "Eroare la procesarea comenzii." });
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
