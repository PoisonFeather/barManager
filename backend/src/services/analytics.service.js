import { getAnalyticsDataByBar, getWaitTimeAnalytics } from "../repositories/analytics.repository.js";

export async function getAnalytics(barId, period) {
  // Return the data directly from the repository
  return await getAnalyticsDataByBar(barId, period);
}

export async function getWaitTimes(barId, period) {
  return await getWaitTimeAnalytics(barId, period);
}
