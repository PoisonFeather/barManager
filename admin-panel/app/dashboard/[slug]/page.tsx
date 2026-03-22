"use client";
import { useEffect, useState, use } from 'react';

export default function BartenderDashboard({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [activeTab, setActiveTab] = useState<'orders' | 'stock'>('orders');
  const [barData, setBarData] = useState<any>(null);
  const [tableGroups, setTableGroups] = useState<any[]>([]);

  // 1. Fetch inițial și Polling la 10 secunde
  useEffect(() => {
    fetch(`http://localhost:3001/menu-complete/${slug}`)
      .then(res => res.json())
      .then(data => {
        setBarData(data);
        fetchSummary(data.id);
      });

    const interval = setInterval(() => {
      if (barData?.id) fetchSummary(barData.id);
    }, 10000);
    
    return () => clearInterval(interval);
  }, [slug, barData?.id]);

  const fetchSummary = (barId: string) => {
    if (!barId) return;
    fetch(`http://localhost:3001/dashboard/summary/${barId}`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setTableGroups(data);
        } else {
          setTableGroups([]);
        }
      })
      .catch(() => setTableGroups([]));
  };

  // 2. Acțiuni Barman
  const serveItem = async (itemId: string) => {
    try {
      const res = await fetch(`http://localhost:3001/order-items/${itemId}/serve`, { 
        method: 'PATCH' 
      });
      if (res.ok) fetchSummary(barData.id);
    } catch (err) {
      alert("N-am putut marca produsul ca servit.");
    }
  };

  const closeTable = async (tableId: string) => {
    if (!confirm("Sigur închizi masa? Nota va fi marcată ca plătită.")) return;
    
    try {
      const res = await fetch(`http://localhost:3001/tables/${tableId}/close`, { 
        method: 'PATCH' 
      });
      if (res.ok) fetchSummary(barData.id);
    } catch (err) {
      alert("Eroare la închiderea mesei.");
    }
  };

  const toggleStock = async (prodId: string, currentStatus: boolean) => {
    const newStatus = !currentStatus;
    try {
      const res = await fetch(`http://localhost:3001/products/${prodId}/toggle`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_available: newStatus })
      });
  
      if (res.ok) {
        setBarData((prev: any) => ({
          ...prev,
          categories: prev.categories.map((cat: any) => ({
            ...cat,
            products: cat.products.map((p: any) => 
              p.id === prodId ? { ...p, is_available: newStatus } : p
            )
          }))
        }));
      }
    } catch (err) {
      alert("Nu am putut actualiza stocul!");
    }
  };

  if (!barData) return (
    <div className="min-h-screen bg-black flex items-center justify-center text-white font-black italic animate-pulse uppercase tracking-widest">
      Conectare Satellite...
    </div>
  );

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-4 md:p-8 font-sans">
      
      {/* HEADER */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tighter leading-none">{barData.name}</h1>
          <p className="text-[10px] text-zinc-500 uppercase font-black tracking-widest mt-2">Dashboard Live</p>
        </div>
        <div className="flex gap-2 bg-black/50 p-1.5 rounded-2xl border border-white/5">
          <button 
            onClick={() => setActiveTab('orders')}
            className={`px-6 py-2 rounded-xl font-black text-[10px] uppercase transition-all ${activeTab === 'orders' ? 'bg-white text-black shadow-lg shadow-white/5' : 'text-zinc-500 hover:text-white'}`}
          >
            Mese ({tableGroups.length})
          </button>
          <button 
            onClick={() => setActiveTab('stock')}
            className={`px-6 py-2 rounded-xl font-black text-[10px] uppercase transition-all ${activeTab === 'stock' ? 'bg-white text-black shadow-lg shadow-white/5' : 'text-zinc-500 hover:text-white'}`}
          >
            Stoc
          </button>
        </div>
      </div>

      {activeTab === 'orders' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tableGroups.length === 0 ? (
            <div className="col-span-full py-32 text-center border-2 border-dashed border-zinc-900 rounded-[3rem]">
              <p className="text-zinc-600 font-black uppercase tracking-[0.3em] text-sm italic">Nicio masă activă în acest moment</p>
            </div>
          ) : tableGroups.map((group) => (
            <div 
              key={group.table_id} 
              className={`bg-zinc-900 rounded-[2.5rem] p-7 border-t-8 shadow-2xl flex flex-col transition-all duration-500 ${
                group.pending_items?.length > 0 ? 'border-orange-500' : 'border-zinc-800 opacity-60'
              }`}
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-4xl font-black italic tracking-tighter uppercase leading-none">Masa {group.table_number}</h3>
                  <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-2">
                    Total: <span className="text-white">{Number(group.total_to_pay || 0).toFixed(2)} RON</span>
                  </p>
                </div>
                {group.pending_items?.length > 0 && (
                  <span className="bg-orange-500 text-black text-[8px] font-black px-2 py-1 rounded-lg uppercase animate-pulse">
                    {group.pending_items.length} noi
                  </span>
                )}
              </div>
          
              <div className="flex-1 space-y-3 mb-8">
                {group.pending_items?.length > 0 ? (
                  group.pending_items.map((item: any) => (
                    <div key={item.item_id} className="flex justify-between items-center bg-black/40 p-4 rounded-2xl border border-white/5 hover:border-white/10 transition-colors">
                      <span className="font-black text-sm uppercase tracking-tight">{item.qty}x {item.name}</span>
                      <button 
                        onClick={() => serveItem(item.item_id)}
                        className="bg-green-600 hover:bg-green-500 text-white w-10 h-10 flex items-center justify-center rounded-xl transition-all active:scale-90 shadow-lg shadow-green-900/20"
                      > ✓ </button>
                    </div>
                  ))
                ) : (
                  <div className="py-6 text-center bg-white/5 rounded-2xl border border-dashed border-white/10">
                    <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest italic">Complet servit ✅</p>
                  </div>
                )}
              </div>
          
              <button 
                onClick={() => closeTable(group.table_id)} 
                className={`w-full p-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${
                  group.pending_items?.length === 0 
                  ? 'bg-white text-black hover:bg-zinc-200' 
                  : 'bg-zinc-800 text-zinc-600 cursor-not-allowed opacity-50'
                }`}
                disabled={group.pending_items?.length > 0}
              >
                Închide Nota & Eliberează
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in duration-500">
          {barData.categories?.map((cat: any) => (
            <div key={cat.id} className="bg-zinc-900/50 rounded-[2.5rem] p-6 border border-white/5">
              <h3 className="text-[10px] font-black uppercase text-zinc-500 tracking-[0.2em] mb-6 pl-2 border-l-2 border-orange-500">
                {cat.name}
              </h3>
              
              <div className="space-y-3">
                {cat.products?.map((prod: any) => (
                  <div 
                    key={prod.id} 
                    className={`flex justify-between items-center p-4 rounded-2xl border transition-all ${
                      prod.is_available 
                      ? 'bg-black/40 border-white/5' 
                      : 'bg-red-500/5 border-red-500/20 opacity-80'
                    }`}
                  >
                    <div>
                      <p className={`font-bold text-sm uppercase ${!prod.is_available ? 'text-zinc-500 line-through' : 'text-white'}`}>
                        {prod.name}
                      </p>
                      <p className="text-[10px] text-zinc-600 font-mono italic">
                        {Number(prod.price).toFixed(2)} RON
                      </p>
                    </div>

                    <button
                      onClick={() => toggleStock(prod.id, prod.is_available)}
                      className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-90 shadow-md ${
                        prod.is_available 
                        ? 'bg-green-600 text-white shadow-green-900/10' 
                        : 'bg-zinc-800 text-red-500 border border-red-500/30'
                      }`}
                    >
                      {prod.is_available ? 'În Stoc' : 'Epuizat'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}