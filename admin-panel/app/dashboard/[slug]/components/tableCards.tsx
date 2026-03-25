// components/TableCard.tsx

export function TableCard({ 
  group, 
  onComplete, 
  onServe, 
  onClose, 
  onApprove, // Funcție nouă pentru acceptarea primei comenzi/mese
  onReject   // Funcție nouă pentru respingere prank
}: any) {
  // Stări de prioritate pentru culori
  const isPendingApproval = group.status === "pending_approval";
  const isUrgent = group.active_requests?.some((r: any) => r.type === "bill");
  const hasOrders = group.pending_items?.length > 0;

  // Alegem culoarea bordurii în funcție de gravitate
  const getBorderColor = () => {
    if (isPendingApproval) return "border-yellow-400 shadow-[0_0_40px_rgba(250,204,21,0.3)] animate-pulse";
    if (isUrgent) return "border-red-600";
    if (hasOrders) return "border-orange-500";
    return "border-zinc-200 dark:border-zinc-800 opacity-90";
  };

  return (
    <div className={`bg-white dark:bg-zinc-900 rounded-[2.5rem] p-7 border-t-8 shadow-2xl flex flex-col transition-all duration-500 ${getBorderColor()}`}>
      
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-4xl font-black italic tracking-tighter uppercase leading-none">Masa {group.table_number}</h3>
          <p className="text-[10px] font-bold text-zinc-500 uppercase mt-2">
            Total acumulat: <span className="text-zinc-900 dark:text-white font-black">{Number(group.total_to_pay || 0).toFixed(2)} RON</span>
          </p>
        </div>
        {isPendingApproval && (
          <span className="bg-yellow-400 text-black text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-tighter">
            Așteaptă Aprobare
          </span>
        )}
      </div>

      {/* SECȚIUNE APROBARE (Prank-Proof) */}
      {isPendingApproval && (
        <div className="mb-8 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-3xl border border-yellow-200 dark:border-yellow-900/50">
          <p className="text-[10px] font-black text-yellow-700 dark:text-yellow-400 uppercase mb-3 text-center">
            ⚠️ Cineva vrea să deschidă masa!
          </p>
          <div className="flex gap-2">
            <button 
              onClick={() => onApprove(group.table_id)} 
              className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-black py-4 rounded-2xl font-black uppercase text-[10px] transition-all active:scale-95"
            >
              ✅ Deschide Masa
            </button>
            <button 
              onClick={() => onReject(group.table_id)} 
              className="px-5 bg-zinc-200 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 py-4 rounded-2xl font-black hover:bg-red-100 hover:text-red-600 transition-all"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* ALERTE (Chelner/Notă) */}
      <div className="space-y-2 mb-6">
        {group.active_requests?.map((req: any) => (
          <div key={req.id} className={`p-4 rounded-2xl flex justify-between items-center ${req.type === 'bill' ? 'bg-red-600' : 'bg-orange-500'} text-white shadow-lg`}>
            <span className="font-black text-[10px] uppercase">{req.type === 'bill' ? '🧾 NOTĂ' : '🛎️ CHELNER'}</span>
            <button onClick={() => onComplete(req.id)} className="bg-white/20 hover:bg-white/40 px-3 py-1.5 rounded-lg text-[9px] font-black uppercase transition-colors">OK</button>
          </div>
        ))}
      </div>

      {/* PRODUSE DE SERVIT */}
      <div className="flex-1 space-y-3 mb-8">
        <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest ml-2">Comenzi active</p>
        {hasOrders ? group.pending_items.map((item: any) => (
          <div key={item.item_id} className="flex justify-between items-center bg-zinc-100 dark:bg-black/40 p-4 rounded-2xl border border-zinc-200 dark:border-white/5 group hover:border-orange-500/50 transition-colors">
            <span className="font-black text-sm uppercase">{item.qty}x {item.name}</span>
            <button 
              onClick={() => onServe(item.item_id)} 
              className="bg-green-600 hover:bg-green-500 text-white w-10 h-10 flex items-center justify-center rounded-xl shadow-lg transition-transform active:scale-90"
            >
              ✓
            </button>
          </div>
        )) : (
          <div className="py-8 text-center bg-zinc-50 dark:bg-white/5 rounded-4xl border-2 border-dashed border-zinc-200 dark:border-zinc-800 text-zinc-400 font-bold uppercase text-[9px] italic">
            Toate produsele sunt la client ✅
          </div>
        )}
      </div>

      {/* BUTON ÎNCHIDERE NOTĂ */}
      <button 
        onClick={() => onClose(group.table_id)} 
        disabled={hasOrders || isPendingApproval} 
        className={`w-full p-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all 
          ${(!hasOrders && !isPendingApproval) 
            ? "bg-zinc-950 dark:bg-white text-white dark:text-black hover:scale-[1.02] active:scale-95 shadow-xl" 
            : "bg-zinc-100 dark:bg-zinc-800 text-zinc-400 cursor-not-allowed opacity-50"}`}
      >
        Închide & Eliberează Masa
      </button>
    </div>
    
  );
}