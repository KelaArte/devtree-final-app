import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getUser } from "../api/DevTreeApi";
import { Navigate, useNavigate } from "react-router-dom";
import DevTree from "../components/DevTree";
import { useEffect } from "react";
import { Toaster } from "sonner"; // Importamos Toaster aquí también si DevTree lanza alertas

export default function AppLayout() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const token = localStorage.getItem("AUTH_TOKEN");

  const { data, isLoading, isError } = useQuery({
    queryFn: getUser,
    queryKey: ["user"],
    retry: 1,
    refetchOnWindowFocus: false,
    enabled: !!token,
  });

  useEffect(() => {
    if (!token) {
      queryClient.clear();
      navigate("/auth/login");
    }
  }, [token, navigate, queryClient]);

  if (!token) return <Navigate to="/auth/login" replace />;

  // UI de Carga mejorada (Spinner centrado en modo oscuro)
  if (isLoading)
    return (
      <div className="bg-slate-950 min-h-screen flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-4">
          {/* Spinner simple con Tailwind */}
          <div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-400 font-light animate-pulse">
            Cargando perfil...
          </p>
        </div>
      </div>
    );

  if (isError) {
    localStorage.removeItem("AUTH_TOKEN");
    queryClient.clear();
    return <Navigate to="/auth/login" replace />;
  }

  // Renderizado principal
  if (data)
    return (
      <div className="bg-slate-950 min-h-screen text-white">
        {/* Main Wrapper para asegurar modo oscuro en toda la app */}
        <main className="max-w-6xl mx-auto p-4">
          <DevTree data={data} />
        </main>
        <Toaster position="top-right" richColors theme="dark" />
      </div>
    );

  return null;
}
