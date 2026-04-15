/**
 * useSuperAdminApi — hook pentru apeluri autentificate la endpoint-urile /superadmin/*
 * Folosește tokenul stocat în localStorage sub cheia 'superadmin_token'.
 */

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";

function getSuperAdminToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("superadmin_token");
}

async function superAdminFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const token = getSuperAdminToken();
  const res = await fetch(`${BACKEND_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
      ...(options?.headers ?? {}),
    },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body?.error || `HTTP ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export const superAdminApi = {
  getStats: () => superAdminFetch<Record<string, number>>("/superadmin/stats"),
  getBars: () => superAdminFetch<Bar[]>("/superadmin/bars"),
  getRecentOrders: (limit = 20) =>
    superAdminFetch<RecentOrder[]>(`/superadmin/orders/recent?limit=${limit}`),
  getRevenueTrend: (days = 30) =>
    superAdminFetch<RevenueTrendPoint[]>(`/superadmin/revenue?days=${days}`),
  getChurnRisk: () => superAdminFetch<ChurnBar[]>("/superadmin/churn-risk"),
  getSystemHealth: () => superAdminFetch<SystemHealth>("/superadmin/system-health"),
};

// ─── Types ───────────────────────────────────────────────────────────────────
export interface Bar {
  id: string;
  name: string;
  slug: string;
  primary_color: string | null;
  table_count: number;
  tables_open: number;
  user_count: number;
  total_orders: number;
  orders_today: number;
  revenue_total: number;
  revenue_month: number;
  last_order_at: string | null;
  bar_created_at: string;
}

export interface RecentOrder {
  id: string;
  total_amount: number;
  status: string;
  is_paid: boolean;
  payment_method: string | null;
  created_at: string;
  bar_name: string;
  bar_slug: string;
  table_number: number;
}

export interface RevenueTrendPoint {
  day: string;
  orders_count: number;
  revenue: number;
}

export interface ChurnBar {
  id: string;
  name: string;
  slug: string;
  created_at: string;
  last_order_at: string | null;
  total_orders_ever: number;
}

export interface SystemHealth {
  db_ok: boolean;
  orders_last_10min: number;
  checked_at: string;
}
