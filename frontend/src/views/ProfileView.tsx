import React from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import ErrorMessage from "../components/ErrorMessage";
import VisitCounter from "../components/VisitCounter";
import { updateProfile, uploadImage } from "../api/DevTreeApi";
import type { ProfileForm, User } from "../types";
import { toast } from "sonner";

export default function ProfileView() {
  const queryClient = useQueryClient();
  // Asumimos que data existe porque el layout protege esta ruta
  const data: User = queryClient.getQueryData(["user"])!;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProfileForm>({
    defaultValues: { handle: data.handle, description: data.description },
  });

  const updateProfileMutation = useMutation({
    mutationFn: updateProfile,
    onError: (error) => toast.error(error.message),
    onSuccess: (data) => {
      toast.success(data);
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });

  const uploadImageMutation = useMutation({
    mutationFn: uploadImage,
    onError: (error) => toast.error(error.message),
    onSuccess: (imgUrl) => {
      // Optimistic update
      queryClient.setQueryData(["user"], (prevData: User) => ({
        ...prevData,
        image: imgUrl,
      }));
      toast.success("Imagen actualizada");
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      uploadImageMutation.mutate(e.target.files[0]);
    }
  };

  const handleUserProfileForm = (formData: ProfileForm) => {
    const user: User = queryClient.getQueryData(["user"])!;
    const updatedUser = { ...user, ...formData };
    updateProfileMutation.mutate(updatedUser);
  };

  const inputStyle =
    "bg-slate-900 border border-slate-700 p-3 w-full rounded-lg placeholder-slate-500 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all";
  const labelStyle = "text-lg font-bold text-slate-200 block mb-2";

  return (
    <div className="space-y-6">
      {/* Contador de visitas */}
      <VisitCounter />

      {/* Formulario de edición de perfil */}
      <form
        className="bg-slate-800 p-10 rounded-xl border border-slate-700 space-y-8"
        onSubmit={handleSubmit(handleUserProfileForm)}
      >
        <legend className="text-3xl font-black text-center text-white mb-5">
          Editar Información
        </legend>

        {/* Handle */}
        <div className="space-y-2">
          <label htmlFor="handle" className={labelStyle}>
            Handle:
          </label>
          <input
            type="text"
            className={inputStyle}
            placeholder="handle o Nombre de Usuario"
            {...register("handle", {
              required: "El nombre de usuario es obligatorio.",
            })}
          />
          {errors.handle && (
            <ErrorMessage>{errors.handle.message}</ErrorMessage>
          )}
        </div>

        {/* Descripción */}
        <div className="space-y-2">
          <label htmlFor="description" className={labelStyle}>
            Descripción:
          </label>
          <textarea
            className={`${inputStyle} min-h-[100px] resize-none`}
            placeholder="Tu Descripción"
            {...register("description", {
              required: "La descripción es obligatoria.",
            })}
          />
          {errors.description && (
            <ErrorMessage>{errors.description.message}</ErrorMessage>
          )}
        </div>

        {/* Imagen */}
        <div className="space-y-2">
          <label className={labelStyle}>Imagen de Perfil:</label>

          {/* Input file personalizado */}
          <div className="relative">
            <input
              id="image"
              type="file"
              accept="image/*"
              onChange={handleChange}
              className="block w-full text-sm text-slate-400
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-sm file:font-semibold
                    file:bg-cyan-500 file:text-white
                    hover:file:bg-cyan-600
                    cursor-pointer bg-slate-900 rounded-lg border border-slate-700
                  "
            />
          </div>

          {uploadImageMutation.isPending && (
            <p className="text-cyan-400 text-sm font-bold animate-pulse">
              Subiendo imagen...
            </p>
          )}
        </div>

        <input
          type="submit"
          disabled={updateProfileMutation.isPending}
          className="bg-cyan-500 p-3 text-lg w-full uppercase text-white rounded-lg font-bold cursor-pointer hover:bg-cyan-600 transition-colors disabled:opacity-50"
          value={
            updateProfileMutation.isPending ? "Guardando..." : "Guardar Cambios"
          }
        />
      </form>
    </div>
  );
}
