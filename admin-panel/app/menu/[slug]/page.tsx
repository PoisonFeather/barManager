"use client";
import { useEffect, useState, use } from 'react';
import { useSearchParams } from 'next/navigation';

export default function ClientMenu({ params }: { params: Promise<{ slug: string }> }) {
  // Unwrapping params conform noilor reguli Next.js 15
  const { slug } = use(params);
  
  const [data, setData] = useState<any>(null);
  const [cart, setCart] = useState<any[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  const searchParams = useSearchParams();
  const table = searchParams.get('table');

  // 1. Logica de adaugare in cos
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

  // 2. Modificare cantitate (+/-) sau stergere la 0
  const updateQuantity = (id: string, delta: number) => {
    setCart((prev) => prev.map(item => {
      if (item.id === id) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : null;
      }
      return item;
    }).filter(Boolean));
  };

  // 3. Calcule rapide
  const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    fetch(`http://localhost:3001/menu-complete/${slug}`)
      .then(res => res.json())
      .then(json => setData(json))
      .catch(err => console.error("Eroare la fetch, boss:", err));
  }, [slug]);

  if (!data) return (
    <div className="p-10 text-white bg-black h-screen flex items-center justify-center font-black italic animate-pulse">
      SE ÎNCARCĂ MENIUL...
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white pb-32 font-sans relative">
      
      {/* HEADER DINAMIC */}
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
          MASA {table || '??'}
        </div>
      </div>

      {/* LISTA PRODUSE */}
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
                  className="bg-zinc-900/40 p-4 rounded-[2rem] flex justify-between items-center border border-white/5 active:scale-[0.97] transition-transform"
                >
                  <div className="flex-1 pr-4">
                    <h3 className="font-bold text-lg mb-1">{prod.name}</h3>
                    {prod.description && <p className="text-zinc-500 text-xs mb-2 line-clamp-1">{prod.description}</p>}
                    <span className="text-white font-black text-sm tabular-nums">
                      {Number(prod.price).toFixed(2)} <span className="text-[10px] text-zinc-600 uppercase">RON</span>
                    </span>
                  </div>
                  
                  <button 
                    onClick={() => addToCart(prod)}
                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl font-light transition-all active:bg-white active:text-black bg-white/5"
                    style={{ color: data.primary_color }}
                  >
                    +
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* FLOATING ACTION BUTTON */}
      {totalItems > 0 && !isCartOpen && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[90%] max-w-md z-40">
          <button 
            onClick={() => setIsCartOpen(true)}
            className="w-full p-5 rounded-[2.5rem] font-black flex justify-between items-center shadow-2xl transition-all hover:scale-[1.02] active:scale-95 shadow-black/50"
            style={{ backgroundColor: data.primary_color || '#ffffff', color: '#fff' }}
          >
            <div className="flex items-center gap-3">
              <span className="bg-black/20 w-8 h-8 rounded-xl flex items-center justify-center text-sm">{totalItems}</span>
              <span className="uppercase tracking-tighter italic">Vezi comanda</span>
            </div>
            <span className="text-lg tabular-nums">{totalAmount.toFixed(2)} RON</span>
          </button>
        </div>
      )}

      {/* CHECKOUT MODAL (SLIDE UP) */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end">
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsCartOpen(false)}></div>
          
          <div className="relative bg-zinc-900 w-full max-h-[85vh] rounded-t-[3rem] p-8 flex flex-col shadow-[0_-20px_50px_rgba(0,0,0,0.5)] border-t border-white/10 overflow-hidden">
            {/* Handle vizual */}
            <div className="w-12 h-1.5 bg-zinc-800 rounded-full mx-auto mb-8"></div>

            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-black uppercase italic tracking-tighter">Review</h2>
              <button onClick={() => setIsCartOpen(false)} className="text-zinc-500 uppercase text-[10px] font-bold tracking-widest">Închide</button>
            </div>

            {/* Lista Scrollabila */}
            <div className="flex-1 overflow-y-auto space-y-4 mb-8 pr-2 custom-scrollbar">
              {cart.map((item) => (
                <div key={item.id} className="flex justify-between items-center bg-white/5 p-5 rounded-[2rem] border border-white/5">
                  <div>
                    <h4 className="font-bold text-base">{item.name}</h4>
                    <p className="text-[10px] text-zinc-500 font-bold uppercase">{(item.price * item.quantity).toFixed(2)} RON</p>
                  </div>
                  <div className="flex items-center gap-4 bg-black/50 rounded-2xl p-1 border border-white/5">
                    <button onClick={() => updateQuantity(item.id, -1)} className="w-9 h-9 flex items-center justify-center font-bold text-lg">-</button>
                    <span className="font-black text-sm w-4 text-center">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, 1)} className="w-9 h-9 flex items-center justify-center font-bold text-lg text-green-500">+</button>
                  </div>
                </div>
              ))}
            </div>

            {/* Buton FINAL */}
            <button 
              className="w-full p-6 rounded-[2rem] font-black text-xl uppercase tracking-[0.1em] active:scale-95 transition-transform mb-4 shadow-xl"
              style={{ backgroundColor: data.primary_color || '#ffffff', color: '#fff' }}
              onClick={() => alert("Comanda a fost trimisă la bar! 🍻")}
            >
              Trimite ({totalAmount.toFixed(2)} RON)
            </button>
          </div>
        </div>
      )}
    </div>
  );
}