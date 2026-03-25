// /**
//  * BARTENDER DASHBOARD
//  * - Afișează mesele active, comenzile în așteptare și stocul de produse.
//  * - Permite barmanului să marcheze comenzile ca servite și să închidă mesele.
//  * - Actualizare live prin polling și notificări sonore pentru comenzi noi.
//  * - Design modern, curat, ușor de folosit pe orice device.
//  * - Se integrează cu backend-ul existent pentru date și acțiuni.
//  * - Tehnologii: React, Next.js, Tailwind CSS, Web APIs (Fetch, Audio).
//  * - Focus pe UX pentru a face munca barmanului cât mai eficientă și plăcută.
//  * - NOTĂ: Acest cod este un punct de plecare și poate fi extins cu funcționalități suplimentare precum autentificare, managementul utilizatorilor, rapoarte de vânzări etc.
//  * TODO:
//  * - SRP: Împărțirea în componente mai mici (ex: TableCard, StockItem) pentru o mai bună organizare și reutilizare.
//  * - Adăugare autentificare pentru barmani (ex: JWT, NextAuth).
//  * - Extindere funcționalități: adăugare/ștergere produse, modificare prețuri, rapoarte.
//  * - Optimizare performanță: WebSockets în loc de polling, caching local.
//  * - Testare și feedback de la utilizatori reali pentru îmbunătățiri UX.
//  * - Schimb din localhost intr-un mediu de producție (ex: Vercel, AWS) și configurare corespunzătoare a backend-ului pentru CORS și securitate.
//  * - Posibilă integrare cu sisteme POS existente sau aplicații mobile pentru barmani.
//  * - Design responsive și accesibil pentru a fi folosit pe tablete sau telefoane în bar.
//  * - Implementare efecte vizuale pentru a atrage atentia personalului asupra comenzilor noi sau urgente (ex: animații, schimbare culori).
//  */

// // "use client";
// // import { useRef, useEffect, useState, use } from "react";
// // import { ThemeToggle } from "@/components/ThemeToggle";
// // import { useDashboardSummary } from "@/shared/hooks/useDashboardSummary";
// // import { useBarData } from "@/shared/hooks/useBarData"; 


// "use client";
// import { useState, use } from "react";
// import { ThemeToggle } from "@/components/ThemeToggle";
// import { useDashboardSummary } from "@/shared/hooks/useDashboardSummary";
// import { useBarData } from "@/shared/hooks/useBarData";
// import { useAudioAlerts } from "@/shared/hooks/useAudioAlert"; // Hook-ul nou
// import { dashboardService } from "@/shared/services/dashboardService"; // Service-ul nou
// import { stockService } from "@/shared/services/stockService"; // Service-ul nou


// export default function BartenderDashboard({ params }: { params: Promise<{ slug: string }> }) {
//   const { slug } = use(params);
//   const [activeTab, setActiveTab] = useState<"orders" | "stock">("orders");

//   // 1. DATE & POLLING (Gestionate de hook-uri)
//   const { barData, setBarData } = useBarData(slug); 
//   const { tableGroups, refresh } = useDashboardSummary(barData?.id || null);

//   // 2. AUDIO (Gestionat de hook-ul useAudioAlerts)
//   const { isAudioEnabled, enableAudio } = useAudioAlerts(tableGroups);

//   // 3. ACȚIUNI (Folosesc serviciile și dau refresh)
//   const handleCompleteRequest = async (id: string) => {
//     const success = await dashboardService.completeRequest(id); // Marchez și cererea ca completă
//     if (success) refresh();
//     else alert("Eroare la  finalizarea cererii.");
//   };

//   const handleServeItem = async (id: string) => {
//     const success = await dashboardService.serveItem(id); // Marchez și cererea ca completă
//     if (success) refresh();
//     else alert("Eroare la servirea produsului.");
//   };

