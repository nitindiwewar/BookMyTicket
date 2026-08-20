import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, AlertCircle, Info, X, AlertTriangle, Sparkles } from "lucide-react";

const toastConfigs = {
  success: {
    icon: CheckCircle2,
    badgeBg: "bg-emerald-500 text-white",
    cardBg: "bg-white/95 border-emerald-200 text-slate-900 shadow-emerald-500/10",
    barBg: "bg-emerald-500",
    titleColor: "text-emerald-950",
  },
  error: {
    icon: AlertCircle,
    badgeBg: "bg-rose-500 text-white",
    cardBg: "bg-white/95 border-rose-200 text-slate-900 shadow-rose-500/10",
    barBg: "bg-rose-500",
    titleColor: "text-rose-950",
  },
  warning: {
    icon: AlertTriangle,
    badgeBg: "bg-amber-500 text-white",
    cardBg: "bg-white/95 border-amber-200 text-slate-900 shadow-amber-500/10",
    barBg: "bg-amber-500",
    titleColor: "text-amber-950",
  },
  info: {
    icon: Sparkles,
    badgeBg: "bg-cyan-600 text-white",
    cardBg: "bg-white/95 border-cyan-200 text-slate-900 shadow-cyan-500/10",
    barBg: "bg-cyan-600",
    titleColor: "text-cyan-950",
  },
};

export default function Toast({ toasts, onDismiss }) {
  return (
    <div className="fixed top-5 right-5 z-[999999] flex flex-col gap-3 max-w-sm w-full pointer-events-none px-4 sm:px-0">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => {
          const cfg = toastConfigs[toast.type] || toastConfigs.info;
          const Icon = cfg.icon;

          return (
            <motion.div
              key={toast.id}
              layout
              initial={{ opacity: 0, y: -20, scale: 0.92, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 0.9, y: -15, filter: "blur(4px)" }}
              transition={{ type: "spring", stiffness: 420, damping: 26 }}
              className={`pointer-events-auto relative overflow-hidden rounded-2xl border p-4 shadow-2xl backdrop-blur-xl transition-all ${cfg.cardBg}`}
            >
              <div className="flex items-start gap-3">
                <div className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl shadow-md ${cfg.badgeBg}`}>
                  <Icon className="h-5 w-5 stroke-[2.3]" />
                </div>

                <div className="flex-1 pr-2">
                  <div className={`text-xs font-black uppercase tracking-wider ${cfg.titleColor}`}>
                    {toast.title || (toast.type === "success" ? "Success" : toast.type === "error" ? "Error" : toast.type === "warning" ? "Notice" : "Update")}
                  </div>
                  <div className="text-xs sm:text-sm font-semibold text-slate-700 mt-0.5 leading-snug">
                    {toast.message}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onDismiss(toast.id)}
                  className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Animated Progress Bar */}
              <motion.div
                initial={{ width: "100%" }}
                animate={{ width: "0%" }}
                transition={{ duration: (toast.duration || 3500) / 1000, ease: "linear" }}
                className={`absolute bottom-0 left-0 h-1 ${cfg.barBg}`}
              />
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
