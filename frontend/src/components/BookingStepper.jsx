import { motion } from "framer-motion";
import { Check, Film, Armchair, Popcorn, CreditCard, Ticket } from "lucide-react";

const steps = [
  { id: "theaters", label: "Showtime", icon: Film },
  { id: "seats", label: "Seats", icon: Armchair },
  { id: "snacks", label: "Snacks", icon: Popcorn },
  { id: "payment", label: "Payment", icon: CreditCard },
  { id: "confirmed", label: "Confirmation", icon: Ticket },
];

export default function BookingStepper({ current, currentStep }) {
  let currentIndex = 0;
  if (typeof currentStep === "number") {
    currentIndex = currentStep - 1;
  } else if (typeof current === "string") {
    currentIndex = steps.findIndex((s) => s.id === current);
  }
  currentIndex = Math.max(0, currentIndex);


  return (
    <div className="sticky top-16 z-30 mb-6 rounded-3xl border border-slate-200 bg-white/90 p-3 shadow-md backdrop-blur-xl">
      <div className="flex items-center justify-between gap-2 overflow-x-auto scrollbar-none px-2">
        {steps.map((s, i) => {
          const done = i < currentIndex;
          const active = i === currentIndex;
          const Icon = s.icon;

          return (
            <div key={s.id} className="flex min-w-fit items-center gap-2">
              <div
                className={`relative flex h-8 w-8 items-center justify-center rounded-2xl border text-xs font-bold transition-all duration-300 ${
                  active
                    ? "border-red-500 bg-red-600 text-white shadow-lg shadow-red-600/30"
                    : done
                    ? "border-emerald-500/40 bg-emerald-500/15 text-emerald-600"
                    : "border-slate-200 bg-slate-100 text-slate-400"
                }`}
              >
                {done ? <Check className="h-4 w-4 stroke-[3]" /> : <Icon className="h-4 w-4" />}
              </div>

              <div
                className={`text-xs font-semibold ${
                  active
                    ? "text-slate-900 font-bold"
                    : done
                    ? "text-slate-700"
                    : "text-slate-400"
                }`}
              >
                {s.label}
              </div>

              {i !== steps.length - 1 && (
                <div
                  className={`mx-2 h-0.5 w-6 sm:w-10 rounded-full transition-colors ${
                    i < currentIndex
                      ? "bg-emerald-500/40"
                      : "bg-slate-200"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