//   const handleCloseTable = async (id: string) => {
//     if (!confirm("Sigur închizi masa?")) return;
//     const ok = await dashboardService.closeTable(id);
//     if (ok) refresh();
//   };
  
//   const handleToggleStock = async (prodId: string, currentStatus: boolean) => {
//     const updatedProd = await stockService.toggleStock(prodId, !currentStatus);
//     if (updatedProd) {
//       // Update local la starea barData (opțional, dacă vrei update instant în UI)
//       setBarData((prev: any) => ({
//         ...prev,
//         categories: prev.categories.map((cat: any) => ({
//           ...cat,
//           products: cat.products.map((p: any) =>
//             p.id === prodId ? { ...p, is_available: !currentStatus } : p
//           ),
//         })),
//       }));
//     }
//   };


//   if (!barData)
//     return (
//       <div className="min-h-screen bg-black flex items-center justify-center text-white font-black animate-pulse">
//         CONECTARE...
//       </div>
//     );
// // Dacă datele barului nu sunt încă încărcate, afișăm un ecran de încărcare simplu. Odată ce datele sunt disponibile, se va afișa dashboard-ul complet cu toate funcționalitățile.
//   return (
//     <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white p-4 md:p-8 transition-colors duration-300">
//       {/* HEADER */}
//       <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
//         <div>
//           <h1 className="text-4xl font-black uppercase tracking-tighter leading-none">
//             {barData.name}
//           </h1>
//           <p className="text-[10px] text-zinc-500 uppercase font-black tracking-widest mt-2 flex items-center gap-2">
//             <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>{" "}
//             Dashboard Live
//           </p>
//         </div>
//         {!isAudioEnabled && (
//           <div className="fixed inset-0 z-100 bg-black/60 backdrop-blur-md flex items-center justify-center">
//             <button
//               onClick={enableAudio}
//               className="bg-orange-500 hover:bg-orange-600 text-black font-black px-10 py-5 rounded-4xl text-xl shadow-2xl animate-bounce"
//             >
//               🚀 ACTIVEAZĂ ALERTELE SONORE
//             </button>
//           </div>
//         )}
//         <div className="flex items-center gap-4 w-full md:w-auto">
//           <ThemeToggle />
//           <div className="flex flex-1 md:flex-none gap-1 bg-zinc-200 dark:bg-black/50 p-1.5 rounded-2xl border border-zinc-300 dark:border-white/5">
//             <button
//               onClick={() => setActiveTab("orders")}
//               className={`flex-1 md:flex-none px-6 py-2 rounded-xl font-black text-[10px] uppercase transition-all ${
//                 activeTab === "orders"
//                   ? "bg-white dark:bg-zinc-800 shadow-lg"
//                   : "text-zinc-500"
//               }`}
//             >
//               Mese ({tableGroups.length})
//             </button>
//             <button
//               onClick={() => setActiveTab("stock")}
//               className={`flex-1 md:flex-none px-6 py-2 rounded-xl font-black text-[10px] uppercase transition-all ${
//                 activeTab === "stock"
//                   ? "bg-white dark:bg-zinc-800 shadow-lg"
//                   : "text-zinc-500"
//               }`}
//             >
//               Stoc
//             </button>
//           </div>
//         </div>
//       </header>
//       {/* SECȚIUNEA DE COMENZI ACTIVE */}
//       {activeTab === "orders" ? (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {tableGroups.length === 0 ? (
//             <div className="col-span-full py-32 text-center border-2 border-dashed border-zinc-200 dark:border-zinc-900 rounded-[3rem]">
//               <p className="text-zinc-400 font-black uppercase tracking-widest text-sm italic">
//                 Nicio masă activă
//               </p>
//             </div>
//           ) : (
//             tableGroups.map((group) => (
//               <div
//                 key={group.table_id}
//                 className={`bg-white dark:bg-zinc-900 rounded-[2.5rem] p-7 border-t-8 shadow-2xl flex flex-col transition-all duration-500 ${
//                   group.active_requests?.some((r: any) => r.type === "bill")
//                     ? "border-red-600"
//                     : group.pending_items?.length > 0
//                     ? "border-orange-500"
//                     : "border-zinc-200 dark:border-zinc-800 opacity-90"
//                 }`}
//               >
//                 {/* CARD HEADER */}
//                 <div className="flex justify-between items-start mb-6">
//                   <div>
//                     <h3 className="text-4xl font-black italic tracking-tighter uppercase leading-none">
//                       Masa {group.table_number}
//                     </h3>
//                     <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-2">
//                       Total:{" "}
//                       <span className="text-zinc-900 dark:text-white font-black">
//                         {Number(group.total_to_pay || 0).toFixed(2)} RON
//                       </span>
//                     </p>
//                   </div>
//                   {group.pending_items?.length > 0 && (
//                     <span className="bg-orange-500 text-white text-[8px] font-black px-2 py-1 rounded-lg uppercase animate-pulse">
//                       {group.pending_items.length} noi
//                     </span>
//                   )}
//                 </div>

