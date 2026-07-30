import { forwardRef } from "react";

const Card = forwardRef(function Card(
  { children, className = "", hover = false, ...props },
  ref
) {
  return (
    <div
      ref={ref}
      className={`rounded-[22px] bg-white p-6 shadow-md shadow-slate-200/50 border border-[#E5E7EB] transition-all duration-300 ${
        hover ? "hover:shadow-xl hover:shadow-slate-300/60 hover:-translate-y-1" : ""
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
});

export default Card;

