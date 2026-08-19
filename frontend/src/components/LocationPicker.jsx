import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  ChevronDown,
  Search,
  Navigation,
  Check,
  X,
} from "lucide-react";
import { useLocationCity } from "../state/locationContext.jsx";
import { CITY_OPTIONS } from "../constants/index.js";

const POPULAR_CITIES = [
  { name: "Gondia", tag: "Featured" },
  { name: "Nagpur", tag: "Orange City" },
  { name: "Mumbai", tag: "Financial Hub" },
  { name: "Delhi NCR", tag: "Capital Region" },
  { name: "Bengaluru", tag: "Tech Capital" },
  { name: "Hyderabad", tag: "Cyberabad" },
  { name: "Pune", tag: "Cultural Hub" },
  { name: "Kolkata", tag: "City of Joy" },
  { name: "Chennai", tag: "Gateway of South" },
  { name: "Ahmedabad", tag: "Heritage City" },
];

export default function LocationPicker({ compact = false }) {
  const loc = useLocationCity();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const inputRef = useRef(null);

  // Focus search input when pop-up opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  const filteredCities = CITY_OPTIONS.filter((c) =>
    c.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectCity = (cityName) => {
    loc.setCity(cityName);
    setIsOpen(false);
    setSearchQuery("");
  };

  const handleDetectGps = async () => {
    setIsOpen(false);
    await loc.detect();
  };

  return (
    <>
      {/* Location Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label="Select City Location"
        className={`group inline-flex items-center gap-1.5 rounded-full bg-slate-100/90 hover:bg-slate-200/90 text-slate-900 border border-slate-200/80 shadow-2xs hover:shadow-xs transition-all duration-200 cursor-pointer font-extrabold active:scale-95 touch-manipulation min-h-[36px] sm:min-h-[40px] ${
          compact ? "px-3 py-1.5 text-xs" : "px-3.5 sm:px-4 py-2 text-xs sm:text-sm"
        }`}
      >
        <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#FF1744] transition-transform duration-300 group-hover:scale-110 shrink-0" />
        <span className="max-w-[75px] xs:max-w-[110px] sm:max-w-[160px] truncate font-black text-slate-800">
          {loc.status === "detecting" ? "Detecting..." : loc.city || "Select City"}
        </span>
        <ChevronDown className="h-3.5 w-3.5 text-slate-400 group-hover:text-[#FF1744] transition-transform duration-200 group-hover:translate-y-0.5 shrink-0" />
      </button>

      {/* Responsive Small Pop-Up Window */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[99999] flex items-center justify-center p-2.5 sm:p-4">
            {/* Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-slate-950/75 backdrop-blur-sm"
            />

            {/* Compact Responsive Dialog Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 12 }}
              transition={{ type: "spring", duration: 0.25, bounce: 0.05 }}
              className="relative w-full max-w-[95vw] xs:max-w-sm sm:max-w-md max-h-[85vh] sm:max-h-[80vh] flex flex-col overflow-hidden rounded-2xl sm:rounded-3xl bg-white shadow-2xl border border-slate-200/90 z-10 my-auto"
            >
              {/* Fixed Top Header Bar */}
              <div className="flex items-center justify-between border-b border-slate-100 bg-slate-900 px-3.5 sm:px-4.5 py-3 sm:py-3.5 text-white shrink-0">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="grid h-7 w-7 sm:h-8 sm:w-8 place-items-center rounded-lg bg-[#FF1744]/20 text-[#FF1744] shrink-0">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm sm:text-base font-black tracking-tight text-white leading-tight truncate">
                      Select Your City
                    </h3>
                    <p className="text-[10px] sm:text-[11px] font-medium text-slate-400 truncate">
                      Shows movies & showtimes in your area
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="grid h-7 w-7 place-items-center rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer shrink-0 ml-2"
                  aria-label="Close dialog"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Scrollable Body Content */}
              <div className="p-3.5 sm:p-4 space-y-3 flex-1 overflow-y-auto overscroll-contain min-h-0">
                {/* Auto Detect Location Button */}
                <button
                  type="button"
                  onClick={handleDetectGps}
                  disabled={loc.status === "detecting"}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-100 hover:bg-slate-200/80 border border-slate-200 px-3 py-2.5 sm:py-2.5 text-xs font-black text-slate-800 transition active:scale-[0.98] cursor-pointer min-h-[42px]"
                >
                  <Navigation className={`h-3.5 w-3.5 text-[#FF1744] shrink-0 ${loc.status === "detecting" ? "animate-spin" : ""}`} />
                  <span>{loc.status === "detecting" ? "Detecting GPS..." : "Use Current Location (GPS)"}</span>
                </button>

                {/* Search Bar Input */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
                  <input
                    ref={inputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search city (e.g. Gondia, Nagpur)..."
                    className="w-full rounded-xl bg-slate-50 pl-9 pr-8 py-2 sm:py-2 text-xs font-bold text-slate-900 placeholder:text-slate-400 border border-slate-200 focus:border-[#FF1744] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF1744]/20 transition min-h-[38px]"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>

                {/* City Options List / Grid */}
                <div>
                  <div className="flex items-center justify-between text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-slate-400 mb-2 px-0.5">
                    <span>Popular Cities</span>
                    <span className="text-[#FF1744] font-black">{filteredCities.length} Cities</span>
                  </div>

                  {filteredCities.length === 0 ? (
                    <div className="py-6 px-4 text-center text-slate-400 text-xs font-bold">
                      No city found matching "{searchQuery}"
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-2 xs:gap-2.5">
                      {filteredCities.map((cityName) => {
                        const isSelected = loc.city?.toLowerCase().trim() === cityName.toLowerCase().trim();
                        const popInfo = POPULAR_CITIES.find((p) => p.name.toLowerCase() === cityName.toLowerCase());

                        return (
                          <button
                            key={cityName}
                            type="button"
                            onClick={() => handleSelectCity(cityName)}
                            className={`flex items-center justify-between p-2.5 sm:p-3 rounded-xl border text-left transition-all duration-150 cursor-pointer min-h-[44px] touch-manipulation ${
                              isSelected
                                ? "bg-[#FF1744]/10 border-[#FF1744] text-[#FF1744] font-black shadow-2xs"
                                : "bg-slate-50/80 hover:bg-slate-100 border-slate-200/90 text-slate-800 hover:border-slate-300 font-bold"
                            }`}
                          >
                            <div className="flex flex-col min-w-0 pr-1">
                              <span className="text-xs truncate font-extrabold leading-tight">
                                {cityName}
                              </span>
                              {popInfo?.tag && (
                                <span className={`text-[9px] font-extrabold tracking-tight mt-0.5 ${
                                  cityName === "Gondia"
                                    ? "text-amber-600"
                                    : "text-slate-400"
                                }`}>
                                  {popInfo.tag}
                                </span>
                              )}
                            </div>

                            {isSelected && (
                              <span className="grid h-4 w-4 place-items-center rounded-full bg-[#FF1744] text-white shrink-0 ml-1">
                                <Check className="h-2.5 w-2.5 stroke-[3]" />
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* Fixed Bottom Footer Bar */}
              <div className="bg-slate-50 border-t border-slate-100 px-3.5 sm:px-4 py-2.5 text-center shrink-0">
                <p className="text-[11px] font-bold text-slate-500 truncate">
                  Selected City: <span className="text-[#FF1744] font-black">{loc.city || "None"}</span>
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}


