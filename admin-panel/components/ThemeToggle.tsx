"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Evităm eroarea de hidratare: componenta se randează doar pe client
  useEffect(() => setMounted(true), []);

  if (!mounted) return <div className="w-10 h-10" />; // Spațiu gol până la încărcare

  const isDark = resolvedTheme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="group relative inline-flex h-9 w-16 items-center rounded-full bg-zinc-200 dark:bg-zinc-800 transition-colors focus:outline-none shadow-inner"
    >
      <span
        className={`${
          isDark ? "translate-x-8 bg-zinc-900" : "translate-x-1 bg-white"
        } inline-block h-7 w-7 transform rounded-full transition-transform duration-300 ease-in-out items-center justify-center shadow-md`}
      >
        {isDark ? (
          <span className="text-[14px]">🌙</span>
        ) : (
          <span className="text-[14px]">☀️</span>
        )}
      </span>
    </button>
  );
}