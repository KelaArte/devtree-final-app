import { Outlet } from "react-router-dom";
import { Toaster } from "sonner";
import Logo from "../components/Logo";
export default function AuthLayout() {
  return (
    <>
      {/* Contenedor Principal: Fondo oscuro con degradado sutil */}
      <div className="bg-slate-950 min-h-screen flex flex-col items-center justify-center relative overflow-hidden text-white">
        {/* Fondo decorativo (Efecto de luz superior) */}
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-800 via-slate-950 to-slate-950 -z-10"></div>

        <div className="w-full max-w-lg px-5 py-10 z-10">
          {/* Logotipo centrado */}
          <div className="flex justify-center mb-10">
            <Logo />
          </div>

          {/* Aquí se renderiza LoginView, RegisterView, etc. */}
          <Outlet />
        </div>
      </div>

      {/* Configuración de Sonner para modo oscuro */}
      <Toaster position="top-right" richColors theme="dark" />
    </>
  );
}
