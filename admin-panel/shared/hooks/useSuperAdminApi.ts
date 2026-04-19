/**
 * useSuperAdminApi — hook pentru apeluri autentificate la endpoint-urile /superadmin/*
 * Folosește tokenul stocat în localStorage sub cheia 'superadmin_token'.
 */

const BACKEND_URL = "/api";

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
  getStats: () => superAdminFetch<GlobalStats>("/superadmin/stats"),
  getBars: () => superAdminFetch<Bar[]>("/superadmin/bars"),
  getRecentOrders: (limit = 20) =>
    superAdminFetch<RecentOrder[]>(`/superadmin/orders/recent?limit=${limit}`),
  getRevenueTrend: (days = 30) =>
    superAdminFetch<RevenueTrendPoint[]>(`/superadmin/revenue?days=${days}`),
  getChurnRisk: () => superAdminFetch<ChurnBar[]>("/superadmin/churn-risk"),
  getSystemHealth: () => superAdminFetch<SystemHealth>("/superadmin/system-health"),

  // Bar specifics (Superadmin capabilities)
  getBarDetails: (barId: string) => superAdminFetch<BarDetails>(`/superadmin/bars/${barId}/details`),
  updateBarFeatures: (barId: string, features: BarFeatures) => superAdminFetch<BarFeatures>(`/superadmin/bars/${barId}/features`, { method: "PATCH", body: JSON.stringify({ features }) }),
  getBarUsers: (barId: string) => superAdminFetch<BarUser[]>(`/superadmin/bars/${barId}/users`),
  createBarUser: (barId: string, payload: any) => superAdminFetch<BarUser>(`/superadmin/bars/${barId}/users`, { method: "POST", body: JSON.stringify(payload) }),
  updateUserPassword: (userId: string, payload: any) => superAdminFetch<{success: boolean}>(`/superadmin/users/${userId}/password`, { method: "PUT", body: JSON.stringify(payload) }),
  updateUserRoleAndCategories: (userId: string, payload: any) => superAdminFetch<BarUser>(`/superadmin/users/${userId}/role`, { method: "PUT", body: JSON.stringify(payload) }),
};

// ─── Types ───────────────────────────────────────────────────────────────────
export interface GlobalStats {
  total_bars: number;
  total_users: number;
  total_tables: number;
  tables_open_now: number;
  orders_today: number;
  orders_week: number;
  orders_month: number;
  revenue_today: number;
  revenue_week: number;
  revenue_month: number;
  revenue_all_time: number;
  active_bars_7d: number;
}

export interface Bar {
  id: string;
  name: string;
  slug: string;
  logo_url?: string | null;
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

export interface BarFeatures {
  timer_minutes?: number;
  has_kds?: boolean;
}

export interface BarDetails extends Bar {
  features: BarFeatures;
  stats: {
    total_tables: number;
    total_orders: number;
    total_revenue: string;
  };
}

export interface BarUser {
  id: string;
  username: string;
  role: "admin" | "server" | "kitchen";
  created_at: string;
  allowed_categories: string[];
}
