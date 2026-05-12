import { memo } from "react";
import { classNames } from "../../utils/classNames.js";

/**
 * Button component with multiple variants and sizes
 * Memoized for performance optimization
 * @component
 * @param {Object} props
 * @param {React.ElementType} props.as - Component to render as (default: button)
 * @param {'primary'|'subtle'|'ghost'|'danger'} props.variant - Button variant (default: primary)
 * @param {'sm'|'md'|'lg'} props.size - Button size (default: md)
 * @param {string} props.className - Additional CSS classes
 * @returns {JSX.Element}
 */
function Button({
  as: Comp = "button",
  variant = "primary",
  size = "md",
  className,
  ...props
}) {
  const base =
    "inline-flex items-center justify-center rounded-xl font-semibold transition will-change-transform focus:outline-none focus:ring-2 focus:ring-white/30 focus:ring-offset-2 focus:ring-offset-black disabled:pointer-events-none disabled:opacity-50 active:translate-y-px";

  const variants = {
    primary: "bg-white text-black hover:bg-white/90 shadow-sm shadow-white/10",
    subtle:
      "border border-white/10 bg-white/5 text-white hover:bg-white/10 shadow-sm shadow-black/20",
    ghost: "text-white hover:bg-white/10",
    danger:
      "border border-white/10 bg-black text-white hover:bg-white/5 shadow-sm shadow-black/30",
  };

  const sizes = {
    sm: "px-3 py-2 text-sm",
    md: "px-4 py-2.5 text-sm",
    lg: "px-5 py-3 text-sm",
  };

  return (
    <Comp
      className={classNames(base, variants[variant], sizes[size], className)}
      {...props}
    />
  );
}

export default memo(Button);
