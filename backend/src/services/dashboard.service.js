import {
  getDashboardSummaryByBar,
  updateProductAvailability,
} from "../repositories/dashboard.repository.js";

export async function getDashboardSummary(barId) {
  return getDashboardSummaryByBar(barId);
}

export async function toggleProductAvailability(productId, is_available) {
  await updateProductAvailability(productId, is_available);
  return { success: true };
}
