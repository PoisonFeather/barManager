"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { superAdminApi, type Bar } from "@/shared/hooks/useSuperAdminApi";

function fmtEur(n: number) {
  return `€${new Intl.NumberFormat("ro-RO", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n)}`;
}
function timeAgo(iso: string | null) {
  if (!iso) return "Niciodată";
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1)  return "acum";
  if (m < 60) return `${m}m în urmă`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h în urmă`;
  return `${Math.floor(h / 24)}z în urmă`;
}

function ActivityDot({ lastOrderAt }: { lastOrderAt: string | null }) {
  const diffDays = lastOrderAt
    ? (Date.now() - new Date(lastOrderAt).getTime()) / 86_400_000
    : Infinity;
  const color = diffDays < 1 ? "bg-green-400" : diffDays < 7 ? "bg-amber-400" : "bg-red-500";
  const label = diffDays < 1 ? "Activ azi" : diffDays < 7 ? "Activ săpt." : "Inactiv";
  return (
    <div className="flex items-center gap-1.5">
      <span className={`w-2 h-2 rounded-full ${color}`} />
      <span className="text-xs font-bold text-zinc-400">{label}</span>
    </div>
  );
}

export default function SuperAdminBarsPage() {
  const [bars,    setBars]    = useState<Bar[]>([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState("");
  const [search,  setSearch]  = useState("");
  const [sortKey, setSortKey] = useState<keyof Bar>("revenue_total");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  async function load() {
    try {
      setError("");
      const data = await superAdminApi.getBars();
      setBars(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  function toggleSort(key: keyof Bar) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  }

  const filtered = bars
    .filter((b) =>
      b.name.toLowerCase().includes(search.toLowerCase()) ||
      b.slug.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      const av = a[sortKey] as number | string | null;
      const bv = b[sortKey] as number | string | null;
      const cmp = (av ?? 0) < (bv ?? 0) ? -1 : (av ?? 0) > (bv ?? 0) ? 1 : 0;
      return sortDir === "desc" ? -cmp : cmp;
    });

  const totalRevenue  = bars.reduce((s, b) => s + Number(b.revenue_total), 0);
  const totalOrders   = bars.reduce((s, b) => s + b.total_orders, 0);
  const activeBars    = bars.filter((b) => {
    if (!b.last_order_at) return false;
    return (Date.now() - new Date(b.last_order_at).getTime()) < 7 * 86_400_000;
  }).length;

  function SortIcon({ k }: { k: keyof Bar }) {
    if (sortKey !== k) return <span className="text-zinc-700 ml-1">↕</span>;
    return <span className="text-orange-400 ml-1">{sortDir === "desc" ? "↓" : "↑"}</span>;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center bg-red-500/10 border border-red-500/20 rounded-2xl p-8 max-w-md">
          <p className="text-red-400 font-bold mb-4">{error}</p>
          <button onClick={load} className="px-5 py-2 rounded-full bg-orange-500 text-black font-black text-xs uppercase tracking-widest">
            Încearcă din nou
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black tracking-tight">Toate barurile</h1>
          <p className="text-zinc-500 text-sm font-medium mt-0.5">
            {bars.length} baruri înregistrate · {activeBars} active ultimele 7 zile
          </p>
        </div>
        <button
          onClick={load}
          className="px-4 py-2 rounded-full bg-zinc-800 border border-white/8 text-xs font-black uppercase tracking-widest text-zinc-300 hover:text-white hover:bg-zinc-700 transition-all self-start"
        >
          ↻ Refresh
        </button>
      </div>

      {/* Summary Strip */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total baruri",     value: String(bars.length),    icon: "🍺" },
          { label: "Revenue total",    value: fmtEur(totalRevenue),   icon: "💶" },
          { label: "Comenzi totale",   value: String(totalOrders),    icon: "📦" },
        ].map(({ label, value, icon }) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-zinc-900/60 border border-white/5 rounded-2xl px-5 py-4 flex items-center gap-3"
          >
            <span className="text-2xl">{icon}</span>
            <div>
              <div className="text-xs text-zinc-500 font-bold uppercase tracking-widest">{label}</div>
              <div className="text-xl font-black text-white">{value}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Caută bar după nume sau slug..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full bg-zinc-900/60 border border-white/8 rounded-xl px-4 py-3 text-sm text-white font-medium placeholder:text-zinc-600 focus:outline-none focus:border-orange-500/50 transition-all"
      />

      {/* Table */}
      <div className="bg-zinc-900/60 border border-white/5 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                {(
                  [
                    { label: "Bar",            key: "name"           },
                    { label: "Mese",           key: "table_count"    },
                    { label: "Ocupate acum",   key: "tables_open"    },
                    { label: "Comenzi azi",    key: "orders_today"   },
                    { label: "Comenzi total",  key: "total_orders"   },
                    { label: "Revenue lună",   key: "revenue_month"  },
                    { label: "Revenue total",  key: "revenue_total"  },
                    { label: "Ultima activit.",key: "last_order_at"  },
                    { label: "Status",         key: null             },
                  ] as { label: string; key: keyof Bar | null }[]
                ).map(({ label, key }) => (
                  <th
                    key={label}
                    onClick={() => key && toggleSort(key)}
                    className={`text-left text-xs font-bold text-zinc-500 uppercase tracking-widest px-4 py-3 whitespace-nowrap ${key ? "cursor-pointer hover:text-zinc-300 transition-colors select-none" : ""}`}
                  >
                    {label}
                    {key && <SortIcon k={key} />}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={9} className="text-center text-zinc-600 py-12 font-medium">
                    Niciun bar găsit.
                  </td>
                </tr>
              )}
              {filtered.map((bar, i) => (
                <motion.tr
                  key={bar.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.02 }}
                  onClick={() => window.location.assign(`/superadmin/bars/${bar.id}`)}
                  className="border-b border-white/4 hover:bg-white/3 transition-colors cursor-pointer"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {bar.primary_color && (
                        <div
                          className="w-3 h-3 rounded-full shrink-0 ring-1 ring-white/10"
                          style={{ background: bar.primary_color }}
                        />
                      )}
                      <div>
                        <div className="font-bold text-white">{bar.name}</div>
                        <div className="text-zinc-500 text-xs font-medium">/{bar.slug}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-zinc-300 font-bold">{bar.table_count}</td>
                  <td className="px-4 py-3">
                    <span className={`font-black ${bar.tables_open > 0 ? "text-green-400" : "text-zinc-600"}`}>
                      {bar.tables_open}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-zinc-300 font-bold">{bar.orders_today}</td>
                  <td className="px-4 py-3 text-zinc-400 font-medium">{bar.total_orders}</td>
                  <td className="px-4 py-3 text-orange-400 font-black">{fmtEur(Number(bar.revenue_month))}</td>
                  <td className="px-4 py-3 text-orange-400 font-black">{fmtEur(Number(bar.revenue_total))}</td>
                  <td className="px-4 py-3 text-zinc-500 font-medium whitespace-nowrap">{timeAgo(bar.last_order_at)}</td>
                  <td className="px-4 py-3">
                    <ActivityDot lastOrderAt={bar.last_order_at} />
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
