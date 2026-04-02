"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { dashboardService } from "@/shared/services/dashboardService";

interface MenuEditorProps {
  categories: any[];
  refreshData: () => void;
  barId: string;
}

export function MenuSection({ categories, refreshData, barId }: MenuEditorProps) {
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // --- HANDLERE PENTRU API ---
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const isNewProduct = editingProduct.isNew;
    const bodyData = {
      name: editingProduct.name,
      price: Number(editingProduct.price),
      description: editingProduct.description,
      ...(isNewProduct && { category_id: editingProduct.category_id })
    };

    try {
      if (isNewProduct) {
        await dashboardService.createProduct(bodyData);
      } else {
        await dashboardService.updateProduct(editingProduct.id, bodyData);
      }
      refreshData();
      setEditingProduct(null);
    } catch (err: any) {
      alert(err.message || "Eroare la salvare");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (productId: string) => {
    if (!confirm("⚠️ Ești sigur că vrei să ștergi definitiv acest produs? Nu va mai apărea în meniu.")) return;

    try {
      await dashboardService.deleteProduct(productId);
      refreshData();
    } catch (err: any) {
      alert(err.message || "Eroare de conexiune cu serverul.");
    }
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    setIsLoading(true);
    try {
      await dashboardService.createCategory({ bar_id: barId, name: newCategoryName });
      setNewCategoryName("");
      setShowAddCategory(false);
      refreshData();
    } catch (err: any) {
      alert(err.message || "Eroare la crearea categoriei");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    if (!confirm("⚠️ Ești sigur că vrei să ștergi această categorie? O poți șterge doar dacă este goală (șterge mai întâi produsele din ea).")) return;

    setIsLoading(true);
    try {
      await dashboardService.deleteCategory(categoryId);
      refreshData();
    } catch (err: any) {
      alert(err.message || "Eroare de conexiune cu serverul.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* LISTA DE CATEGORII ȘI PRODUSE */}
      {categories?.map((cat: any) => (
        <div key={cat.id} className="bg-white dark:bg-zinc-900 rounded-3xl p-6 shadow-sm border border-zinc-200 dark:border-white/5">
          <div className="flex justify-between items-center mb-6 border-b border-zinc-200 dark:border-zinc-800 pb-4">
            <h2 className="text-xl font-black uppercase tracking-widest text-zinc-400">
              {cat.name}
            </h2>
            <button 
              onClick={() => handleDeleteCategory(cat.id)}
              className="text-red-500 hover:text-red-600 bg-red-500/10 hover:bg-red-500/20 p-2 rounded-xl transition-colors text-xs font-bold"
              title="Șterge categoria"
            >
              🗑️
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {cat.products?.map((prod: any) => (
              <div key={prod.id} className="bg-zinc-50 dark:bg-zinc-950 p-5 rounded-2xl border border-zinc-200 dark:border-white/5 flex flex-col justify-between group hover:border-orange-500/50 transition-colors">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg leading-tight dark:text-zinc-100">{prod.name}</h3>
                    <span className="bg-zinc-200 dark:bg-zinc-800 px-2 py-1 rounded-lg text-xs font-black">
                      {Number(prod.price).toFixed(2)}
                    </span>
                  </div>
                  {prod.description && (
                    <p className="text-[10px] text-zinc-500 line-clamp-2 mb-4">
                      {prod.description}
                    </p>
                  )}
                </div>

                <div className="flex gap-2 mt-4 pt-4 border-t border-zinc-200 dark:border-zinc-800">
                  <button 
                    onClick={() => setEditingProduct(prod)}
                    className="flex-1 bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 text-xs font-black uppercase py-2 rounded-xl transition-colors"
                  >
                    ✏️ Editează
                  </button>
                  <button 
                    onClick={() => handleDelete(prod.id)}
                    className="w-10 bg-red-500/10 hover:bg-red-500/20 text-red-500 flex items-center justify-center rounded-xl transition-colors"
                    title="Șterge produs"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
            {/* 👈 BUTONUL DE ADAUGĂ E AICI, ÎN INTERIORUL GRID-ULUI */}
            <button
              onClick={() => setEditingProduct({ 
                isNew: true, 
                category_id: cat.id, 
                name: "", 
                price: "", 
                description: "" 
              })}
              className="bg-zinc-50 dark:bg-zinc-900/30 border-2 border-dashed border-zinc-300 dark:border-zinc-800 hover:border-orange-500 hover:text-orange-500 text-zinc-400 p-5 rounded-2xl flex flex-col items-center justify-center transition-all min-h-40 group"
            >
              <span className="text-3xl mb-2 group-hover:scale-125 transition-transform">+</span>
              <span className="text-xs font-black uppercase tracking-widest">Adaugă Produs</span>
            </button>
          </div>
        </div>
      ))}
      
      {/* BUTON ADĂUGARE CATEGORIE */}
      <div className="flex justify-center mt-6">
        <button
          onClick={() => setShowAddCategory(true)}
          className="bg-orange-500 hover:bg-orange-600 text-black px-6 py-3 rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl transition-all active:scale-95"
        >
          + Adaugă Categorie
        </button>
      </div>

      {/* MODALUL DE EDITARE (Apare doar când dai click pe "Editează" sau "Adaugă Produs") */}
      <AnimatePresence>
        {editingProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-zinc-900 w-full max-w-md p-6 md:p-8 rounded-[2.5rem] shadow-2xl border border-zinc-200 dark:border-white/10"
            >
              <h2 className="text-2xl font-black uppercase mb-6">✏️ Editează Produs</h2>
              
              <form onSubmit={handleSave} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-2">Nume Produs</label>
                  <input 
                    type="text" 
                    value={editingProduct.name}
                    onChange={(e) => setEditingProduct({...editingProduct, name: e.target.value})}
                    className="w-full p-4 bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl focus:outline-none focus:border-orange-500 transition-colors"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-2">Preț (RON)</label>
                  <input 
                    type="number" 
                    step="0.01"
                    value={editingProduct.price}
                    onChange={(e) => setEditingProduct({...editingProduct, price: e.target.value})}
                    className="w-full p-4 bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl focus:outline-none focus:border-orange-500 transition-colors"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-2">Descriere (Opțional)</label>
                  <textarea 
                    value={editingProduct.description || ""}
                    onChange={(e) => setEditingProduct({...editingProduct, description: e.target.value})}
                    className="w-full p-4 bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl focus:outline-none focus:border-orange-500 transition-colors min-h-25 resize-none"
                    placeholder="Ex: 200ml, lămâie, gheață..."
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button 
                    type="button" 
                    onClick={() => setEditingProduct(null)}
                    className="flex-1 p-4 rounded-2xl font-black text-xs uppercase bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-300 dark:hover:bg-zinc-700 transition-colors"
                  >
                    Anulează
                  </button>
                  <button 
                    type="submit" 
                    disabled={isLoading}
                    className="flex-1 p-4 rounded-2xl font-black text-xs uppercase bg-orange-500 hover:bg-orange-600 text-black shadow-lg shadow-orange-500/20 transition-transform active:scale-95 disabled:opacity-50"
                  >
                    {isLoading ? "Se salvează..." : "✔️ Salvează"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {/* MODALUL PENTRU CATEGORIE NOUĂ */}
        {showAddCategory && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-zinc-900 w-full max-w-sm p-6 rounded-[2.5rem] shadow-2xl border border-zinc-200 dark:border-white/10"
            >
              <h2 className="text-xl font-black uppercase mb-6">📂 Categorie Nouă</h2>
              
              <form onSubmit={handleAddCategory} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-2">Nume (ex: Băuturi)</label>
                  <input 
                    type="text" 
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    className="w-full p-4 bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl focus:outline-none focus:border-orange-500 transition-colors"
                    required
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button 
                    type="button" 
                    onClick={() => { setShowAddCategory(false); setNewCategoryName(""); }}
                    className="flex-1 p-4 rounded-2xl font-black text-xs uppercase bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-300 dark:hover:bg-zinc-700 transition-colors"
                  >
                    Anulează
                  </button>
                  <button 
                    type="submit" 
                    disabled={isLoading || !newCategoryName.trim()}
                    className="flex-1 p-4 rounded-2xl font-black text-xs uppercase bg-orange-500 hover:bg-orange-600 text-black shadow-lg shadow-orange-500/20 transition-transform active:scale-95 disabled:opacity-50"
                  >
                    {isLoading ? "Se adaugă..." : "+ Adaugă"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}