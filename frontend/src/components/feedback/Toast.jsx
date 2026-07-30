import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, AlertCircle, Info, X, AlertTriangle } from "lucide-react";

const icons = {
  success: CheckCircle2,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
};

const styles = {
  success: "border-emerald-500/30 bg-emerald-950/80 text-emerald-200",
  error: "border-red-500/30 bg-red-950/80 text-red-200",
  warning: "border-amber-500/30 bg-amber-950/80 text-amber-200",
  info: "border-cyan-500/30 bg-slate-900/90 text-cyan-200",
};

export default function Toast({ toasts, onDismiss }) {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0">
      <AnimatePresence mode="sync">
        {toasts.map((toast) => {
          const Icon = icons[toast.type] || Info;
          const styleCls = styles[toast.type] || styles.info;

          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className={`pointer-events-auto flex items-center justify-between gap-3 rounded-2xl border px-4 py-3 shadow-2xl backdrop-blur-xl ${styleCls}`}
            >
              <div className="flex items-center gap-3 text-xs sm:text-sm font-medium">
                <Icon className="h-4 w-4 shrink-0" />
                <span>{toast.message}</span>
              </div>
              <button
                type="button"
                onClick={() => onDismiss(toast.id)}
                className="rounded-full p-1 opacity-70 hover:opacity-100 transition"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
