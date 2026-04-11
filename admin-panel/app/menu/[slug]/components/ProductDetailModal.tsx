"use client";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";

interface ProductDetailModalProps {
  prod: any;
  primaryColor: string;
  onAdd: (product: any) => void;
  onClose: () => void;
}

export function ProductDetailModal({ prod, primaryColor, onAdd, onClose }: ProductDetailModalProps) {
  // Treat undefined/null as available — only explicit false means unavailable
  const isAvailable = prod.is_available !== false;

  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Compute perceived luminance (0 = black, 1 = white)
  const getLuminance = (hex: string): number => {
    const c = hex.replace('#', '');
    if (c.length !== 6) return 0.5;
    const r = parseInt(c.slice(0, 2), 16) / 255;
    const g = parseInt(c.slice(2, 4), 16) / 255;
    const b = parseInt(c.slice(4, 6), 16) / 255;
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };

  // Returns a price color with guaranteed contrast against the modal background.
  // Light mode bg = white (~lum 1)  → color must be dark enough (lum < 0.7)
  // Dark mode bg  = zinc-900 (~lum 0.05) → color must be light enough (lum > 0.2)
  const getPriceColor = (): string => {
    const isDark = mounted && resolvedTheme === 'dark';
    const lum = getLuminance(primaryColor || '#888888');
    if (isDark) {
      // On dark bg: if the color is too dark, use white
      return lum < 0.2 ? '#ffffff' : primaryColor;
    } else {
      // On light bg: if the color is too light, use near-black
      return lum > 0.7 ? '#18181b' : primaryColor;
    }
  };

  const handleAdd = () => {
    onAdd(prod);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end">
      {/* Overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-md"
      />

      {/* Card */}
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 28, stiffness: 220 }}
        className="relative bg-white dark:bg-zinc-900 w-full max-h-[90vh] rounded-t-[2.5rem] shadow-2xl flex flex-col overflow-hidden"
      >
        {/* Drag pill */}
        <div className="w-12 h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-full mx-auto mt-5 mb-2 shrink-0" />

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto">
          {/* Image — optional */}
          {prod.image_url && (
            <div className="relative w-full h-72 sm:h-80 overflow-hidden flex items-center justify-center bg-zinc-50 dark:bg-zinc-950">
              {/* Blurred Ambient Glow extracted from the image */}
              <div 
                className="absolute inset-0 bg-cover bg-center opacity-40 dark:opacity-30 blur-3xl scale-125 saturate-150 mix-blend-multiply dark:mix-blend-screen"
                style={{ backgroundImage: `url(${prod.image_url})` }}
              />
              
              {/* Gradient overlay to smoothly blend the image area into the white/dark text section below */}
              <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-white via-white/60 to-transparent dark:from-zinc-900 dark:via-zinc-900/60 z-0" />
              
              {/* The Product Image itself floating on top */}
              <div className="relative z-10 w-full h-full p-8 pb-4">
                <img
                  src={prod.image_url}
                  alt={prod.name}
                  className="w-full h-full object-contain filter drop-shadow-[0_20px_35px_rgba(0,0,0,0.15)] dark:drop-shadow-[0_20px_35px_rgba(0,0,0,0.5)] transform transition-transform duration-700 hover:scale-105"
                />
              </div>
            </div>
          )}

          <div className="px-7 pt-6 pb-4">
            {/* Header row */}
            <div className="flex items-start justify-between gap-4 mb-1">
              <h2 className="text-2xl font-black uppercase tracking-tight leading-tight dark:text-white flex-1">
                {prod.name}
              </h2>
              <button
                onClick={onClose}
                className="shrink-0 w-9 h-9 flex items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors text-lg"
                aria-label="Închide"
              >
                ×
              </button>
            </div>

            {/* Price */}
            <p className="text-xl font-black mb-5" style={{ color: getPriceColor() }}>
              {Number(prod.price).toFixed(2)} <span className="text-sm font-bold opacity-60">RON</span>
            </p>

            {/* Full description */}
            {prod.description ? (
              <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed whitespace-pre-line">
                {prod.description}
              </p>
            ) : (
              <p className="text-sm text-zinc-400 dark:text-zinc-600 italic">
                Fără descriere disponibilă.
              </p>
            )}
          </div>
        </div>

        {/* Footer — Add to order button */}
        <div className="px-7 py-6 bg-white dark:bg-zinc-900 border-t border-zinc-100 dark:border-white/5 shrink-0">
          {isAvailable ? (
            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={handleAdd}
              className="w-full py-5 rounded-3xl font-black text-base uppercase tracking-widest shadow-lg active:scale-95 flex items-center justify-between px-8 group transition-opacity"
              style={{ backgroundColor: primaryColor, color: '#000' }}
            >
              <span>Adaugă la comandă</span>
              <span className="opacity-50 group-hover:translate-x-1 transition-transform text-xl">+</span>
            </motion.button>
          ) : (
            <div className="w-full py-5 rounded-3xl font-black text-base uppercase tracking-widest text-center bg-zinc-100 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-600">
              Indisponibil momentan
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
