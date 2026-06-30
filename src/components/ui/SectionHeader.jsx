import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

export default function SectionHeader({ eyebrow, title, action, to }) {
  return (
    <div className="mb-6 flex items-end justify-between gap-4">
      <div>
        {eyebrow && (
          <p className="mb-1 text-xs font-semibold uppercase tracking-[0.2em] text-cinema-purple-glow">
            {eyebrow}
          </p>
        )}
        <h2 className="text-2xl font-bold sm:text-3xl">{title}</h2>
      </div>
      {action && to && (
        <Link to={to} className="group flex items-center gap-1 text-sm font-medium text-slate-300 hover:text-white">
          {action}
          <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
        </Link>
      )}
    </div>
  )
}
