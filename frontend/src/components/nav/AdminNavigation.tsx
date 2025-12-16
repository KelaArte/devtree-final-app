import { useQueryClient } from "@tanstack/react-query";

export default function AdminNavigation() {
  const queryClient = useQueryClient();
  return (
    <button
      className="bg-cyan-500 hover:bg-cyan-600 transition-colors p-2 text-white uppercase font-bold text-xs rounded-lg cursor-pointer"
      onClick={() => {
        localStorage.removeItem("AUTH_TOKEN");
        queryClient.clear();
        window.location.href = "/auth/login";
      }}
    >
      Cerrar Sesión
    </button>
  );
}