//                 {/* 🛎️ ALERTE SERVICII */}
//                 {group.active_requests?.length > 0 && (
//                   <div className="mb-6 space-y-2">
//                     {group.active_requests.map((req: any) => (
//                       <div
//                         key={req.id}
//                         className={`p-4 rounded-2xl flex justify-between items-center animate-in zoom-in duration-300 ${
//                           req.type === "bill"
//                             ? "bg-red-600 text-white shadow-lg"
//                             : "bg-orange-500 text-white shadow-lg"
//                         }`}
//                       >
//                         <div className="flex items-center gap-3">
//                           <span className="text-xl">
//                             {req.type === "bill" ? "🧾" : "🛎️"}
//                           </span>
//                           <div>
//                             <p className="text-[10px] font-black uppercase leading-none">
//                               {req.type === "bill"
//                                 ? `NOTĂ (${req.method?.toUpperCase() || "?"})`
//                                 : "CHELNER"}
//                             </p>
//                             <p className="text-[7px] font-bold opacity-70 uppercase mt-1">
//                               Acum
//                             </p>
//                           </div>
//                         </div>
//                         <button
//                           onClick={() => handleCompleteRequest(req.id)}
//                           className="bg-white/20 hover:bg-white/40 px-3 py-1.5 rounded-lg text-[9px] font-black uppercase transition-all"
//                         >
//                           OK
//                         </button>
//                       </div>
//                     ))}
//                   </div>
//                 )}

//                 {/* LISTĂ PRODUSE PENDING */}
//                 <div className="flex-1 space-y-3 mb-8">
//                   {group.pending_items?.length > 0 ? (
//                     group.pending_items.map((item: any) => (
//                       <div
//                         key={item.item_id}
//                         className="flex justify-between items-center bg-zinc-100 dark:bg-black/40 p-4 rounded-2xl border border-zinc-200 dark:border-white/5"
//                       >
//                         <span className="font-black text-sm uppercase tracking-tight">
//                           {item.qty}x {item.name}
//                         </span>
//                         <button
//                           onClick={() => handleServeItem(item.item_id)}
//                           className="bg-green-600 hover:bg-green-500 text-white w-10 h-10 flex items-center justify-center rounded-xl transition-all shadow-lg"
//                         >
//                           ✓
//                         </button>
//                       </div>
//                     ))
//                   ) : (
//                     <div className="py-6 text-center bg-zinc-50 dark:bg-white/5 rounded-2xl border border-dashed border-zinc-200 dark:border-white/10">
//                       <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest italic">
//                         Complet servit ✅
//                       </p>
//                     </div>
//                   )}
//                 </div>

