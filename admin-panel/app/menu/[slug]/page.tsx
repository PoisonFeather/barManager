"use client";
import { useEffect, useState, use, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { AnimatePresence } from 'framer-motion';

// 1. Importăm Hook-urile și Serviciile din shared
import { useBarData } from "@/shared/hooks/useBarData";
import { useCart } from "@/shared/hooks/useCart";
import { orderService } from "@/shared/services/orderService";

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

  useEffect(() => {
    if (currentTable?.id) refreshHistory();
  }, [currentTable]);

  // Securizare sesiune  - token generat de backend pentru a preveni accesul neautorizat la comenzi (în special dacă cineva încearcă să acceseze direct API-ul fără token)
  useEffect(() => {
    const syncSession = async () => {
      // 🚩 Dacă nu avem masă, nu cerem token
      if (!currentTable?.id) return;
  
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/table-status/${currentTable.id}`);
        const data = await res.json();
        
        if (data.sessionToken) {
          // Îl punem în buzunarul browserului
          localStorage.setItem(`session_${currentTable.id}`, data.sessionToken);
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

  if (menuLoading || !barData) {
    return (
      <div className="p-10 text-white bg-black h-screen flex items-center justify-center font-black animate-pulse uppercase tracking-[0.5em]">
        Conectare Satelit...
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