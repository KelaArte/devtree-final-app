import { BookmarkSquareIcon, UserIcon } from "@heroicons/react/20/solid";
import { Link, useLocation, useNavigate } from "react-router-dom";

const tabs = [
  { name: "Links", href: "/admin", icon: BookmarkSquareIcon },
  { name: "Mi Perfil", href: "/admin/profile", icon: UserIcon },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function NavigationTabs() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    navigate(e.target.value);
  };

  return (
    <div className="mb-10">
      {/* Versión Móvil: Select oscuro */}
      <div className="sm:hidden">
        <label htmlFor="tabs" className="sr-only">
          Select a tab
        </label>
        <select
          id="tabs"
          name="tabs"
          className="block w-full rounded-md border-slate-700 bg-slate-800 text-white focus:border-cyan-500 focus:ring-cyan-500"
          onChange={handleChange}
          value={location.pathname}
        >
          {tabs.map((tab) => (
            <option value={tab.href} key={tab.name}>
              {tab.name}
            </option>
          ))}
        </select>
      </div>

      {/* Versión Desktop: Tabs underline */}
      <div className="hidden sm:block">
        <div className="border-b border-slate-700">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            {tabs.map((tab) => {
              const isCurrent = location.pathname === tab.href;
              return (
                <Link
                  key={tab.name}
                  to={tab.href}
                  className={classNames(
                    isCurrent
                      ? "border-cyan-500 text-cyan-400"
                      : "border-transparent text-slate-400 hover:border-slate-600 hover:text-slate-200",
                    "group inline-flex items-center border-b-2 py-4 px-1 text-xl font-medium transition-colors"
                  )}
                >
                  <tab.icon
                    className={classNames(
                      isCurrent
                        ? "text-cyan-400"
                        : "text-slate-500 group-hover:text-slate-300",
                      "-ml-0.5 mr-2 h-5 w-5 transition-colors"
                    )}
                    aria-hidden="true"
                  />
                  <span>{tab.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </div>
  );
}
