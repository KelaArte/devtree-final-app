import { Switch } from "@headlessui/react";
import { type DevTreeLink } from "../types";
import { classNames } from "../utils";

type DevTreeInputProps = {
  item: DevTreeLink;
  handleUrlChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleEnableLink: (socialNetwork: string) => void;
};

export default function DevTreeInput({
  item,
  handleUrlChange,
  handleEnableLink,
}: DevTreeInputProps) {
  return (
    // bg-slate-900: Fondo de la fila más oscuro que el contenedor principal (800)
    <div className="bg-slate-900 shadow-sm p-5 flex items-center gap-3 rounded-lg border border-slate-700">
      <div
        className="w-12 h-12 bg-cover opacity-80"
        style={{ backgroundImage: `url('/social/icon_${item.name}.svg')` }}
      ></div>

      <input
        type="text"
        className="flex-1 bg-slate-800 border border-slate-700 rounded-lg p-2 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
        value={item.url}
        onChange={handleUrlChange}
        name={item.name}
        placeholder={`https://${item.name}.com/usuario`}
      />

      <Switch
        checked={item.enabled}
        onChange={() => handleEnableLink(item.name)}
        className={classNames(
          item.enabled ? "bg-cyan-500" : "bg-slate-600",
          "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-slate-900"
        )}
      >
        <span
          aria-hidden="true"
          className={classNames(
            item.enabled ? "translate-x-5" : "translate-x-0",
            "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
          )}
        />
      </Switch>
    </div>
  );
}
