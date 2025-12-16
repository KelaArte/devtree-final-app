import { useQuery } from "@tanstack/react-query";
import { getMyStats } from "../api/DevTreeApi";
import type { MyVisitStats } from "../types";

/**
 * Componente que muestra las estadísticas de visitas del perfil del usuario autenticado
 * Incluye contador total y desglose por períodos de tiempo
 */
export default function VisitCounter() {
  const { data, isLoading, isError } = useQuery<MyVisitStats>({
    queryKey: ["myStats"],
    queryFn: getMyStats,
    refetchInterval: 30000, // Actualizar cada 30 segundos
  });

  if (isLoading) {
    return (
      <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 p-6 rounded-xl border border-purple-700/50 animate-pulse">
        <div className="h-8 bg-purple-700/30 rounded w-1/3 mb-4"></div>
        <div className="h-12 bg-purple-700/30 rounded w-1/2"></div>
      </div>
    );
  }

  if (isError || !data) {
    return null; // No mostrar nada si hay error
  }

  return (
    <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 p-6 rounded-xl border border-purple-700/50 shadow-lg hover:shadow-purple-500/20 transition-all duration-300">
      <div className="flex items-center gap-3 mb-4">
        <svg
          className="w-6 h-6 text-purple-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
          />
        </svg>
        <h3 className="text-xl font-bold text-white">Visitas al Perfil</h3>
      </div>

      {/* Contador principal */}
      <div className="mb-6">
        <p className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
          {data.stats.totalVisits.toLocaleString()}
        </p>
        <p className="text-sm text-purple-300 mt-1">visitas totales</p>
      </div>

      {/* Estadísticas por período */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-purple-800/30 p-3 rounded-lg border border-purple-600/30">
          <p className="text-2xl font-bold text-purple-200">
            {data.stats.last24Hours}
          </p>
          <p className="text-xs text-purple-400 mt-1">Últimas 24h</p>
        </div>
        <div className="bg-purple-800/30 p-3 rounded-lg border border-purple-600/30">
          <p className="text-2xl font-bold text-purple-200">
            {data.stats.last7Days}
          </p>
          <p className="text-xs text-purple-400 mt-1">Última semana</p>
        </div>
        <div className="bg-purple-800/30 p-3 rounded-lg border border-purple-600/30">
          <p className="text-2xl font-bold text-purple-200">
            {data.stats.last30Days}
          </p>
          <p className="text-xs text-purple-400 mt-1">Último mes</p>
        </div>
      </div>

      {/* Indicador de actualización automática */}
      <div className="mt-4 flex items-center gap-2">
        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
        <p className="text-xs text-purple-400">
          Actualización automática cada 30s
        </p>
      </div>
    </div>
  );
}
