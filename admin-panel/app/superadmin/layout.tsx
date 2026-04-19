"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const NAV_ITEMS = [
  { href: "/superadmin",       label: "Overview",    icon: "📊" },
  { href: "/superadmin/bars",  label: "Baruri",      icon: "🍺" },
];

export default function SuperAdminLayout({ children }: { children: React.ReactNode }) {
  const router   = useRouter();
  const pathname = usePathname();
  const [ready, setReady] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  // Auth guard — rulează strict client-side
  useEffect(() => {
    const token = localStorage.getItem("superadmin_token");
    if (!token && pathname !== "/superadmin/login") {
      router.replace("/superadmin/login");
    } else {
      setReady(true);
    }
  }, [pathname, router]);

  // Nu randa layout-ul pe pagina de login
  if (pathname === "/superadmin/login") return <>{children}</>;
  if (!ready) {
    return (
      <div className="min-h-screen bg-[#080808] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  function handleLogout() {
    localStorage.removeItem("superadmin_token");
    router.push("/superadmin/login");
  }

  return (
    <div className="min-h-screen bg-[#080808] text-white flex">
      {/* ── SIDEBAR ──────────────────────────────────────────────────── */}
      <motion.aside
        animate={{ width: collapsed ? 72 : 220 }}
        transition={{ type: "spring", stiffness: 320, damping: 28 }}
        className="relative flex flex-col border-r border-white/5 bg-zinc-950/80 shrink-0 overflow-hidden"
      >
        {/* Logo */}
        <div className="h-16 flex items-center gap-3 px-4 border-b border-white/5 shrink-0">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-orange-600 to-orange-400 flex items-center justify-center shadow-[0_0_12px_rgba(234,88,12,0.4)] shrink-0">
            <span className="text-black font-black text-[10px]">BM</span>
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="font-black tracking-tighter text-sm whitespace-nowrap overflow-hidden"
              >
                SaaS Admin
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 flex flex-col gap-1 px-2">
          {NAV_ITEMS.map(({ href, label, icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-all
                  ${active
                    ? "bg-orange-500/15 text-orange-400"
                    : "text-zinc-500 hover:text-white hover:bg-white/5"
                  }
                `}
              >
                <span className="text-base shrink-0">{icon}</span>
                <AnimatePresence>
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="whitespace-nowrap overflow-hidden"
                    >
                      {label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>
            );
          })}
        </nav>

        {/* User + Logout */}
        <div className="border-t border-white/5 p-3">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-bold text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-all"
          >
            <span className="text-base shrink-0">🚪</span>
            <AnimatePresence>
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="whitespace-nowrap"
                >
                  Deconectare
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed((c) => !c)}
          className="absolute top-[18px] -right-3 w-6 h-6 rounded-full bg-zinc-800 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-700 transition-all text-[10px]"
          aria-label={collapsed ? "Extinde meniu" : "Restrânge meniu"}
        >
          {collapsed ? "›" : "‹"}
        </button>
      </motion.aside>

      {/* ── MAIN CONTENT ─────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="h-16 border-b border-white/5 flex items-center justify-between px-6 bg-zinc-950/40 backdrop-blur-sm shrink-0">
          <div>
            <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">
              {NAV_ITEMS.find((n) => n.href === pathname)?.label ?? "BarManager SaaS"}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900 border border-white/8 text-xs font-bold text-zinc-300">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              AndreiBarManager
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
