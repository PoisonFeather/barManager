"use client";
import { useState, use } from "react";

import { DndContext, closestCenter, DragEndEvent } from "@dnd-kit/core"; 

import { useDashboardSummary } from "@/shared/hooks/useDashboardSummary";
import { useBarData } from "@/shared/hooks/useBarData";
import { useAudioAlerts } from "@/shared/hooks/useAudioAlert";
import { dashboardService } from "@/shared/services/dashboardService";
import { useSocket } from "@/shared/hooks/useSocket"; 

import { DashboardHeader } from "./components/dashboardHeader";
import { TableCard } from "./components/tableCards"; 
import { StockSection } from "./components/stockSection";
import { MenuSection } from "./components/menuSection";

export default function BartenderDashboard({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [activeTab, setActiveTab] = useState<"orders" | "stock" | "menu">("orders");

  const { barData, setBarData } = useBarData(slug);
  const { tableGroups, refresh } = useDashboardSummary(barData?.id || null);
  
  useSocket(refresh);
  const { isAudioEnabled, enableAudio } = useAudioAlerts(tableGroups);

  // Handlere normale
  const handleComplete = async (id: string) => (await dashboardService.completeRequest(id)) && refresh();
  const handleServe = async (id: string) => (await dashboardService.serveItem(id)) && refresh();
  const handleClose = async (id: string) => confirm("Închizi masa?") && (await dashboardService.closeTable(id)) && refresh();
  const handleApprove = async (tableId: string) => {
    if (await dashboardService.approveTable(tableId)) refresh();
  };
  const handleReject = async (tableId: string) => {
    if (confirm("Sigur anulezi cererea? Comanda va fi ștearsă.")) {
      if (await dashboardService.rejectTable(tableId)) refresh();
    }
  };

  // 2. LOGICA PENTRU DRAG & DROP
  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    // Dacă ai lăsat masa peste o ALTĂ masă
    if (over && active.id !== over.id) {
      const sourceId = active.id as string;
      const targetId = over.id as string;

      // Opțional: Poți căuta numerele meselor în tableGroups ca să pui un Confirm mai prietenos (ex: "Unești Masa 5 cu 1?")
      if (confirm(`Ești sigur că vrei să unești aceste mese? Comanda mesei trase se va muta pe masa destinație.`)) {
        // Aici chemăm endpoint-ul nou pe care l-am făcut în backend!
        await dashboardService.mergeTables({ sourceId, targetId,
          bar_id : barData?.id || ""
         });
        refresh();
      }
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

      {/* 3. ÎNVELIM GRID-UL ÎN DndContext */}
      {activeTab === "orders" && (
        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
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
        </DndContext>
      )}

      {activeTab === "stock" && <StockSection barData={barData} setBarData={setBarData} />}
      {activeTab === "menu" && <MenuSection categories={barData?.categories || []} refreshData={refresh} />}
    </div>
  );
}