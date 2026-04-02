import { fetchWithAuth } from "../utils/fetchWithAuth";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export const stockService = {
  toggleStock: async (prodId: string | number, currentStatus: boolean) => {
    const newStatus = !currentStatus;

    try {
      const res = await fetchWithAuth(`${API_BASE_URL}/dashboard/products/${prodId}/toggle`, {
        method: "PATCH",
        body: JSON.stringify({ is_available: newStatus }),
      });

      if (!res.ok) {
        // Dacă serverul dă eroare de validare, vedem aici detaliile
        const errorData = await res.json();
        console.error("Backend validation error:", errorData);
        return null;
      }

      return newStatus;
    } catch (err) {
      console.error("Stock Service Network Error:", err);
      return null;
    }
  },
};