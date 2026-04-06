"use client";
import { useState, use, useEffect } from "react";
import { useRouter } from "next/navigation";

import { 
  DndContext, 
  closestCenter, 
  DragEndEvent,
  useSensor,       
  useSensors,      
  MouseSensor,     
  TouchSensor      
} from "@dnd-kit/core";

import { useDashboardSummary } from "@/shared/hooks/useDashboardSummary";
import { useBarData } from "@/shared/hooks/useBarData";
import { useAudioAlerts } from "@/shared/hooks/useAudioAlert";
import { dashboardService } from "@/shared/services/dashboardService";
import { useSocket } from "@/shared/hooks/useSocket"; 

import { DashboardHeader } from "./components/dashboardHeader";
import { TableCard } from "./components/tableCards"; 
import { StockSection } from "./components/stockSection";
import { MenuSection } from "./components/menuSection";
import { Sidebar } from "./components/Sidebar";
import { AnalyticsSection } from "./components/analyticsSection";

export default function BartenderDashboard({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"orders" | "stock" | "menu">("orders");
  const [mainView, setMainView] = useState<"workspace" | "analytics">("workspace");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
      }
    }
  }, [router]);

  const { barData, setBarData } = useBarData(slug);
  const { tableGroups, refresh } = useDashboardSummary(barData?.id || null);
  
  useSocket(refresh);
  const { isAudioEnabled, enableAudio } = useAudioAlerts(tableGroups);

  const sensors = useSensors(
    useSensor(MouseSensor, {
      // Pentru mouse pe laptop: trebuie să tragi de masa măcar 10px ca să se activeze
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(TouchSensor, {
      // Pentru tablete/telefoane: trebuie să ții apăsat 250ms ca să se prindă masa
      activationConstraint: {
        delay: 200,
        tolerance: 1, // Îi dă voie degetului să tremure 5px fără să anuleze acțiunea
      },
    })
  );

  // Handlere normale
  const handleComplete = async (id: string) => (await dashboardService.completeRequest(id)) && refresh();
  const handleServe = async (id: string) => (await dashboardService.serveItem(id)) && refresh();



  const handleClose = async (id: string, paymentMethod?: string) => {
    console.log("Table ID:", id);
    console.log("Payment Method:", paymentMethod);
  
    const tableGroup = tableGroups.find(g => g.table_id === id);
    const allRequests = [
      ...(tableGroup?.active_requests || []),
      ...(tableGroup?.requests || [])
    ];
  
    const lastBillRequest = allRequests.find((r: any) => r.type === "bill");
    let payment = paymentMethod || lastBillRequest?.payment_method;
  
    // Cerem metoda manual dacă nu a fost detectată din cereri
    if (!payment) {
      const userInput = prompt(
        "Închizi masa? Scrie metoda de plată: 'cash' sau 'card'",
        "cash"
      );
      if (userInput === null) return; // Userul a dat Cancel
      payment = userInput.toLowerCase().trim();
    }

    // Curățare finală a stringului ca să fim siguri
    if (payment === "cash" || payment === "card") {
      
      // OPTIMISTIC UPDATE: Închidem instant masa din UI pentru a dispărea de pe ecran fără delay
      // Asta șterge vizual masa până când vine refresh-ul real de la server
      const currentTableCard = document.getElementById(`table-card-${id}`);
      
      // Acum trimitem requestul către backend
      const success = await dashboardService.closeTable(id, payment);
      if (success) {
        refresh(); // Refresh final de la DB
      } else {
        // Dacă a picat serverul, arătăm la loc masa
        if (currentTableCard) currentTableCard.style.display = "block";
        alert("Eroare la închiderea mesei. Încearcă din nou.");
      }
    } else {
      alert("Metodă invalidă. Tastează 'cash' sau 'card'.");
    }
  };
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
    <div className="flex min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white transition-colors duration-500">
      <Sidebar mainView={mainView} setMainView={setMainView} />
      
      {/* Wrapper principal cu padding pentru mobile naavigation bottom si pt conținutul paginii */}
      <div className="flex-1 w-full p-4 pb-24 md:p-8 overflow-y-auto">
        {mainView === "workspace" ? (
          <>
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
              <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd} sensors={sensors}>
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
                        onClose={() => handleClose(group.table_id, group.requests?.find((r: any) => r.type === "bill")?.payment_method)}
                        onApprove={handleApprove}
                        onReject={handleReject}
                        
                      />
                    ))
                  )}
                </div>
              </DndContext>
            )}

            {activeTab === "stock" && <StockSection barData={barData} setBarData={setBarData} />}
            {activeTab === "menu" && <MenuSection categories={barData?.categories || []} refreshData={refresh} barId={barData?.id} />}
          </>
        ) : (
          <AnalyticsSection barId={barData.id} />
        )}
      </div>
    </div>
  );
}