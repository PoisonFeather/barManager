import {
  getGlobalStats,
  getAllBars,
  getRecentOrders,
  getRevenueTrend,
  getChurnRiskBars,
  getSystemHealth,
} from "../repositories/superadmin.repository.js";

function resolveStatus(error, fallback = 500) {
  return Number.isInteger(error?.status) ? error.status : fallback;
}

export async function getStatsHandler(req, res) {
  try {
    const data = await getGlobalStats();
    return res.json(data);
  } catch (error) {
    console.error("superadmin/stats error:", error);
    return res.status(resolveStatus(error)).json({ error: error.message });
  }
}

export async function getBarsHandler(req, res) {
  try {
    const data = await getAllBars();
    return res.json(data);
  } catch (error) {
    console.error("superadmin/bars error:", error);
    return res.status(resolveStatus(error)).json({ error: error.message });
  }
}

export async function getRecentOrdersHandler(req, res) {
  try {
    const limit = Math.min(parseInt(req.query.limit) || 20, 100);
    const data = await getRecentOrders(limit);
    return res.json(data);
  } catch (error) {
    console.error("superadmin/orders/recent error:", error);
    return res.status(resolveStatus(error)).json({ error: error.message });
  }
}

export async function getRevenueTrendHandler(req, res) {
  try {
    const days = Math.min(parseInt(req.query.days) || 30, 365);
    const data = await getRevenueTrend(days);
    return res.json(data);
  } catch (error) {
    console.error("superadmin/revenue error:", error);
    return res.status(resolveStatus(error)).json({ error: error.message });
  }
}

export async function getChurnRiskHandler(req, res) {
  try {
    const data = await getChurnRiskBars();
    return res.json(data);
  } catch (error) {
    console.error("superadmin/health error:", error);
    return res.status(resolveStatus(error)).json({ error: error.message });
  }
}

export async function getSystemHealthHandler(req, res) {
  try {
    const data = await getSystemHealth();
    return res.json(data);
  } catch (error) {
    console.error("superadmin/system-health error:", error);
    return res.status(resolveStatus(error)).json({ error: error.message });
  }
}
