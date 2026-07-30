/**
 * LoadingButton - Button with spinning loader, disabled state, and scale animation
 * @param {Object} props
 * @param {boolean} props.loading - Show loading spinner
 * @param {boolean} props.disabled - Disable button
 * @param {string} props.variant - 'primary' | 'secondary' | 'outline'
 * @param {string} props.className - Additional classes
 * @param {React.ReactNode} props.children - Button content
 * @param {Function} props.onClick - Click handler
 * @param {string} props.type - Button type
 */
export default function LoadingButton({
  loading = false,
  disabled = false,
  variant = "primary",
  className = "",
  children,
  onClick,
  type = "button",
  ...props
}) {
  const baseStyles =
    "relative inline-flex w-full items-center justify-center gap-2 rounded-2xl px-6 py-3.5 text-sm font-semibold outline-none transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100";

  const variants = {
    primary:
      "bg-[#E50914] text-white hover:bg-[#E50914]/90 hover:shadow-lg hover:shadow-[#E50914]/20 focus:ring-2 focus:ring-[#E50914]/40",
    secondary:
      "bg-white/[0.06] text-white border border-white/[0.08] hover:bg-white/[0.10] hover:border-white/[0.12] focus:ring-2 focus:ring-white/[0.10]",
    outline:
      "bg-transparent text-white border border-white/[0.12] hover:bg-white/[0.04] focus:ring-2 focus:ring-white/[0.08]",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseStyles} ${variants[variant]} ${className} ${
        !disabled && !loading ? "hover:scale-[1.02]" : ""
      }`}
      {...props}
    >
      {loading && (
        <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {loading ? "Please wait..." : children}
    </button>
  );
}
