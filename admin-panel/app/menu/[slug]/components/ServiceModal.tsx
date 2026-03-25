// app/menu/[slug]/components/ServiceModal.tsx
import { useState } from 'react';
import { motion } from "framer-motion";

interface Props {
  onSendRequest: (type: string, method?: string | null) => void;
  onClose: () => void;
}

export function ServiceModal({ onSendRequest, onClose }: Props) {
  const [step, setStep] = useState<'choice' | 'payment'>('choice');

  return (
    <div className="fixed inset-0 z-60 flex flex-col justify-end">
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm" 
        onClick={onClose} 
      />
      
      <motion.div 
        initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
        className="relative bg-zinc-950 w-full rounded-t-[3rem] p-10 pb-16 border-t border-white/5"
      >
        <div className="w-12 h-1.5 bg-zinc-800 rounded-full mx-auto mb-10" />
        
        {step === 'choice' ? (
          <div className="grid gap-4">
            <h3 className="text-center font-black uppercase text-[10px] tracking-widest mb-4 text-zinc-500">Servicii Masă</h3>
            <button onClick={() => onSendRequest('waiter')} className="w-full p-6 rounded-4xl bg-white/5 border border-white/10 flex items-center justify-between active:bg-white/10 transition-all">
              <div className="flex items-center gap-4"><span className="text-2xl">🛎️</span><span className="font-bold text-lg text-white">Cheamă Chelnerul</span></div>
              <span className="text-zinc-500">→</span>
            </button>
            <button onClick={() => setStep('payment')} className="w-full p-6 rounded-4xl bg-white/5 border border-white/10 flex items-center justify-between active:bg-white/10 transition-all">
              <div className="flex items-center gap-4"><span className="text-2xl">🧾</span><span className="font-bold text-lg text-white">Cere Nota de Plată</span></div>
              <span className="text-zinc-500">→</span>
            </button>
          </div>
        ) : (
          <div className="grid gap-6">
            <h3 className="text-center font-black uppercase text-[10px] tracking-widest opacity-40 text-white">Metoda de plată?</h3>
            <div className="grid grid-cols-2 gap-4">
              <button onClick={() => onSendRequest('bill', 'cash')} className="flex flex-col items-center gap-3 p-8 rounded-[2.5rem] bg-zinc-900 border border-white/5 active:scale-95 transition-all text-white">
                <span className="text-4xl">💵</span><span className="font-black uppercase text-[10px]">CASH</span>
              </button>
              <button onClick={() => onSendRequest('bill', 'card')} className="flex flex-col items-center gap-3 p-8 rounded-[2.5rem] bg-zinc-900 border border-white/5 active:scale-95 transition-all text-white">
                <span className="text-4xl">💳</span><span className="font-black uppercase text-[10px]">CARD</span>
              </button>
            </div>
            <button onClick={() => setStep('choice')} className="text-[10px] font-black uppercase opacity-30 mt-4 tracking-widest text-center w-full text-white">← Înapoi</button>
          </div>
        )}
      </motion.div>
    </div>
  );
}