import { getAnalytics } from "../services/analytics.service.js";

function resolveStatus(error, fallback = 500) {
  return Number.isInteger(error?.status) ? error.status : fallback;
}

export async function getAnalyticsHandler(req, res) {
  try {
    const { barId } = req.params;
    const { period } = req.query; // 'today', 'week', 'month', 'all'
    
    // Verificăm permisiunile. Vom folosi un check în route, dar putem verifica și aici:
    if (req.user.barId !== barId) {
       return res.status(403).json({ error: "Interzis" });
    }

    const data = await getAnalytics(barId, period || 'week');
    return res.json(data);
  } catch (error) {
    console.error("Eroare getAnalyticsHandler:", error);
    return res.status(resolveStatus(error)).json({ error: error.message });
  }
}
