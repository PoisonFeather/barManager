// useDashboardSummary.ts
import { useState, useEffect } from 'react';
import { dashboardService } from '../services/dashboardService';

export function useDashboardSummary(barId: string | null) {
  const [tableGroups, setTableGroups] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchSummary = async () => {
    if (!barId) return;
    setLoading(true);
    
    // Apelăm serviciul (clean & simple)
    const data = await dashboardService.getSummary(barId);
    setTableGroups(Array.isArray(data) ? data : []);
    
    setLoading(false);
  };

  // reîmprospătăm datele când se schimbă barId
  useEffect(() => {
    fetchSummary();
  }, [barId]);

  return { tableGroups, loading, refresh: fetchSummary };
}