import { useState } from "react";
import { stockService } from "@/shared/services/stockService";

interface Props {
  barData: any;
  setBarData: (data: any) => void;
}

export function StockSection({ barData, setBarData }: Props) {
  const [searchQuery, setSearchQuery] = useState("");
  
  // Gestionăm toggle-ul direct aici, lăsând pagina principală "ușoară"
  const handleToggle = async (prodId: string, currentStatus: boolean) => {
    // 1. Apelăm serviciul (comunicarea cu backend)
    const updatedStatus = await stockService.toggleStock(prodId, currentStatus);

    // 2. Dacă serverul a confirmat (nu e null), facem update-ul vizual
    if (updatedStatus !== null) {
      setBarData((prev: any) => ({
        ...prev,
        categories: prev.categories.map((cat: any) => ({
          ...cat,
          products: cat.products.map((p: any) =>
            p.id === prodId ? { ...p, is_available: updatedStatus } : p
          ),
        })),
      }));
    } else {
      alert("⚠️ Eroare la actualizarea stocului. Încearcă din nou.");
    }
  };

  const filteredCategories = barData.categories?.map((cat: any) => ({
    ...cat,
    products: cat.products.filter((prod: any) => 
      prod.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter((cat: any) => cat.products.length > 0);

  return (
    <div className="animate-in fade-in duration-500">
      
      {/* Search Input */}
      <div className="mb-8 w-full max-w-sm">
        <div className="relative flex items-center">
          <span className="absolute left-4 text-xl opacity-50">🔍</span>
          <input
            type="text"
            placeholder="Caută un produs rapid..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl pl-12 pr-6 py-4 text-sm font-bold placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-shadow"
          />
        </div>
      </div>

      {filteredCategories?.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredCategories.map((cat: any) => (
            <div
              key={cat.id}
              className="bg-white dark:bg-zinc-900/50 rounded-[2.5rem] p-6 border border-zinc-200 dark:border-white/5"
            >
              <h3 className="text-[10px] font-black uppercase text-zinc-500 tracking-[0.2em] mb-6 pl-2 border-l-2 border-orange-500">
                {cat.name}
              </h3>

              <div className="space-y-3">
                {cat.products?.map((prod: any) => (
                  <div
                    key={prod.id}
                    className={`flex justify-between items-center p-4 rounded-2xl border transition-all ${
                      prod.is_available
                        ? "bg-zinc-50 dark:bg-black/40 border-zinc-100 dark:border-white/5"
                        : "bg-red-500/5 border-red-500/20 opacity-60"
                    }`}
                  >
                    <div>
                      <p className={`font-bold text-sm uppercase ${!prod.is_available ? "text-zinc-400 line-through" : ""}`}>
                        {prod.name}
                      </p>
                      <p className="text-[10px] text-zinc-500 font-mono italic">
                        {Number(prod.price).toFixed(2)} RON
                      </p>
                    </div>

                    <button
                      onClick={() => handleToggle(prod.id, prod.is_available)}
                      className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                        prod.is_available
                          ? "bg-green-600 text-white shadow-lg"
                          : "bg-zinc-200 dark:bg-zinc-800 text-red-500"
                      }`}
                    >
                      {prod.is_available ? "În Stoc" : "Epuizat"}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="w-full text-center py-20 bg-white dark:bg-zinc-900/50 rounded-3xl border border-zinc-200 dark:border-white/5">
          <p className="text-zinc-400 font-black uppercase tracking-widest text-sm italic">
            {searchQuery ? "Nu am găsit niciun produs." : "Niciun produs adăugat."}
          </p>
        </div>
      )}
    </div>
  );
}