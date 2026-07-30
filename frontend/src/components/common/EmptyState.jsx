import { Film } from "lucide-react";
import Button from "../ui/Button.jsx";

export default function EmptyState({
  icon: Icon = Film,
  title = "No items found",
  description = "Try adjusting your search or filters to find what you are looking for.",
  actionLabel,
  onAction,
  className = "",
}) {
  const IconComponent = (typeof Icon === "function" || typeof Icon === "object") && Icon ? Icon : Film;

  return (
    <div
      className={`flex flex-col items-center justify-center p-12 text-center rounded-3xl border border-slate-200 bg-slate-50/50 ${className}`}
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/10 text-red-500 mb-4">
        <IconComponent className="h-8 w-8" />
      </div>

      <h3 className="text-lg font-bold text-slate-900">
        {title}
      </h3>
      <p className="mt-1.5 max-w-sm text-sm text-slate-500">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button onClick={onAction} className="mt-6" size="sm">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
