interface Props {
  totalItems: number;
  totalAmount: number;
  historyTotal: number;
  onOpenCart: () => void;
  onOpenService: () => void;
  onUnlock: () => void;
  showUnlockRequest: boolean;
  primaryColor: string;
  isCartOpen: boolean;
  isServiceModalOpen: boolean;
}

export function FloatingActionBar({ 
  totalItems, totalAmount, historyTotal, onOpenCart, onOpenService, onUnlock, showUnlockRequest, primaryColor, isCartOpen, isServiceModalOpen 
}: Props) {
  console.log("[DEBUG] FloatingActionBar rendered! showUnlockRequest =", showUnlockRequest);
  // Nu afișăm bara dacă modalurile sunt deschise (ca să nu se suprapună)
  if (isCartOpen || isServiceModalOpen) return null;

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[92%] max-w-md z-40 flex gap-2 animate-in fade-in slide-in-from-bottom duration-500">
      {/* Buton Deblocare Masa */}
      {showUnlockRequest && (
        <button 
          onClick={onUnlock} 
          className="w-12 h-16 rounded-3xl bg-red-500 border border-red-400 flex flex-col items-center justify-center text-sm shadow-[0_0_15px_rgba(239,68,68,0.5)] active:scale-95 transition-transform shrink-0 animate-pulse text-white"
          title="Primiți persoana la masă"
        >
          <span className="text-xl">🔓</span>
          <span className="text-[7px] font-black uppercase mt-1">Acceptă</span>
        </button>
      )}

      {/* Buton Servicii */}
      <button 
        onClick={onOpenService} 
        className="w-16 h-16 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 flex items-center justify-center text-xl shadow-2xl active:scale-95 transition-transform shrink-0"
      >
        🛎️
      </button>

      {/* Buton Coș / Notă */}
      {(totalItems > 0 || historyTotal > 0) && (
        <div className="flex-1">
          {totalItems > 0 ? (
            <button 
              onClick={onOpenCart} 
              className="w-full h-16 px-8 rounded-4xl font-black flex justify-between items-center shadow-xl active:scale-95 transition-all" 
              style={{ backgroundColor: primaryColor, color: '#000' }}
            >
              <span className="italic uppercase text-sm font-black">Comandă</span>
              <span className="text-lg tabular-nums">{totalAmount.toFixed(2)} RON</span>
            </button>
          ) : (
            <button 
              onClick={onOpenCart} 
              className="w-full h-16 px-6 rounded-4xl font-bold bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 flex justify-between items-center shadow-2xl active:scale-95"
            >
              <span className="uppercase text-[10px] tracking-widest opacity-60">Vezi Nota</span>
              <span className="text-sm font-black text-orange-500">
                {historyTotal.toFixed(2)} RON
              </span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}