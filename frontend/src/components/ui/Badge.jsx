export default function Badge({
  children,
  variant = "default",
  className = "",
  size = "md",
}) {
  const variants = {
    default: "bg-slate-100/90 text-slate-800",
    primary: "bg-red-50 text-[#FF1744] font-bold border border-red-200/50",
    cyan: "bg-cyan-50 text-cyan-700 font-bold border border-cyan-200/50",
    amber: "bg-amber-50 text-amber-700 font-bold border border-amber-200/50",
    emerald: "bg-emerald-50 text-emerald-700 font-bold border border-emerald-200/50",
    subtle: "bg-slate-100 text-slate-600 font-medium",
    glass: "glass-badge text-white font-bold",
  };

  const sizes = {
    sm: "px-2.5 py-0.5 text-[10px]",
    md: "px-3 py-1 text-xs",
    lg: "px-3.5 py-1.5 text-sm",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-bold tracking-wide ${variants[variant] || variants.default} ${sizes[size] || sizes.md} ${className}`}
    >
      {children}
    </span>
  );
}

