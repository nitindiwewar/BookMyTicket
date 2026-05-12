import { memo } from "react";
import { classNames } from "../../utils/classNames.js";

/**
 * Input component with label, hint, and error handling
 * Memoized for performance optimization
 * @component
 * @param {Object} props
 * @param {string} props.label - Input label text
 * @param {string} props.hint - Optional hint text
 * @param {string} props.error - Error message to display
 * @param {string} props.className - Additional CSS classes
 * @param {boolean} props.success - Whether to show success state
 * @returns {JSX.Element}
 */
function Input({ label, hint, error, className, success, ...props }) {
  return (
    <label className={classNames("block", className)}>
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs font-semibold text-white/70">{label}</span>
        {hint ? <span className="text-xs text-white/40">{hint}</span> : null}
      </div>
      <input
        className={classNames(
          "mt-2 w-full rounded-2xl border bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/40 outline-none transition-all duration-200",
          error
            ? "border-red-500/50 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
            : success
              ? "border-green-500/50 focus:border-green-500 focus:ring-2 focus:ring-green-500/20"
              : "border-white/10 focus:border-white/20 focus:bg-white/10",
        )}
        {...props}
      />
      {error ? (
        <div className="mt-2 flex items-center gap-1.5 text-xs font-medium text-red-400">
          <svg
            className="h-3.5 w-3.5 shrink-0"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          {error}
        </div>
      ) : success ? (
        <div className="mt-2 flex items-center gap-1.5 text-xs font-medium text-green-400">
          <svg
            className="h-3.5 w-3.5 shrink-0"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
          Valid
        </div>
      ) : null}
    </label>
  );
}

export default memo(Input);
