const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

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
    // Mergem la buzunarul unde am pus cheia în page.tsx
    const token = localStorage.getItem(`session_${payload.table_id}`);
    //console.log("Order Payload:", payload);
    //console.log(localStorage);
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        ...payload, 
        session_token: token // 🔑 Aici punem cheia în plic
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
            session_token:token}) // Trimitem tot obiectul, inclusiv session_token
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
  }
};