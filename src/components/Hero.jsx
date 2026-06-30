import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Info, Star, Clock, Calendar } from 'lucide-react'
import { trendingMovies } from '../data/movies'
import { formatRuntime, formatDate } from '../lib/format'

const featured = trendingMovies.slice(0, 4)

export default function Hero() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setIndex((i) => (i + 1) % featured.length), 6000)
    return () => clearInterval(t)
  }, [])

  const movie = featured[index]
  const { from, via, to } = movie.banner

  return (
    <section className="relative overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={movie.id}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0"
          style={{ background: `linear-gradient(120deg, ${from} 0%, ${via} 45%, ${to} 100%)` }}
        />
      </AnimatePresence>

      <div className="absolute inset-0 bg-gradient-to-t from-cinema-black via-cinema-black/70 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-cinema-black/90 via-cinema-black/40 to-transparent" />

      <div className="section relative flex min-h-[78vh] items-center py-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={movie.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl"
          >
            <span className="chip mb-4 border-cinema-purple-glow/40 bg-cinema-purple/20 text-cinema-purple-glow">
              ★ Featured · Trending Now
            </span>
            <h1 className="text-balance text-4xl font-extrabold leading-tight sm:text-6xl">
              {movie.title}
            </h1>
            <p className="mt-3 text-lg italic text-white/80">{movie.tagline}</p>

            <div className="mt-5 flex flex-wrap items-center gap-3 text-sm text-white/80">
              <span className="inline-flex items-center gap-1 text-cinema-gold">
                <Star size={15} className="fill-cinema-gold" /> {movie.rating}
              </span>
              <span className="inline-flex items-center gap-1"><Clock size={15} /> {formatRuntime(movie.duration)}</span>
              <span className="inline-flex items-center gap-1"><Calendar size={15} /> {formatDate(movie.releaseDate)}</span>
              <span className="chip">{movie.certificate}</span>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              {movie.genres.map((g) => (
                <span key={g} className="chip">{g}</span>
              ))}
            </div>

            <p className="mt-5 max-w-xl text-sm leading-relaxed text-slate-300 line-clamp-3">
              {movie.description}
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link to={`/movies/${movie.id}`} className="btn-primary px-7 py-3">
                <Play size={18} /> Book Tickets
              </Link>
              <Link to={`/movies/${movie.id}`} className="btn-ghost px-6 py-3">
                <Info size={18} /> More Info
              </Link>
            </div>

            <div className="mt-8 flex gap-2">
              {featured.map((f, i) => (
                <button
                  key={f.id}
                  onClick={() => setIndex(i)}
                  aria-label={`Show ${f.title}`}
                  className={`h-1.5 rounded-full transition-all ${i === index ? 'w-8 bg-purple-red' : 'w-3 bg-white/30 hover:bg-white/50'}`}
                />
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  )
}
