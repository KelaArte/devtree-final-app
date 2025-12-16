import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { isAxiosError } from "axios";
import { toast } from "sonner";
import type { RegisterForm } from "../types";
import ErrorMessage from "../components/ErrorMessage";
import api from "../config/axios";
import { useSearchParams } from 'react-router-dom'

export default function RegisterView() {

  const [searchParams] = useSearchParams()
  const preHandle = searchParams.get('handle') || ''

  const initialValues: RegisterForm = {
  name: '',
  email: '',
  handle: preHandle,     
  password: '',
  password_confirmation: '',
}

  const {
    register,
    watch,
    reset,
    handleSubmit,
    formState: { errors, isSubmitting }, // Agregamos isSubmitting
  } = useForm({ defaultValues: initialValues });

  const password = watch("password");

  const handleRegister = async (formData: RegisterForm) => {
    try {
      const { data } = await api.post(`/auth/register`, formData);
      toast.success(data);
      reset();
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        toast.error(error.response?.data.error);
      } else {
        toast.error("Error al registrarse");
      }
    }
  };

  const inputStyle =
    "bg-slate-900 border border-slate-700 p-3 w-full rounded-lg placeholder-slate-500 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all";
  const labelStyle = "text-xl font-bold text-slate-200 block mb-2";

  return (
    <>
      <h1 className="text-center text-4xl text-white font-black font-display">
        Crear cuenta
      </h1>

      <form
        onSubmit={handleSubmit(handleRegister)}
        className="bg-slate-800 px-8 py-10 rounded-xl shadow-2xl space-y-8 mt-10 max-w-md mx-auto border border-slate-700"
        noValidate
      >
        {/* Nombre */}
        <div>
          <label htmlFor="name" className={labelStyle}>
            Nombre
          </label>
          <input
            id="name"
            type="text"
            placeholder="Tu Nombre"
            className={inputStyle}
            {...register("name", { required: "El nombre es obligatorio." })}
          />
          {errors.name && <ErrorMessage>{errors.name.message}</ErrorMessage>}
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className={labelStyle}>
            E-mail
          </label>
          <input
            id="email"
            type="email"
            placeholder="Email de Registro"
            className={inputStyle}
            {...register("email", {
              required: "El email es obligatorio.",
              pattern: {
                value: /\S+@\S+\.\S+/,
                message: "Email no válido.",
              },
            })}
          />
          {errors.email && <ErrorMessage>{errors.email.message}</ErrorMessage>}
        </div>

        {/* Handle */}
        <div>
          <label htmlFor="handle" className={labelStyle}>
            Handle
          </label>
          <input
            id="handle"
            type="text"
            placeholder="Nombre de usuario: sin espacios"
            className={inputStyle}
            {...register("handle", { required: "El handle es obligatorio." })}
          />
          {errors.handle && (
            <ErrorMessage>{errors.handle.message}</ErrorMessage>
          )}
        </div>

        {/* Password */}
        <div>
          <label htmlFor="password" className={labelStyle}>
            Password
          </label>
          <input
            id="password"
            type="password"
            placeholder="Password de Registro"
            className={inputStyle}
            {...register("password", {
              required: "El password es obligatorio.",
              minLength: {
                value: 8,
                message: "El password debe ser mínimo de 8 caracteres.",
              },
            })}
          />
          {errors.password && (
            <ErrorMessage>{errors.password.message}</ErrorMessage>
          )}
        </div>

        {/* Repetir Password */}
        <div>
          <label htmlFor="password_confirmation" className={labelStyle}>
            Repetir Password
          </label>
          <input
            id="password_confirmation"
            type="password"
            placeholder="Repetir Password"
            className={inputStyle}
            {...register("password_confirmation", {
              required: "Repetir el password es obligatorio.",
              validate: (value) =>
                value === password || "Los password no son iguales",
            })}
          />
          {errors.password_confirmation && (
            <ErrorMessage>{errors.password_confirmation.message}</ErrorMessage>
          )}
        </div>

        <input
          type="submit"
          disabled={isSubmitting}
          className={`bg-cyan-500 w-full p-3 text-white uppercase font-bold hover:bg-cyan-600 cursor-pointer transition-colors rounded-lg text-lg ${
            isSubmitting ? "opacity-50 cursor-not-allowed" : ""
          }`}
          value={isSubmitting ? "Creando cuenta..." : "Crear Cuenta"}
        />
      </form>

      <nav className="mt-10">
        <Link
          className="text-center text-slate-400 text-sm block hover:text-white transition-colors"
          to="/auth/login"
        >
          ¿Ya tienes una cuenta?{" "}
          <span className="font-bold text-cyan-400">Inicia sesión.</span>
        </Link>
      </nav>
    </>
  );
}
