"use client";

import { useEffect, useState, use } from "react";
import { motion } from "framer-motion";
import { superAdminApi, type BarDetails, type BarUser } from "@/shared/hooks/useSuperAdminApi";

function fmtEur(n: number) {
  return `€${new Intl.NumberFormat("ro-RO", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n)}`;
}

export default function SuperAdminBarDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [bar, setBar] = useState<BarDetails | null>(null);
  const [users, setUsers] = useState<BarUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Modals state
  const [userModalMode, setUserModalMode] = useState<"create" | "edit" | null>(null);
  const [userFormData, setUserFormData] = useState({ id: "", username: "", password: "", role: "server", allowedCategories: [] as string[] });
  
  // Available categories for kitchen selection
  const [barCategories, setBarCategories] = useState<{id: string, name: string}[]>([]);

  async function load() {
    try {
      setLoading(true);
      setError("");
      const details = await superAdminApi.getBarDetails(id);
      const userList = await superAdminApi.getBarUsers(id);
      setBar(details);
      setUsers(userList);

      // Fetch categories for the Kitchen role selection
      const menuRes = await fetch(`/api/menu/${details.slug}`);
      if (menuRes.ok) {
        const menuData = await menuRes.json();
        setBarCategories(menuData.categories || []);
      }
    } catch (err: any) {
      setError(err.message || String(err));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [id]);

  async function handleToggleFeature(key: "timer_minutes" | "has_kds", value: any) {
    if (!bar) return;
    const newFeatures = { ...bar.features, [key]: value };
    try {
      await superAdminApi.updateBarFeatures(id, newFeatures);
      setBar({ ...bar, features: newFeatures });
    } catch (err: any) {
      alert("Error updating feature: " + err.message);
    }
  }

  async function handleSaveUser() {
    try {
      if (userModalMode === "create") {
        await superAdminApi.createBarUser(id, userFormData);
      } else if (userModalMode === "edit" && userFormData.id) {
        await superAdminApi.updateUser(userFormData.id, userFormData);
      }
      setUserModalMode(null);
      setUserFormData({ id: "", username: "", password: "", role: "server", allowedCategories: [] });
      load();
    } catch (err: any) {
      alert("Error saving user: " + err.message);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-10 h-10 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !bar) {
    return <div className="text-red-500 font-bold">Error loading bar: {error}</div>;
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4 border-b border-white/5 pb-4">
        {bar.logo_url && <img src={bar.logo_url} alt="Logo" className="w-12 h-12 rounded-full object-cover ring-1 ring-white/10" />}
        <div>
          <h1 className="text-2xl font-black">{bar.name}</h1>
          <p className="text-zinc-500 font-medium">/{bar.slug}</p>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-zinc-900 border border-white/5 p-5 rounded-2xl">
          <p className="text-sm text-zinc-500 uppercase tracking-widest font-bold">Mese Active/Totale</p>
          <p className="text-3xl font-black mt-2">{bar.stats.total_tables}</p>
        </div>
        <div className="bg-zinc-900 border border-white/5 p-5 rounded-2xl">
          <p className="text-sm text-zinc-500 uppercase tracking-widest font-bold">Comenzi Totale</p>
          <p className="text-3xl font-black mt-2">{bar.stats.total_orders}</p>
        </div>
        <div className="bg-zinc-900 border border-white/5 p-5 rounded-2xl">
          <p className="text-sm text-zinc-500 uppercase tracking-widest font-bold">Revenue Total</p>
          <p className="text-3xl text-orange-400 font-black mt-2">{fmtEur(Number(bar.stats.total_revenue))}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Features Configurator */}
        <div className="bg-zinc-900/60 border border-white/5 rounded-2xl p-6 space-y-6">
          <h2 className="text-lg font-black border-b border-white/5 pb-2">Configurare Funcționalități</h2>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-bold text-white">Timer Inactivitate Mese</p>
              <p className="text-xs text-zinc-500">Câte minute până alerta personalului? 0 pts dezactivare.</p>
            </div>
            <input 
              type="number" 
              className="w-20 bg-black border border-white/10 px-3 py-2 rounded-lg text-white"
              value={bar.features.timer_minutes || 0}
              onChange={(e) => handleToggleFeature("timer_minutes", parseInt(e.target.value))}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-bold text-white">Kitchen Display System (KDS)</p>
              <p className="text-xs text-zinc-500">Activează vederea de producție bucătărie / barman.</p>
            </div>
            <button 
              onClick={() => handleToggleFeature("has_kds", !bar.features.has_kds)}
              className={`w-12 h-6 rounded-full flex items-center p-1 transition-colors ${bar.features.has_kds ? "bg-orange-500" : "bg-zinc-700"}`}
            >
              <motion.div animate={{ x: bar.features.has_kds ? 24 : 0 }} className="w-4 h-4 bg-white rounded-full" />
            </button>
          </div>

          <div className="flex items-center justify-between mt-4">
            <div>
              <p className="font-bold text-white">Comenzi la Masă (QR)</p>
              <p className="text-xs text-zinc-500">Permite clienților să comande direct din telefon.</p>
            </div>
            <button 
              onClick={() => handleToggleFeature("allow_ordering", bar.features.allow_ordering === false ? true : false)}
              className={`w-12 h-6 rounded-full flex items-center p-1 transition-colors ${bar.features.allow_ordering !== false ? "bg-orange-500" : "bg-zinc-700"}`}
            >
              <motion.div animate={{ x: bar.features.allow_ordering !== false ? 24 : 0 }} className="w-4 h-4 bg-white rounded-full" />
            </button>
          </div>

          <div className="flex items-center justify-between mt-4">
            <div>
              <p className="font-bold text-white">Cheamă Chelner / Nota</p>
              <p className="text-xs text-zinc-500">Afișează butonul de chemat ospătarul.</p>
            </div>
            <button 
              onClick={() => handleToggleFeature("allow_call_waiter", bar.features.allow_call_waiter === false ? true : false)}
              className={`w-12 h-6 rounded-full flex items-center p-1 transition-colors ${bar.features.allow_call_waiter !== false ? "bg-orange-500" : "bg-zinc-700"}`}
            >
              <motion.div animate={{ x: bar.features.allow_call_waiter !== false ? 24 : 0 }} className="w-4 h-4 bg-white rounded-full" />
            </button>
          </div>
        </div>

        {/* User Accounts */}
        <div className="bg-zinc-900/60 border border-white/5 rounded-2xl p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-white/5 pb-2">
            <h2 className="text-lg font-black">Conturi Personal</h2>
            <button onClick={() => { setUserFormData({ id: "", username: "", password: "", role: "server", allowedCategories: [] }); setUserModalMode("create"); }} className="px-3 py-1 bg-white/10 hover:bg-white/20 text-xs font-bold rounded-lg transition-colors">
              + Cont Nou
            </button>
          </div>

          <div className="space-y-2">
            {users.map(u => (
              <div key={u.id} className="flex justify-between items-center p-3 bg-black/40 rounded-xl border border-white/5">
                <div>
                  <p className="font-bold text-white">{u.username}</p>
                  <p className="text-xs text-zinc-400">
                    <span className="text-orange-400 font-black uppercase tracking-wider">{u.role}</span>
                    {u.role === "kitchen" && u.allowed_categories.length > 0 && ` (${u.allowed_categories.length} categorii)`}
                  </p>
                </div>
                <div className="flex gap-2 text-xs">
                  <button 
                    onClick={() => {
                      setUserFormData({ id: u.id, username: u.username, password: "", role: u.role, allowedCategories: u.allowed_categories || [] });
                      setUserModalMode("edit");
                    }} 
                    className="text-zinc-400 font-bold hover:text-white border border-white/10 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    Editează
                  </button>
                </div>
              </div>
            ))}
            {users.length === 0 && <p className="text-xs text-zinc-500 text-center py-4">Niciun cont adăugat încă.</p>}
          </div>
        </div>
      </div>

      {/* Modal Creare/Editare User */}
      {userModalMode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-zinc-900 border border-white/10 p-6 rounded-3xl w-full max-w-md shadow-2xl relative overflow-y-auto max-h-[90vh]">
            <h3 className="text-xl font-black mb-6">
              {userModalMode === "create" ? "Creare Utilizator Nou" : "Editare Utilizator"}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest block mb-1">Username</label>
                <input 
                  type="text" 
                  value={userFormData.username} 
                  onChange={e => setUserFormData({...userFormData, username: e.target.value})}
                  className="w-full bg-black/50 border border-white/10 rounded-xl p-3 focus:outline-none focus:border-orange-500/50 transition-colors placeholder:text-zinc-600"
                  placeholder="ex: bucatarie1"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest block mb-1">Parola {userModalMode === "edit" ? "(Lăsați gol pentru a nu schimba)" : ""}</label>
                <input 
                  type="password" 
                  value={userFormData.password} 
                  onChange={e => setUserFormData({...userFormData, password: e.target.value})}
                  className="w-full bg-black/50 border border-white/10 rounded-xl p-3 focus:outline-none focus:border-orange-500/50 transition-colors"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest block mb-1">Rol</label>
                <select 
                  value={userFormData.role} 
                  onChange={e => setUserFormData({...userFormData, role: e.target.value})}
                  className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white appearance-none focus:outline-none focus:border-orange-500/50"
                >
                  <option value="server">Ospătar / Server (comenzi)</option>
                  <option value="kitchen">Producție / KDS (bucătărie/bar)</option>
                  <option value="admin">Administrator / Manager</option>
                </select>
              </div>

              {userFormData.role === "kitchen" && barCategories.length > 0 && (
                <div className="pt-2">
                  <label className="text-xs font-bold text-orange-400 uppercase tracking-widest block mb-2">
                    Categorii Permise (KDS)
                  </label>
                  <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
                    {barCategories.map(cat => (
                      <label key={cat.id} className="flex items-center gap-3 p-2 hover:bg-white/5 rounded-lg cursor-pointer">
                        <input 
                          type="checkbox"
                          checked={userFormData.allowedCategories.includes(cat.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setUserFormData({...userFormData, allowedCategories: [...userFormData.allowedCategories, cat.id]});
                            } else {
                              setUserFormData({...userFormData, allowedCategories: userFormData.allowedCategories.filter(id => id !== cat.id)});
                            }
                          }}
                          className="w-4 h-4 rounded border-white/10 text-orange-500 focus:ring-0 focus:ring-offset-0 bg-black/50"
                        />
                        <span className="text-sm font-bold text-white">{cat.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-8 flex justify-end gap-3">
              <button 
                onClick={() => setUserModalMode(null)}
                className="px-5 py-2.5 rounded-xl border border-white/10 text-white font-bold hover:bg-white/5 transition-colors text-sm"
              >
                Anulează
              </button>
              <button 
                onClick={handleSaveUser}
                disabled={!userFormData.username || (userModalMode === "create" && !userFormData.password)}
                className="px-5 py-2.5 rounded-xl bg-white text-black font-black hover:bg-zinc-200 transition-colors disabled:opacity-50 text-sm"
              >
                {userModalMode === "create" ? "Creează" : "Salvează"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
