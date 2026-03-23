/* Onboarding dashboard 
- Form pentru a introduce toate datele necesare despre bar (nume, slug, culoare, numar mese)
- Form dinamic pentru a adăuga categorii și produse (cu nume și preț)
- Buton de submit care trimite totul la backend pentru a crea barul și meniul aferent
TODO:
- Validări de bază (ex: nume obligatoriu, preț numeric)
- Feedback vizual pentru erori sau succes
- Posibilitate de a adăuga o descriere pentru fiecare produs
- Posibilitate de a șterge categorii sau produse adăugate din greșeală
- Design responsive și user-friendly

*/


"use client";
import { useState } from 'react';

export default function OnboardingPage() {
  const [barData, setBarData] = useState({
    bar_name: '',
    slug: '',
    primary_color: '#000000',
    bar_number_tables:0,
    menu: [{ category: '', products: [{ name: '', price: '', description: '' }] }]
  });

  // Logica pentru a adăuga o categorie nouă în formular
  const addCategory = () => {
    setBarData({
      ...barData,
      menu: [...barData.menu, { category: '', products: [{ name: '', price: '', description: '' }] }]
    });
  };

  // Logica pentru a trimite totul la server
  const handleOnboarding = async () => {
    const response = await fetch('http://localhost:3001/onboarding/full-setup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(barData)
    });
    
    if (response.ok) {
      alert("LIVE");
    } else {
      alert("Eroare la decolare. Verifică terminalul.");
    }
  };
  // Logica pentru a adăuga un produs nou într-o categorie specifică
  return (
    <div className="p-8 bg-black min-h-screen text-white font-sans">
      <h1 className="text-4xl font-black mb-8 text-red-600">NEW BAR ONBOARDING</h1>
      
      {/* Date Bar */}
      <div className="grid grid-cols-3 gap-4 mb-10 bg-zinc-900 p-6 rounded-xl">
        <input placeholder="Nume Bar" className="p-3 bg-zinc-800 rounded" 
               onChange={e => setBarData({...barData, bar_name: e.target.value})} />
        <input placeholder="Slug (ex: test-pub)" className="p-3 bg-zinc-800 rounded" 
               onChange={e => setBarData({...barData, slug: e.target.value})} />
        <input type="color" className="w-full h-12 bg-zinc-800 rounded cursor-pointer" 
               onChange={e => setBarData({...barData, primary_color: e.target.value})} />
        <input type="number" placeholder='Numar mese' className="p-3 bg-zinc-800 rounded"
            onChange={e => setBarData({...barData, bar_number_tables : Number(e.target.value)})} />
      </div>

      {/* Dinamic Menu */}
      {barData.menu.map((cat, catIdx) => (
        <div key={catIdx} className="mb-6 border-l-4 border-red-600 pl-6 bg-zinc-900 p-6 rounded-r-xl">
          <input placeholder="Nume Categorie (ex: Beri)" className="text-xl font-bold bg-transparent border-b border-zinc-700 mb-4 w-full"
                 onChange={e => {
                   const newMenu = [...barData.menu];
                   newMenu[catIdx].category = e.target.value;
                   setBarData({...barData, menu: newMenu});
                 }} />
          
          {cat.products.map((prod, prodIdx) => (
            <div key={prodIdx} className="grid grid-cols-3 gap-2 mb-2">
              <input placeholder="Produs" className="p-2 bg-zinc-800 rounded text-sm" 
                     onChange={e => {
                       const newMenu = [...barData.menu];
                       newMenu[catIdx].products[prodIdx].name = e.target.value;
                       setBarData({...barData, menu: newMenu});
                     }}/>
              <input placeholder="Preț" type="number" className="p-2 bg-zinc-800 rounded text-sm" 
                     onChange={e => {
                       const newMenu = [...barData.menu];
                       newMenu[catIdx].products[prodIdx].price = e.target.value;
                       setBarData({...barData, menu: newMenu});
                     }}/>
              <button className="text-zinc-500 text-xs text-left" onClick={() => {
                const newMenu = [...barData.menu];
                newMenu[catIdx].products.push({name: '', price: '', description: ''});
                setBarData({...barData, menu: newMenu});
              }}>+ Adaugă Produs</button>
            </div>
          ))}
        </div>
      ))}

      <button onClick={addCategory} className="mb-10 text-red-500 font-bold">+ ADAUGĂ CATEGORIE NOUĂ</button>
      
      <button onClick={handleOnboarding} className="w-full bg-red-600 p-4 rounded-full font-black text-xl hover:bg-red-500 transition">
        LANSEAZĂ BARUL PE PLATFORMĂ
      </button>
    </div>
  );
}