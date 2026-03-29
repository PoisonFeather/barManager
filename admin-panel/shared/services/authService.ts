const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export const authService = {
  login: async (credentials: { username: string; password: string }) => {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || "Date de autentificare incorecte!");
    }

    const data = await res.json();
    
    // MVP: Salvăm token-ul în localStorage pentru viitoarele autorizări
    if (data.token) {
      localStorage.setItem("token", data.token);
    }

    return data; // Returnăm datele (ex: barSlug) către UI
  },

  logout: () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  }
};