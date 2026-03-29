const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export const barService = {
  // Aduce datele complete ale barului pe baza slug-ului din URL
  getBarBySlug: async (slug: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/menu-complete/${slug}`);
      if (!res.ok) throw new Error('Barul nu a fost găsit ${res.status}');
      return await res.json();
    } catch (error) {
      console.error("Bar Service Error:", error);
      return null;
    }
  }
};