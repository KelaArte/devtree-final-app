import { useLocation } from "react-router-dom";
import HomeNavigation from "./nav/HomeNavigation";
import AdminNavigation from "./nav/AdminNavigation";
import Logo from "./Logo";
import type { JSX } from "react";

export default function Header(): JSX.Element {
  const location = useLocation();
  const path = location.pathname;

  // Mostrar HomeNavigation cuando estemos en la raíz o en cualquier ruta /auth/*
  const showHomeNav = path === "/" || path.startsWith("/auth");

  return (
    <header className="bg-slate-900 py-5 border-b border-slate-800">
      <div className="mx-auto max-w-5xl flex flex-col md:flex-row items-center md:justify-between px-5 md:px-0">
        <div className="w-full md:w-1/3 flex justify-center md:justify-start">
          <Logo />
        </div>

        <div className="w-full md:w-1/3 md:flex md:justify-end mt-5 md:mt-0">
          {showHomeNav ? <HomeNavigation /> : <AdminNavigation />}
        </div>
      </div>
    </header>
  );
}