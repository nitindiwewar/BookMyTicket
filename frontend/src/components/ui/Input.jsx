import { forwardRef } from "react";

const Input = forwardRef(function Input(
  {
    label,
    error,
    helperText,
    icon: Icon,
    className = "",
    containerClassName = "",
    disabled,
    ...props
  },
  ref
) {
  return (
    <div className={`flex flex-col gap-1.5 ${containerClassName}`}>
      {label && (
        <label className="text-xs font-bold tracking-wide uppercase text-slate-600">
          {label}
        </label>
      )}

      <div className="relative flex items-center">
        {Icon && (
          <div className="pointer-events-none absolute left-3.5 text-slate-400">
            <Icon className="h-4 w-4" />
          </div>
        )}

        <input
          ref={ref}
          disabled={disabled}
          className={`w-full rounded-2xl bg-slate-100 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all duration-200 ${
            Icon ? "pl-10" : ""
          } ${
            error
              ? "bg-red-50 text-red-900 placeholder:text-red-300 ring-2 ring-red-500/30"
              : "focus:bg-slate-200/70 focus:ring-2 focus:ring-red-500/20"
          } ${disabled ? "opacity-50 cursor-not-allowed" : ""} ${className}`}
          {...props}
        />
      </div>

      {error ? (
        <p className="text-xs text-red-500 font-semibold">{error}</p>
      ) : helperText ? (
        <p className="text-xs text-slate-500">{helperText}</p>
      ) : null}
    </div>
  );
});

export default Input;
