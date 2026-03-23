"use client";
import { useEffect, useState, use } from 'react';
import { useSearchParams } from 'next/navigation';
import { ThemeToggle } from "@/components/ThemeToggle";

export default function ClientMenu({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const searchParams = useSearchParams();
  
  // 1. Luăm ambii parametri posibili din URL
  const tableIdFromURL = searchParams.get('t'); 
  const tableNumFromURL = searchParams.get('table');

  const [data, setData] = useState<any>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [orderHistory, setOrderHistory] = useState<any[]>([]);
  const [cart, setCart] = useState<any[]>([]);


  // --- STĂRI NOI PENTRU CERERI SERVICII ---
const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
const [serviceStep, setServiceStep] = useState<'choice' | 'payment'>('choice'); // 'choice' = Chelner/Nota, 'payment' = Cash/Card

  // 2. LOGICA DE IDENTIFICARE MASA (Aici se definește finalTableId)
  // Această variabilă este calculată la fiecare randare
  const currentTable = data?.tables?.find((t: any) => 
    t.id === tableIdFromURL || t.table_number === Number(tableNumFromURL)
  );
  
  const finalTableId = currentTable?.id; // UUID-ul real din DB
  const displayTableNumber = currentTable ? currentTable.table_number : "??";

  // 3. Persistență Cart (LocalStorage)
  useEffect(() => {
    const saved = localStorage.getItem('active_cart');
    if (saved) setCart(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('active_cart', JSON.stringify(cart));
  }, [cart]);

  // 4. Fetch Date
  const fetchHistory = () => {
    if (!finalTableId) return;
    fetch(`http://localhost:3001/table-history/${finalTableId}`)
      .then(res => res.json())
      .then(json => { if (Array.isArray(json)) setOrderHistory(json); });
  };

  useEffect(() => {
    fetch(`http://localhost:3001/menu-complete/${slug}`)
      .then(res => res.json())
      .then(json => {
        setData(json);
      });
  }, [slug]);

  // Apelăm istoricul separat când finalTableId devine disponibil
  useEffect(() => {
    if (finalTableId) fetchHistory();
  }, [finalTableId]);

  // 5. Funcții Coș
  const addToCart = (product: any) => {
    setCart((prev) => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart((prev) => prev.map(item => {
      if (item.id === id) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : null;
      }
      return item;
    }).filter(Boolean));
  };

  const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  // 6. TRIMITERE COMANDĂ
  const sendOrder = async () => {
    if (!data?.id || !finalTableId) {
      console.error("Eroare trimitere -> Bar:", data?.id, "Table:", finalTableId);
      alert("Nu am putut identifica masa sau barul. Verifică URL-ul!");
      return;
    }

    const orderPayload = {
      bar_id: data.id,
      table_id: finalTableId,
      total_amount: totalAmount,
      items: cart
    };

    try {
      const response = await fetch('http://localhost:3001/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload)
      });

      const result = await response.json();
      if (result.success) {
        alert("Comanda a plecat! 🚀");
        setCart([]);
        localStorage.removeItem('active_cart');
        setIsCartOpen(false);
        fetchHistory();
      }
    } catch (err) {
      alert("Eroare la server!");
    }
  };

  // 6.1 TRIMITERE CERERE (CHELNER / NOTA)
const sendRequest = async (type: string, method: string | null = null) => {
    if (!data?.id || !finalTableId) {
      alert("Eroare identificare masă!");
      return;
    }
  
    try {
      const response = await fetch('http://localhost:3001/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bar_id: data.id,
          table_id: finalTableId,
          type: type, // 'waiter' sau 'bill'
          payment_method: method // 'cash' sau 'card'
        })
      });
  
      if (response.ok) {
        alert(type === 'waiter' ? "Chelnerul a fost chemat! 🛎️" : "Cererea pentru notă a fost trimisă! 🧾");
        setIsServiceModalOpen(false);
        setServiceStep('choice'); // Resetăm pentru data viitoare
      }
    } catch (err) {
      alert("Eroare la server!");
    }
  };

  if (!data) return <div className="p-10 text-white bg-black h-screen flex items-center justify-center font-black animate-pulse">ÎNCĂRCARE...</div>;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black text-zinc-900 dark:text-white pb-32 font-sans relative transition-colors duration-300">
      {/* 1. HEADER */}
      <div className="sticky top-0 z-40 p-5 backdrop-blur-xl border-b border-white/10 flex justify-between items-center transition-colors duration-300 bg-white/80 dark:bg-black/80" style={{ borderBottomColor: data.primary_color + '44' }}>
  <div>
    <h1 className="font-black text-2xl uppercase leading-none text-zinc-900 dark:text-white">
      {data.name}
    </h1>
    <p className="text-[9px] text-zinc-500 font-bold uppercase mt-1 tracking-widest">Order System</p>
  </div>
  
  <div className="flex items-center gap-3">
    {/* BUTONUL DE DARK/LIGHT MODE */}
    <ThemeToggle />

    <div className="px-4 py-2 rounded-2xl text-[11px] font-black shadow-sm" style={{ backgroundColor: data.primary_color || '#ffffff', color: '#000' }}>
      MASA {displayTableNumber}
    </div>
  </div>
