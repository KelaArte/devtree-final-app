import React, { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { social } from "../data/social";
import DevTreeInput from "../components/DevTreeInput";
import { isValidUrl } from "../utils";
import { updateProfile } from "../api/DevTreeApi";
import type { SocialNetwork, User, DevTreeLink } from "../types";

export default function LinkTreeView() {
  const [devTreeLinks, setDevTreeLinks] = useState<DevTreeLink[]>(social);
  const queryClient = useQueryClient();
  const user = queryClient.getQueryData<User>(["user"]);

  const { mutate, isPending } = useMutation({
    mutationFn: updateProfile,
    onError: (error: Error) => toast.error(error.message),
    onSuccess: () => toast.success("Links actualizados correctamente"),
  });

  useEffect(() => {
    if (!user) return;
    let storedLinks: SocialNetwork[] = [];
    try {
      if (typeof user.links === "string") {
        storedLinks = JSON.parse(user.links);
      }
    } catch (e) {
      console.warn("Error parseando user.links", e);
    }

    const updatedData = devTreeLinks.map((item) => {
      const userlink = storedLinks.find((link) => link.name === item.name);
      return userlink
        ? { ...item, url: userlink.url, enabled: userlink.enabled }
        : item;
    });

    setDevTreeLinks(updatedData);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const updatedLinks = devTreeLinks.map((link) =>
      link.name === e.target.name ? { ...link, url: e.target.value } : link
    );
    setDevTreeLinks(updatedLinks);
  };

  const handleEnableLink = (socialNetwork: string) => {
    const updatedLinks = devTreeLinks.map((link) => {
      if (link.name === socialNetwork) {
        if (isValidUrl(link.url)) {
          return { ...link, enabled: !link.enabled };
        } else {
          toast.error("URL no válida");
        }
      }
      return link;
    });
    setDevTreeLinks(updatedLinks);

    // Lógica de actualización del cache de React Query (Optimistic UI local)
    // ... (Tu lógica original de reordenamiento de IDs se mantiene aquí) ...
    // Para simplificar la vista, asumo que esta lógica actualiza el queryData "user"
    // tal como lo tenías en tu código original.

    // NOTA: He mantenido tu lógica original, pero recuerda que lo ideal
    // es mover esta lógica compleja a un hook personalizado o utilitario
    // para mantener la vista limpia.

    // (Aquí iría el bloque de lógica de IDs que ya tenías funcional)
    updateLocalCache(updatedLinks, socialNetwork);
  };

  const handleLinkRemoved = (deletedId: number) => {
    const updatedLinks = devTreeLinks.map(link =>
      link.id === deletedId ? { ...link, enabled: false, url: "" } : link
    );
    setDevTreeLinks(updatedLinks);
  };

  // Helper para limpiar el render principal (tu lógica original encapsulada)
  const updateLocalCache = (
    currentLinks: DevTreeLink[],
    networkName: string
  ) => {
    if (!user) return;
    const links: SocialNetwork[] = JSON.parse(user.links || "[]");
    let updatedItems: SocialNetwork[] = [];
    const selectedItem = currentLinks.find((l) => l.name === networkName);

    if (selectedItem?.enabled) {
      const id = links.filter((l) => l.id).length + 1;
      if (links.some((l) => l.name === networkName)) {
        updatedItems = links.map((l) =>
          l.name === networkName ? { ...l, enabled: true, id } : l
        );
      } else {
        updatedItems = [...links, { ...selectedItem, id } as SocialNetwork];
      }
    } else {
      const indexToUpdate = links.findIndex((l) => l.name === networkName);
      updatedItems = links.map((l) => {
        if (l.name === networkName) return { ...l, id: 0, enabled: false };
        if (l.id > indexToUpdate && indexToUpdate !== 0 && l.id !== 1)
          return { ...l, id: l.id - 1 };
        return l;
      });
    }

    queryClient.setQueryData(["user"], (prev: User) => ({
      ...prev,
      links: JSON.stringify(updatedItems),
    }));
  };

  return (
    <div className="space-y-5 bg-slate-800 p-6 rounded-xl border border-slate-700">
      {devTreeLinks.map((item) => (
        <DevTreeInput
          key={item.name}
          item={item}
          handleUrlChange={handleUrlChange}
          handleEnableLink={handleEnableLink}
        />
      ))}

      <button
        className="bg-cyan-500 hover:bg-cyan-600 transition-colors p-3 text-lg w-full uppercase text-white rounded-lg font-bold disabled:opacity-50"
        disabled={isPending}
        onClick={() => {
          if (!user) return toast.error("No hay usuario cargado");
          mutate(queryClient.getQueryData(["user"])!);
        }}
      >
        {isPending ? "Guardando..." : "Guardar Cambios"}
      </button>
    </div>
  );
}
