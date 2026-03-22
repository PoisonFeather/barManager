"use client";
import { useEffect, useState, use } from 'react';
import { useSearchParams } from 'next/navigation';

export default function ClientMenu({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const searchParams = useSearchParams();
  const tableId = searchParams.get('t'); 

  const [data, setData] = useState<any>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [orderHistory, setOrderHistory] = useState<any[]>([]);

  // 1. Initializare Cart din LocalStorage (Lazy Initializer)
  const [cart, setCart] = useState<any[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('active_cart');
      try {
        return saved ? JSON.parse(saved) : [];
      } catch (e) {
        return [];
      }
    }
    return [];
  });

  // 2. Persistenta Cart la orice modificare
  useEffect(() => {
    localStorage.setItem('active_cart', JSON.stringify(cart));
  }, [cart]);

  // 3. Identificarea mesei
  const currentTable = data?.tables?.find((t: any) => t.id === tableId);
  const displayTableNumber = currentTable ? currentTable.table_number : "??";

  const fetchHistory = () => {
    if (!tableId) return;
    fetch(`http://localhost:3001/table-history/${tableId}`)
      .then(res => res.json())
      .then(json => {
        if (Array.isArray(json)) setOrderHistory(json);
      })
      .catch(err => console.error("Eroare istoric:", err));
  };

  useEffect(() => {
    fetch(`http://localhost:3001/menu-complete/${slug}`)
      .then(res => res.json())
      .then(json => {
        setData(json);
        fetchHistory();
      });
  }, [slug, tableId]);

  const addToCart = (product: any) => {
    setCart((prev) => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
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

  const sendOrder = async () => {
    if (!data?.id || !tableId) return;
    
    const orderPayload = {
      bar_id: data.id,
      table_id: tableId,
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
        setCart([]); // Golește coșul local
        localStorage.removeItem('active_cart');
        setIsCartOpen(false);
        fetchHistory(); // Updatează imediat nota de plată
      }
    } catch (err) {
      alert("Eroare la trimitere!");
    }
  };

  if (!data) return (
    <div className="p-10 text-white bg-black h-screen flex items-center justify-center font-black italic animate-pulse">
      SE ÎNCARCĂ MENIUL...
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white pb-32 font-sans relative">
      
      {/* HEADER */}
      <div 
        className="sticky top-0 z-40 p-5 backdrop-blur-xl border-b border-white/10 flex justify-between items-center"
        style={{ borderBottomColor: data.primary_color + '44' }}
      >
        <div>
          <h1 className="font-black text-2xl tracking-tighter uppercase leading-none">{data.name}</h1>
          <p className="text-[9px] text-zinc-500 font-bold tracking-[0.3em] uppercase mt-1">Order System</p>
        </div>
        <div 
          className="px-4 py-2 rounded-2xl text-[11px] font-black shadow-lg"
          style={{ backgroundColor: data.primary_color || '#ffffff', color: '#fff' }}
        >
          MASA {displayTableNumber}
        </div>
      </div>

      {/* MENIU PRODUSE */}
      <div className="p-4 space-y-10 mt-4">
        {data.categories?.map((cat: any) => (
          <div key={cat.id}>
            <h2 className="text-zinc-600 uppercase text-[10px] font-black tracking-[0.2em] mb-5 pl-2 border-l-2 border-white/20">
              {cat.name}
            </h2>

            <div className="grid gap-4">
              {cat.products?.map((prod: any) => (
                <div 
                  key={prod.id} 
                  className={`bg-zinc-900/40 p-4 rounded-[2rem] flex justify-between items-center border border-white/5 transition-all 
                    ${!prod.is_available ? 'opacity-40 grayscale pointer-events-none' : 'active:scale-[0.97]'}`}
                >
                  <div className="flex-1 pr-4">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-lg mb-1">{prod.name}</h3>
                      {!prod.is_available && (
                        <span className="text-[8px] bg-red-500/20 text-red-500 px-2 py-0.5 rounded-full font-black uppercase tracking-tighter">Epuizat</span>
                      )}
                    </div>
                    {prod.description && <p className="text-zinc-500 text-xs mb-2 line-clamp-1">{prod.description}</p>}
                    <span className="text-white font-black text-sm tabular-nums">
                      {Number(prod.price).toFixed(2)} <span className="text-[10px] text-zinc-600 uppercase">RON</span>
                    </span>
                  </div>
                  
                  {prod.is_available ? (
                    <button 
                      onClick={() => addToCart(prod)}
                      className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl font-light bg-white/5 transition-all active:bg-white active:text-black"
                      style={{ color: data.primary_color }}
                    > + </button>
                  ) : (
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-zinc-800/50">🚫</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* BUTON PLUTITOR COȘ */}
      {totalItems > 0 && !isCartOpen && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[90%] max-w-md z-40">
          <button 
            onClick={() => setIsCartOpen(true)}
            className="w-full p-5 rounded-[2.5rem] font-black flex justify-between items-center shadow-2xl"
            style={{ backgroundColor: data.primary_color || '#ffffff', color: '#fff' }}
          >
            <div className="flex items-center gap-3">
              <span className="bg-black/20 w-8 h-8 rounded-xl flex items-center justify-center text-sm">{totalItems}</span>
              <span className="uppercase tracking-tighter italic">Comandă</span>
            </div>
            <span className="text-lg tabular-nums">{totalAmount.toFixed(2)} RON</span>
          </button>
        </div>
      )}

      {/* CHECKOUT MODAL + NOTA DE PLATĂ */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsCartOpen(false)}></div>
          
          <div className="relative bg-zinc-900 w-full max-h-[90vh] rounded-t-[3rem] p-8 flex flex-col shadow-2xl border-t border-white/10 overflow-hidden animate-in slide-in-from-bottom-full duration-300">
            <div className="w-12 h-1.5 bg-zinc-800 rounded-full mx-auto mb-8"></div>

            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-black uppercase italic tracking-tighter">Detalii</h2>
              <button onClick={() => setIsCartOpen(false)} className="text-zinc-500 uppercase text-[10px] font-bold">Închide</button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-6 mb-8 custom-scrollbar">
              {/* Secțiunea 1: PRODUSE NOI (ÎN COȘ) */}
              {cart.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-zinc-500 text-[10px] font-black uppercase tracking-widest pl-1">De comandat acum</h3>
                  {cart.map((item) => (
                    <div key={item.id} className="flex justify-between items-center bg-white/5 p-4 rounded-[1.5rem] border border-white/5">
                      <div>
                        <h4 className="font-bold text-sm">{item.name}</h4>
                        <p className="text-[10px] text-zinc-500">{(item.price * item.quantity).toFixed(2)} RON</p>
                      </div>
                      <div className="flex items-center gap-4 bg-black/50 rounded-xl p-1">
                        <button onClick={() => updateQuantity(item.id, -1)} className="w-8 h-8 flex items-center justify-center font-bold">-</button>
                        <span className="font-black text-xs">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, 1)} className="w-8 h-8 flex items-center justify-center font-bold text-green-500">+</button>
                      </div>
                    </div>
                  ))}
                  {orderHistory.length > 0 && (
  <div className="mt-8 pt-8 border-t border-white/10">
    <h3 className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-4">Nota de plată (Trimise)</h3>
    <div className="space-y-3 opacity-60">
      {orderHistory.flatMap(order => order.items).map((item, i) => (
        <div key={i} className="flex justify-between text-sm">
          <span>{item.qty}x {item.name}</span>
          <span className="font-bold">{(item.qty * item.price).toFixed(2)} RON</span>
        </div>
      ))}
    </div>
    
    <div className="mt-4 p-4 bg-white/5 rounded-2xl flex justify-between items-center">
      <span className="text-xs uppercase font-bold text-zinc-400">Total consumat:</span>
      <span className="font-black text-orange-400">
        {orderHistory.reduce((sum, o) => sum + Number(o.total_amount), 0).toFixed(2)} RON
      </span>
    </div>
  </div>
)}
                </div>
              )}

              {/* Secțiunea 2: NOTA DE PLATĂ (ISTORIC) */}
              {orderHistory.length > 0 && (
                <div className="mt-8 pt-6 border-t border-white/5">
                  <h3 className="text-zinc-500 text-[10px] font-black uppercase tracking-widest pl-1 mb-4">Comandate anterior</h3>
                  <div className="space-y-3 opacity-60">
                    {orderHistory.flatMap(o => o.items).map((item, idx) => (
                      <div key={idx} className="flex justify-between text-xs px-2">
                        <span>{item.qty}x {item.name}</span>
                        <span className="font-bold">{(item.qty * item.price).toFixed(2)} RON</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 p-4 bg-black/40 rounded-2xl flex justify-between items-center border border-white/5">
                    <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-tighter">Total consumat:</span>
                    <span className="font-black text-sm" style={{ color: data.primary_color }}>
                      {orderHistory.reduce((sum, o) => sum + Number(o.total_amount), 0).toFixed(2)} RON
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* BUTON TRIMITE (DOAR DACĂ AI CEVA ÎN COȘ) */}
            {cart.length > 0 && (
              <button 
                className="w-full p-6 rounded-[2rem] font-black text-xl uppercase tracking-widest active:scale-95 transition-transform mb-4 shadow-xl"
                style={{ backgroundColor: data.primary_color || '#ffffff', color: '#fff' }}
                onClick={sendOrder}
              >
                Trimite ({totalAmount.toFixed(2)} RON)
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}