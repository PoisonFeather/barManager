"use client";
import { useEffect, useState, use } from 'react';

export default function BartenderDashboard({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [activeTab, setActiveTab] = useState<'orders' | 'stock'>('orders');
  const [barData, setBarData] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);

  // 1. Helper pentru timp (calculăm de cât timp e comanda activă)
  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const orderDate = new Date(dateString);
    const diffInMinutes = Math.floor((now.getTime() - orderDate.getTime()) / 60000);
    if (diffInMinutes < 1) return "Chiar acum";
    return `acum ${diffInMinutes} min`;
  };

  // 2. Fetch datele barului și comenzile
  useEffect(() => {
    fetch(`http://localhost:3001/menu-complete/${slug}`)
      .then(res => res.json())
      .then(data => {
        setBarData(data);
        fetchOrders(data.id);
      });

    // Opțional: Refresh automat la fiecare 30 de secunde
    const interval = setInterval(() => {
        if (barData?.id) fetchOrders(barData.id);
    }, 30000);
    return () => clearInterval(interval);
  }, [slug, barData?.id]);

  const fetchOrders = (barId: string) => {
    if (!barId) return; // Nu facem fetch dacă nu avem ID-ul barului
  
    fetch(`http://localhost:3001/orders/${barId}`)
      .then(res => res.json())
      .then(data => {
        // VERIFICARE CRITICĂ: Dacă data este array, îl punem în state. 
        // Dacă e obiect (eroare), punem listă goală.
        if (Array.isArray(data)) {
          setOrders(data);
        } else {
          console.error("Backend-ul nu a trimis un array:", data);
          setOrders([]); 
        }
      })
      .catch(err => {
        console.error("Eroare rețea:", err);
        setOrders([]);
      });
  };

  // 3. Update statusul comenzii (Acceptă / Finalizează)
  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const response = await fetch(`http://localhost:3001/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        fetchOrders(barData.id); // Refresh listă
      }
    } catch (err) {
      alert("Eroare la schimbarea statusului!");
    }
  };

  if (!barData) return (
    <div className="min-h-screen bg-black flex items-center justify-center text-white font-black italic animate-pulse">
      CONECTARE LA SATELLITE...
    </div>
  );

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-4 md:p-8 font-sans">
      
      {/* HEADER */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tighter leading-none">{barData.name}</h1>
          <div className="flex items-center gap-2 mt-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-ping"></span>
            <p className="text-[10px] text-zinc-500 uppercase font-black tracking-widest">Server Live / Dashboard</p>
          </div>
        </div>
        <button 
          onClick={() => fetchOrders(barData.id)}
          className="bg-zinc-900 border border-white/5 p-4 rounded-2xl hover:bg-zinc-800 transition-all active:scale-95"
        >
          🔄
        </button>
      </div>

      {/* TABS NAVIGATION */}
      <div className="flex gap-2 mb-10 bg-black/50 p-1.5 rounded-[2rem] w-fit border border-white/5">
        <button 
          onClick={() => setActiveTab('orders')}
          className={`px-8 py-3 rounded-full font-black text-xs uppercase tracking-tighter transition-all ${activeTab === 'orders' ? 'bg-white text-black shadow-lg shadow-white/10' : 'text-zinc-500 hover:text-white'}`}
        >
          Comenzi Active ({orders.length})
        </button>
        <button 
          onClick={() => setActiveTab('stock')}
          className={`px-8 py-3 rounded-full font-black text-xs uppercase tracking-tighter transition-all ${activeTab === 'stock' ? 'bg-white text-black shadow-lg shadow-white/10' : 'text-zinc-500 hover:text-white'}`}
        >
          Management Stoc
        </button>
      </div>

      {/* CONȚINUT DINAMIC */}
      {activeTab === 'orders' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {orders.length === 0 ? (
            <div className="col-span-full py-32 text-center border-2 border-dashed border-zinc-900 rounded-[3rem]">
              <p className="text-zinc-600 font-black uppercase tracking-[0.3em] text-sm">Nicio comandă în așteptare</p>
            </div>
          ) : (
            orders.map((order) => (
              <div 
                key={order.id} 
                className={`relative overflow-hidden bg-zinc-900 rounded-[2.5rem] p-7 border-t-8 shadow-2xl transition-all
                  ${order.status === 'pending' ? 'border-orange-500' : 'border-blue-500 opacity-90'}`}
              >
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-4xl font-black italic tracking-tighter leading-none mb-1">MASA {order.table_number}</h3>
                    <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                      {getTimeAgo(order.created_at)}
                    </p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter
                    ${order.status === 'pending' ? 'bg-orange-500/10 text-orange-500' : 'bg-blue-500/10 text-blue-500'}`}>
                    {order.status === 'pending' ? 'Nouă' : 'În preparare'}
                  </div>
                </div>

                {/* LISTA PRODUSE */}
                <div className="space-y-3 mb-8">
                  {order.items?.map((item: any, idx: number) => (
                    <div key={idx} className="flex justify-between items-center bg-black/40 p-4 rounded-2xl border border-white/5">
                      <span className="font-black text-sm uppercase tracking-tight">{item.name}</span>
                      <span className="bg-white text-black w-8 h-8 flex items-center justify-center rounded-xl font-black text-xs">
                        {item.qty}
                      </span>
                    </div>
                  ))}
                </div>

                {/* BUTOANE ACȚIUNE */}
                <div className="grid grid-cols-2 gap-3">
                  {order.status === 'pending' ? (
                    <>
                      <button 
                        onClick={() => updateOrderStatus(order.id, 'preparing')}
                        className="bg-blue-600 hover:bg-blue-500 p-5 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all active:scale-95"
                      >
                        Acceptă
                      </button>
                      <button 
                        onClick={() => updateOrderStatus(order.id, 'completed')}
                        className="bg-zinc-800 hover:bg-zinc-700 p-5 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all active:scale-95"
                      >
                        Finalizat
                      </button>
                    </>
                  ) : (
                    <button 
                      onClick={() => updateOrderStatus(order.id, 'completed')}
                      className="col-span-2 bg-green-600 hover:bg-green-500 p-5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all active:scale-95 shadow-lg shadow-green-900/20"
                    >
                      Marchează ca Servit ✅
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        /* TAB STOC - Îl lăsăm momentan placeholder sau îl umplem imediat */
        <div className="grid gap-4">
           <div className="bg-zinc-900 p-10 rounded-[3rem] text-center border border-white/5">
              <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs">Aici vei gestiona disponibilitatea produselor.</p>
           </div>
        </div>
      )}
    </div>
  );
}