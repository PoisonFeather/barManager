import { motion } from "framer-motion";

interface ProductCardProps {
  prod: any;
  onAdd: (product: any) => void;
  onOpenDetail: (product: any) => void;
  primaryColor: string;
  allowOrdering: boolean;
}

export function ProductCard({ prod, onAdd, onOpenDetail, primaryColor, allowOrdering }: ProductCardProps) {
  // Treat undefined/null as available — only explicit false means unavailable
  const isAvailable = prod.is_available !== false;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={() => onOpenDetail(prod)}
      className={`bg-white dark:bg-zinc-900/40 p-5 rounded-4xl flex justify-between items-center border border-zinc-100 dark:border-white/5 shadow-sm transition-all cursor-pointer active:scale-[0.98] ${!isAvailable ? 'opacity-40 grayscale' : ''}`}
    >
      <div className="flex-1 pr-4">
        <h3 className="font-bold text-lg dark:text-zinc-100">{prod.name}</h3>
        {prod.description && (
          <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1 mb-2 line-clamp-2 leading-snug">
            {prod.description}
          </p>
        )}
        <span className="text-zinc-500 dark:text-zinc-400 font-black text-sm">
          {Number(prod.price).toFixed(2)} RON
        </span>
        </span>
      </div>

      {isAvailable && allowOrdering && (
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={(e) => {
            e.stopPropagation(); // Prevent opening the detail modal
            onAdd(prod);
          }}
          className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl font-light bg-zinc-100 dark:bg-white/5 transition-colors relative overflow-hidden shrink-0"
        >
          {/* Light mode: icon întunecat */}
          <span className="block dark:hidden text-zinc-800">+</span>
          {/* Dark mode: icon în culoarea brandului */}
          <span className="hidden dark:block" style={{ color: primaryColor }}>+</span>
        </motion.button>
      )}
    </motion.div>
  );
}