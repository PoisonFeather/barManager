"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation'; 

export default function OnboardingPage() {
  const router = useRouter(); 
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  const [barData, setBarData] = useState({
    bar_name: '',
    slug: '',
    logo_url: '',
    logo_url_light: '',
    primary_color: '#ff4500',
    bar_number_tables: '',
    username: '', 
    password: '', 
    menu: [{ category: '', products: [{ name: '', price: '', description: '', image_url: '' }] }]
  });

  // --- LOGICĂ PENTRU CATEGORII ---
  const addCategory = () => {
    setBarData({
      ...barData,
      menu: [...barData.menu, { category: '', products: [{ name: '', price: '', description: '', image_url: '' }] }]
    });
  };

  const removeCategory = (catIdx: number) => {
    const newMenu = barData.menu.filter((_, idx) => idx !== catIdx);
    setBarData({ ...barData, menu: newMenu });
  };

  const updateCategoryName = (catIdx: number, value: string) => {
    const newMenu = [...barData.menu];
    newMenu[catIdx].category = value;
    setBarData({ ...barData, menu: newMenu });
  };

  // --- LOGICĂ PENTRU PRODUSE ---
  const addProduct = (catIdx: number) => {
    const newMenu = [...barData.menu];
    newMenu[catIdx].products.push({ name: '', price: '', description: '', image_url: '' });
    setBarData({ ...barData, menu: newMenu });
  };

  const removeProduct = (catIdx: number, prodIdx: number) => {
    const newMenu = [...barData.menu];
    newMenu[catIdx].products = newMenu[catIdx].products.filter((_, idx) => idx !== prodIdx);
    setBarData({ ...barData, menu: newMenu });
  };

  const updateProduct = (catIdx: number, prodIdx: number, field: string, value: string) => {
    const newMenu = [...barData.menu];
    newMenu[catIdx].products[prodIdx] = { ...newMenu[catIdx].products[prodIdx], [field]: value };
    setBarData({ ...barData, menu: newMenu });
  };

  // --- TRIMITE DATELE ---
  const handleOnboarding = async () => {
    // validare și pentru username/parolă
    if (!barData.bar_name || !barData.slug || !barData.bar_number_tables || !barData.username || !barData.password) {
      setFeedback({ type: 'error', message: 'Te rog completează datele barului și contul de administrator!' });
      return;
    }

    setIsLoading(true);
    setFeedback({ type: '', message: '' });

    try {
      const response = await fetch('http://localhost:3001/onboarding/full-setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...barData,
          bar_number_tables: Number(barData.bar_number_tables)
        })
      });
      
      if (response.ok) {
        setFeedback({ type: 'success', message: '🚀 Barul a fost lansat cu succes! Te redirecționăm la login...' });
        
        setTimeout(() => {
          router.push('/login');
        }, 2000);
        
      } else {
        const errData = await response.json();
        setFeedback({ type: 'error', message: errData.error || 'Eroare la decolare. Verifică datele.' });
      }
    } catch (error) {
      setFeedback({ type: 'error', message: 'Nu mă pot conecta la server!' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-8 bg-zinc-950 min-h-screen text-white font-sans max-w-5xl mx-auto">
      <div className="mb-10">
        <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-linear-to-r from-red-500 to-orange-500 uppercase tracking-tighter">
          Setup Locație Nouă
        </h1>
        <p className="text-zinc-400 mt-2 font-medium">Configurează detaliile barului și meniul inițial.</p>
      </div>

      {/* --- DATE BAR --- */}
      <div className="bg-zinc-900 border border-zinc-800 p-6 md:p-8 rounded-3xl mb-10 shadow-xl">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
          <span className="bg-zinc-800 p-2 rounded-lg text-red-500">🏢</span> Date Generale
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Nume Bar *</label>
            <input placeholder="Ex: Central Pub" className="p-4 bg-zinc-950 border border-zinc-800 rounded-xl focus:outline-none focus:border-red-500 transition-colors" 
                   value={barData.bar_name} onChange={e => setBarData({...barData, bar_name: e.target.value})} />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Slug (Link unic) *</label>
            <input placeholder="Ex: central-pub" className="p-4 bg-zinc-950 border border-zinc-800 rounded-xl focus:outline-none focus:border-red-500 transition-colors lowercase" 
                   value={barData.slug} onChange={e => setBarData({...barData, slug: e.target.value.replace(/\s+/g, '-').toLowerCase()})} />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Număr Mese *</label>
            <input type="number" placeholder="Ex: 15" className="p-4 bg-zinc-950 border border-zinc-800 rounded-xl focus:outline-none focus:border-red-500 transition-colors"
                   value={barData.bar_number_tables} onChange={e => setBarData({...barData, bar_number_tables: e.target.value})} />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Culoare Brand</label>
            <div className="flex items-center gap-4 bg-zinc-950 border border-zinc-800 p-2 rounded-xl">
              <input type="color" className="w-12 h-10 rounded cursor-pointer bg-transparent border-0" 
                     value={barData.primary_color} onChange={e => setBarData({...barData, primary_color: e.target.value})} />
              <span className="font-mono text-zinc-400">{barData.primary_color}</span>
            </div>
          </div>

          {/* Logo Dark Mode */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Logo — Dark Mode <span className="text-zinc-600 normal-case font-normal">(logo alb/deschis)</span></label>
            <div className="flex items-center gap-3 bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden focus-within:border-red-500 transition-colors">
              <div className="bg-zinc-900 h-full flex items-center px-3 py-3 shrink-0">
                {barData.logo_url
                  ? <img src={barData.logo_url} alt="preview dark" className="h-8 w-auto max-w-[80px] object-contain" onError={e => (e.currentTarget.style.display = 'none')} />
                  : <span className="text-zinc-600 text-xs">Preview</span>
                }
              </div>
              <input
                placeholder="https://exemplu.com/logo-dark.png"
                className="flex-1 p-4 bg-transparent border-0 focus:outline-none text-sm"
                value={barData.logo_url}
                onChange={e => setBarData({...barData, logo_url: e.target.value.trim()})}
              />
            </div>
          </div>

          {/* Logo Light Mode */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Logo — Light Mode <span className="text-zinc-600 normal-case font-normal">(logo închis/negru)</span></label>
            <div className="flex items-center gap-3 bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden focus-within:border-red-500 transition-colors">
              <div className="bg-white h-full flex items-center px-3 py-3 shrink-0">
                {barData.logo_url_light
                  ? <img src={barData.logo_url_light} alt="preview light" className="h-8 w-auto max-w-[80px] object-contain" onError={e => (e.currentTarget.style.display = 'none')} />
                  : <span className="text-gray-400 text-xs">Preview</span>
                }
              </div>
              <input
                placeholder="https://exemplu.com/logo-light.png"
                className="flex-1 p-4 bg-transparent border-0 focus:outline-none text-sm"
                value={barData.logo_url_light}
                onChange={e => setBarData({...barData, logo_url_light: e.target.value.trim()})}
              />
            </div>
          </div>
        </div>
      </div>

      {/* CONT ADMINISTRATOR */}
      <div className="bg-zinc-900 border border-zinc-800 p-6 md:p-8 rounded-3xl mb-10 shadow-xl">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
          <span className="bg-zinc-800 p-2 rounded-lg text-red-500">🔐</span> Cont Administrator
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Nume Utilizator *</label>
            <input 
              placeholder="Ex: patron_central" 
              className="p-4 bg-zinc-950 border border-zinc-800 rounded-xl focus:outline-none focus:border-red-500 transition-colors" 
              value={barData.username} 
              onChange={e => setBarData({...barData, username: e.target.value.trim().toLowerCase()})} 
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Parolă *</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              className="p-4 bg-zinc-950 border border-zinc-800 rounded-xl focus:outline-none focus:border-red-500 transition-colors" 
              value={barData.password} 
              onChange={e => setBarData({...barData, password: e.target.value})} 
            />
          </div>
        </div>
      </div>

      {/* --- MENIU DINAMIC --- */}
      <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
        <span className="bg-zinc-800 p-2 rounded-lg text-red-500">🍔</span> Configurare Meniu
      </h2>

      {barData.menu.map((cat, catIdx) => (
        <div key={catIdx} className="mb-8 border border-zinc-800 bg-zinc-900 rounded-3xl overflow-hidden shadow-lg transition-all">
          <div className="bg-zinc-800/50 p-6 flex justify-between items-center border-b border-zinc-800">
            <input 
              placeholder="Nume Categorie (ex: Cafea)" 
              className="text-2xl font-black bg-transparent focus:outline-none placeholder:text-zinc-600 w-full"
              value={cat.category}
              onChange={e => updateCategoryName(catIdx, e.target.value)} 
            />
            <button onClick={() => removeCategory(catIdx)} className="text-zinc-500 hover:text-red-500 ml-4 p-2 transition-colors" title="Șterge categoria">
              🗑️
            </button>
          </div>
          
          <div className="p-6 space-y-4">
            {cat.products.map((prod, prodIdx) => (
              <div key={prodIdx} className="flex flex-col md:flex-row gap-3 items-start md:items-center bg-zinc-950 p-4 rounded-2xl border border-zinc-800/50">
                <div className="flex-1 w-full space-y-3">
                  <div className="flex gap-3">
                    <input placeholder="Nume Produs" className="flex-2 p-3 bg-zinc-900 border border-zinc-800 rounded-xl focus:outline-none focus:border-red-500 text-sm" 
                           value={prod.name} onChange={e => updateProduct(catIdx, prodIdx, 'name', e.target.value)} />
                    <input placeholder="Preț (RON)" type="number" className="flex-1 p-3 bg-zinc-900 border border-zinc-800 rounded-xl focus:outline-none focus:border-red-500 text-sm" 
                           value={prod.price} onChange={e => updateProduct(catIdx, prodIdx, 'price', e.target.value)} />
                  </div>
                  <input placeholder="Descriere (ex: 200ml, gheață, lapte)" className="w-full p-3 bg-zinc-900 border border-zinc-800 rounded-xl focus:outline-none focus:border-red-500 text-sm text-zinc-400" 
                         value={prod.description} onChange={e => updateProduct(catIdx, prodIdx, 'description', e.target.value)} />
                  <input placeholder="URL Imagine (opțional)" type="url" className="w-full p-3 bg-zinc-900 border border-zinc-800 rounded-xl focus:outline-none focus:border-red-500 text-sm text-zinc-500" 
                         value={prod.image_url} onChange={e => updateProduct(catIdx, prodIdx, 'image_url', e.target.value.trim())} />
                </div>
                
                <button onClick={() => removeProduct(catIdx, prodIdx)} className="text-zinc-600 hover:text-red-500 p-3 bg-zinc-900 rounded-xl border border-zinc-800 transition-colors h-full mt-2 md:mt-0" title="Șterge produs">
                  ✖
                </button>
              </div>
            ))}
            
            <button onClick={() => addProduct(catIdx)} className="text-sm font-bold text-zinc-400 hover:text-white flex items-center gap-2 mt-4 transition-colors">
              <span className="bg-zinc-800 p-1 rounded-md text-red-500">+</span> Adaugă Produs
            </button>
          </div>
        </div>
      ))}

      <div className="flex justify-center mb-12">
        <button onClick={addCategory} className="border-2 border-dashed border-zinc-700 hover:border-red-500 text-zinc-400 hover:text-red-500 w-full py-6 rounded-3xl font-bold uppercase tracking-widest transition-all">
          + Adaugă Categorie Nouă
        </button>
      </div>
      
      {/* --- FEEDBACK & SUBMIT --- */}
      {feedback.message && (
        <div className={`p-4 rounded-xl mb-6 font-bold text-center ${feedback.type === 'error' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-green-500/20 text-green-400 border border-green-500/30'}`}>
          {feedback.message}
        </div>
      )}

      <div className="sticky bottom-6 z-10">
        <button 
          onClick={handleOnboarding} 
          disabled={isLoading}
          className={`w-full p-5 rounded-2xl font-black text-xl uppercase tracking-widest shadow-2xl transition-all
            ${isLoading ? 'bg-zinc-700 text-zinc-400 cursor-not-allowed' : 'bg-linear-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white hover:scale-[1.01]'}`}
        >
          {isLoading ? 'Se lansează sistemul...' : 'LANSEAZĂ BARUL PE PLATFORMĂ'}
        </button>
      </div>
    </div>
  );
}