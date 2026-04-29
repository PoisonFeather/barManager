// app/menu/[slug]/components/CartModal.tsx
import { motion, useDragControls } from "framer-motion";

interface Props {
  cart: any[];
  history: any[];
  myShare: any[];
  onUpdate: (id: string, delta: number) => void;
  onSend: () => void;
  onClose: () => void;
  primaryColor: string;
  totalAmount: number;
  historyTotal: number;
}

export function CartModal({ cart, history, myShare, onUpdate, onSend, onClose, primaryColor, totalAmount, historyTotal }: Props) {
  const dragControls = useDragControls();
  const myShareTotal = myShare.reduce((sum, o) => sum + (Number(o.price) * o.quantity), 0);
  // Secțiunea "Contribuția Ta" apare DOAR dacă:
  // 1. Avem produse personale (myShare non-gol)
  // 2. Totalul personal diferă de totalul mesei (există alți oameni la masă)
  const isSharedTable = myShare.length > 0 && Math.abs(myShareTotal - historyTotal) > 0.001;

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end">
      {/* Overlay */}
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }}
        onClick={onClose} 
        className="absolute inset-0 bg-black/40 backdrop-blur-md"
      />
      
      <motion.div 
        drag="y"
        dragControls={dragControls}
        dragListener={false}
        dragConstraints={{ top: 0 }}
        dragElastic={0.2}
        onDragEnd={(e, info) => {
          if (info.offset.y > 100 || info.velocity.y > 500) {
            onClose();
          }
        }}
        initial={{ y: "100%" }} 
        animate={{ y: 0 }} 
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="relative bg-white dark:bg-zinc-900 w-full max-h-[85vh] rounded-t-[3rem] shadow-2xl flex flex-col overflow-hidden"
      >
        <div 
          className="w-full pt-6 pb-4 flex justify-center shrink-0 cursor-grab active:cursor-grabbing"
          onPointerDown={(e) => dragControls.start(e)}
          style={{ touchAction: "none" }}
        >
          <div className="w-12 h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-full" />
        </div>
        
        <div className="flex-1 overflow-y-auto px-8 pb-10 space-y-8">
          <div className="flex justify-between items-end">
            <h2 className="text-3xl font-black uppercase tracking-tighter">Nota Ta</h2>
            <button onClick={onClose} className="text-[10px] font-black uppercase text-zinc-400">Închide</button>
          </div>

          {/* Produse noi în coș (neprimite încă) */}
          {cart.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-zinc-400 text-[10px] font-black uppercase tracking-widest">De Comandat</h3>
              {cart.map((item) => (
                <div key={item.cartItemId || item.id} className="flex justify-between items-center bg-zinc-50 dark:bg-white/5 p-5 rounded-4xl border border-zinc-100 dark:border-white/5">
                  <div className="flex-1">
                    <p className="font-black uppercase text-sm">{item.name}</p>
                    {item.notes && (
                      <p className="text-xs text-orange-500 font-bold italic line-clamp-1 mb-1">
                        * {item.notes}
                      </p>
                    )}
                    <p className="text-[10px] font-bold text-zinc-500">{(item.price * item.quantity).toFixed(2)} RON</p>
                  </div>
                  <div className="flex items-center gap-4 bg-zinc-200/50 dark:bg-black/40 p-1.5 rounded-2xl border border-zinc-300 dark:border-white/10">
                    <button className="w-8 h-8 flex items-center justify-center font-bold" onClick={() => onUpdate(item.cartItemId || item.id, -1)}>−</button>
                    <span className="font-black w-4 text-center text-sm">{item.quantity}</span>
                    <button className="w-8 h-8 flex items-center justify-center font-bold" onClick={() => onUpdate(item.cartItemId || item.id, 1)}>+</button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Contribuția personală — vizibil doar dacă ești la masă cu alții */}
          {isSharedTable && myShare.length > 0 && (
            <div className="pt-2">
              <h3 className="text-[10px] font-black uppercase tracking-widest mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-indigo-500 inline-block" />
                <span className="text-indigo-500 dark:text-indigo-400">Contribuția Ta</span>
              </h3>
              <div className="space-y-2 bg-indigo-50 dark:bg-indigo-950/30 p-5 rounded-3xl border border-indigo-100 dark:border-indigo-900/50">
                {myShare.map((item, i) => (
                  <div key={i} className="flex flex-col mb-1 text-[11px] font-bold uppercase tracking-tight text-indigo-700 dark:text-indigo-300">
                    <div className="flex justify-between">
                      <span>{item.quantity}x {item.name}</span>
                      <span className="font-mono italic">{(item.quantity * item.price).toFixed(2)} RON</span>
                    </div>
                    {item.notes && <span className="text-[9px] lowercase italic opacity-80">* {item.notes}</span>}
                  </div>
                ))}
                <div className="border-t border-indigo-200 dark:border-indigo-800 pt-2 mt-2 flex justify-between font-black text-sm text-indigo-700 dark:text-indigo-300">
                  <span>Subtotal tău</span>
                  <span>{myShareTotal.toFixed(2)} RON</span>
                </div>
              </div>
            </div>
          )}

          {/* Istoricul întregii mese */}
          {history.length > 0 && (
            <div className="pt-4">
              <h3 className="text-zinc-400 text-[10px] font-black uppercase tracking-widest mb-4 text-center">
                {isSharedTable ? "Total Masă" : "Comandate Anterior"}
              </h3>
              <div className="space-y-2 bg-zinc-100 dark:bg-black/20 p-6 rounded-4xl border border-dashed border-zinc-200 dark:border-white/10">
                {history.map((item, i) => (
                  <div key={i} className="flex flex-col mb-1 text-[11px] font-bold uppercase tracking-tight text-zinc-500">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <span>{item.quantity}x {item.name}</span>
                        {item.placed_by_staff && (
                          <span className="bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400 text-[9px] font-black px-1.5 py-0.5 rounded-md uppercase tracking-wider">
                            🍺 Bar
                          </span>
                        )}
                      </div>
                      <span className="font-mono italic">{(item.quantity * item.price).toFixed(2)}</span>
                    </div>
                    {item.notes && <span className="text-[9px] lowercase italic text-orange-400 dark:text-orange-500/80">* {item.notes}</span>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer cu Total și Buton */}
        <div className="p-8 pt-4 bg-zinc-50 dark:bg-zinc-900/80 border-t border-zinc-100 dark:border-white/5 backdrop-blur-lg">
          <div className="flex justify-between items-center mb-6 px-2">
            <span className="text-[10px] font-black uppercase text-zinc-400 tracking-widest">Total de plată</span>
            <span className="text-2xl font-black text-zinc-900 dark:text-white">{(totalAmount + historyTotal).toFixed(2)} RON</span>
          </div>
          {cart.length > 0 && (
            <button 
              onClick={onSend} 
              className="w-full p-6 rounded-4xl font-black text-lg uppercase tracking-widest shadow-2xl active:scale-95 flex justify-between items-center px-10 group" 
              style={{ backgroundColor: primaryColor, color: '#000' }}
            >
              <span>Trimite Comanda</span>
              <span className="opacity-40 group-hover:translate-x-2 transition-transform">🚀</span>
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}