"use client";

import { useEffect, useState } from "react";
import { dashboardService } from "@/shared/services/dashboardService";
import { motion } from "framer-motion";

interface AnalyticsSectionProps {
  barId: string;
}

export function AnalyticsSection({ barId }: AnalyticsSectionProps) {
  const [period, setPeriod] = useState<"today" | "week" | "month">("today");
  // Am actualizat tipul de date ca să includă zReport
  const [data, setData] = useState<{ summary: any; topProducts: any[]; zReport?: any[] } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!barId) return;
    
    let isMounted = true;
    const fetchData = async () => {
      setLoading(true);
      try {
        const result = await dashboardService.getAnalytics(barId, period);
        if (isMounted) setData(result);
      } catch (error) {
        console.error(error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    
    fetchData();
    return () => { isMounted = false; };
  }, [barId, period]);

  // Funcție ajutătoare pentru extragerea banilor pe cash/card
  const getZReportAmount = (method: string) => {
    if (!data?.zReport) return 0;
    const found = data.zReport.find(m => m.payment_method?.toLowerCase() === method);
    return found ? Number(found.amount) : 0;
  };

  return (
    <div className="animate-in fade-in duration-500 pb-24 md:pb-8 w-full max-w-7xl mx-auto">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-6 mb-10 border-b border-zinc-200 dark:border-zinc-800 pb-6">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tight text-zinc-900 dark:text-zinc-100 mb-2">
            Performanță & Analytics 📈
          </h1>
          <p className="text-sm font-bold text-zinc-500 uppercase tracking-widest">
            Aici vei găsi și alte informații de admin în viitor.
          </p>
        </div>
        
        {/* FILTRE PERIOADĂ */}
        <div className="flex bg-zinc-200 dark:bg-zinc-900 p-1 rounded-2xl w-full md:w-auto">
          {[
            { id: "today", label: "Azi" }, // Am schimbat label-ul pentru claritate
            { id: "week", label: "Săptămâna" },
            { id: "month", label: "Luna" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setPeriod(tab.id as any)}
              className={`flex-1 md:flex-none px-4 py-3 rounded-xl text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all ${
                period === tab.id
                  ? "bg-white dark:bg-zinc-800 text-orange-500 shadow-sm"
                  : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="h-64 flex items-center justify-center">
            <span className="font-black uppercase tracking-[0.5em] text-zinc-400 animate-pulse text-xs">Încărcare date...</span>
        </div>
      ) : (
        <div className="space-y-8">
            
            {/* 🔴 SECȚIUNEA RAPORT Z (Apare doar dacă suntem pe TODAY) */}
            {period === "today" && (
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                    className="bg-zinc-900 border-2 border-dashed border-zinc-700 rounded-3xl p-6 md:p-10 max-w-2xl mx-auto shadow-2xl relative overflow-hidden"
                >
                    <div className="absolute top-0 left-0 w-full h-2 bg-orange-500"></div>
                    
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-black uppercase tracking-widest text-white mb-1">Raport Z (Închidere)</h2>
                        <p className="text-zinc-500 font-mono text-sm">{new Date().toLocaleDateString('ro-RO')}</p>
                    </div>

                    <div className="space-y-4 font-mono text-sm text-zinc-300">
                        <div className="flex justify-between items-center border-b border-zinc-800 pb-4">
                            <span>TOTAL COMENZI ONORATE:</span>
                            <span className="font-bold text-white">{data?.summary?.total_orders || 0}</span>
                        </div>
                        <div className="flex justify-between items-center border-b border-zinc-800 pb-4">
                            <span>ÎNCASĂRI CASH:</span>
                            <span className="font-bold text-white">{getZReportAmount('cash').toFixed(2)} RON</span>
                        </div>
                        <div className="flex justify-between items-center border-b border-zinc-800 pb-4">
                            <span>ÎNCASĂRI CARD:</span>
                            <span className="font-bold text-white">{getZReportAmount('card').toFixed(2)} RON</span>
                        </div>
                        
                        <div className="flex justify-between items-center pt-4 text-xl text-orange-500 font-black">
                            <span>TOTAL VENIT ZILNIC:</span>
                            <span>{Number(data?.summary?.total_revenue || 0).toFixed(2)} RON</span>
                        </div>
                    </div>

                    <div className="mt-10 flex justify-center">
                        <button onClick={() => window.print()} className="bg-zinc-800 hover:bg-zinc-700 text-white px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-colors flex items-center gap-2">
                            🖨️ Printează Raportul
                        </button>
                    </div>
                </motion.div>
            )}

            {/* CARDS SUMAR CLASICE (Apar pe week/month) */}
            {period !== "today" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                        className="bg-white dark:bg-zinc-900 rounded-3xl p-6 shadow-sm border border-zinc-200 dark:border-white/5 flex flex-col justify-center items-center text-center h-40"
                    >
                        <span className="text-zinc-500 font-bold uppercase tracking-widest text-[10px] mb-2">Comenzi Onorate</span>
                        <span className="text-5xl font-black text-zinc-800 dark:text-zinc-100">
                            {data?.summary?.total_orders || 0}
                        </span>
                    </motion.div>

                    <motion.div 
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                        className="bg-orange-500 rounded-3xl p-6 shadow-lg shadow-orange-500/20 flex flex-col justify-center items-center text-center h-40 text-black"
                    >
                        <span className="font-bold uppercase tracking-widest text-[10px] mb-2 opacity-80">Total Venit (RON)</span>
                        <span className="text-5xl font-black">
                            {Number(data?.summary?.total_revenue || 0).toFixed(2)}
                        </span>
                    </motion.div>
                </div>
            )}

            {/* TABEL TOP PRODUSE (Apare mereu) */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                className="bg-white dark:bg-zinc-900 rounded-3xl p-6 shadow-sm border border-zinc-200 dark:border-white/5"
            >
                <h2 className="text-xl font-black uppercase tracking-widest text-zinc-400 mb-6 border-b border-zinc-200 dark:border-zinc-800 pb-4">
                    Top Cele Mai Vândute Produse
                </h2>
                
                {data?.topProducts && data.topProducts.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-zinc-200 dark:border-zinc-800 text-zinc-400 font-black uppercase text-[10px] tracking-widest">
                                    <th className="py-4 font-bold">Produs</th>
                                    <th className="py-4 font-bold text-center">Cantitate</th>
                                    <th className="py-4 font-bold text-right">Venit Generat (RON)</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm font-bold">
                                {data.topProducts.map((prod, index) => (
                                    <tr key={prod.id} className="border-b border-zinc-100 dark:border-zinc-800/50 hover:bg-zinc-50 dark:hover:bg-zinc-800/20 transition-colors">
                                        <td className="py-4 flex items-center gap-3">
                                            <span className="text-xs font-black text-zinc-400 w-4">{index + 1}.</span>
                                            <span className="dark:text-zinc-200">{prod.name}</span>
                                        </td>
                                        <td className="py-4 text-center">
                                            <span className="bg-zinc-100 dark:bg-zinc-800 px-3 py-1 text-xs rounded-xl inline-block min-w-10">
                                                {prod.total_quantity}
                                            </span>
                                        </td>
                                        <td className="py-4 text-right text-orange-500">
                                            {Number(prod.total_revenue).toFixed(2)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="py-12 text-center text-zinc-500 font-bold text-sm uppercase tracking-widest">
                        Nicio vânzare în această perioadă.
                    </div>
                )}
            </motion.div>
        </div>
      )}
    </div>
  );
}