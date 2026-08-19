import { motion } from "framer-motion";

export default function Tabs({ items, activeTab, onChange, className = "" }) {
  return (
    <div
      className={`flex items-center gap-1 overflow-x-auto p-1.5 rounded-2xl bg-slate-100/90 scrollbar-none ${className}`}
    >
      {items.map((tab) => {
        const key = tab.key || tab.id;
        const isActive = activeTab === key;
        const Icon = tab.icon;

        return (
          <button
            key={key}
            type="button"
            onClick={() => onChange(key)}
            className={`relative flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-bold transition-colors duration-200 shrink-0 rounded-xl cursor-pointer ${
              isActive ? "text-red-600 font-extrabold" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            {isActive && (
              <motion.div
                layoutId="activeTabPill"
                className="absolute inset-0 rounded-xl bg-white shadow-xs"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-2">
              {Icon && <Icon className="h-4 w-4" />}
              {tab.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
