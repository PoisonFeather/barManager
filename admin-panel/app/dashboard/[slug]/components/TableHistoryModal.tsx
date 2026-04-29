import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { dashboardService } from "@/shared/services/dashboardService";

interface Props {
  tableId: string;
  tableNumber: number;
  onClose: () => void;
  onUpdate: () => void; // To refresh dashboard when history changes
}

export function TableHistoryModal({ tableId, tableNumber, onClose, onUpdate }: Props) {
  const [history, setHistory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchHistory = async () => {
    try {
      const data = await dashboardService.getTableHistory(tableId);
      setHistory(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [tableId]);

  const handleDelete = async (itemId: string) => {
    if (confirm("Sigur ștergi acest produs de pe notă? Această acțiune este ireversibilă.")) {
      await dashboardService.deleteOrderItem(itemId);
      await fetchHistory();
      onUpdate();
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative bg-white dark:bg-zinc-900 w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
      >
        <div className="p-6 border-b border-zinc-100 dark:border-white/5 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-black uppercase tracking-widest">Istoric Masa {tableNumber}</h2>
            <p className="text-xs text-zinc-500 font-bold uppercase mt-1">Editează nota (șterge produse)</p>
          </div>
          <button onClick={onClose} className="w-10 h-10 bg-zinc-100 dark:bg-zinc-800 rounded-full font-black flex items-center justify-center hover:bg-red-100 hover:text-red-600 transition-colors">
            ✕
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {isLoading ? (
            <p className="text-center text-zinc-500 font-bold uppercase text-xs animate-pulse py-10">Se încarcă...</p>
          ) : history.length === 0 ? (
            <p className="text-center text-zinc-500 font-bold uppercase text-xs py-10">Niciun produs pe notă.</p>
          ) : (
            history.map((item) => (
              <div key={item.item_id} className="flex justify-between items-center bg-zinc-50 dark:bg-white/5 p-4 rounded-2xl border border-zinc-100 dark:border-white/5">
                <div className="flex-1">
                   <div className="flex items-center gap-2">
                     <span className="font-black text-sm uppercase">{item.quantity}x {item.name}</span>
                     {item.placed_by_staff && <span className="bg-amber-100 text-amber-700 text-[9px] px-1.5 py-0.5 rounded font-black uppercase">Bar/Chelner</span>}
                   </div>
                   {item.notes && <p className="text-[10px] text-orange-500 italic mt-0.5">* {item.notes}</p>}
                   <p className="text-xs font-bold text-zinc-400 mt-1">{(item.quantity * item.price).toFixed(2)} RON</p>
                </div>
                <button 
                  onClick={() => handleDelete(item.item_id)}
                  className="w-10 h-10 bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 rounded-xl font-black flex items-center justify-center hover:bg-red-600 hover:text-white transition-colors"
                  title="Șterge produs"
                >
                  🗑️
                </button>
              </div>
            ))
          )}
        </div>
      </motion.div>
    </div>
  );
}
