import { useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

const COUNTRY_CODES = [
  { code: "+91", label: "IN", flag: "🇮🇳" },
  { code: "+1", label: "US", flag: "🇺🇸" },
  { code: "+44", label: "UK", flag: "🇬🇧" },
  { code: "+61", label: "AU", flag: "🇦🇺" },
  { code: "+81", label: "JP", flag: "🇯🇵" },
  { code: "+86", label: "CN", flag: "🇨🇳" },
  { code: "+49", label: "DE", flag: "🇩🇪" },
  { code: "+33", label: "FR", flag: "🇫🇷" },
  { code: "+971", label: "AE", flag: "🇦🇪" },
  { code: "+65", label: "SG", flag: "🇸🇬" },
];

export default function MobileInput({
  countryCode = "+91",
  onCountryCodeChange,
  mobile = "",
  onMobileChange,
  error = "",
  disabled = false,
}) {
  const [codeDropdownOpen, setCodeDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const selectedCountry =
    COUNTRY_CODES.find((c) => c.code === countryCode) || COUNTRY_CODES[0];

  const handleMobileChange = (e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 10);
    onMobileChange(value);
  };

  const handleKeyDown = (e) => {
    const allowedKeys = [
      "Backspace",
      "Delete",
      "Tab",
      "Escape",
      "Enter",
      "ArrowLeft",
      "ArrowRight",
      "ArrowUp",
      "ArrowDown",
    ];
    if (allowedKeys.includes(e.key)) return;
    if (
      (e.ctrlKey || e.metaKey) &&
      ["a", "c", "v", "x"].includes(e.key.toLowerCase())
    )
      return;
    if (!/^\d$/.test(e.key)) {
      e.preventDefault();
    }
  };

  return (
    <div className="w-full space-y-1.5">
      <label className="block text-xs font-bold tracking-wide uppercase text-slate-600">
        Mobile Number
      </label>
      <div className="relative flex items-center gap-2">
        {/* Country Code Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            disabled={disabled}
            onClick={() => setCodeDropdownOpen(!codeDropdownOpen)}
            onBlur={() => setTimeout(() => setCodeDropdownOpen(false), 200)}
            className="flex items-center gap-1.5 rounded-2xl bg-slate-100 px-3.5 py-2.5 text-sm font-bold text-slate-800 hover:bg-slate-200/80 transition disabled:opacity-50 min-w-[95px]"
          >
            <span className="text-base leading-none">
              {selectedCountry.flag}
            </span>
            <span>{selectedCountry.code}</span>
            <ChevronDown
              className={`h-3.5 w-3.5 text-slate-400 transition-transform ${
                codeDropdownOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {codeDropdownOpen && (
            <div className="absolute left-0 top-full mt-1.5 z-50 w-[160px] rounded-2xl bg-white shadow-xl p-1.5 max-h-56 overflow-y-auto space-y-1">
              {COUNTRY_CODES.map((country) => (
                <button
                  key={country.code}
                  type="button"
                  className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold transition ${
                    country.code === countryCode
                      ? "bg-red-50 text-red-600"
                      : "text-slate-700 hover:bg-slate-100"
                  }`}
                  onClick={() => {
                    onCountryCodeChange(country.code);
                    setCodeDropdownOpen(false);
                  }}
                >
                  <span className="text-base leading-none">{country.flag}</span>
                  <span>{country.code}</span>
                  <span className="text-slate-400 text-[10px] ml-auto">{country.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Mobile Input */}
        <div className="relative flex-1">
          <input
            type="tel"
            inputMode="numeric"
            value={mobile}
            onChange={handleMobileChange}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            placeholder="98765 43210"
            maxLength={10}
            className={`w-full rounded-2xl bg-slate-100 px-4 py-2.5 text-sm font-bold text-slate-900 placeholder:text-slate-400 outline-none transition ${
              error
                ? "bg-red-50 text-red-900 ring-2 ring-red-500/30"
                : "focus:bg-slate-200/70 focus:ring-2 focus:ring-red-500/20"
            } disabled:opacity-50`}
          />
        </div>
      </div>

      {error && (
        <p className="text-xs font-semibold text-red-500 pt-0.5">
          {error}
        </p>
      )}
    </div>
  );
}
