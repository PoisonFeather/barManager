import { useState, useEffect, useCallback } from 'react';
import { barService } from '../services/barService';

export function useBarData(slug: string) {
  const [barData, setBarData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    if (!slug) return;
    setLoading(true);
    const data = await barService.getBarBySlug(slug);
    setBarData(data);
    setLoading(false);
  }, [slug]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { barData, setBarData, loading, refresh: fetchData };
}