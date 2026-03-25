// components/DashboardHeader.tsx
import { ThemeToggle } from "@/components/ThemeToggle";

interface Props {
  barName: string;
  activeTab: "orders" | "stock";
  setActiveTab: (tab: "orders" | "stock") => void;
  tableCount: number;
  isAudioEnabled: boolean;
  onEnableAudio: () => void;
}

export function DashboardHeader({ barName, activeTab, setActiveTab, tableCount, isAudioEnabled, onEnableAudio }: Props) {
  return (
    <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
      <div>
        <h1 className="text-4xl font-black uppercase tracking-tighter leading-none">{barName}</h1>
        <p className="text-[10px] text-zinc-500 uppercase font-black tracking-widest mt-2 flex items-center gap-2">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span> Dashboard Live
        </p>
      </div>

      {!isAudioEnabled && (
        <div className="fixed inset-0 z-100 bg-black/60 backdrop-blur-md flex items-center justify-center">
          <button onClick={onEnableAudio} className="bg-orange-500 hover:bg-orange-600 text-black font-black px-10 py-5 rounded-4xl text-xl shadow-2xl animate-bounce">
            🚀 ACTIVEAZĂ ALERTELE SONORE
          </button>
        </div>
      )}

      <div className="flex items-center gap-4 w-full md:w-auto">
        <ThemeToggle />
        <div className="flex flex-1 md:flex-none gap-1 bg-zinc-200 dark:bg-black/50 p-1.5 rounded-2xl border border-zinc-300 dark:border-white/5">
          <button onClick={() => setActiveTab("orders")} className={`flex-1 md:flex-none px-6 py-2 rounded-xl font-black text-[10px] uppercase ${activeTab === "orders" ? "bg-white dark:bg-zinc-800 shadow-lg" : "text-zinc-500"}`}>
            Mese ({tableCount})
          </button>
          <button onClick={() => setActiveTab("stock")} className={`flex-1 md:flex-none px-6 py-2 rounded-xl font-black text-[10px] uppercase ${activeTab === "stock" ? "bg-white dark:bg-zinc-800 shadow-lg" : "text-zinc-500"}`}>
            Stoc
          </button>
        </div>
      </div>
    </header>
  );
}