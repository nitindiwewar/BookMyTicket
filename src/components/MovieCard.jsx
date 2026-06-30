import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Star, Clock, Heart, Play } from 'lucide-react'
import Poster from './ui/Poster'
import { useApp } from '../context/AppContext'
import { formatRuntime, formatDate, cx } from '../lib/format'

export default function MovieCard({ movie, index = 0 }) {
  const { state, toggleFavorite } = useApp()
  const isFav = state.favorites.includes(movie.id)

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.4) }}
      className="group relative"
    >
      <div className="glass-card overflow-hidden transition-all duration-300 group-hover:border-cinema-purple-glow/50 group-hover:shadow-glow">
        <div className="relative aspect-[2/3] overflow-hidden">
          <div className="h-full w-full transition-transform duration-500 group-hover:scale-105">
            <Poster movie={movie} showTitle={false} />
          </div>

          {/* top badges */}
          <div className="absolute inset-x-0 top-0 flex items-start justify-between p-3">
            <span className="chip bg-black/50 backdrop-blur text-cinema-gold">
              <Star size={12} className="fill-cinema-gold" />
              {movie.rating}
            </span>
            <button
              onClick={() => toggleFavorite(movie.id)}
              aria-label={isFav ? 'Remove from favorites' : 'Add to favorites'}
              className={cx(
                'grid h-8 w-8 place-items-center rounded-full border border-white/10 backdrop-blur transition',
                isFav ? 'bg-cinema-red text-white' : 'bg-black/50 text-white/80 hover:bg-black/70',
              )}
            >
              <Heart size={15} className={isFav ? 'fill-white' : ''} />
            </button>
          </div>

          {/* hover overlay */}
          <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black via-black/40 to-transparent p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <div className="flex flex-wrap gap-1.5">
              {movie.formats.slice(0, 3).map((f) => (
                <span key={f} className="chip border-white/20 bg-white/10 text-[10px]">
                  {f}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-2 p-4">
          <h3 className="truncate font-display text-base font-semibold text-white">{movie.title}</h3>
          <p className="truncate text-xs text-slate-400">
            {movie.genres.join(' · ')}
          </p>
          <div className="flex items-center gap-3 text-xs text-slate-400">
            <span className="inline-flex items-center gap-1">
              <Clock size={12} /> {formatRuntime(movie.duration)}
            </span>
            <span>{movie.language}</span>
          </div>
          <p className="text-[11px] text-slate-500">
            {movie.upcoming ? 'Releasing ' : 'In cinemas · '}
            {formatDate(movie.releaseDate)}
          </p>

          <Link
            to={`/movies/${movie.id}`}
            className={cx('btn w-full', movie.upcoming ? 'btn-outline' : 'btn-primary')}
          >
            {movie.upcoming ? 'View Details' : (<><Play size={15} /> Book Now</>)}
          </Link>
        </div>
      </div>
    </motion.div>
  )
}
