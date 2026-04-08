"use client";
import { useState, useMemo, useRef, useEffect } from "react";
import { dashboardService } from "@/shared/services/dashboardService";

interface Product {
  id: string;
  name: string;
  price: number;
  description?: string;
}

interface Category {
  id: string;
  name: string;
  products: Product[];
}

interface CartItem extends Product {
  quantity: number;
}

interface StaffOrderModalProps {
  tableId: string;
  tableNumber: number;
  barId: string;
  categories: Category[];
  onClose: () => void;
  onSuccess: () => void;
}

export function StaffOrderModal({
  tableId,
  tableNumber,
  barId,
  categories,
  onClose,
  onSuccess,
}: StaffOrderModalProps) {
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    searchRef.current?.focus();
  }, []);

  const allProducts = useMemo(
    () => categories.flatMap((c) => c.products || []),
    [categories]
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return allProducts;
    return allProducts.filter((p) => p.name.toLowerCase().includes(q));
  }, [search, allProducts]);

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const updateQty = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((i) => (i.id === id ? { ...i, quantity: i.quantity + delta } : i))
        .filter((i) => i.quantity > 0)
    );
  };

  const totalAmount = cart.reduce((s, i) => s + i.price * i.quantity, 0);

  const handleSend = async () => {
    if (!cart.length) return;
    setIsSending(true);
    setError("");
    try {
      await dashboardService.placeStaffOrder({
        bar_id: barId,
        table_id: tableId,
        items: cart.map((i) => ({
          product_id: i.id,
          name: i.name,
          price: i.price,
          quantity: i.quantity,
        })),
        total_amount: totalAmount,
      });
      onSuccess();
      onClose();
    } catch (e: any) {
      setError(e.message || "Eroare la trimitere");
    } finally {
      setIsSending(false);
    }
  };

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/70 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="relative w-full max-w-lg bg-white dark:bg-zinc-900 rounded-t-[2.5rem] md:rounded-[2.5rem] shadow-2xl flex flex-col max-h-[90vh]">

        {/* Header */}
        <div className="flex items-center justify-between px-7 pt-7 pb-4 border-b border-zinc-100 dark:border-white/10 shrink-0">
          <div>
            <h2 className="text-xl font-black uppercase tracking-tighter">
              Comandă Staff
            </h2>
            <p className="text-[10px] text-zinc-500 font-bold uppercase mt-0.5">
              Masa {tableNumber}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl flex items-center justify-center bg-zinc-100 dark:bg-white/10 text-zinc-500 hover:text-red-500 font-black transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Search */}
        <div className="px-7 py-4 shrink-0">
          <input
            ref={searchRef}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Caută produs..."
            className="w-full bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-2xl px-5 py-3 text-sm font-medium focus:outline-none focus:border-zinc-400 dark:focus:border-white/30 transition-colors placeholder:text-zinc-400"
          />
        </div>

        {/* Product list */}
        <div className="flex-1 overflow-y-auto px-7 pb-4 space-y-2">
          {filtered.length === 0 ? (
            <p className="text-center text-xs text-zinc-400 font-bold uppercase py-10">
              Niciun produs găsit
            </p>
          ) : (
            filtered.map((prod) => {
              const inCart = cart.find((i) => i.id === prod.id);
              return (
                <div
                  key={prod.id}
                  className="flex items-center justify-between bg-zinc-50 dark:bg-white/5 rounded-2xl px-4 py-3 border border-zinc-100 dark:border-white/5"
                >
                  <div className="flex-1 min-w-0 pr-3">
                    <p className="font-bold text-sm truncate">{prod.name}</p>
                    <p className="text-xs text-zinc-500 font-semibold">
                      {Number(prod.price).toFixed(2)} RON
                    </p>
                  </div>

                  {inCart ? (
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => updateQty(prod.id, -1)}
                        className="w-8 h-8 rounded-xl bg-zinc-200 dark:bg-white/10 font-black text-lg flex items-center justify-center hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/30 transition-colors"
                      >
                        −
                      </button>
                      <span className="w-5 text-center font-black text-sm">
                        {inCart.quantity}
                      </span>
                      <button
                        onClick={() => updateQty(prod.id, +1)}
                        className="w-8 h-8 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-black font-black text-lg flex items-center justify-center hover:opacity-80 transition-opacity"
                      >
                        +
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => addToCart(prod)}
                      className="w-9 h-9 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-black font-black text-xl flex items-center justify-center hover:opacity-80 active:scale-90 transition-all shrink-0"
                    >
                      +
                    </button>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer coș + trimitere */}
        {cart.length > 0 && (
          <div className="px-7 py-5 border-t border-zinc-100 dark:border-white/10 shrink-0 space-y-3">
            {/* Mini coș */}
            <div className="space-y-1 max-h-28 overflow-y-auto">
              {cart.map((item) => (
                <div key={item.id} className="flex justify-between text-xs font-semibold text-zinc-600 dark:text-zinc-400">
                  <span>{item.quantity}× {item.name}</span>
                  <span>{(item.price * item.quantity).toFixed(2)} RON</span>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase text-zinc-500">Total</span>
              <span className="font-black text-lg">{totalAmount.toFixed(2)} RON</span>
            </div>

            {error && (
              <p className="text-xs text-red-500 font-bold text-center">{error}</p>
            )}

            <button
              onClick={handleSend}
              disabled={isSending}
              className="w-full py-4 rounded-2xl font-black uppercase tracking-widest text-sm transition-all bg-zinc-950 dark:bg-white text-white dark:text-black hover:opacity-90 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSending ? "Se trimite..." : `Trimite Comanda — ${totalAmount.toFixed(2)} RON`}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
