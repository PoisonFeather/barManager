import { motion } from "framer-motion";

interface ProductDetailModalProps {
  prod: any;
  primaryColor: string;
  onAdd: (product: any) => void;
  onClose: () => void;
}

export function ProductDetailModal({ prod, primaryColor, onAdd, onClose }: ProductDetailModalProps) {
  // Treat undefined/null as available — only explicit false means unavailable
  const isAvailable = prod.is_available !== false;

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
            <div className="w-full h-56 sm:h-64 overflow-hidden">
              <img
                src={prod.image_url}
                alt={prod.name}
                className="w-full h-full object-cover"
              />
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
            <p className="text-xl font-black mb-5" style={{ color: primaryColor }}>
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
