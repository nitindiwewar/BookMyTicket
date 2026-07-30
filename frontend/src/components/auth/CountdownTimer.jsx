import { RefreshCw } from "lucide-react";

export default function CountdownTimer({
  seconds = 30,
  onResend,
  disabled = false,
}) {
  const isExpired = seconds <= 0;

  return (
    <div className="flex items-center justify-between text-xs">
      <span className="text-slate-500 font-medium">
        {isExpired
          ? "OTP expired. Request a new code."
          : `Resend code in ${seconds}s`}
      </span>
      <button
        type="button"
        disabled={!isExpired || disabled}
        onClick={onResend}
        className="inline-flex items-center gap-1.5 rounded-xl bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-700 transition hover:bg-slate-200/80 disabled:opacity-40 disabled:pointer-events-none"
      >
        <RefreshCw className={`h-3.5 w-3.5 ${!isExpired ? "animate-spin text-slate-400" : ""}`} />
        Resend OTP
      </button>
    </div>
  );
}
