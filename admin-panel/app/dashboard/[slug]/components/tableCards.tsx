
export function TableCard({ group, onComplete, onServe, onClose }: any) {
    const isUrgent = group.active_requests?.some((r: any) => r.type === "bill");
    const hasOrders = group.pending_items?.length > 0;
  
    return (
      <div className={`bg-white dark:bg-zinc-900 rounded-[2.5rem] p-7 border-t-8 shadow-2xl flex flex-col transition-all duration-500 
        ${isUrgent ? "border-red-600" : hasOrders ? "border-orange-500" : "border-zinc-200 dark:border-zinc-800 opacity-90"}`}>
        
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-4xl font-black italic tracking-tighter uppercase leading-none">Masa {group.table_number}</h3>
            <p className="text-[10px] font-bold text-zinc-500 uppercase mt-2">
              Total: <span className="text-zinc-900 dark:text-white font-black">{Number(group.total_to_pay || 0).toFixed(2)} RON</span>
            </p>
          </div>
        </div>
  
        {/* Alerte (Chelner/Notă) */}
        <div className="space-y-2 mb-6">
          {group.active_requests?.map((req: any) => (
            <div key={req.id} className={`p-4 rounded-2xl flex justify-between items-center ${req.type === 'bill' ? 'bg-red-600' : 'bg-orange-500'} text-white`}>
              <span className="font-black text-[10px] uppercase">{req.type === 'bill' ? '🧾 NOTĂ' : '🛎️ CHELNER'}</span>
              <button onClick={() => onComplete(req.id)} className="bg-white/20 px-3 py-1.5 rounded-lg text-[9px] font-black uppercase">OK</button>
            </div>
          ))}
        </div>
  
        {/* Produse de servit */}
        <div className="flex-1 space-y-3 mb-8">
          {hasOrders ? group.pending_items.map((item: any) => (
            <div key={item.item_id} className="flex justify-between items-center bg-zinc-100 dark:bg-black/40 p-4 rounded-2xl border border-zinc-200 dark:border-white/5">
              <span className="font-black text-sm uppercase">{item.qty}x {item.name}</span>
              <button onClick={() => onServe(item.item_id)} className="bg-green-600 text-white w-10 h-10 flex items-center justify-center rounded-xl shadow-lg">✓</button>
            </div>
          )) : (
            <div className="py-6 text-center bg-zinc-50 dark:bg-white/5 rounded-2xl border border-dashed border-zinc-200 dark:border-white/10 text-zinc-400 font-bold uppercase text-[10px]">Complet servit ✅</div>
          )}
        </div>
  
        <button onClick={() => onClose(group.table_id)} disabled={hasOrders} className={`w-full p-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${!hasOrders ? "bg-zinc-900 dark:bg-white text-white dark:text-black" : "bg-zinc-200 dark:bg-zinc-800 text-zinc-400 cursor-not-allowed"}`}>
          Închide Nota
        </button>
      </div>
    );
  }