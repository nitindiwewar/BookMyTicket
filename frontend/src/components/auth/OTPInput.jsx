import { useCallback, useEffect, useRef } from "react";

export default function OTPInput({
  value = "",
  onChange,
  error = "",
  disabled = false,
  success = false,
}) {
  const inputRefs = useRef([]);
  const digits = value.padEnd(6, "").split("").slice(0, 6);

  useEffect(() => {
    const firstEmptyIndex = digits.findIndex((d) => !d);
    const focusIndex = firstEmptyIndex === -1 ? 5 : firstEmptyIndex;
    inputRefs.current[focusIndex]?.focus();
  }, []);

  const handleChange = useCallback(
    (index, e) => {
      const char = e.target.value.replace(/\D/g, "").slice(-1);
      const newDigits = [...digits];
      newDigits[index] = char;
      const newValue = newDigits.join("");
      onChange(newValue);

      if (char && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    },
    [digits, onChange]
  );

  const handleKeyDown = useCallback(
    (index, e) => {
      if (e.key === "Backspace") {
        e.preventDefault();
        const newDigits = [...digits];
        if (digits[index]) {
          newDigits[index] = "";
          onChange(newDigits.join(""));
        } else if (index > 0) {
          newDigits[index - 1] = "";
          onChange(newDigits.join(""));
          inputRefs.current[index - 1]?.focus();
        }
      } else if (e.key === "ArrowLeft" && index > 0) {
        inputRefs.current[index - 1]?.focus();
      } else if (e.key === "ArrowRight" && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    },
    [digits, onChange]
  );

  const handlePaste = useCallback(
    (e) => {
      e.preventDefault();
      const pastedData = e.clipboardData
        .getData("text/plain")
        .replace(/\D/g, "")
        .slice(0, 6);
      if (pastedData) {
        onChange(pastedData);
        const lastIndex = Math.min(pastedData.length, 5);
        inputRefs.current[lastIndex]?.focus();
      }
    },
    [onChange]
  );

  const handleFocus = useCallback((index) => {
    inputRefs.current[index]?.select();
  }, []);

  return (
    <div className="w-full">
      <label className="block text-center text-xs font-extrabold tracking-wide text-slate-600 uppercase mb-3">
        Enter 6-Digit OTP
      </label>
      <div className="flex items-center justify-center gap-2 sm:gap-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <input
            key={index}
            ref={(el) => (inputRefs.current[index] = el)}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digits[index] || ""}
            onChange={(e) => handleChange(index, e)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={index === 0 ? handlePaste : undefined}
            onFocus={() => handleFocus(index)}
            disabled={disabled || success}
            autoComplete="one-time-code"
            className={`h-12 w-10 sm:h-14 sm:w-12 rounded-2xl text-center text-lg sm:text-xl font-black text-slate-900 outline-none transition-all duration-200 ${
              success
                ? "bg-emerald-50 text-emerald-600"
                : error
                ? "bg-red-50 text-red-900 ring-2 ring-red-500/30"
                : "bg-slate-100 focus:bg-slate-200/80 focus:ring-2 focus:ring-red-500/20"
            } disabled:opacity-50 ${
              digits[index] && !error && !success
                ? "bg-red-50 text-red-600"
                : ""
            }`}
          />
        ))}
      </div>

      {error && (
        <p className="mt-2 text-center text-xs font-semibold text-red-500">
          {error}
        </p>
      )}
    </div>
  );
}
