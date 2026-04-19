import { motion } from "framer-motion";

interface SidebarProps {
  mainView: "workspace" | "analytics";
  setMainView: (view: "workspace" | "analytics") => void;
  userRole?: string;
}

export function Sidebar({ mainView, setMainView }: SidebarProps) {
  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-20 bg-white dark:bg-zinc-950 border-r border-zinc-200 dark:border-zinc-900 items-center py-8 gap-8 transition-colors shrink-0">
        <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center text-black font-black text-xs shadow-lg shadow-orange-500/20">
          SP
        </div>

        <nav className="flex flex-col gap-4 mt-4 w-full px-4">
          <button
            onClick={() => setMainView("workspace")}
            className={`w-full aspect-square rounded-2xl flex flex-col items-center justify-center gap-1 transition-all ${
              mainView === "workspace" 
                ? "bg-zinc-100 dark:bg-zinc-800 text-orange-500" 
                : "text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 hover:text-zinc-700 dark:hover:text-zinc-300"
            }`}
            title="Workspace / Bar"
          >
            <span className="text-xl">🍸</span>
            <span className="text-[9px] font-bold uppercase tracking-widest">Bar</span>
          </button>

          {(userRole === "admin" || userRole === "superadmin") && (
            <button
              onClick={() => setMainView("analytics")}
              className={`w-full aspect-square rounded-2xl flex flex-col items-center justify-center gap-1 transition-all ${
                mainView === "analytics" 
                  ? "bg-zinc-100 dark:bg-zinc-800 text-orange-500" 
                  : "text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 hover:text-zinc-700 dark:hover:text-zinc-300"
              }`}
               title="Analytics / Rapoarte"
            >
              <span className="text-xl">📈</span>
              <span className="text-[9px] font-bold uppercase tracking-widest">Admin</span>
            </button>
          )}
        </nav>
      </aside>

      {/* Mobile Bottom Nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-900 flex justify-around items-center px-4 z-50">
          <button
            onClick={() => setMainView("workspace")}
            className={`flex flex-col items-center justify-center gap-1 p-2 transition-all ${
              mainView === "workspace" 
                ? "text-orange-500" 
                : "text-zinc-500"
            }`}
          >
            <span className="text-lg">🍸</span>
            <span className="text-[9px] font-bold uppercase tracking-widest">Bar</span>
          </button>

          {(userRole === "admin" || userRole === "superadmin") && (
            <button
              onClick={() => setMainView("analytics")}
              className={`flex flex-col items-center justify-center gap-1 p-2 transition-all ${
                mainView === "analytics" 
                  ? "text-orange-500" 
                  : "text-zinc-500"
              }`}
            >
              <span className="text-lg">📈</span>
              <span className="text-[9px] font-bold uppercase tracking-widest">Admin</span>
            </button>
          )}
      </div>
    </>
  );
}
