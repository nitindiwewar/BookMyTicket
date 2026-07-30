import { MapPin, Navigation, Sparkles } from "lucide-react";
import { useLocationCity } from "../state/locationContext.jsx";

export default function LocationPicker({ compact = false }) {
  const loc = useLocationCity();

  return (
    <div className="relative inline-flex items-center">
      {/* Pure Map GPS Location Pill Trigger */}
      <button
        type="button"
        onClick={() => loc.detect()}
        disabled={loc.status === "detecting"}
        title="Click to detect exact GPS map location"
        className={`group inline-flex items-center gap-2 rounded-full bg-slate-100/90 text-[#111827] hover:bg-slate-200/80 border border-slate-200/60 transition-all duration-200 font-extrabold cursor-pointer ${
          compact ? "px-3.5 py-1.5 text-xs" : "px-4 py-2 text-sm"
        }`}
      >
        <MapPin className="h-4 w-4 text-[#FF1744] transition-transform duration-300 group-hover:scale-110 shrink-0" />
        
        <span className="max-w-[140px] sm:max-w-[200px] truncate">
          {loc.status === "detecting" ? "Detecting GPS..." : loc.city}
        </span>

        <Navigation className={`h-3 w-3 text-[#FF1744] transition-transform ${loc.status === "detecting" ? "animate-spin" : "group-hover:rotate-45"}`} />

        <span className="relative flex h-2 w-2 shrink-0">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
      </button>
    </div>
  );
}
