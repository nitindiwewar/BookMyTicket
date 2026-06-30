import { useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function Carousel({ children, itemClassName = 'w-[170px] sm:w-[200px]' }) {
  const ref = useRef(null)

  const scrollBy = (dir) => {
    const el = ref.current
    if (!el) return
    el.scrollBy({ left: dir * (el.clientWidth * 0.8), behavior: 'smooth' })
  }

  return (
    <div className="group relative">
      <button
        onClick={() => scrollBy(-1)}
        aria-label="Scroll left"
        className="absolute -left-3 top-1/2 z-10 hidden -translate-y-1/2 place-items-center rounded-full glass-strong p-2 text-white opacity-0 transition group-hover:opacity-100 md:grid"
      >
        <ChevronLeft size={20} />
      </button>
      <div
        ref={ref}
        className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2"
      >
        {Array.isArray(children)
          ? children.map((child, i) => (
              <div key={i} className={`${itemClassName} shrink-0 snap-start`}>
                {child}
              </div>
            ))
          : children}
      </div>
      <button
        onClick={() => scrollBy(1)}
        aria-label="Scroll right"
        className="absolute -right-3 top-1/2 z-10 hidden -translate-y-1/2 place-items-center rounded-full glass-strong p-2 text-white opacity-0 transition group-hover:opacity-100 md:grid"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  )
}
