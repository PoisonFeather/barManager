import { stockService } from "@/shared/services/stockService";

interface Props {
  barData: any;
  setBarData: (data: any) => void;
}

export function StockSection({ barData, setBarData }: Props) {
  
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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in duration-500">
      {barData.categories?.map((cat: any) => (
        <div
          key={cat.id}
          className="bg-white dark:bg-zinc-900/50 rounded-[2.5rem] p-6 border border-zinc-200 dark:border-white/5"
        >
          {/* Titlu Categorie */}
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

                {/* Buton Status Stoc */}
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
  );
}