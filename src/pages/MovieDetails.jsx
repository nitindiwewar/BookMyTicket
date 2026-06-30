import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Play, Star, Clock, Calendar, Heart, Share2, X, ChevronRight } from 'lucide-react'
import Poster from '../components/ui/Poster'
import RatingStars from '../components/ui/RatingStars'
import { getMovieById } from '../data/movies'
import { getShowtimes } from '../data/theaters'
import { useApp } from '../context/AppContext'
import { formatRuntime, formatDate, compactVotes, cx } from '../lib/format'

export default function MovieDetails() {
  const { id } = useParams()
  const movie = getMovieById(id)
  const navigate = useNavigate()
  const { state, toggleFavorite, startBooking } = useApp()
  const [showTrailer, setShowTrailer] = useState(false)

  if (!movie) {
    return (
      <div className="section grid min-h-[60vh] place-items-center text-center">
        <div>
          <h1 className="text-2xl font-bold">Movie not found</h1>
          <Link to="/movies" className="btn-primary mt-4">Back to movies</Link>
        </div>
      </div>
    )
  }

  const isFav = state.favorites.includes(movie.id)
  const showtimes = getShowtimes(movie)
  const { from, via, to } = movie.banner

  const pickShow = (theaterId, show) => {
    startBooking(movie.id, theaterId, show)
    navigate(`/movies/${movie.id}/seats`)
  }

  return (
    <div>
      {/* Banner */}
      <section className="relative">
        <div
          className="absolute inset-0"
          style={{ background: `linear-gradient(120deg, ${from}, ${via} 50%, ${to})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-cinema-black via-cinema-black/80 to-cinema-black/30" />

        <div className="section relative grid gap-8 py-16 md:grid-cols-[300px_1fr] md:py-20">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-auto w-56 md:mx-0 md:w-full"
          >
            <div className="aspect-[2/3] overflow-hidden rounded-2xl shadow-card ring-1 ring-white/10">
              <Poster movie={movie} showTitle={false} />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h1 className="text-4xl font-extrabold sm:text-5xl">{movie.title}</h1>
            <p className="mt-2 text-lg italic text-white/80">{movie.tagline}</p>

            <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-white/85">
              <span className="inline-flex items-center gap-1 text-cinema-gold">
                <Star size={16} className="fill-cinema-gold" /> {movie.rating}
                <span className="text-white/50">({compactVotes(movie.votes)} votes)</span>
              </span>
              <span className="inline-flex items-center gap-1"><Clock size={15} /> {formatRuntime(movie.duration)}</span>
              <span className="inline-flex items-center gap-1"><Calendar size={15} /> {formatDate(movie.releaseDate)}</span>
              <span className="chip">{movie.certificate}</span>
              <span className="chip">{movie.language}</span>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              {movie.genres.map((g) => <span key={g} className="chip">{g}</span>)}
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {movie.formats.map((f) => (
                <span key={f} className="chip border-cinema-purple-glow/40 text-cinema-purple-glow">{f}</span>
              ))}
            </div>

            <p className="mt-5 max-w-2xl leading-relaxed text-slate-300">{movie.description}</p>

            <div className="mt-7 flex flex-wrap gap-3">
              {!movie.upcoming && (
                <a href="#showtimes" className="btn-primary px-7 py-3">
                  <Play size={18} /> Book Now
                </a>
              )}
              <button onClick={() => setShowTrailer(true)} className="btn-ghost px-6 py-3">
                <Play size={18} /> Watch Trailer
              </button>
              <button
                onClick={() => toggleFavorite(movie.id)}
                className={cx('btn px-5 py-3', isFav ? 'bg-cinema-red text-white' : 'btn-outline')}
              >
                <Heart size={18} className={isFav ? 'fill-white' : ''} />
                {isFav ? 'Saved' : 'Favorite'}
              </button>
              <button className="btn-outline px-5 py-3"><Share2 size={18} /> Share</button>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="section grid gap-10 pb-16 lg:grid-cols-[1fr_340px]">
        <div className="space-y-12">
          {/* Cast & crew */}
          <section>
            <h2 className="mb-5 text-2xl font-bold">Cast & Crew</h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {[...movie.cast, ...movie.crew].map((p) => (
                <div key={p.name} className="glass-card flex items-center gap-3 p-3">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-purple-red/30 font-display text-sm font-bold text-white">
                    {p.name.split(' ').map((n) => n[0]).join('')}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">{p.name}</p>
                    <p className="truncate text-xs text-slate-400">{p.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Reviews */}
          <section>
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-2xl font-bold">Ratings & Reviews</h2>
              <div className="flex items-center gap-2">
                <RatingStars rating={movie.rating} size={18} />
                <span className="font-display text-lg font-bold">{movie.rating}/10</span>
              </div>
            </div>
            {movie.reviews.length === 0 ? (
              <div className="glass-card p-8 text-center text-slate-400">
                No reviews yet. Be the first to review after release.
              </div>
            ) : (
              <div className="space-y-4">
                {movie.reviews.map((r, i) => (
                  <div key={i} className="glass-card p-5">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="font-semibold">@{r.user}</span>
                      <span className="chip text-cinema-gold"><Star size={12} className="fill-cinema-gold" /> {r.rating}/10</span>
                    </div>
                    <p className="text-sm text-slate-300">{r.text}</p>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Showtimes */}
        <aside id="showtimes" className="space-y-4">
          <div className="glass-card p-5">
            <h2 className="text-xl font-bold">{movie.upcoming ? 'Coming Soon' : 'Show Timings'}</h2>
            {movie.upcoming ? (
              <p className="mt-3 text-sm text-slate-400">
                Bookings open closer to release on {formatDate(movie.releaseDate)}.
              </p>
            ) : (
              <div className="mt-4 space-y-5">
                {showtimes.map(({ theater, shows }) => (
                  <div key={theater.id}>
                    <p className="text-sm font-semibold">{theater.name}</p>
                    <p className="mb-2 text-xs text-slate-500">{theater.area}, {theater.city}</p>
                    <div className="flex flex-wrap gap-2">
                      {shows.map((s) => (
                        <button
                          key={s.id}
                          onClick={() => pickShow(theater.id, s)}
                          className={cx(
                            'group flex flex-col items-center rounded-xl border px-3 py-1.5 text-xs transition hover:-translate-y-0.5',
                            s.fillRate > 0.8
                              ? 'border-cinema-red/40 text-cinema-red-glow hover:border-cinema-red'
                              : 'border-emerald-400/30 text-emerald-300 hover:border-emerald-400',
                          )}
                        >
                          <span className="font-semibold">{s.time}</span>
                          <span className="text-[10px] text-slate-500">{s.format}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
                <p className="flex items-center gap-1 text-xs text-slate-500">
                  <span className="inline-block h-2 w-2 rounded-full bg-emerald-400" /> Available
                  <span className="ml-3 inline-block h-2 w-2 rounded-full bg-cinema-red" /> Filling fast
                </p>
              </div>
            )}
          </div>
        </aside>
      </div>

      {/* Trailer modal */}
      {showTrailer && (
        <div
          className="fixed inset-0 z-[60] grid place-items-center bg-black/80 p-4 backdrop-blur"
          onClick={() => setShowTrailer(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-3xl"
          >
            <button
              onClick={() => setShowTrailer(false)}
              className="absolute -top-12 right-0 grid h-10 w-10 place-items-center rounded-full glass text-white"
              aria-label="Close trailer"
            >
              <X size={20} />
            </button>
            <div className="aspect-video overflow-hidden rounded-2xl border border-white/10 shadow-card">
              <iframe
                className="h-full w-full"
                src={`https://www.youtube.com/embed/${movie.trailerId}`}
                title={`${movie.title} trailer`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
