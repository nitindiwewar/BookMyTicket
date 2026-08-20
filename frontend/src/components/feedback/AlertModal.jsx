import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Info,
  X,
  Star,
  Trash2,
} from "lucide-react";

const modalIcons = {
  success: {
    icon: CheckCircle2,
    bg: "bg-emerald-50 text-emerald-600 border-emerald-200",
    badge: "SUCCESS",
  },
  error: {
    icon: AlertCircle,
    bg: "bg-rose-50 text-rose-600 border-rose-200",
    badge: "ERROR OCCURRED",
  },
  warning: {
    icon: AlertTriangle,
    bg: "bg-amber-50 text-amber-600 border-amber-200",
    badge: "WARNING",
  },
  danger: {
    icon: Trash2,
    bg: "bg-rose-50 text-rose-600 border-rose-200",
    badge: "CONFIRM ACTION",
  },
  info: {
    icon: Info,
    bg: "bg-cyan-50 text-cyan-600 border-cyan-200",
    badge: "INFORMATION",
  },
  rating: {
    icon: Star,
    bg: "bg-amber-50 text-amber-500 border-amber-200",
    badge: "RATE & REVIEW",
  },
};

export default function AlertModal({ alertState, onClose }) {
  if (!alertState || !alertState.isOpen) return null;

  const {
    type = "info",
    title = "Notification",
    message = "",
    confirmText = "OK, Got It",
    cancelText = "Cancel",
    isConfirm = false,
    isRating = false,
    onConfirm,
    onCancel,
  } = alertState;

  const [ratingVal, setRatingVal] = useState(8);
  const [hoverRating, setHoverRating] = useState(0);
  const config = modalIcons[type] || modalIcons.info;
  const IconComponent = config.icon;

  const handleConfirm = () => {
    if (isRating && onConfirm) {
      onConfirm(ratingVal);
    } else if (onConfirm) {
      onConfirm(true);
    }
    onClose();
  };

  const handleCancel = () => {
    if (onCancel) onCancel(false);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[999999] grid place-items-center bg-slate-950/75 p-4 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: "spring", stiffness: 380, damping: 28 }}
          className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white p-6 sm:p-7 shadow-2xl border border-slate-100 text-center space-y-5"
        >
          {/* Close Button */}
          <button
            type="button"
            onClick={handleCancel}
            className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-full bg-slate-100 text-slate-400 hover:bg-slate-200 hover:text-slate-700 transition cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>

          {/* Animated Header Icon */}
          <div className="flex justify-center pt-2">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 20, delay: 0.1 }}
              className={`grid h-16 w-16 place-items-center rounded-2xl border shadow-lg ${config.bg}`}
            >
              <IconComponent className="h-8 w-8 stroke-[2.2]" />
            </motion.div>
          </div>

          {/* Title & Badge */}
          <div className="space-y-1.5 px-2">
            <div className="inline-block text-[10px] font-black tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600">
              {config.badge}
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-snug">
              {title}
            </h3>
            <p className="text-xs sm:text-sm font-medium text-slate-600 leading-relaxed max-w-sm mx-auto pt-1">
              {message}
            </p>
          </div>

          {/* Interactive Star Rating Selector if type is 'rating' */}
          {isRating && (
            <div className="py-2 space-y-3">
              <div className="flex justify-center items-center gap-1.5 sm:gap-2">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => {
                  const active = (hoverRating || ratingVal) >= num;
                  return (
                    <button
                      key={num}
                      type="button"
                      onMouseEnter={() => setHoverRating(num)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setRatingVal(num)}
                      className="cursor-pointer transition-transform hover:scale-125 focus:outline-none"
                    >
                      <Star
                        className={`h-5 w-5 sm:h-6 sm:w-6 ${
                          active
                            ? "fill-amber-400 text-amber-400 drop-shadow-xs"
                            : "text-slate-200 fill-slate-100"
                        }`}
                      />
                    </button>
                  );
                })}
              </div>
              <div className="text-sm font-black text-amber-600">
                {ratingVal} / 10 Star Rating
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-center gap-3 pt-2">
            {isConfirm && (
              <button
                type="button"
                onClick={handleCancel}
                className="flex-1 rounded-2xl border border-slate-200 bg-slate-100 hover:bg-slate-200 py-3 text-xs sm:text-sm font-extrabold text-slate-700 transition cursor-pointer"
              >
                {cancelText}
              </button>
            )}

            <button
              type="button"
              onClick={handleConfirm}
              className={`flex-1 rounded-2xl py-3 text-xs sm:text-sm font-extrabold text-white transition shadow-lg cursor-pointer ${
                type === "error" || type === "danger" || type === "warning"
                  ? "bg-rose-600 hover:bg-rose-700 shadow-rose-600/30"
                  : "bg-[#FF1744] hover:bg-[#D50000] shadow-red-500/30"
              }`}
            >
              {confirmText}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
