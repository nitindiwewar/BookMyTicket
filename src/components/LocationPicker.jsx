import { useEffect, useRef, useState } from "react";
import Card from "./ui/Card.jsx";
import MapLocationPicker from "./MapLocationPicker.jsx";
import { useLocationCity } from "../state/locationContext.jsx";

function classNames(...parts) {
  return parts.filter(Boolean).join(" ");
}

export default function LocationPicker({ compact = false }) {
  const loc = useLocationCity();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [mapOpen, setMapOpen] = useState(false);
  const rootRef = useRef(null);

  useEffect(() => {
    const onDown = (e) => {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(e.target)) {
        setOpen(false);
        setMapOpen(false);
      }
    };
    window.addEventListener("mousedown", onDown);
    return () => window.removeEventListener("mousedown", onDown);
  }, []);

  const options = loc.options.filter((c) =>
    c.toLowerCase().includes(query.trim().toLowerCase()),
  );

  return (
    <div className="relative" ref={rootRef}>
      <button
        type="button"
        onClick={() => {
          setOpen((v) => !v);
          if (open) setMapOpen(false);
        }}
        className={classNames(
          "inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 text-white/85 transition hover:bg-white/10 hover:text-white",
          compact
            ? "px-3 py-2 text-xs font-semibold"
            : "px-4 py-2.5 text-sm font-semibold",
        )}
        aria-label="Select location"
      >
        <span className="text-white/60">📍</span>
        <span className="max-w-40 truncate">{loc.city}</span>
        <span className="text-white/50">⌄</span>
      </button>

      {open ? (
        <div className="absolute left-0 top-[calc(100%+0.5rem)] z-50 w-[min(22rem,90vw)]">
          {mapOpen ? (
            <MapLocationPicker
              onCancel={() => setMapOpen(false)}
              onDone={() => {
                setMapOpen(false);
                setOpen(false);
              }}
            />
          ) : (
            <Card className="p-3">
              <div className="flex items-center justify-between gap-3">
                <div className="text-xs font-semibold text-white/70">
                  Choose your city
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => loc.detect()}
                    className="rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white/80 transition hover:bg-white/10 disabled:opacity-60"
                    disabled={
                      loc.status === "detecting" || loc.status === "watching"
                    }
                  >
                    {loc.status === "detecting"
                      ? "Detecting…"
                      : "Use current location"}
                  </button>
                </div>
              </div>

              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search city…"
                className="mt-3 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/40 outline-none transition focus:border-white/20 focus:bg-white/10"
              />

              <div className="mt-3 grid max-h-60 gap-2 overflow-auto pr-1">
                {options.map((c) => {
                  const active = c === loc.city;
                  return (
                    <button
                      key={c}
                      type="button"
                      className={classNames(
                        "rounded-2xl border p-3 text-left text-sm font-semibold transition",
                        active
                          ? "border-white/25 bg-white text-black"
                          : "border-white/10 bg-white/5 text-white/80 hover:bg-white/10 hover:text-white",
                      )}
                      onClick={() => {
                        loc.setCity(c);
                        setOpen(false);
                      }}
                    >
                      {c}
                    </button>
                  );
                })}

                {!options.length ? (
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-3 text-sm text-white/60">
                    No matching cities.
                  </div>
                ) : null}
              </div>

              {loc.status === "denied" ? (
                <div className="mt-3 text-xs text-white/50">
                  Location permission denied — using a best‑guess city.
                </div>
              ) : null}
            </Card>
          )}
        </div>
      ) : null}
    </div>
  );
}
