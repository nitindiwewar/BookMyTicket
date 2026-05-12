const steps = [
  { id: "theaters", label: "Theater" },
  { id: "seats", label: "Seats" },
  { id: "snacks", label: "Snacks" },
  { id: "payment", label: "Payment" },
  { id: "confirmed", label: "Confirmed" },
];

export default function BookingStepper({ current }) {
  const currentIndex = Math.max(
    0,
    steps.findIndex((s) => s.id === current),
  );

  return (
    <div className="sticky top-15 z-30 mb-4 rounded-2xl border border-white/10 bg-black/70 p-3 backdrop-blur">
      <div className="flex items-center justify-between gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {steps.map((s, i) => {
          const done = i < currentIndex;
          const active = i === currentIndex;
          return (
            <div key={s.id} className="flex min-w-fit items-center gap-2">
              <div
                className={[
                  "grid h-6 w-6 place-items-center rounded-full border text-[10px] font-bold",
                  active
                    ? "border-white/40 bg-white text-black"
                    : done
                      ? "border-white/20 bg-white/15 text-white"
                      : "border-white/10 bg-white/5 text-white/60",
                ].join(" ")}
              >
                {i + 1}
              </div>
              <div
                className={[
                  "text-xs font-semibold",
                  active
                    ? "text-white"
                    : done
                      ? "text-white/80"
                      : "text-white/50",
                ].join(" ")}
              >
                {s.label}
              </div>
              {i !== steps.length - 1 ? (
                <div className="mx-1 h-px w-6 bg-white/15" />
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}
