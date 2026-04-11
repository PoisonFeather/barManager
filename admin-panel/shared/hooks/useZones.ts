import { useState, useEffect } from "react";
import { dashboardService } from "../services/dashboardService";

export function useZones(barId: string | null) {
  const [zones, setZones] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchZones = async () => {
    if (!barId) return;
    setLoading(true);
    try {
      const data = await dashboardService.getZones(barId);
      setZones(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchZones();
  }, [barId]);

  return { zones, loading, refreshZones: fetchZones };
}