</div>

      {/* 2. LISTA PRODUSE */}
      <div className="p-4 space-y-10 mt-4">
        {data.categories?.map((cat: any) => (
          <div key={cat.id}>
            <h2 className="text-zinc-600 uppercase text-[10px] font-black tracking-[0.2em] mb-5 pl-2 border-l-2 border-white/20">{cat.name}</h2>
            <div className="grid gap-4">
              {cat.products?.map((prod: any) => (
                <div key={prod.id} className={`bg-zinc-900/40 p-4 rounded-[2rem] flex justify-between items-center border border-white/5 ${!prod.is_available ? 'opacity-40 grayscale' : ''}`}>
                  <div className="flex-1 pr-4">
                    <h3 className="font-bold text-lg">{prod.name}</h3>
                    <span className="text-white font-black text-sm">{Number(prod.price).toFixed(2)} RON</span>
                  </div>
                  {prod.is_available && (
                    <button onClick={() => addToCart(prod)} className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl font-light bg-white/5" style={{ color: data.primary_color }}>+</button>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* 3. FLOATING ACTION BAR (Butoanele de jos) */}
      {!isCartOpen && !isServiceModalOpen && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[92%] max-w-md z-40 flex gap-3 animate-in fade-in slide-in-from-bottom duration-500">
          {/* Buton Servicii */}
          <button 
            onClick={() => setIsServiceModalOpen(true)}
            className="w-16 h-16 rounded-[2rem] bg-zinc-900 border border-white/10 flex items-center justify-center text-xl shadow-2xl active:scale-95"
          >
            🛎️
          </button>

          {/* Buton Comandă / Notă */}
          {(totalItems > 0 || orderHistory.length > 0) && (
            <div className="flex-1">
              {totalItems > 0 ? (
                <button onClick={() => setIsCartOpen(true)} className="w-full h-16 px-8 rounded-[2rem] font-black flex justify-between items-center shadow-xl active:scale-95" style={{ backgroundColor: data.primary_color, color: '#000' }}>
                  <span className="italic uppercase text-sm font-black">Comandă</span>
                  <span className="text-lg tabular-nums">{totalAmount.toFixed(2)} RON</span>
                </button>
              ) : (
                <button onClick={() => setIsCartOpen(true)} className="w-full h-16 px-6 rounded-[2rem] font-bold bg-zinc-900 border border-white/10 flex justify-between items-center shadow-2xl">
                  <span className="uppercase text-[10px] tracking-widest opacity-60">Vezi Nota</span>
                  <span className="text-sm font-black text-orange-400">
                    {orderHistory.reduce((sum, o) => sum + Number(o.price * o.quantity || 0), 0).toFixed(2)} RON
                  </span>
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* 4. MODAL COȘ & ISTORIC */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsCartOpen(false)}></div>
          <div className="relative bg-zinc-900 w-full max-h-[90vh] rounded-t-[3rem] p-8 flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-300">
             <div className="w-12 h-1.5 bg-zinc-800 rounded-full mx-auto mb-8"></div>
             
             <div className="flex-1 overflow-y-auto space-y-8 pb-10">
                {/* Produse noi în coș */}
                {cart.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">În coș</h3>
                    {cart.map((item) => (
                      <div key={item.id} className="flex justify-between items-center bg-white/5 p-4 rounded-2xl border border-white/5">
                        <div>
                          <p className="font-bold">{item.name}</p>
                          <p className="text-[10px] text-zinc-500">{(item.price * item.quantity).toFixed(2)} RON</p>
                        </div>
                        <div className="flex items-center gap-4 bg-black/40 p-2 rounded-xl">
                          <button className="w-8 h-8 flex items-center justify-center font-bold" onClick={() => updateQuantity(item.id, -1)}>−</button>
                          <span className="font-black w-4 text-center">{item.quantity}</span>
                          <button className="w-8 h-8 flex items-center justify-center font-bold" onClick={() => updateQuantity(item.id, 1)}>+</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Istoric comenzi */}
                {orderHistory.length > 0 && (
                  <div className="pt-6 border-t border-white/10">
                    <h3 className="text-zinc-500 text-[10px] font-black uppercase mb-4 tracking-widest">Comandate anterior</h3>
                    <div className="space-y-2 opacity-60">
                      {orderHistory.map((item, i) => (
                        <div key={i} className="flex justify-between text-xs font-medium">
                          <span>{item.quantity}x {item.name}</span>
                          <span>{(item.quantity * item.price).toFixed(2)} RON</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
             </div>

             {cart.length > 0 && (
               <button onClick={sendOrder} className="w-full p-6 rounded-[2rem] font-black text-xl shadow-2xl active:scale-95 transition-all" style={{ backgroundColor: data.primary_color, color: '#000' }}>
                 Trimite Comanda
               </button>
             )}
          </div>
        </div>
      )}

      {/* 5. MODAL SERVICII (CHELNER / NOTA) */}
      {isServiceModalOpen && (
        <div className="fixed inset-0 z-[60] flex flex-col justify-end">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => { setIsServiceModalOpen(false); setServiceStep('choice'); }}></div>
          <div className="relative bg-zinc-950 w-full rounded-t-[3rem] p-10 pb-16 border-t border-white/5 animate-in slide-in-from-bottom duration-300">
            <div className="w-12 h-1.5 bg-zinc-800 rounded-full mx-auto mb-10"></div>
            {/* ... restul de cod din modalul de servicii ... */}
            {serviceStep === 'choice' ? (
              <div className="grid gap-4">
                <h3 className="text-center font-black uppercase text-[10px] tracking-[0.2em] mb-4 text-zinc-500">Servicii Masă</h3>
                <button onClick={() => sendRequest('waiter')} className="w-full p-6 rounded-[2rem] bg-white/5 border border-white/10 flex items-center justify-between group active:bg-white/10 transition-all">
                  <div className="flex items-center gap-4"><span className="text-2xl">🛎️</span><span className="font-bold text-lg">Cheamă Chelnerul</span></div>
                  <span className="opacity-20 group-active:translate-x-2 transition-transform">→</span>
                </button>
                <button onClick={() => setServiceStep('payment')} className="w-full p-6 rounded-[2rem] bg-white/5 border border-white/10 flex items-center justify-between group active:bg-white/10 transition-all">
                  <div className="flex items-center gap-4"><span className="text-2xl">🧾</span><span className="font-bold text-lg">Cere Nota de Plată</span></div>
                  <span className="opacity-20 group-active:translate-x-2 transition-transform">→</span>
                </button>
              </div>
            ) : (
              <div className="grid gap-6">
                <h3 className="text-center font-black uppercase text-[10px] tracking-[0.2em] opacity-40">Cum dorești să plătești?</h3>
                <div className="grid grid-cols-2 gap-4">
                  <button onClick={() => sendRequest('bill', 'cash')} className="flex flex-col items-center gap-3 p-8 rounded-[2.5rem] bg-zinc-900 border border-white/5 active:scale-95 transition-all">
                    <span className="text-4xl">💵</span><span className="font-black uppercase text-[10px]">CASH</span>
                  </button>
                  <button onClick={() => sendRequest('bill', 'card')} className="flex flex-col items-center gap-3 p-8 rounded-[2.5rem] bg-zinc-900 border border-white/5 active:scale-95 transition-all">
                    <span className="text-4xl">💳</span><span className="font-black uppercase text-[10px]">CARD</span>
                  </button>
                </div>
                <button onClick={() => setServiceStep('choice')} className="text-[10px] font-black uppercase opacity-30 mt-4 tracking-[0.3em] text-center w-full">← Înapoi</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}