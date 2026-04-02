import { fetchWithAuth } from "../utils/fetchWithAuth";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export const dashboardService = {
  getSummary: async (barId: string) => {
    try {
      const res = await fetchWithAuth(`${API_BASE_URL}/dashboard/summary/${barId}`);
      console.log("Dashboard Summary Response:", res);
      if (!res.ok) throw new Error("Eroare la server");
      return await res.json();
    } catch (error) {
      console.error("Dashboard Service Error:", error);
      return []; // Returnăm o listă goală ca fallback
    }
  },

  completeRequest: async (itemId: string) => {
    const res = await fetchWithAuth(`${API_BASE_URL}/requests/${itemId}/complete`, {
      method: "PATCH",
    });
    return res.ok;
  },
  serveItem: async (itemId: string) => {
    const res = await fetchWithAuth(`${API_BASE_URL}/order-items/${itemId}/serve`, { 
        method: "PATCH" 
      });
    return res.ok;
  },
  closeTable: async (tableId: string) => {
    const res = await fetchWithAuth(`${API_BASE_URL}/tables/${tableId}/close`, { 
        method: "PATCH" 
      });
    return res.ok;
  },
  approveTable: async (tableId: string) => {
    const res = await fetchWithAuth(`${API_BASE_URL}/dashboard/approve-table`, {
      method: 'POST',
      body: JSON.stringify({ tableId })
    });
    return res.ok;
  },

  rejectTable: async (tableId: string) => {
    const res = await fetchWithAuth(`${API_BASE_URL}/dashboard/reject-table`, {
      method: 'POST',
      body: JSON.stringify({ tableId })
    });
    return res.ok;
  },
  mergeTables: async (payload: { sourceId: string; targetId: string ; bar_id : string}) => {
    try {
      const res = await fetchWithAuth(`${API_BASE_URL}/dashboard/merge-tables`, { // Asigură-te că pui URL-ul tău corect
        method: "POST",
        body: JSON.stringify(payload),
      });
      return res.ok;
    } catch (error) {
      console.error("Eroare la unire mese:", error);
      return false;
    }
  },

  createCategory: async (payload: { bar_id: string; name: string }) => {
    const res = await fetchWithAuth(`${API_BASE_URL}/categories`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw new Error(error.error || "Eroare la salvarea categoriei");
    }
    return res.json();
  },

  createProduct: async (payload: any) => {
    const res = await fetchWithAuth(`${API_BASE_URL}/dashboard/products`, { // Wait, wait. Product POST endpoint?
      // Wait, is it /dashboard/products or /products? Look at dashboard.routes.js: router.post("/products", addProductHandler); Yes it is /dashboard/products.
      // And in menu.routes.js: router.post("/products", createProductHandler);
      // Let's use /dashboard/products since it was already used by menuSection.tsx
      method: "POST",
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw new Error(error.error || "Eroare la adăugare produs");
    }
    return res.json();
  },

  updateProduct: async (id: string, payload: any) => {
    const res = await fetchWithAuth(`${API_BASE_URL}/dashboard/products/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
       const error = await res.json().catch(() => ({}));
       throw new Error(error.error || "Eroare la actualizare produs");
    }
    return res.json();
  },

  deleteProduct: async (id: string) => {
    const res = await fetchWithAuth(`${API_BASE_URL}/dashboard/products/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) {
       const error = await res.json().catch(() => ({}));
       throw new Error(error.error || "Nu s-a putut șterge produsul");
    }
    return res.json();
  },

  deleteCategory: async (id: string) => {
    const res = await fetchWithAuth(`${API_BASE_URL}/dashboard/categories/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) {
       const error = await res.json().catch(() => ({}));
       throw new Error(error.error || "Nu s-a putut șterge categoria");
    }
    return res.json();
  }
};
