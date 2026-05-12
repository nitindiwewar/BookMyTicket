import { memo } from "react";

function classNames(...parts) {
  return parts.filter(Boolean).join(" ");
}

function Card({ className, children }) {
  return (
    <div
      className={classNames(
        "rounded-2xl border border-white/10 bg-white/5 shadow-[0_8px_24px_rgba(255,255,255,0.06)]",
        className,
      )}
    >
      {children}
    </div>
  );
}

export default memo(Card);
