"use client";
import { useState, use, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDashboardSummary } from "@/shared/hooks/useDashboardSummary";
import { useBarData } from "@/shared/hooks/useBarData";
import { dashboardService } from "@/shared/services/dashboardService";
import { useSocket } from "@/shared/hooks/useSocket";
import { TableCard } from "../components/tableCards";

export default function KitchenKDS({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const router = useRouter();
  const [userRole, setUserRole] = useState<string>("server");
  const [allowedCategories, setAllowedCategories] = useState<string[]>([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUserRole(payload.role || "server");
        setAllowedCategories(payload.allowedCategories || []);
      } catch (e) { }
    }
  }, [router]);

  const { barData } = useBarData(slug);
  const { tableGroups, refresh } = useDashboardSummary(barData?.id || null);
  useSocket(() => refresh());

  const handleComplete = async (id: string) => {
    if (await dashboardService.completeRequest(id)) refresh();
  };
  const handleServe = async (id: string) => {
    if (await dashboardService.serveItem(id)) refresh();
  };

  if (!barData) {
    return <div className="min-h-screen bg-black flex items-center justify-center text-orange-500 font-black animate-pulse text-2xl tracking-widest">KDS Se Încarcă...</div>;
  }

  const hasWork = (group: any) => {
    if (!allowedCategories || allowedCategories.length === 0) return true; // Poate vedea tot

    // Filtram pur și simplu dacă există produse pendinte care fac parte din categoriile permise
    return group.pending_items?.some((item: any) => allowedCategories.includes(item.category_id));
  };

  const kdsGroups = tableGroups.filter(hasWork);

  return (
    <div className="min-h-screen bg-zinc-100 dark:bg-zinc-950 p-4 md:p-8 text-zinc-900 dark:text-white">
      <div className="flex justify-between items-center mb-8 border-b border-zinc-200 dark:border-white/10 pb-4">
        <div>
          <h1 className="text-4xl text-orange-500 font-black tracking-tighter uppercase">KDS / Ecran Producție</h1>
          <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs mt-1">{barData.name}</p>
        </div>
        {userRole !== "kitchen" && (
          <button
            onClick={() => router.push(`/dashboard/${slug}`)}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 font-bold text-xs uppercase tracking-widest transition-colors"
          >
            Înapoi la Bar
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-max items-start">
        {kdsGroups.map(group => (
          <div key={group.table_id} className="scale-100 transform origin-top transition-transform">
            <TableCard
              group={group}
              onComplete={handleComplete}
              onServe={handleServe}
              onClose={() => { }} // Disabled on KDS visually because they shouldn't tap it
              onApprove={() => { }}
              onReject={() => { }}
              onAddOrder={() => { }}
            />
          </div>
        ))}
        {kdsGroups.length === 0 && (
          <div className="col-span-full py-20 text-center">
            <p className="text-zinc-600 font-black text-2xl uppercase tracking-widest">Nicio masă activă la secția ta</p>
          </div>
        )}
      </div>
    </div>
  );
}
