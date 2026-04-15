"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";

export default function SuperAdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${BACKEND_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Eroare la autentificare.");
        return;
      }

      if (data.role !== "superadmin") {
        setError("Acces interzis. Numai administratorii SaaS pot intra aici.");
        return;
      }

      localStorage.setItem("superadmin_token", data.token);
      router.push("/superadmin");
    } catch {
      setError("Eroare de rețea. Verifică conexiunea la backend.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#080808] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Glow */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-orange-600/10 blur-[180px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[40%] h-[40%] bg-orange-500/5 blur-[180px] rounded-full pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 22 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Logo */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-orange-600 to-orange-400 flex items-center justify-center shadow-[0_0_30px_rgba(234,88,12,0.4)] mb-4">
            <span className="text-black font-black text-lg tracking-widest">BM</span>
          </div>
          <h1 className="text-2xl font-black tracking-tighter text-white">BarManager</h1>
          <p className="text-xs text-zinc-500 font-bold uppercase tracking-[0.2em] mt-1">
            SaaS Admin Portal
          </p>
        </div>

        {/* Card */}
        <div className="bg-zinc-900/70 border border-white/8 rounded-[2rem] p-8 backdrop-blur-md shadow-2xl">
          <h2 className="text-lg font-black text-white mb-1 tracking-tight">Bun venit, Andrei</h2>
          <p className="text-sm text-zinc-500 font-medium mb-8">
            Autentifică-te pentru a accesa controlul global al platformei.
          </p>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2">
                Username
              </label>
              <input
                id="superadmin-username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="AndreiBarManager"
                required
                autoComplete="username"
                className="w-full bg-zinc-800/80 border border-white/8 rounded-xl px-4 py-3 text-white text-sm font-medium placeholder:text-zinc-600 focus:outline-none focus:border-orange-500/60 focus:bg-zinc-800 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2">
                Parolă
              </label>
              <input
                id="superadmin-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                required
                autoComplete="current-password"
                className="w-full bg-zinc-800/80 border border-white/8 rounded-xl px-4 py-3 text-white text-sm font-medium placeholder:text-zinc-600 focus:outline-none focus:border-orange-500/60 focus:bg-zinc-800 transition-all"
              />
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3"
              >
                <span>⚠️</span> {error}
              </motion.div>
            )}

            <button
              id="superadmin-login-btn"
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-orange-500 text-black font-black uppercase tracking-widest text-sm hover:bg-orange-400 hover:scale-[1.02] active:scale-100 transition-all shadow-[0_0_20px_rgba(234,88,12,0.3)] disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {loading ? "Se autentifică..." : "Intră în Dashboard"}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-zinc-700 font-medium mt-6">
          Acces restricționat · BarManager SaaS © 2026
        </p>
      </motion.div>
    </div>
  );
}
