import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { toast } from "sonner";
import api from "../config/axios";
import ErrorMessage from "../components/ErrorMessage";
import type { LoginForm } from "../types";

export default function LoginView() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const initialValues: LoginForm = { email: "", password: "" };

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: initialValues });

  const handleLogin = async (formData: LoginForm) => {
    try {
      const { data } = await api.post("/auth/login", formData);
      localStorage.setItem("AUTH_TOKEN", data);
      await queryClient.invalidateQueries({ queryKey: ["user"] });
      toast.success("¡Bienvenido de nuevo!");
      navigate("/admin/profile");
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        toast.error(error.response.data.error);
      } else {
        toast.error("Ocurrió un error inesperado");
      }
    }
  };

  return (
    <>
      <h1 className="text-center text-4xl text-white font-black font-display">
        Iniciar Sesión
      </h1>

      <form
        onSubmit={handleSubmit(handleLogin)}
        // CAMBIOS DE DISEÑO DARK MODE AQUÍ:
        // bg-slate-800: Fondo de tarjeta oscuro
        // border-slate-700: Borde sutil para separar del fondo
        className="bg-slate-800 px-8 py-10 rounded-xl shadow-2xl space-y-8 mt-10 max-w-md mx-auto border border-slate-700"
        noValidate
      >
        {/* Campo Email */}
        <div className="flex flex-col gap-2">
          <label htmlFor="email" className="text-xl font-bold text-slate-200">
            E-mail
          </label>
          <input
            id="email"
            type="email"
            placeholder="Ej: correo@empresa.com"
            // INPUT DARK MODE:
            // bg-slate-900: Fondo muy oscuro
            // text-white: Texto claro al escribir
            // placeholder-slate-500: Placeholder tenue
            className="w-full bg-slate-900 border border-slate-700 text-white p-3 rounded-lg placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
            {...register("email", {
              required: "El Email es obligatorio",
              pattern: {
                value: /\S+@\S+\.\S+/,
                message: "E-mail no válido",
              },
            })}
          />
          {errors.email && <ErrorMessage>{errors.email.message}</ErrorMessage>}
        </div>

        {/* Campo Password */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor="password"
            className="text-xl font-bold text-slate-200"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            placeholder="Ingresa tu contraseña"
            className="w-full bg-slate-900 border border-slate-700 text-white p-3 rounded-lg placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
            {...register("password", {
              required: "El Password es obligatorio",
            })}
          />
          {errors.password && (
            <ErrorMessage>{errors.password.message}</ErrorMessage>
          )}
        </div>

        {/* Botón de Submit */}
        <input
          type="submit"
          disabled={isSubmitting}
          className={`bg-cyan-500 w-full p-3 text-white uppercase font-bold hover:bg-cyan-600 cursor-pointer transition-colors rounded-lg text-lg
            ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}
          `}
          value={isSubmitting ? "Cargando..." : "Iniciar Sesión"}
        />
      </form>

      {/* Navegación Inferior */}
      <nav className="mt-10 flex flex-col space-y-2">
        <Link
          to="/auth/register"
          className="text-center text-slate-400 text-sm hover:text-white transition-colors"
        >
          ¿No tienes cuenta?{" "}
          <span className="font-bold text-cyan-400 hover:text-cyan-300">
            Regístrate
          </span>
        </Link>

        <Link
          to="/auth/forgot-password"
          className="text-center text-slate-400 text-sm hover:text-white transition-colors"
        >
          Olvidé mi contraseña
        </Link>
      </nav>
    </>
  );
}
