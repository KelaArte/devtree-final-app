import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { SocialNetwork } from "../types";

type DevTreeLinkProps = {
  link: SocialNetwork;
};

export default function DevTreeLink({ link }: DevTreeLinkProps) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: link.id,
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      // Diseño del botón dentro del "Móvil": Fondo blanco o Slate claro para contraste
      // Si quieres estilo Cyberpunk total, usa bg-slate-800 y texto blanco
      className="bg-slate-800 px-5 py-3 flex items-center gap-5 rounded-lg border border-slate-700 shadow-sm cursor-grab active:cursor-grabbing"
      {...attributes}
      {...listeners}
    >
      <div
        className="w-8 h-8 bg-cover"
        style={{ backgroundImage: `url('/social/icon_${link.name}.svg')` }}
      ></div>
      <p className="capitalize text-slate-200 font-medium">
        Visita mi: <span className="font-bold text-white">{link.name}</span>
      </p>
    </li>
  );
}
