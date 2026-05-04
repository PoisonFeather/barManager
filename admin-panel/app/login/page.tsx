// app/login/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/shared/services/authService";

export default function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [demoSlug, setDemoSlug] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isDemoLoading, setIsDemoLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorMsg("");

        try {
            // SRP: Delegăm logica grea către serviciu
            const data = await authService.login({ username, password });

            // Dacă backend-ul ne trimite slug-ul barului, îl redirecționăm direct acolo!
            if (data.barSlug) {
                router.push(`/dashboard/${data.barSlug}`);
            } else {
                router.push("/dashboard"); // Fallback de siguranță
            }
        } catch (error: any) {
            console.error("Login error:", error);
            setErrorMsg(error.message || "A apărut o eroare la conectare.");
        } finally {
            setIsLoading(false);
        }
    }

    const handleDemoLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsDemoLoading(true);
        setErrorMsg("");

        try {
            const data = await authService.demoLogin(demoSlug.trim());
            if (data.barSlug) {
                router.push(`/dashboard/${data.barSlug}`);
            } else {
                router.push("/dashboard");
            }
        } catch (error: any) {
            console.error("Demo Login error:", error);
            setErrorMsg(error.message || "A apărut o eroare la demo login.");
        } finally {
            setIsDemoLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-[2.5rem] p-8 shadow-2xl border border-zinc-200 dark:border-zinc-800 animate-in fade-in zoom-in duration-500">
                
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-black uppercase tracking-tighter text-zinc-900 dark:text-white mb-2">
                        Bar Manager
                    </h1>
                    <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">
                        Login Dashboard
                    </p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-2">Nume utilizator</label>
                        <input 
                            type="text" 
                            value={username}
                            onChange={(e) => setUsername(e.target.value.trim())}
                            className="w-full p-4 bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl focus:outline-none focus:border-orange-500 transition-colors text-zinc-900 dark:text-white"
                            placeholder="Ex: patron_central"
                            required
                            disabled={isLoading}
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-2">Parolă</label>
                        <input 
                            type="password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-4 bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl focus:outline-none focus:border-orange-500 transition-colors text-zinc-900 dark:text-white"
                            placeholder="••••••••"
                            required
                            disabled={isLoading}
                        />
                    </div>

                    {/* Mesajul de eroare */}
                    {errorMsg && (
                        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-xs font-bold text-center">
                            {errorMsg}
                        </div>
                    )}

                    <button 
                        type="submit" 
                        disabled={isLoading}
                        className="w-full mt-4 p-4 rounded-2xl font-black text-sm uppercase bg-orange-500 hover:bg-orange-600 text-black shadow-lg shadow-orange-500/20 transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100"
                    >
                        {isLoading ? "Se conectează..." : "Intră în cont"}
                    </button>
                </form>

                <div className="mt-8 border-t border-zinc-200 dark:border-zinc-800 pt-6">
                    <div className="text-center mb-4">
                        <h2 className="text-sm font-black uppercase text-zinc-900 dark:text-white">Testează fără cont</h2>
                    </div>
                    <form onSubmit={handleDemoLogin} className="space-y-4">
                        <div className="space-y-1">
                            <input 
                                type="text" 
                                value={demoSlug}
                                onChange={(e) => setDemoSlug(e.target.value)}
                                className="w-full p-4 bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl focus:outline-none focus:border-orange-500 transition-colors text-zinc-900 dark:text-white"
                                placeholder="bar-slug (ex: pub123)"
                                required
                                disabled={isDemoLoading}
                            />
                        </div>
                        <button 
                            type="submit" 
                            disabled={isDemoLoading}
                            className="w-full mt-2 p-4 rounded-2xl font-black text-sm uppercase bg-zinc-800 hover:bg-zinc-700 text-white shadow-lg transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100"
                        >
                            {isDemoLoading ? "Se accesează..." : "Demo Login"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}