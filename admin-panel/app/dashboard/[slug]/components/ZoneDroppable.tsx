import { useDroppable } from "@dnd-kit/core";

export function ZoneDroppable({ id, children, isActive, isEditMode }: { id: string | null; children: React.ReactNode; isActive: boolean; isEditMode: boolean }) {
  const { isOver, setNodeRef } = useDroppable({
    id: id ? `zone-${id}` : 'zone-all',
    data: {
      type: "zone",
      zoneId: id,
    },
    disabled: !isEditMode // Doar în Edit Mode zonele devin ținte de drop
  });

  return (
    <button
      ref={setNodeRef}
      className={`relative px-4 py-2 rounded-2xl text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all ${
        isOver
          ? "bg-orange-500 text-white shadow-[0_0_20px_rgba(249,115,22,0.5)] scale-110 z-10"
          : isActive
          ? "bg-zinc-800 dark:bg-white text-white dark:text-black shadow-lg"
          : "bg-zinc-100 dark:bg-zinc-900 text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300"
      }`}
    >
      {children}
    </button>
  );
}
