const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export const orderService = {
  // Preia produsele deja comandate și servite la masa curentă
  fetchHistory: async (tableId: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/table-history/${tableId}`);
      if (!res.ok) return [];
      return await res.json();
    } catch (err) {
      console.error("History Service Error:", err);
      return [];
    }
  },

  // Trimite coșul de cumpărături către backend
  sendOrder: async (payload: any) => {
    try {
      const response = await fetch(`${API_BASE_URL}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      return await response.json();
    } catch (err) {
      console.error("Order Service Error:", err);
      return { success: false };
    }
  },

  // Trimite cereri speciale (Chelner sau Notă)
  sendRequest: async (payload: any) => {
    try {
      const response = await fetch(`${API_BASE_URL}/requests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      return response.ok;
    } catch (err) {
      console.error("Request Service Error:", err);
      return false;
    }
  }
};