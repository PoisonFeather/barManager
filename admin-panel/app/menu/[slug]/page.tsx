"use client";
import { useEffect, useState, use } from 'react';
import { useSearchParams } from 'next/navigation';
import { ThemeToggle } from "@/components/ThemeToggle";

export default function ClientMenu({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const searchParams = useSearchParams();
  
  const tableIdFromURL = searchParams.get('t'); 
  const tableNumFromURL = searchParams.get('table');

  const [data, setData] = useState<any>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [orderHistory, setOrderHistory] = useState<any[]>([]);
  const [cart, setCart] = useState<any[]>([]);
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [serviceStep, setServiceStep] = useState<'choice' | 'payment'>('choice');

  const currentTable = data?.tables?.find((t: any) => 
    t.id === tableIdFromURL || t.table_number === Number(tableNumFromURL)
  );
  
  const finalTableId = currentTable?.id; 
  const displayTableNumber = currentTable ? currentTable.table_number : "??";

  useEffect(() => {
    const saved = localStorage.getItem('active_cart');
    if (saved) setCart(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('active_cart', JSON.stringify(cart));
  }, [cart]);

  // 1. FETCH DATE MENIU (Fixat cu backticks)
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/menu-complete/${slug}`)
      .then(res => res.json())
      .then(json => {
        setData(json);
      });
  }, [slug]);


  // 2. FETCH ISTORIC (Fixat cu backticks)
  const fetchHistory = () => {
    if (!finalTableId) return;
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/table-history/${finalTableId}`)
      .then(res => res.json())
      .then(json => { if (Array.isArray(json)) setOrderHistory(json); });
  };

  useEffect(() => {
    if (finalTableId) fetchHistory();
  }, [finalTableId]);

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

  // 3. TRIMITERE COMANDĂ (Fixat cu backticks)
  const sendOrder = async () => {
    if (!data?.id || !finalTableId) {
      alert("Nu am putut identifica masa!");
      return;
    }

    const orderPayload = {
      bar_id: data.id,
      table_id: finalTableId,
      total_amount: totalAmount,
      items: cart
    };

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders`, {
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

  // 4. TRIMITERE CERERE (Fixat cu backticks)
  const sendRequest = async (type: string, method: string | null = null) => {
    if (!data?.id || !finalTableId) {
      alert("Eroare identificare masă!");
      return;
    }
  
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/requests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bar_id: data.id,
          table_id: finalTableId,
          type: type,
          payment_method: method
        })
      });
  
      if (response.ok) {
        alert(type === 'waiter' ? "Chelnerul vine acum! 🛎️" : "Cererea pentru notă a fost trimisă! 🧾");
        setIsServiceModalOpen(false);
        setServiceStep('choice');
      }
    } catch (err) {
      alert("Eroare la server!");
    }
  };
  
  if (!data) return <div className="p-10 text-white bg-black h-screen flex items-center justify-center font-black animate-pulse uppercase tracking-[0.5em]">Conectare Satelit...</div>;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black text-zinc-900 dark:text-white pb-32 font-sans relative transition-colors duration-300">
      {/* HEADER */}
      <div className="sticky top-0 z-40 p-5 backdrop-blur-xl border-b border-zinc-200 dark:border-white/10 flex justify-between items-center transition-colors duration-300 bg-white/80 dark:bg-black/80" style={{ borderBottomColor: data.primary_color + '44' }}>
        <div>
          <h1 className="font-black text-2xl uppercase leading-none text-zinc-900 dark:text-white">{data.name}</h1>
          <p className="text-[9px] text-zinc-500 font-bold uppercase mt-1 tracking-widest leading-none">Order Live System</p>
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <div className="px-4 py-2 rounded-2xl text-[11px] font-black shadow-sm" style={{ backgroundColor: data.primary_color || '#ffffff', color: '#000' }}>
            Masa {displayTableNumber}
          </div>
        </div>
      </div>

      {/* LISTA PRODUSE */}
      <div className="p-4 space-y-10 mt-4">
        {data.categories?.map((cat: any) => (
          <div key={cat.id}>
            <h2 className="text-zinc-400 dark:text-zinc-600 uppercase text-[10px] font-black tracking-[0.2em] mb-5 pl-2 border-l-2 border-zinc-300 dark:border-white/20">{cat.name}</h2>
            <div className="grid gap-4">
              {cat.products?.map((prod: any) => (
                <div key={prod.id} className={`bg-white dark:bg-zinc-900/40 p-5 rounded-[2rem] flex justify-between items-center border border-zinc-100 dark:border-white/5 shadow-sm ${!prod.is_available ? 'opacity-40 grayscale' : ''}`}>
                  <div className="flex-1 pr-4">
                    <h3 className="font-bold text-lg dark:text-zinc-100">{prod.name}</h3>
                    <span className="text-zinc-500 dark:text-zinc-400 font-black text-sm">{Number(prod.price).toFixed(2)} RON</span>
                  </div>
                  {prod.is_available && (
                    <button onClick={() => addToCart(prod)} className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl font-light bg-zinc-100 dark:bg-white/5 active:scale-90 transition-transform" style={{ color: data.primary_color }}>+</button>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* FLOATING ACTION BAR */}
      {!isCartOpen && !isServiceModalOpen && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[92%] max-w-md z-40 flex gap-3 animate-in fade-in slide-in-from-bottom duration-500">
          <button onClick={() => setIsServiceModalOpen(true)} className="w-16 h-16 rounded-[2rem] bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 flex items-center justify-center text-xl shadow-2xl active:scale-95">🛎️</button>
          {(totalItems > 0 || orderHistory.length > 0) && (
            <div className="flex-1">
              {totalItems > 0 ? (
                <button onClick={() => setIsCartOpen(true)} className="w-full h-16 px-8 rounded-[2rem] font-black flex justify-between items-center shadow-xl active:scale-95 transition-all" style={{ backgroundColor: data.primary_color, color: '#000' }}>
                  <span className="italic uppercase text-sm font-black">Comandă</span>
                  <span className="text-lg tabular-nums">{totalAmount.toFixed(2)} RON</span>
                </button>
              ) : (
                <button onClick={() => setIsCartOpen(true)} className="w-full h-16 px-6 rounded-[2rem] font-bold bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 flex justify-between items-center shadow-2xl">
                  <span className="uppercase text-[10px] tracking-widest opacity-60">Vezi Nota</span>
                  <span className="text-sm font-black text-orange-500">
                    {(orderHistory.reduce((sum, o) => sum + Number(o.price * o.quantity || 0), 0)).toFixed(2)} RON
                  </span>
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* MODAL COȘ (CEL PREMIUM) */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-md" onClick={() => setIsCartOpen(false)}></div>
          <div className="relative bg-white dark:bg-zinc-900 w-full max-h-[85vh] rounded-t-[3rem] shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-300">
             <div className="w-12 h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-full mx-auto my-6"></div>
             <div className="flex-1 overflow-y-auto px-8 pb-10 space-y-8">
                <div className="flex justify-between items-end"><h2 className="text-3xl font-black uppercase tracking-tighter">Nota Ta</h2><button onClick={() => setIsCartOpen(false)} className="text-[10px] font-black uppercase text-zinc-400">Închide</button></div>
                {cart.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-zinc-400 text-[10px] font-black uppercase tracking-widest">De Comandat</h3>
                    {cart.map((item) => (
                      <div key={item.id} className="flex justify-between items-center bg-zinc-50 dark:bg-white/5 p-5 rounded-[2rem] border border-zinc-100 dark:border-white/5">
                        <div className="flex-1"><p className="font-black uppercase text-sm">{item.name}</p><p className="text-[10px] font-bold text-zinc-500">{(item.price * item.quantity).toFixed(2)} RON</p></div>
                        <div className="flex items-center gap-4 bg-zinc-200/50 dark:bg-black/40 p-1.5 rounded-2xl border border-zinc-300 dark:border-white/10">
                          <button className="w-8 h-8 flex items-center justify-center font-bold" onClick={() => updateQuantity(item.id, -1)}>−</button>
                          <span className="font-black w-4 text-center text-sm">{item.quantity}</span>
                          <button className="w-8 h-8 flex items-center justify-center font-bold" onClick={() => updateQuantity(item.id, 1)}>+</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {orderHistory.length > 0 && (
                  <div className="pt-4"><h3 className="text-zinc-400 text-[10px] font-black uppercase tracking-widest mb-4 text-center">Comandate Anterior</h3><div className="space-y-2 bg-zinc-100 dark:bg-black/20 p-6 rounded-[2rem] border border-dashed border-zinc-200 dark:border-white/10">
                      {orderHistory.map((item, i) => (<div key={i} className="flex justify-between text-[11px] font-bold uppercase tracking-tight text-zinc-500"><span>{item.quantity}x {item.name}</span><span className="font-mono italic">{(item.quantity * item.price).toFixed(2)}</span></div>))}
                  </div></div>
                )}
             </div>
             <div className="p-8 pt-4 bg-zinc-50 dark:bg-zinc-900/80 border-t border-zinc-100 dark:border-white/5 backdrop-blur-lg">
                <div className="flex justify-between items-center mb-6 px-2"><span className="text-[10px] font-black uppercase text-zinc-400 tracking-widest">Total de plată</span><span className="text-2xl font-black text-zinc-900 dark:text-white">{(totalAmount + orderHistory.reduce((sum, o) => sum + Number(o.price * o.quantity || 0), 0)).toFixed(2)} RON</span></div>
                {cart.length > 0 && (<button onClick={sendOrder} className="w-full p-6 rounded-[2rem] font-black text-lg uppercase tracking-widest shadow-2xl active:scale-95 flex justify-between items-center px-10 group" style={{ backgroundColor: data.primary_color || '#ff5f00', color: '#000' }}><span>Trimite Comanda</span><span className="opacity-40 group-hover:translate-x-2 transition-transform">🚀</span></button>)}
             </div>
          </div>
        </div>
      )}

      {/* 5. MODAL SERVICII */}
      {isServiceModalOpen && (
        <div className="fixed inset-0 z-[60] flex flex-col justify-end">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => { setIsServiceModalOpen(false); setServiceStep('choice'); }}></div>
          <div className="relative bg-zinc-950 w-full rounded-t-[3rem] p-10 pb-16 border-t border-white/5 animate-in slide-in-from-bottom duration-300">
            <div className="w-12 h-1.5 bg-zinc-800 rounded-full mx-auto mb-10"></div>
            {serviceStep === 'choice' ? (
              <div className="grid gap-4">
                <h3 className="text-center font-black uppercase text-[10px] tracking-widest mb-4 text-zinc-500">Servicii Masă</h3>
                <button onClick={() => sendRequest('waiter')} className="w-full p-6 rounded-[2rem] bg-white/5 border border-white/10 flex items-center justify-between active:bg-white/10 transition-all"><div className="flex items-center gap-4"><span className="text-2xl">🛎️</span><span className="font-bold text-lg">Cheamă Chelnerul</span></div><span>→</span></button>
                <button onClick={() => setServiceStep('payment')} className="w-full p-6 rounded-[2rem] bg-white/5 border border-white/10 flex items-center justify-between active:bg-white/10 transition-all"><div className="flex items-center gap-4"><span className="text-2xl">🧾</span><span className="font-bold text-lg">Cere Nota de Plată</span></div><span>→</span></button>
              </div>
            ) : (
              <div className="grid gap-6">
                <h3 className="text-center font-black uppercase text-[10px] tracking-widest opacity-40">Metoda de plată?</h3>
                <div className="grid grid-cols-2 gap-4">
                  <button onClick={() => sendRequest('bill', 'cash')} className="flex flex-col items-center gap-3 p-8 rounded-[2.5rem] bg-zinc-900 border border-white/5 active:scale-95 transition-all"><span className="text-4xl">💵</span><span className="font-black uppercase text-[10px]">CASH</span></button>
                  <button onClick={() => sendRequest('bill', 'card')} className="flex flex-col items-center gap-3 p-8 rounded-[2.5rem] bg-zinc-900 border border-white/5 active:scale-95 transition-all"><span className="text-4xl">💳</span><span className="font-black uppercase text-[10px]">CARD</span></button>
                </div>
                <button onClick={() => setServiceStep('choice')} className="text-[10px] font-black uppercase opacity-30 mt-4 tracking-widest text-center w-full">← Înapoi</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}