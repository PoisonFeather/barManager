"use client";
import { useEffect, useState, use } from 'react';
import { useSearchParams } from 'next/navigation';

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

  if (!data) return <div className="p-10 text-white bg-black h-screen flex items-center justify-center font-black animate-pulse">ÎNCĂRCARE...</div>;

  return (
    <div className="min-h-screen bg-black text-white pb-32 font-sans relative">
      {/* HEADER */}
      <div className="sticky top-0 z-40 p-5 backdrop-blur-xl border-b border-white/10 flex justify-between items-center" style={{ borderBottomColor: data.primary_color + '44' }}>
        <div>
          <h1 className="font-black text-2xl uppercase leading-none">{data.name}</h1>
          <p className="text-[9px] text-zinc-500 font-bold uppercase mt-1 tracking-widest">Order System</p>
        </div>
        <div className="px-4 py-2 rounded-2xl text-[11px] font-black" style={{ backgroundColor: data.primary_color || '#ffffff' }}>
          MASA {displayTableNumber}
        </div>
      </div>

      {/* LISTA PRODUSE */}
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

      {/* FLOATING ACTION BUTTON */}
      {(totalItems > 0 || orderHistory.length > 0) && !isCartOpen && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[90%] max-w-md z-40 flex flex-col gap-2">
          {totalItems === 0 && orderHistory.length > 0 && (
            <button onClick={() => setIsCartOpen(true)} className="w-full p-4 rounded-2xl font-bold bg-zinc-900 border border-white/10 flex justify-between items-center">
              <span className="uppercase text-[10px] tracking-widest opacity-60">Vezi Nota</span>
              <span className="text-sm font-black text-orange-400">
                {orderHistory.reduce((sum, o) => sum + Number(o.price * o.quantity || 0), 0).toFixed(2)} RON
              </span>
            </button>
          )}
          {totalItems > 0 && (
            <button onClick={() => setIsCartOpen(true)} className="w-full p-5 rounded-[2.5rem] font-black flex justify-between items-center" style={{ backgroundColor: data.primary_color }}>
              <span className="italic uppercase">Comandă</span>
              <span className="text-lg tabular-nums">{totalAmount.toFixed(2)} RON</span>
            </button>
          )}
        </div>
      )}

      {/* MODAL */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end">
          <div className="absolute inset-0 bg-black/60" onClick={() => setIsCartOpen(false)}></div>
          <div className="relative bg-zinc-900 w-full max-h-[90vh] rounded-t-[3rem] p-8 flex flex-col overflow-hidden">
             <div className="w-12 h-1.5 bg-zinc-800 rounded-full mx-auto mb-8"></div>
             <div className="flex-1 overflow-y-auto space-y-6">
                {cart.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-zinc-500 text-[10px] font-black uppercase">În coș</h3>
                    {cart.map((item) => (
                      <div key={item.id} className="flex justify-between items-center bg-white/5 p-4 rounded-2xl">
                        <span className="font-bold">{item.name}</span>
                        <div className="flex items-center gap-4">
                          <button onClick={() => updateQuantity(item.id, -1)}>-</button>
                          <span className="font-black">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, 1)}>+</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {orderHistory.length > 0 && (
                  <div className="pt-6 border-t border-white/5">
                    <h3 className="text-zinc-500 text-[10px] font-black uppercase mb-4">Comandate anterior</h3>
                    {orderHistory.map((item, i) => (
                      <div key={i} className="flex justify-between text-xs opacity-60 mb-2">
                        <span>{item.quantity}x {item.name}</span>
                        <span>{(item.quantity * item.price).toFixed(2)} RON</span>
                      </div>
                    ))}
                  </div>
                )}
             </div>
             {cart.length > 0 && (
               <button onClick={sendOrder} className="w-full mt-6 p-6 rounded-[2rem] font-black text-xl" style={{ backgroundColor: data.primary_color }}>
                 Trimite ({totalAmount.toFixed(2)} RON)
               </button>
             )}
          </div>
        </div>
      )}
    </div>
  );
}
