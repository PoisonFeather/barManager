import { getAnalyticsDataByBar } from "../repositories/analytics.repository.js";

export async function getAnalytics(barId, period) {
  // Return the data directly from the repository
  return await getAnalyticsDataByBar(barId, period);
}
