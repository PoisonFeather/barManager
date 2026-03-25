"use client";
import { useState, use, useCallback } from "react"; // Adăugăm useCallback pentru siguranță
import { useDashboardSummary } from "@/shared/hooks/useDashboardSummary";
import { useBarData } from "@/shared/hooks/useBarData";
import { useAudioAlerts } from "@/shared/hooks/useAudioAlert";
import { dashboardService } from "@/shared/services/dashboardService";
import { useSocket } from "@/shared/hooks/useSocket"; 

// Componente UI
import { DashboardHeader } from "./components/dashboardHeader";
import { TableCard } from "./components/tableCards";
import { StockSection } from "./components/stockSection";

export default function BartenderDashboard({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [activeTab, setActiveTab] = useState<"orders" | "stock">("orders");

  const { barData, setBarData } = useBarData(slug);
  
  // 1. Luăm datele și funcția de refresh
  const { tableGroups, refresh } = useDashboardSummary(barData?.id || null);
  //"Date primite în Dashboard:", JSON.stringify(tableGroups, null, 2));
  // 2. 🔥 CONECTAREA LIVE:
  // De fiecare dată când Socket-ul primește semnalul 'new-data' din backend,
  // va executa automat funcția refresh(). Fără refresh manual, fără polling!
  useSocket(refresh);

  const { isAudioEnabled, enableAudio } = useAudioAlerts(tableGroups);

  // Handlere
  const handleComplete = async (id: string) => (await dashboardService.completeRequest(id)) && refresh();
  const handleServe = async (id: string) => (await dashboardService.serveItem(id)) && refresh();
  const handleClose = async (id: string) => confirm("Închizi masa?") && (await dashboardService.closeTable(id)) && refresh();
  const handleApprove = async (tableId: string) => {
    // Chemăm serviciul să deschidă masa și să confirme comanda
    const ok = await dashboardService.approveTable(tableId);
    if (ok) {
      refresh(); // Refresh la date ca să dispară zona galbenă
    }
  };
  
  const handleReject = async (tableId: string) => {
    if (confirm("Sigur anulezi cererea? Comanda va fi ștearsă.")) {
      const ok = await dashboardService.rejectTable(tableId);
      if (ok) refresh();
    }
  };

  if (!barData) return <div className="min-h-screen bg-black flex items-center justify-center text-white font-black animate-pulse uppercase tracking-[0.5em]">Conectare...</div>;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white p-4 md:p-8 transition-colors duration-500">
      <DashboardHeader 
        barName={barData.name} 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        tableCount={tableGroups.length}
        isAudioEnabled={isAudioEnabled}
        onEnableAudio={enableAudio}
      />

      {activeTab === "orders" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-700">
          {tableGroups.length === 0 ? (
            <div className="col-span-full py-32 text-center border-2 border-dashed border-zinc-200 dark:border-zinc-900 rounded-[4rem]">
              <p className="text-zinc-400 font-black uppercase tracking-widest text-sm italic">Nicio masă activă</p>
            </div>
          ) : (
            tableGroups.map(group => (
              <TableCard 
                key={group.table_id} 
                group={group} 
                onComplete={handleComplete} 
                onServe={handleServe} 
                onClose={handleClose} 
                onApprove={handleApprove}
                onReject={handleReject}
              />
            ))
          )}
        </div>
      ) : (
        <StockSection barData={barData} setBarData={setBarData} />
      )}
    </div>
  );
}