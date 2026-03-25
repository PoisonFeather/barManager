const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export const menuService = {
  /**
   * Preia meniul complet (categorii + produse) pentru un bar specific.
   * @param slug - Identificatorul unic al barului din URL
   */
  getMenuBySlug: async (slug: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/menu-complete/${slug}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Eroare la preluarea meniului: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Menu Service Error:", error);
      return null;
    }
  },

  // Aici poți adăuga pe viitor și alte metode, de exemplu:
  // getProductById: async (id: string) => { ... }
};