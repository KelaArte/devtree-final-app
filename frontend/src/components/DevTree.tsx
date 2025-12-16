import { useEffect, useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { Toaster } from "sonner";
import { DndContext, type DragEndEvent, type DragStartEvent, closestCenter } from "@dnd-kit/core";
import DropPapelera from "../components/DropPapelera";
import { SortableContext, verticalListSortingStrategy, arrayMove } from "@dnd-kit/sortable";
import NavigationTabs from "../components/NavigationTabs";
import type { SocialNetwork, User } from "../types";
import DevTreeLink from "./DevTreeLink";
import { useQueryClient } from "@tanstack/react-query";
import Header from "./Header";

type DevTreeProps = {
  data: User;
};

export default function DevTree({ data }: DevTreeProps) {
  const queryClient = useQueryClient();
  const [enabledLinks, setEnabledLinks] = useState<SocialNetwork[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (!data?.links) return;
    try {
      const parsed: SocialNetwork[] = typeof data.links === "string"
        ? JSON.parse(data.links)
        : (data.links as SocialNetwork[]);
      setEnabledLinks(parsed.filter((l) => l.enabled));
    } catch {
      setEnabledLinks([]);
    }
  }, [data]);

  const handleDragStart = (_: DragStartEvent) => setIsDragging(true);

  const handleDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;
    setIsDragging(false);
    if (!over) return;

    // ELIMINAR
    if (over.id === "trash") {
      const updatedEnabled = enabledLinks.filter((l) => l.id !== active.id);
      setEnabledLinks(updatedEnabled);

      const parsed: SocialNetwork[] = typeof data.links === "string"
        ? JSON.parse(data.links)
        : (data.links as SocialNetwork[]);
      const updatedAll = parsed.map((l) =>
        l.id === active.id ? { ...l, enabled: false, id: 0 } : l
      );

      queryClient.setQueryData(["user"], (prev: User | undefined) =>
        prev ? { ...prev, links: JSON.stringify(updatedAll) } : prev
      );
      return;
    }

    // REORDENAR
    if (active.id !== over.id) {
      const prevIndex = enabledLinks.findIndex((l) => l.id === active.id);
      const newIndex = enabledLinks.findIndex((l) => l.id === over.id);
      if (prevIndex === -1 || newIndex === -1) return;

      const reordered = arrayMove(enabledLinks, prevIndex, newIndex);
      setEnabledLinks(reordered);

      const parsed: SocialNetwork[] = typeof data.links === "string"
        ? JSON.parse(data.links)
        : (data.links as SocialNetwork[]);
      const disabled = parsed.filter((l) => !l.enabled);
      queryClient.setQueryData(["user"], (prev: User | undefined) =>
        prev ? { ...prev, links: JSON.stringify(reordered.concat(disabled)) } : prev
      );
    }
  };

  return (
    <>
      <Header />
      <div className="bg-slate-950 min-h-screen py-10">
        <main className="mx-auto max-w-5xl px-5 md:px-0">
          <NavigationTabs />
          <div className="flex justify-end mb-5">
            <Link
              className="font-bold text-right text-slate-200 text-xl hover:text-cyan-400 transition-colors"
              to={`/${data.handle}`}
              target="_blank"
              rel="noreferrer noopener"
            >
              Visitar Mi Perfil: <span className="text-cyan-400">/{data.handle}</span>
            </Link>
          </div>

          <div className="flex flex-col md:flex-row gap-10 mt-10">
            <div className="flex-1">
              <Outlet />
            </div>

            <div className="w-full md:w-96 bg-slate-900 px-5 py-10 space-y-6 rounded-3xl border-4 border-slate-800 shadow-2xl relative">
              <div className="absolute top-4 left-1/2 -translate-x-1/2 w-20 h-1 bg-slate-800 rounded-full"></div>

              <p className="text-3xl text-center text-white font-bold font-display mt-5">
                {data.handle}
              </p>

              {data.image && (
                <img
                  src={data.image}
                  alt="Imagen Perfil"
                  className="mx-auto max-w-[200px] rounded-full border-4 border-slate-800 shadow-lg"
                />
              )}

              <p className="text-center text-lg font-medium text-slate-300 px-2">
                {data.description || "Aquí irá tu descripción..."}
              </p>

              <DndContext
                collisionDetection={closestCenter}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
              >
                <div className="mt-10 flex flex-col gap-4 overflow-y-auto max-h-[400px] scrollbar-hide">
                  <SortableContext
                    items={enabledLinks.map((l) => l.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    {enabledLinks.map((link) => (
                      <DevTreeLink key={link.id} link={link} />
                    ))}
                  </SortableContext>

                  {isDragging && <DropPapelera />}
                </div>
              </DndContext>
            </div>
          </div>
        </main>
      </div>
      <Toaster position="top-right" theme="dark" richColors />
    </>
  );
}
