import { useDraggable, useDroppable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";

export function TableCard({
  group,
  onComplete,
  onServe,
  onDeliver,
  onClose,
  onApprove,
  onReject,
  onAddOrder,
}: any) {
  // 1. Hook pentru a face cardul DESTINAȚIE (Droppable)
  const { isOver, setNodeRef: setDroppableRef } = useDroppable({
    id: group.table_id,
  });

  // 2. Hook pentru a face cardul Sursă (Draggable) - Doar de mâner
  const { attributes, listeners, setNodeRef: setDraggableRef, transform, isDragging } = useDraggable({
    id: group.table_id,
  });

  const isPendingApproval = group.status === "pending_approval";
  const isUrgent = group.active_requests?.some((r: any) => r.type === "bill");
  const hasOrders = group.pending_items?.length > 0;

  // Culoarea bordurii (Aici schimbăm și când tragi o altă masă peste ea)
  const getBorderColor = () => {
    if (isOver) return "border-blue-500 shadow-[0_0_40px_rgba(59,130,246,0.5)] scale-105 z-50"; // Efect vizual de primire
    if (isPendingApproval) return "border-yellow-400 shadow-[0_0_40px_rgba(250,204,21,0.3)] animate-pulse";
    if (isUrgent) return "border-red-600";
    if (hasOrders) return "border-orange-500";
    return "border-zinc-200 dark:border-zinc-800 opacity-90";
  };

  // Stilul care mișcă cardul pe ecran când îl tragi
  const dragStyle = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.4 : 1,
    zIndex: isDragging ? 100 : "auto",
  };

  const setNodeRef = (node: HTMLDivElement | null) => {
    setDroppableRef(node);
    setDraggableRef(node);
  };

  return (
    <div
      ref={setNodeRef} // Aici aterizează alte mese și de aici tragem
      {...listeners}
      {...attributes}
      style={dragStyle}
      id={`table-card-${group.table_id}`}
      className={`relative cursor-grab active:cursor-grabbing bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white rounded-[2.5rem] p-7 border-t-8 shadow-2xl flex flex-col transition-all duration-300 ${getBorderColor()}`}
    >
      <div className="flex justify-between items-start mb-6">
        <div>
          <div className="flex items-center gap-3">
            <h3 className="text-4xl font-black italic tracking-tighter uppercase leading-none">
              Masa {group.table_number}
            </h3>
          </div>

          {/* AFISĂM MESELE UNITE (Dacă există) */}
          {group.merged_children && group.merged_children.length > 0 && (
            <div className="mt-2 flex gap-1 flex-wrap">
              <span className="bg-blue-500/20 text-blue-500 text-[10px] font-black px-2 py-0.5 rounded-md uppercase">
                + Mesele: {group.merged_children.join(", ")}
              </span>
            </div>
          )}

          <p className="text-[10px] font-bold text-zinc-500 uppercase mt-2">
            Total acumulat:{" "}
            <span className="text-zinc-900 dark:text-white font-black">
              {Number(group.total_to_pay || 0).toFixed(2)} RON
            </span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Buton + comandă staff */}
          <button
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => { e.stopPropagation(); onAddOrder(group.table_id, group.table_number); }}
            title="Adaugă comandă"
            className="w-9 h-9 rounded-xl flex items-center justify-center bg-zinc-100 dark:bg-white/10 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-900 hover:text-white dark:hover:bg-white dark:hover:text-black font-black text-xl transition-all active:scale-90"
          >
            +
          </button>

          {isPendingApproval && (
            <span className="bg-yellow-400 text-black text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-tighter">
              Așteaptă Aprobare
            </span>
          )}
        </div>
      </div>

      {/* SECȚIUNE APROBARE (Prank-Proof) */}
      {isPendingApproval && (
        <div className="mb-8 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-3xl border border-yellow-200 dark:border-yellow-900/50">
          <p className="text-[10px] font-black text-yellow-700 dark:text-yellow-400 uppercase mb-3 text-center">
            ⚠️ Cineva vrea să deschidă masa!
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => onApprove(group.table_id)}
              className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-black py-4 rounded-2xl font-black uppercase text-[10px] transition-all active:scale-95"
            >
              ✅ Deschide Masa
            </button>
            <button
              onClick={() => onReject(group.table_id)}
              className="px-5 bg-zinc-200 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 py-4 rounded-2xl font-black hover:bg-red-100 hover:text-red-600 transition-all"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* ALERTE (Chelner/Notă) */}
      <div className="space-y-2 mb-6">
        {group.active_requests?.map((req: any) => (
          <div
            key={req.id}
            className={`p-4 rounded-2xl flex justify-between items-center ${req.type === "bill" ? "bg-red-600 animate-pulse" : "bg-orange-500"
              } text-white shadow-lg`}
          >
            <div className="flex flex-col gap-1.5">
              <span className="font-black text-xs uppercase opacity-90 tracking-wider">
                {req.type === "bill" ? "🧾 NOTĂ" : "🛎️ CHELNER"}
              </span>
              {req.payment_method && (
                <span className="bg-white text-zinc-900 font-black text-sm px-3 py-1 rounded-lg uppercase tracking-widest flex items-center gap-1.5 shadow-sm w-fit">
                  {req.payment_method === 'card' ? '💳' : '💵'} {req.payment_method}
                </span>
              )}
            </div>
            <button
              onClick={() => onComplete(req.id)}
              className="bg-white/20 hover:bg-white/40 px-4 py-2 rounded-xl text-xs font-black uppercase transition-colors shadow-inner"
            >
              OK
            </button>
          </div>
        ))}
      </div>

      {/* PRODUSE DE SERVIT */}
      <div className="flex-1 space-y-3 mb-8">
        <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest ml-2">
          Comenzi active
        </p>
        {hasOrders ? (
          group.pending_items.map((item: any) => {
            const isServed = item.status === 'served';
            return (
              <div
                key={item.item_id}
                className={`flex justify-between items-center p-4 rounded-2xl border transition-colors group ${isServed
                    ? "bg-green-500/10 border-green-500/50 shadow-[0_0_15px_rgba(34,197,94,0.2)]"
                    : "bg-zinc-100 dark:bg-black/40 border-zinc-200 dark:border-white/5 hover:border-orange-500/50"
                  }`}
              >
                <div className="flex flex-col max-w-[70%]">
                  <span className={`font-black text-sm uppercase leading-tight ${isServed ? "text-green-600 dark:text-green-400" : "text-zinc-900 dark:text-white"}`}>
                    {item.qty}x {item.name}
                  </span>
                  {item.notes && (
                    <span className="text-[10px] font-bold italic text-orange-600 dark:text-orange-400 mt-0.5">
                      * {item.notes}
                    </span>
                  )}
                  {isServed && (
                    <span className="text-[9px] font-black uppercase tracking-widest text-green-500 mt-1">
                      ✅ Gata de dus la masă
                    </span>
                  )}
                </div>
                {isServed ? (
                  <button
                    onClick={() => onDeliver && onDeliver(item.item_id)}
                    className="bg-green-600 hover:bg-green-500 text-white px-3 h-10 flex items-center justify-center rounded-xl shadow-lg transition-transform active:scale-90 text-[10px] uppercase font-black tracking-widest"
                  >
                    La Masă
                  </button>
                ) : (
                  <button
                    onClick={() => onServe && onServe(item.item_id)}
                    className="bg-zinc-200 dark:bg-white/10 hover:bg-green-500 hover:text-white dark:text-white text-zinc-600 w-10 h-10 flex items-center justify-center rounded-xl shadow-sm transition-colors active:scale-90 font-black"
                  >
                    ✓
                  </button>
                )}
              </div>
            );
          })
        ) : (
          <div className="py-8 text-center bg-zinc-50 dark:bg-white/5 rounded-4xl border-2 border-dashed border-zinc-200 dark:border-zinc-800 text-zinc-400 font-bold uppercase text-[9px] italic">
            Toate produsele sunt la client ✅
          </div>
        )}
      </div>

      {/* BUTON ÎNCHIDERE NOTĂ */}
      <button
        onClick={() => {
          const billReq = group.active_requests?.find((r: any) => r.type === "bill");
          onClose(group.table_id, billReq?.payment_method);
        }}
        disabled={hasOrders || isPendingApproval}
        className={`w-full p-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all 
          ${!hasOrders && !isPendingApproval
            ? "bg-zinc-950 dark:bg-white text-white dark:text-black hover:scale-[1.02] active:scale-95 shadow-xl"
            : "bg-zinc-100 dark:bg-zinc-800 text-zinc-400 cursor-not-allowed opacity-50"
          }`}
      >
        Închide & Eliberează Masa
      </button>
    </div>
  );
}