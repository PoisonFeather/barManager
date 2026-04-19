import bcrypt from "bcrypt";
import {
  getGlobalStats,
  getAllBars,
  getRecentOrders,
  getRevenueTrend,
  getChurnRiskBars,
  getSystemHealth,
  getBarDetails,
  updateBarFeatures,
  getBarUsers,
  createBarUser,
  updateUserPassword,
  updateUserProfile,
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

export async function getBarDetailsHandler(req, res) {
  try {
    const { barId } = req.params;
    const data = await getBarDetails(barId);
    if (!data) return res.status(404).json({ error: "Bar not found" });
    return res.json(data);
  } catch (error) {
    console.error("superadmin/bar-details error:", error);
    return res.status(resolveStatus(error)).json({ error: error.message });
  }
}

export async function updateBarFeaturesHandler(req, res) {
  try {
    const { barId } = req.params;
    const { features } = req.body;
    const data = await updateBarFeatures(barId, features);
    return res.json(data);
  } catch (error) {
    console.error("superadmin/bar-features error:", error);
    return res.status(resolveStatus(error)).json({ error: error.message });
  }
}

export async function getBarUsersHandler(req, res) {
  try {
    const { barId } = req.params;
    const data = await getBarUsers(barId);
    return res.json(data);
  } catch (error) {
    console.error("superadmin/bar-users error:", error);
    return res.status(resolveStatus(error)).json({ error: error.message });
  }
}

export async function createBarUserHandler(req, res) {
  try {
    const { barId } = req.params;
    const { username, password, role, allowedCategories } = req.body;
    
    if (!username || !password || !role) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    
    const passwordHash = await bcrypt.hash(password, 10);
    const data = await createBarUser(barId, username, passwordHash, role, allowedCategories || []);
    return res.status(201).json(data);
  } catch (error) {
    console.error("superadmin/create-user error:", error);
    return res.status(resolveStatus(error)).json({ error: error.message });
  }
}

export async function updateUserPasswordHandler(req, res) {
  try {
    const { userId } = req.params;
    const { password } = req.body;
    if (!password) return res.status(400).json({ error: "Password required" });
    
    const passwordHash = await bcrypt.hash(password, 10);
    await updateUserPassword(userId, passwordHash);
    return res.json({ success: true });
  } catch (error) {
    console.error("superadmin/update-password error:", error);
    return res.status(resolveStatus(error)).json({ error: error.message });
  }
}

export async function updateUserHandler(req, res) {
  try {
    const { userId } = req.params;
    const { username, role, password, allowedCategories } = req.body;
    if (!username || !role) return res.status(400).json({ error: "Username and role are required" });

    let passwordHash = null;
    if (password) {
      passwordHash = await bcrypt.hash(password, 10);
    }
    const data = await updateUserProfile(userId, { username, role, passwordHash, allowedCategories });
    return res.json(data);
  } catch (error) {
    console.error("superadmin/update-user error:", error);
    return res.status(resolveStatus(error)).json({ error: error.message });
  }
}
