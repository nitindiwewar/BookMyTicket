import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Search, TrendingUp, Ticket, Star, Clapperboard, Sparkles } from 'lucide-react'
import Hero from '../components/Hero'
import Carousel from '../components/Carousel'
import MovieCard from '../components/MovieCard'
import TheaterCard from '../components/TheaterCard'
import SectionHeader from '../components/ui/SectionHeader'
import { MovieGridSkeleton } from '../components/ui/Skeleton'
import { trendingMovies, upcomingMovies } from '../data/movies'
import { theaters } from '../data/theaters'
import { useFakeLoading } from '../hooks/useFakeLoading'

const stats = [
  { icon: Ticket, label: 'Tickets booked', value: '2.4M+' },
  { icon: Clapperboard, label: 'Screens', value: '180+' },
  { icon: Star, label: 'Avg. rating', value: '4.8' },
  { icon: TrendingUp, label: 'Cities', value: '40+' },
]

export default function Landing() {
  const [query, setQuery] = useState('')
  const navigate = useNavigate()
  const loading = useFakeLoading(800)

  const submitSearch = (e) => {
    e.preventDefault()
    navigate(`/movies?q=${encodeURIComponent(query)}`)
  }

  return (
    <div>
      <Hero />

      {/* Search bar */}
      <div className="section -mt-8 relative z-10">
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={submitSearch}
          className="glass-strong flex flex-col gap-3 rounded-2xl p-4 shadow-card sm:flex-row sm:items-center"
        >
          <div className="relative flex-1">
            <Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for movies, theaters, genres..."
              className="input border-transparent bg-white/5 py-3 pl-12 text-base"
            />
          </div>
          <button type="submit" className="btn-primary px-8 py-3">
            <Search size={18} /> Search
          </button>
        </motion.form>
      </div>

      {/* Stats */}
      <div className="section mt-10">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="glass-card flex items-center gap-3 p-4"
            >
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-purple-red/20 text-cinema-purple-glow">
                <s.icon size={20} />
              </span>
              <div>
                <p className="font-display text-xl font-bold">{s.value}</p>
                <p className="text-xs text-slate-400">{s.label}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Trending */}
      <section className="section mt-16">
        <SectionHeader eyebrow="Hot right now" title="Trending Movies" action="View all" to="/movies" />
        {loading ? (
          <MovieGridSkeleton count={5} />
        ) : (
          <Carousel itemClassName="w-[200px] sm:w-[230px]">
            {trendingMovies.map((m, i) => (
              <MovieCard key={m.id} movie={m} index={i} />
            ))}
          </Carousel>
        )}
      </section>

      {/* Upcoming */}
      <section className="section mt-16">
        <SectionHeader eyebrow="Coming soon" title="Upcoming Movies" action="Browse" to="/movies" />
        {loading ? (
          <MovieGridSkeleton count={4} />
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {upcomingMovies.slice(0, 4).map((m, i) => (
              <MovieCard key={m.id} movie={m} index={i} />
            ))}
          </div>
        )}
      </section>

      {/* Popular theaters */}
      <section className="section mt-16">
        <SectionHeader eyebrow="Near you" title="Popular Theaters" action="All theaters" to="/theaters" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {theaters.slice(0, 6).map((t, i) => (
            <TheaterCard key={t.id} theater={t} index={i} />
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="section mt-20">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-3xl border border-white/10 bg-purple-red p-10 text-center shadow-glow sm:p-16"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.25),transparent_50%)]" />
          <div className="relative">
            <Sparkles className="mx-auto mb-4 text-white" size={32} />
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">Your next movie night starts here</h2>
            <p className="mx-auto mt-3 max-w-xl text-white/85">
              Join CineVerse to unlock member pricing, reward points, and the best seats in the house.
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <Link to="/movies" className="btn bg-white px-7 py-3 text-cinema-black hover:-translate-y-0.5">
                <Ticket size={18} /> Book a movie
              </Link>
              <Link to="/offers" className="btn border border-white/40 px-7 py-3 text-white hover:bg-white/10">
                View offers
              </Link>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  )
}
