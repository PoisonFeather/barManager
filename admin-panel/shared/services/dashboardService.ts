const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export const dashboardService = {
  getSummary: async (barId: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/dashboard/summary/${barId}`);
      console.log("Dashboard Summary Response:", res);
      if (!res.ok) throw new Error("Eroare la server");
      return await res.json();
    } catch (error) {
      console.error("Dashboard Service Error:", error);
      return []; // Returnăm o listă goală ca fallback
    }
  },

  completeRequest: async (itemId: string) => {
    const res = await fetch(`${API_BASE_URL}/requests/${itemId}/complete`, {
      method: "PATCH",
    });
    return res.ok;
  },
  serveItem: async (itemId: string) => {
    const res = await fetch(`${API_BASE_URL}/order-items/${itemId}/serve`, { 
        method: "PATCH" 
      });
    return res.ok;
  },
  closeTable: async (tableId: string) => {
    const res = await fetch(`${API_BASE_URL}/tables/${tableId}/close`, { 
        method: "PATCH" 
      });
    return res.ok;
  },
  approveTable: async (tableId: string) => {
    const res = await fetch(`${API_BASE_URL}/dashboard/approve-table`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tableId })
    });
    return res.ok;
  },

  rejectTable: async (tableId: string) => {
    const res = await fetch(`${API_BASE_URL}/dashboard/reject-table`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tableId })
    });
    return res.ok;
  },
};
