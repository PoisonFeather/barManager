const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

// Generează sau recuperează un token unic per browser (nu per sesiune de masă)
// Acesta identifică persoana fizică, nu masa
function getOrCreatePersonalToken(): string {
  const key = "personal_browser_token";
  let token = localStorage.getItem(key);
  if (!token) {
    token = crypto.randomUUID();
    localStorage.setItem(key, token);
  }
  return token;
}

export const orderService = {
  // Preia produsele deja comandate și servite la masa curentă
  fetchHistory: async (tableId: string) => {
    try {
        const res = await fetch(`${API_BASE_URL}/table-history/${tableId}?t=${Date.now()}`);
        if (!res.ok) return [];
      return await res.json();
    } catch (err) {
      console.error("History Service Error:", err);
      return [];
    }
  },

  // Trimite coșul de cumpărături către backend
  sendOrder: async (payload: any) => {
    const token = localStorage.getItem(`session_${payload.table_id}`);
    const personalToken = getOrCreatePersonalToken();
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        ...payload, 
        session_token: token,       // 🔑 Token de securitate al mesei
        personal_token: personalToken // 🧍 Token unic per browser — pentru "Contribuția Ta"
      })
    });
    return res.json();
  },

  // Trimite cereri speciale (Chelner sau Notă)
  sendRequest: async (payload: any) => {
    try {
        const token = localStorage.getItem(`session_${payload.table_id}`);
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/requests`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                ...payload,
            session_token:token})
          });
      return res.ok;
    } catch (err) {
      console.error("Request Service Error:", err);
      return false;
    }
  },

  // Deblochează o masă când un "prieten" a întârziat peste sfertul academic
  unlockTable: async (tableId: string) => {
    try {
      const token = localStorage.getItem(`session_${tableId}`);
      if (!token) return false;

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tables/${tableId}/unlock`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-cache' },
        body: JSON.stringify({ session_token: token })
      });
      return res.ok;
    } catch (err) {
      console.error("Unlock Error:", err);
      return false;
    }
  },

  // Returnează doar produsele comandate de browserul curent (per personal_token unic)
  fetchMyShare: async (tableId: string): Promise<any[]> => {
    try {
      const personalToken = getOrCreatePersonalToken();
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tables/${tableId}/my-share?personal_token=${encodeURIComponent(personalToken)}`);
      if (!res.ok) return [];
      return await res.json();
    } catch (err) {
      console.error("My Share Error:", err);
      return [];
    }
  }
};