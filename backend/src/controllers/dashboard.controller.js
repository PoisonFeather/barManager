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
