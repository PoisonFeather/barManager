"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { superAdminApi, type RevenueTrendPoint, type RecentOrder, type ChurnBar } from "@/shared/hooks/useSuperAdminApi";

// ─── Types ────────────────────────────────────────────────────────────────────
interface GlobalStats {
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

// ─── Helpers ─────────────────────────────────────────────────────────────────
function fmt(n: number) {
  return new Intl.NumberFormat("ro-RO", { minimumFractionDigits: 0, maximumFractionDigits: 2 }).format(n);
}
function fmtEur(n: number) {
  return `€${fmt(n)}`;
}
function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1)  return "acum";
  if (m < 60) return `${m}m în urmă`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h în urmă`;
  return `${Math.floor(h / 24)}z în urmă`;
}

// ─── KPI Card ────────────────────────────────────────────────────────────────
function KpiCard({
  label, value, sub, color = "text-white", icon,
}: {
  label: string; value: string; sub?: string; color?: string; icon: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-zinc-900/60 border border-white/5 rounded-2xl p-5 flex flex-col gap-2 hover:bg-zinc-900 transition-colors"
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">{label}</span>
        <span className="text-xl">{icon}</span>
      </div>
      <div className={`text-3xl font-black tracking-tight ${color}`}>{value}</div>
      {sub && <div className="text-xs text-zinc-500 font-medium">{sub}</div>}
    </motion.div>
  );
}

// ─── Status badge ────────────────────────────────────────────────────────────
function StatusBadge({ isPaid }: { isPaid: boolean }) {
  return (
    <span className={`inline-block text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${
      isPaid ? "bg-green-500/15 text-green-400" : "bg-amber-500/15 text-amber-400"
    }`}>
      {isPaid ? "Plătit" : "Deschis"}
    </span>
  );
}

// ─── Custom Chart Tooltip ─────────────────────────────────────────────────────
function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: {value: number}[]; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-zinc-900 border border-white/10 rounded-xl px-4 py-2 text-sm shadow-xl">
      <div className="text-zinc-400 font-medium mb-1">{label}</div>
      <div className="text-orange-400 font-black">{fmtEur(payload[0]?.value ?? 0)}</div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function SuperAdminOverview() {
  const [stats,        setStats]        = useState<GlobalStats | null>(null);
  const [trend,        setTrend]        = useState<RevenueTrendPoint[]>([]);
  const [orders,       setOrders]       = useState<RecentOrder[]>([]);
  const [churnBars,    setChurnBars]    = useState<ChurnBar[]>([]);
  const [error,        setError]        = useState("");
  const [loading,      setLoading]      = useState(true);
  const [lastRefresh,  setLastRefresh]  = useState<Date | null>(null);
  const [trendDays,    setTrendDays]    = useState(30);

  const load = useCallback(async () => {
    try {
      setError("");
      const [s, t, o, c] = await Promise.all([
        superAdminApi.getStats(),
        superAdminApi.getRevenueTrend(trendDays),
        superAdminApi.getRecentOrders(15),
        superAdminApi.getChurnRisk(),
      ]);
      setStats(s as GlobalStats);
      setTrend(t);
      setOrders(o);
      setChurnBars(c);
      setLastRefresh(new Date());
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [trendDays]);

  useEffect(() => { load(); }, [load]);
  // Auto-refresh every 60s
  useEffect(() => {
    const id = setInterval(() => load(), 60_000);
    return () => clearInterval(id);
  }, [load]);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-zinc-500 text-sm font-medium">Se încarcă datele platformei...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[60vh]">
        <div className="text-center bg-red-500/10 border border-red-500/20 rounded-2xl p-8 max-w-md">
          <div className="text-3xl mb-3">⚠️</div>
          <p className="text-red-400 font-bold mb-4">{error}</p>
          <button onClick={load} className="px-5 py-2 rounded-full bg-orange-500 text-black font-black text-xs uppercase tracking-widest">
            Încearcă din nou
          </button>
        </div>
      </div>
    );
  }

  const trendData = trend.map((d) => ({
    ...d,
    day: new Date(d.day).toLocaleDateString("ro-RO", { day: "2-digit", month: "short" }),
    revenue: parseFloat(String(d.revenue)),
  }));

  return (
    <div className="space-y-8 max-w-7xl mx-auto">

      {/* ── Header ──────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black tracking-tight">
            Bună ziua, Andrei 👋
          </h1>
          <p className="text-zinc-500 text-sm font-medium mt-0.5">
            Overview — toate barurile, comenzile și veniturile în timp real.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {lastRefresh && (
            <span className="text-xs text-zinc-600 font-medium">
              Actualizat: {lastRefresh.toLocaleTimeString("ro-RO")}
            </span>
          )}
          <button
            onClick={load}
            className="px-4 py-2 rounded-full bg-zinc-800 border border-white/8 text-xs font-black uppercase tracking-widest text-zinc-300 hover:text-white hover:bg-zinc-700 transition-all"
          >
            ↻ Refresh
          </button>
        </div>
      </div>

      {/* ── KPI Grid ────────────────────────────────────────────────── */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <KpiCard icon="🍺" label="Baruri înregistrate"  value={String(stats.total_bars)}       sub={`${stats.active_bars_7d} active ultimele 7z`} />
          <KpiCard icon="🪑" label="Mese ocupate acum"    value={String(stats.tables_open_now)}  sub={`din ${stats.total_tables} totale`} />
          <KpiCard icon="📦" label="Comenzi azi"           value={String(stats.orders_today)}     sub={`${stats.orders_week} săpt · ${stats.orders_month} lună`} />
          <KpiCard icon="💶" label="Revenue azi"           value={fmtEur(stats.revenue_today)}    color="text-orange-400" />
          <KpiCard icon="💰" label="Revenue săptămână"     value={fmtEur(stats.revenue_week)}     color="text-orange-400" />
          <KpiCard icon="📈" label="Revenue lună"          value={fmtEur(stats.revenue_month)}    color="text-orange-400" sub={`Total: ${fmtEur(stats.revenue_all_time)}`} />
          <KpiCard icon="👤" label="Utilizatori activi"    value={String(stats.total_users)} />
          <KpiCard icon="🌐" label="Baruri active 7d"      value={String(stats.active_bars_7d)}   sub={`din ${stats.total_bars} înregistrate`} />
        </div>
      )}

      {/* ── Revenue Chart ────────────────────────────────────────────── */}
      <div className="bg-zinc-900/60 border border-white/5 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-base font-black tracking-tight">Revenue trend</h2>
            <p className="text-xs text-zinc-500 font-medium">Venituri zilnice, toate barurile</p>
          </div>
          <div className="flex gap-2">
            {[7, 14, 30, 90].map((d) => (
              <button
                key={d}
                onClick={() => setTrendDays(d)}
                className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest transition-all ${
                  trendDays === d
                    ? "bg-orange-500 text-black"
                    : "bg-zinc-800 text-zinc-400 hover:text-white"
                }`}
              >
                {d}z
              </button>
            ))}
          </div>
        </div>

        {trendData.length === 0 ? (
          <div className="h-48 flex items-center justify-center text-zinc-600 text-sm font-medium">
            Fără date pentru perioada selectată.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={trendData} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"   stopColor="#f97316" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#f97316" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
              <XAxis dataKey="day" tick={{ fill: "#71717a", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#71717a", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `€${v}`} width={55} />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#f97316"
                strokeWidth={2}
                fill="url(#revenueGrad)"
                dot={false}
                activeDot={{ r: 5, fill: "#f97316", stroke: "#080808", strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* ── Bottom Grid: Recent Orders + Churn Risk ──────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Recent Orders */}
        <div className="bg-zinc-900/60 border border-white/5 rounded-2xl p-6">
          <h2 className="text-base font-black tracking-tight mb-5">Comenzi recente</h2>
          <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
            {orders.length === 0 && (
              <p className="text-zinc-600 text-sm font-medium text-center py-8">Nicio comandă.</p>
            )}
            {orders.map((o) => (
              <div
                key={o.id}
                className="flex items-center justify-between gap-3 px-4 py-3 rounded-xl bg-zinc-800/50 hover:bg-zinc-800 transition-colors"
              >
                <div className="min-w-0">
                  <div className="text-sm font-bold text-white truncate">{o.bar_name}</div>
                  <div className="text-xs text-zinc-500 font-medium">Masa {o.table_number} · {timeAgo(o.created_at)}</div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <StatusBadge isPaid={o.is_paid} />
                  <span className="text-sm font-black text-orange-400">{fmtEur(o.total_amount)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Churn Risk */}
        <div className="bg-zinc-900/60 border border-white/5 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-5">
            <h2 className="text-base font-black tracking-tight">Risc churn</h2>
            {churnBars.length > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-red-500/15 text-red-400 text-[10px] font-black uppercase tracking-widest">
                {churnBars.length} inactiv{churnBars.length > 1 ? "e" : ""}
              </span>
            )}
          </div>
          <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
            {churnBars.length === 0 && (
              <div className="flex flex-col items-center justify-center py-10 text-center gap-2">
                <span className="text-3xl">🎉</span>
                <p className="text-zinc-500 text-sm font-medium">Toate barurile sunt active!</p>
              </div>
            )}
            {churnBars.map((b) => (
              <div
                key={b.id}
                className="flex items-center justify-between gap-3 px-4 py-3 rounded-xl bg-red-500/5 border border-red-500/10 hover:bg-red-500/10 transition-colors"
              >
                <div className="min-w-0">
                  <div className="text-sm font-bold text-white truncate">{b.name}</div>
                  <div className="text-xs text-zinc-500 font-medium">
                    {b.last_order_at ? `Ultima comandă: ${timeAgo(b.last_order_at)}` : "Nicio comandă niciodată"}
                    {" · "}{b.total_orders_ever} comenzi total
                  </div>
                </div>
                <span className="text-lg shrink-0">⚠️</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
