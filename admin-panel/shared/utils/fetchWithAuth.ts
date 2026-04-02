// shared/utils/fetchWithAuth.ts

export async function fetchWithAuth(url: string, options: RequestInit = {}) {
  let token = null;
  if (typeof window !== "undefined") {
    token = localStorage.getItem("token");
  }

  const headers: HeadersInit = {
    ...(options.headers || {}),
  };

  // Do not override Content-Type if already set, but default to json if body is present and it's missing
  if (options.body && typeof options.body === "string" && !("Content-Type" in headers)) {
    (headers as any)["Content-Type"] = "application/json";
  }

  // Previn un bug faimos din Next.js Rewrites (304 Not Modified) când se lovește proxy-ul prin Ngrok
  (headers as any)["Cache-Control"] = "no-cache";

  if (token) {
    (headers as any)["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(url, { ...options, headers });

  // Dacă token-ul a expirat sau este invalid
  if (response.status === 401) {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
  }

  return response;
}
