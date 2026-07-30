export default function PageHeader({ title, subtitle, children, className = "" }) {
  return (
    <div className={`flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-8 ${className}`}>
      <div>
        <div className="flex items-center gap-2 mb-1.5">
          <div className="h-6 w-1 rounded-full bg-gradient-to-b from-red-500 to-rose-600" />
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {title}
          </h1>
        </div>
        {subtitle && (
          <p className="text-sm text-slate-500 font-medium pl-3">
            {subtitle}
          </p>
        )}
      </div>
      {children && <div className="flex items-center gap-3 shrink-0">{children}</div>}
    </div>
  );
}
