// shared/hooks/useBarData.ts
import { useState, useEffect } from 'react';
import { barService } from '../services/barService';

export function useBarData(slug: string) {
  const [barData, setBarData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      const data = await barService.getBarBySlug(slug);
      setBarData(data);
      setLoading(false);
    };

    if (slug) {
      fetchInitialData();
    }
  }, [slug]);

  // Returnăm și setBarData pentru a permite update-uri locale (ex: când schimbi stocul)
  return { barData, setBarData, loading };
}