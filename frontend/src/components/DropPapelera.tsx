import { useDroppable } from "@dnd-kit/core";

export default function DropPapelera() {
  const { setNodeRef, isOver } = useDroppable({
    id: "trash",
  });

  return (
    <div
      ref={setNodeRef}
      className={`
        mt-4 h-20 flex items-center justify-center rounded-xl
        border-2 border-dashed transition-all
        ${
          isOver
            ? "bg-red-600/20 border-red-500"
            : "bg-slate-800 border-slate-600"
        }
      `}
    >
      <p className="text-red-400 font-bold">🗑️ Soltar para eliminar</p>
    </div>
  );
}
