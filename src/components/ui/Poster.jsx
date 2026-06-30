import { cx } from '../../lib/format'

// Self-contained themed poster art. Renders a cinematic gradient with the
// movie title so the app has zero external image dependencies.
export default function Poster({ movie, className, showTitle = true }) {
  const { from, to, accent } = movie.poster
  return (
    <div
      className={cx('relative h-full w-full overflow-hidden', className)}
      style={{ background: `linear-gradient(160deg, ${from} 0%, ${to} 95%)` }}
      role="img"
      aria-label={`${movie.title} poster`}
    >
      {/* glow orbs */}
      <div
        className="absolute -right-8 -top-10 h-32 w-32 rounded-full blur-2xl opacity-50"
        style={{ background: accent }}
      />
      <div
        className="absolute -bottom-10 -left-8 h-28 w-28 rounded-full blur-2xl opacity-30"
        style={{ background: accent }}
      />
      {/* film strip lines */}
      <div className="absolute inset-y-0 left-0 w-3 bg-black/30 [background-image:repeating-linear-gradient(0deg,transparent,transparent_8px,rgba(255,255,255,0.12)_8px,rgba(255,255,255,0.12)_14px)]" />
      <div className="absolute inset-y-0 right-0 w-3 bg-black/30 [background-image:repeating-linear-gradient(0deg,transparent,transparent_8px,rgba(255,255,255,0.12)_8px,rgba(255,255,255,0.12)_14px)]" />

      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

      {showTitle && (
        <div className="absolute inset-x-0 bottom-0 p-4">
          <div
            className="mb-2 h-1 w-10 rounded-full"
            style={{ background: accent }}
          />
          <h3 className="font-display text-lg font-bold leading-tight text-white drop-shadow">
            {movie.title}
          </h3>
          <p className="mt-0.5 text-xs text-white/70">{movie.genres.join(' · ')}</p>
        </div>
      )}
    </div>
  )
}
