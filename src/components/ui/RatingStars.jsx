import { Star } from 'lucide-react'
import { cx } from '../../lib/format'

// rating is out of 10; render 5 stars.
export default function RatingStars({ rating, size = 14, className }) {
  const filled = rating / 2
  return (
    <div className={cx('flex items-center gap-0.5', className)} aria-label={`Rated ${rating} of 10`}>
      {Array.from({ length: 5 }).map((_, i) => {
        const fill = Math.max(0, Math.min(1, filled - i))
        return (
          <span key={i} className="relative inline-block" style={{ width: size, height: size }}>
            <Star size={size} className="absolute inset-0 text-white/20" />
            <span className="absolute inset-0 overflow-hidden" style={{ width: `${fill * 100}%` }}>
              <Star size={size} className="text-cinema-gold fill-cinema-gold" />
            </span>
          </span>
        )
      })}
    </div>
  )
}
