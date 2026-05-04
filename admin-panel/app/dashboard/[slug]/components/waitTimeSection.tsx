"use client";

import { useEffect, useState } from "react";
import { dashboardService } from "@/shared/services/dashboardService";
import { motion } from "framer-motion";

interface WaitTimeSectionProps {
  barId: string;
}

export function WaitTimeSection({ barId }: WaitTimeSectionProps) {
  const [period, setPeriod] = useState<"today" | "week" | "month">("today");
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [period, barId]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const waitTimes = await dashboardService.getWaitTimes(barId, period);
      setData(waitTimes);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatSeconds = (totalSeconds: number) => {
    if (!totalSeconds || isNaN(totalSeconds)) return "N/A";
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = Math.floor(totalSeconds % 60);
    
    let res = "";
    if (h > 0) res += `${h}h `;
    if (m > 0 || h > 0) res += `${m}m `;
    res += `${s}s`;
    return res.trim();
  };

  return (
    <div className="flex flex-col h-full bg-zinc-50 dark:bg-black p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-black italic tracking-tighter uppercase">Timp de Așteptare</h2>
        
        {/* Filtre Perioadă */}
        <div className="flex gap-2 p-1.5 bg-zinc-200 dark:bg-zinc-900 rounded-2xl w-fit">
          {(["today", "week", "month"] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                period === p ? "bg-white dark:bg-zinc-700 shadow-md text-black dark:text-white" : "text-zinc-500 hover:text-black dark:hover:text-white"
              }`}
            >
              {p === "today" ? "Azi" : p === "week" ? "Săptămâna Asta" : "Această Lună"}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex-1 flex justify-center items-center">
          <div className="animate-spin w-8 h-8 rounded-full border-4 border-zinc-200 border-t-zinc-900 dark:border-zinc-800 dark:border-t-white" />
        </div>
      ) : !data ? (
        <div className="flex-1 flex justify-center items-center text-zinc-500 font-bold uppercase text-sm">Nu există date încă.</div>
      ) : (
        <div className="flex-1 flex flex-col gap-6 overflow-y-auto pr-2 pb-10">
          
          {/* Carduri Globale */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0 }} className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
              <p className="text-[10px] sm:text-xs font-black uppercase text-zinc-400 mb-2">Timp Mediu Servire Produs</p>
              <h3 className="text-3xl font-black text-blue-600 dark:text-blue-400">
                {formatSeconds(data.globalMins.avgProductSeconds)}
              </h3>
            </motion.div>
            
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
               <p className="text-[10px] sm:text-xs font-black uppercase text-zinc-400 mb-2">Maximum Așteptat la Produs</p>
               <h3 className="text-3xl font-black text-red-600 dark:text-red-400">
                 {formatSeconds(data.globalMins.maxWaitSeconds)}
               </h3>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
               <p className="text-[10px] sm:text-xs font-black uppercase text-zinc-400 mb-2">Timp Mediu Ședere (Per Masă)</p>
               <h3 className="text-3xl font-black text-zinc-900 dark:text-white">
                 {formatSeconds(data.globalMins.avgStaySeconds)}
               </h3>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
             {/* Cele mai lente produse */}
             <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
               <h3 className="text-sm font-black uppercase text-red-600 dark:text-red-400 mb-4 border-b border-red-100 dark:border-red-900/50 pb-3">
                 🔥 Cele Mai Lente Produse
               </h3>
               {data.slowestProducts?.length === 0 ? (
                 <p className="text-xs font-bold text-zinc-500">Momentan nu există date destule.</p>
               ) : (
                 <ul className="space-y-4">
                   {data.slowestProducts.map((p: any, idx: number) => (
                     <li key={idx} className="flex justify-between items-center group">
                       <span className="flex items-center gap-3 font-bold text-sm">
                         <span className="w-5 h-5 rounded-full bg-red-100 dark:bg-red-900/40 text-red-600 flex items-center justify-center text-[10px]">{idx+1}</span>
                         {p.name}
                       </span>
                       <div className="flex flex-col items-end">
                         <span className="text-red-600 font-black">{formatSeconds(p.avg_wait_seconds)}</span>
                         <span className="text-[9px] uppercase text-zinc-400 font-bold">{p.total_servings} serviri</span>
                       </div>
                     </li>
                   ))}
                 </ul>
               )}
             </div>

             {/* Cele mai rapide produse */}
             <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
               <h3 className="text-sm font-black uppercase text-green-600 dark:text-green-400 mb-4 border-b border-green-100 dark:border-green-900/50 pb-3">
                 ⚡️ Cele Mai Rapide Produse
               </h3>
               {data.fastestProducts?.length === 0 ? (
                 <p className="text-xs font-bold text-zinc-500">Momentan nu există date destule.</p>
               ) : (
                 <ul className="space-y-4">
                   {data.fastestProducts.map((p: any, idx: number) => (
                     <li key={idx} className="flex justify-between items-center group">
                       <span className="flex items-center gap-3 font-bold text-sm">
                         <span className="w-5 h-5 rounded-full bg-green-100 dark:bg-green-900/40 text-green-600 flex items-center justify-center text-[10px]">{idx+1}</span>
                         {p.name}
                       </span>
                       <div className="flex flex-col items-end">
                         <span className="text-green-600 font-black">{formatSeconds(p.avg_wait_seconds)}</span>
                         <span className="text-[9px] uppercase text-zinc-400 font-bold">{p.total_servings} serviri</span>
                       </div>
                     </li>
                   ))}
                 </ul>
               )}
             </div>
          </div>

          {/* Rush Hours */}
          <div className="mt-4 bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
             <h3 className="text-sm font-black uppercase text-zinc-800 dark:text-zinc-200 mb-6">
               🕒 Ore de Vârf (Comenzi Plasate)
             </h3>
             {data.rushHours?.length === 0 ? (
                <p className="text-xs font-bold text-zinc-500">Nu există activitate comercială înregistrată.</p>
             ) : (
                <div className="flex items-end gap-1 sm:gap-2 h-40 w-full overflow-x-auto pb-2 mt-4">
                  {(() => {
                    const maxOrders = Math.max(...data.rushHours.map((r: any) => parseInt(r.orders_count)), 1);
                    return Array.from({ length: 24 }, (_, i) => {
                      const existing = data.rushHours.find((r: any) => parseInt(r.hour) === i);
                      return {
                        hour: i,
                        orders_count: existing ? parseInt(existing.orders_count) : 0
                      };
                    }).map((rh: any, idx: number) => {
                      const heightPct = (rh.orders_count / maxOrders) * 100;
                      return (
                        <div key={idx} className="flex flex-col justify-end items-center gap-2 flex-1 min-w-[16px] sm:min-w-[20px] group" title={`${rh.orders_count} comenzi la ora ${rh.hour}:00`}>
                          <span className="text-[10px] font-black text-orange-500 opacity-0 group-hover:opacity-100 transition-opacity">
                            {rh.orders_count > 0 ? rh.orders_count : ""}
                          </span>
                          <div 
                             className={`w-full rounded-t-md transition-all ${rh.orders_count > 0 ? "bg-orange-500 dark:bg-orange-500" : "bg-zinc-100 dark:bg-zinc-800/50"}`} 
                             style={{ height: rh.orders_count > 0 ? `${Math.max(heightPct, 8)}%` : '4px' }}>
                          </div>
                          <span className="text-[9px] font-bold text-zinc-400">{String(rh.hour).padStart(2, '0')}</span>
                        </div>
                      )
                    });
                  })()}
                </div>
             )}
          </div>
          
        </div>
      )}
    </div>
  );
}