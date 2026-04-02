"use client";
import { useEffect, useState, use, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { AnimatePresence } from 'framer-motion';

// 1. Importăm Hook-urile și Serviciile din shared
import { useBarData } from "@/shared/hooks/useBarData";
import { useCart } from "@/shared/hooks/useCart";
import { orderService } from "@/shared/services/orderService";
import { useSocket } from "@/shared/hooks/useSocket";

// 2. Importăm Componentele de UI decupate
import { ThemeToggle } from "@/components/ThemeToggle";
import { ProductCard } from "./components/ProductCard";
import { FloatingActionBar } from "./components/FloatingActionBar";
import { CartModal } from "./components/CartModal";
import { ServiceModal } from "./components/ServiceModal";


export default function ClientMenu({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const searchParams = useSearchParams();
  
  
  // 3. Hook-uri de Date și Coș (Toată logica e izolată aici)
  const { barData, loading: menuLoading } = useBarData(slug);
  const { cart, addToCart, updateQuantity, clearCart, totalAmount, totalItems } = useCart();

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [orderHistory, setOrderHistory] = useState<any[]>([]);
  const [isSessionLocked, setIsSessionLocked] = useState(false);

  // 4. Identificare Masă (Memoizată pentru viteză)
  const currentTable = useMemo(() => {
    const tId = searchParams.get('t');
    const tNum = searchParams.get('table');
    return barData?.tables?.find((t: any) => 
      t.id === tId || t.table_number === Number(tNum)
    );
  }, [barData, searchParams]);

  const historyTotal = useMemo(() => 
    orderHistory.reduce((sum, o) => sum + (Number(o.price) * o.quantity), 0), 
  [orderHistory]);

  // 5. Sincronizare Istoric
  const refreshHistory = async () => {
    if (currentTable?.id) {
      const history = await orderService.fetchHistory(currentTable.id);
      if (Array.isArray(history)) setOrderHistory(history);
    }
  };
  const { socket } = useSocket(refreshHistory);

  useEffect(() => {
    if (!socket || !currentTable?.id) return;
  
    const approvalEvent = `table-approved-${currentTable.id}`;
    const updateEvent = `table-updated-${currentTable.id}`; 
  
    // 1. Ascultăm când Barmanul aprobă masa
    socket.on(approvalEvent, (data: { token: string }) => {
      console.log("🎉 Masa a fost aprobată LIVE! Token:", data.token);
      localStorage.setItem(`session_${currentTable.id}`, data.token);
      refreshHistory();
    });

    // 2. 📢 Ascultăm când ALTCINEVA de la masă pune o comandă
    socket.on(updateEvent, (data) => {
      console.log("update socket for new order at the same table!", data);
      refreshHistory(); //  Asta trage datele noi și updatează istoric/total pe laptop!
    });

    // 3. Ascultăm și dacă cineva deblochează masa
    const unlockEvent = `table-unlocked-${currentTable.id}`;
    socket.on(unlockEvent, () => {
      setIsSessionLocked(false);
      // Eventual putem rula și syncSession din nou, dar state-ul ajunge
    });
  
    // Curățenie când închizi pagina
    return () => {
      socket.off(approvalEvent);
      socket.off(updateEvent); 
      socket.off(unlockEvent);
    };
  }, [socket, currentTable?.id]);

  useEffect(() => {
    if (currentTable?.id) refreshHistory();
  }, [currentTable]);

  // Securizare sesiune  - token generat de backend pentru a preveni accesul neautorizat la comenzi (în special dacă cineva încearcă să acceseze direct API-ul fără token)
  useEffect(() => {
    const syncSession = async () => {
      // 🚩 Dacă nu avem masă, nu cerem token
      if (!currentTable?.id) return;
  
      try {
        const storedToken = localStorage.getItem(`session_${currentTable.id}`) || '';
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/table-status/${currentTable.id}?token=${storedToken}`);
        
        if (res.status === 403) {
          setIsSessionLocked(true);
          return;
        }

        const data = await res.json();
        //console.log(data.sessionToken);
        if (data.sessionToken) {
          // Îl punem în buzunarul browserului
          localStorage.setItem(`session_${currentTable.id}`, data.sessionToken);
          setIsSessionLocked(false); // Token valid, scoatem lacătul
          console.log("🔐 Sesiune securizată: ", data.sessionToken);
        }
      } catch (err) {
        console.error("❌ Eroare la securizarea sesiunii:", err);
      }
    };
  
    syncSession();
  }, [currentTable?.id]);
  // 6. Handlere Acțiuni
  const handleSendOrder = async () => {
    if (!barData?.id || !currentTable?.id) return alert("Eroare identificare masă!");

    const payload = {
      bar_id: barData.id,
      table_id: currentTable.id,
      total_amount: totalAmount,
      items: cart
    };

    const result = await orderService.sendOrder(payload);
    if (result.success) {
      alert("Comanda a plecat! 🚀");
      clearCart();
      setIsCartOpen(false);
      refreshHistory();
    }
  };

  const handleSendRequest = async (type: string, method: string | null = null) => {
    if (!barData?.id || !currentTable?.id) return alert("Eroare identificare!");
    const token = localStorage.getItem(`session_${currentTable.id}`);

    const ok = await orderService.sendRequest({
      bar_id: barData.id,
      table_id: currentTable.id,
      session_token: token, // 🔑 Tokenul de sesiune pentru securitate
      type,
      payment_method: method
    });

    if (ok) {
      alert(type === 'waiter' ? "Chelnerul vine acum! 🛎️" : "Cererea pentru notă a fost trimisă! 🧾");
      setIsServiceModalOpen(false);
    }
  };

  const handleUnlockTable = async () => {
    if (!currentTable?.id) return;
    const ok = await orderService.unlockTable(currentTable.id);
    if (ok) {
      alert("Timpul de acces a fost extins cu 15 minute! Prietenii se pot conecta acum.");
    } else {
      alert("Eroare la extinderea timpului.");
    }
  };

  if (menuLoading || !barData) {
    return (
      <div className="p-10 text-white bg-black h-screen flex items-center justify-center font-black animate-pulse uppercase tracking-[0.5em]">
        Conectare Satelit...
      </div>
    );
  }

  // ECRAN DE BLOCARE 403 (Auto-Join)
  if (isSessionLocked) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-500">
        <div className="w-24 h-24 bg-red-500/20 rounded-full flex items-center justify-center mb-6">
          <span className="text-5xl">🔒</span>
        </div>
        <h1 className="text-white text-2xl font-black uppercase tracking-widest mb-4">Sesiune Încuiată</h1>
        <p className="text-zinc-400 text-sm mb-8 font-bold leading-relaxed max-w-sm">
          Pentru siguranță, mesele se încuie după 15 minute. <br/><br/>
          Rugați un prieten conectat să apese butonul de <b>Primit la Masă</b> din meniul lui.
        </p>
        <button 
          onClick={() => window.location.reload()}
          className="px-8 py-4 bg-zinc-800 text-white rounded-2xl font-black uppercase text-xs tracking-widest active:scale-95 transition-transform"
        >
          Reîncearcă Conexiunea
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black text-zinc-900 dark:text-white pb-32 relative transition-colors duration-300">
      
      {/* HEADER */}
      <div className="sticky top-0 z-40 p-5 backdrop-blur-xl border-b border-zinc-200 dark:border-white/10 flex justify-between items-center bg-white/80 dark:bg-black/80" style={{ borderBottomColor: barData.primary_color + '44' }}>
        <div>
          <h1 className="font-black text-2xl uppercase leading-none">{barData.name}</h1>
          <p className="text-[9px] text-zinc-500 font-bold uppercase mt-1 tracking-widest leading-none">Order Live System</p>
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <div className="px-4 py-2 rounded-2xl text-[11px] font-black shadow-sm" style={{ backgroundColor: barData.primary_color || '#ffffff', color: '#000' }}>
            Masa {currentTable ? currentTable.table_number : "??"}
          </div>
        </div>
      </div>

      {/* LISTA PRODUSE */}
      <div className="p-4 space-y-10 mt-4">
        {barData.categories?.map((cat: any) => (
          <div key={cat.id}>
            <h2 className="text-zinc-400 dark:text-zinc-600 uppercase text-[10px] font-black tracking-[0.2em] mb-5 pl-2 border-l-2 border-zinc-300 dark:border-white/20">
              {cat.name}
            </h2>
            <div className="grid gap-4">
              {cat.products?.map((prod: any) => (
                <ProductCard 
                  key={prod.id} 
                  prod={prod} 
                  onAdd={addToCart} 
                  primaryColor={barData.primary_color} 
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      <FloatingActionBar 
        totalItems={totalItems} 
        totalAmount={totalAmount} 
        historyTotal={historyTotal}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenService={() => setIsServiceModalOpen(true)}
        onUnlock={handleUnlockTable}
        primaryColor={barData.primary_color}
        isCartOpen={isCartOpen}
        isServiceModalOpen={isServiceModalOpen}
      />

      <AnimatePresence>
        {isCartOpen && (
          <CartModal 
            cart={cart} 
            history={orderHistory} 
            onUpdate={updateQuantity} 
            onSend={handleSendOrder} 
            onClose={() => setIsCartOpen(false)}
            primaryColor={barData.primary_color}
            totalAmount={totalAmount}
            historyTotal={historyTotal}
          />
        )}

        {isServiceModalOpen && (
          <ServiceModal 
            onSendRequest={handleSendRequest}
            onClose={() => setIsServiceModalOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}