//                 <button
//                   onClick={() => handleCloseTable(group.table_id)}
//                   className={`w-full p-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${
//                     group.pending_items?.length === 0
//                       ? "bg-zinc-900 dark:bg-white text-white dark:text-black hover:scale-[1.02]"
//                       : "bg-zinc-200 dark:bg-zinc-800 text-zinc-400 cursor-not-allowed"
//                   }`}
//                   disabled={group.pending_items?.length > 0}
//                 >
//                   Închide Nota & Eliberează
//                 </button>
//               </div>
//             ))
//           )}
//         </div>
//       ) : (
//         /* SECȚIUNEA DE STOC */
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in duration-500">
//           {barData.categories?.map((cat: any) => (
//             <div
//               key={cat.id}
//               className="bg-white dark:bg-zinc-900/50 rounded-[2.5rem] p-6 border border-zinc-200 dark:border-white/5"
//             >
//               <h3 className="text-[10px] font-black uppercase text-zinc-500 tracking-[0.2em] mb-6 pl-2 border-l-2 border-orange-500">
//                 {cat.name}
//               </h3>
//               <div className="space-y-3">
//                 {cat.products?.map((prod: any) => (
//                   <div
//                     key={prod.id}
//                     className={`flex justify-between items-center p-4 rounded-2xl border transition-all ${
//                       prod.is_available
//                         ? "bg-zinc-50 dark:bg-black/40 border-zinc-100 dark:border-white/5"
//                         : "bg-red-500/5 border-red-500/20 opacity-60"
//                     }`}
//                   >
//                     <div>
//                       <p
//                         className={`font-bold text-sm uppercase ${
//                           !prod.is_available ? "text-zinc-400 line-through" : ""
//                         }`}
//                       >
//                         {prod.name}
//                       </p>
//                       <p className="text-[10px] text-zinc-500 font-mono italic">
//                         {Number(prod.price).toFixed(2)} RON
//                       </p>
//                     </div>
//                     <button
//                       onClick={() => handleToggleStock(prod.id, prod.is_available)}
//                       className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
//                         prod.is_available
//                           ? "bg-green-600 text-white shadow-lg"
//                           : "bg-zinc-200 dark:bg-zinc-800 text-red-500"
//                       }`}
//                     >
//                       {prod.is_available ? "În Stoc" : "Epuizat"}
//                     </button>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }
"use client";
import { useState, use } from "react";
import { useDashboardSummary } from "@/shared/hooks/useDashboardSummary";
import { useBarData } from "@/shared/hooks/useBarData";
import { useAudioAlerts } from "@/shared/hooks/useAudioAlert";
import { dashboardService } from "@/shared/services/dashboardService";
import { stockService } from "@/shared/services/stockService";

// ✅ Importăm piesele noi
import { DashboardHeader } from "./components/dashboardHeader";
import { TableCard } from "./components/tableCards";
import { StockSection } from "./components/stockSection"; // Presupunem că ai extras și stocul asemănător

export default function BartenderDashboard({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [activeTab, setActiveTab] = useState<"orders" | "stock">("orders");

  const { barData, setBarData } = useBarData(slug);
  const { tableGroups, refresh } = useDashboardSummary(barData?.id || null);
  const { isAudioEnabled, enableAudio } = useAudioAlerts(tableGroups);

  // Handlere (Puntea între UI și Service)
  const handleComplete = async (id: string) => (await dashboardService.completeRequest(id)) && refresh();
  const handleServe = async (id: string) => (await dashboardService.serveItem(id)) && refresh();
  const handleClose = async (id: string) => confirm("Închizi masa?") && (await dashboardService.closeTable(id)) && refresh();

  if (!barData) return <div className="min-h-screen bg-black flex items-center justify-center text-white font-black animate-pulse">CONECTARE...</div>;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white p-4 md:p-8">
      
      <DashboardHeader 
        barName={barData.name} 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        tableCount={tableGroups.length}
        isAudioEnabled={isAudioEnabled}
        onEnableAudio={enableAudio}
      />

      {activeTab === "orders" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tableGroups.length === 0 ? (
            <div className="col-span-full py-32 text-center border-2 border-dashed border-zinc-200 dark:border-zinc-900 rounded-[3rem]">
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