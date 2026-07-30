import { forwardRef } from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

const variants = {
  primary:
    "bg-gradient-to-r from-[#FF1744] to-[#FF4F6D] text-white font-bold shadow-lg shadow-[#FF1744]/25 hover:shadow-xl hover:shadow-[#FF1744]/40 hover:scale-[1.03] active:scale-[0.98] rounded-full border border-red-500/20",
  secondary:
    "bg-white/80 backdrop-blur-md text-[#111827] font-bold border border-[#E5E7EB] hover:bg-white hover:border-slate-300 hover:scale-[1.02] shadow-sm active:scale-[0.98] rounded-full",
  subtle:
    "bg-slate-100/90 text-[#111827] font-bold hover:bg-slate-200/90 hover:scale-[1.02] active:scale-[0.98] rounded-full",
  outline:
    "bg-transparent text-[#111827] font-bold border border-[#E5E7EB] hover:bg-white hover:border-slate-300 hover:shadow-sm active:scale-[0.98] rounded-full",
  ghost:
    "text-[#6B7280] font-bold hover:text-[#111827] hover:bg-slate-100/80 active:scale-[0.98] rounded-full",
  danger:
    "bg-red-50 text-[#FF1744] font-bold hover:bg-red-100 active:scale-[0.98] rounded-full",
};

const sizes = {
  xs: "px-3 py-1 text-xs",
  sm: "px-4 py-1.5 text-xs font-bold",
  md: "px-5 py-2.5 text-sm font-bold",
  lg: "px-7 py-3.5 text-base font-bold",
};

const Button = forwardRef(function Button(
  {
    children,
    className = "",
    variant = "primary",
    size = "md",
    loading = false,
    disabled = false,
    as: Component,
    type = "button",
    ...props
  },
  ref
) {
  const variantClass = variants[variant] || variants.primary;
  const sizeClass = sizes[size] || sizes.md;

  const combinedClass = `inline-flex items-center justify-center gap-2 text-center transition-all duration-200 focus:outline-none disabled:opacity-50 disabled:pointer-events-none cursor-pointer ${variantClass} ${sizeClass} ${className}`;

  if (Component) {
    return (
      <Component ref={ref} className={combinedClass} {...props}>
        {loading && <Loader2 className="h-4 w-4 animate-spin shrink-0" />}
        {children}
      </Component>
    );
  }

  return (
    <motion.button
      ref={ref}
      type={type}
      whileTap={{ scale: disabled || loading ? 1 : 0.97 }}
      disabled={disabled || loading}
      className={combinedClass}
      {...props}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin shrink-0" />}
      {children}
    </motion.button>
  );
});

export default Button;

