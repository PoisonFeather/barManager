// shared/hooks/useDashboardSummary.ts
import { useState, useEffect, useCallback } from 'react';
import { dashboardService } from '../services/dashboardService';

export function useDashboardSummary(barId: string | null) {
  const [tableGroups, setTableGroups] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Folosim useCallback pentru ca funcția să fie "stabilă" și să poată fi chemată și de afară
  const refresh = useCallback(async () => {
    if (!barId) return;
    const data = await dashboardService.getSummary(barId);
    setTableGroups(Array.isArray(data) ? data : []);
  }, [barId]);

  useEffect(() => {
    if (!barId) return;

    // 1. Încărcăm datele imediat ce avem barId
    refresh();

    const interval = setInterval(() => {
      refresh();
    }, 5000); // 5 secunde

    // Când închizi pagina sau se schimbă barId, oprim intervalul vechi
    return () => clearInterval(interval);
  }, [barId, refresh]);

  return { tableGroups, loading, refresh };
}