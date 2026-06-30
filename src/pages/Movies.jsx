import { useMemo, useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { SlidersHorizontal, Search, X } from 'lucide-react'
import MovieCard from '../components/MovieCard'
import { MovieGridSkeleton } from '../components/ui/Skeleton'
import { movies, GENRES, LANGUAGES, CITIES, FORMATS } from '../data/movies'
import { useFakeLoading } from '../hooks/useFakeLoading'
import { cx } from '../lib/format'

const SORTS = [
  { id: 'popularity', label: 'Popularity' },
  { id: 'rating', label: 'Top rated' },
  { id: 'release', label: 'Release date' },
  { id: 'az', label: 'A → Z' },
]

function FilterGroup({ title, options, selected, onToggle }) {
  return (
    <div>
      <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">{title}</h4>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const active = selected.includes(opt)
          return (
            <button
              key={opt}
              onClick={() => onToggle(opt)}
              className={cx(
                'rounded-full border px-3 py-1.5 text-xs font-medium transition',
                active
                  ? 'border-transparent bg-purple-red text-white shadow-glow'
                  : 'border-white/10 bg-white/5 text-slate-300 hover:border-white/30',
              )}
            >
              {opt}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default function Movies() {
  const [searchParams, setSearchParams] = useSearchParams()
  const loading = useFakeLoading(700)
  const [query, setQuery] = useState(searchParams.get('q') || '')
  const [genres, setGenres] = useState([])
  const [languages, setLanguages] = useState([])
  const [cities, setCities] = useState([])
  const [formats, setFormats] = useState([])
  const [sort, setSort] = useState('popularity')
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    setQuery(searchParams.get('q') || '')
  }, [searchParams])

  const toggle = (setter) => (val) =>
    setter((prev) => (prev.includes(val) ? prev.filter((v) => v !== val) : [...prev, val]))

  const clearAll = () => {
    setGenres([]); setLanguages([]); setCities([]); setFormats([])
    setQuery(''); setSearchParams({})
  }

  const filtered = useMemo(() => {
    let list = movies.filter((m) => {
      const q = query.trim().toLowerCase()
      if (q && !(`${m.title} ${m.genres.join(' ')} ${m.language}`.toLowerCase().includes(q))) return false
      if (genres.length && !m.genres.some((g) => genres.includes(g))) return false
      if (languages.length && !languages.includes(m.language)) return false
      if (formats.length && !m.formats.some((f) => formats.includes(f))) return false
      return true
    })
    // city is a soft filter (all movies show everywhere in mock data); keep for UI completeness
    list = [...list].sort((a, b) => {
      if (sort === 'rating') return b.rating - a.rating
      if (sort === 'release') return new Date(b.releaseDate) - new Date(a.releaseDate)
      if (sort === 'az') return a.title.localeCompare(b.title)
      return b.votes - a.votes
    })
    return list
  }, [query, genres, languages, formats, cities, sort])

  const activeCount = genres.length + languages.length + cities.length + formats.length

  return (
    <div className="section py-10">
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cinema-purple-glow">Now showing & upcoming</p>
        <h1 className="mt-1 text-3xl font-bold sm:text-4xl">Explore Movies</h1>
      </div>

      {/* search + sort row */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search movies by title, genre, language..."
            className="input py-3 pl-12"
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowFilters((s) => !s)}
            className="btn-ghost px-4 py-3 lg:hidden"
          >
            <SlidersHorizontal size={16} /> Filters {activeCount > 0 && `(${activeCount})`}
          </button>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="input w-auto cursor-pointer py-3"
            aria-label="Sort movies"
          >
            {SORTS.map((s) => (
              <option key={s.id} value={s.id} className="bg-cinema-panel">
                Sort: {s.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
        {/* Filters sidebar */}
        <aside className={cx('lg:block', showFilters ? 'block' : 'hidden')}>
          <div className="glass-card sticky top-20 space-y-5 p-5">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-lg font-semibold">Filters</h3>
              {activeCount > 0 && (
                <button onClick={clearAll} className="flex items-center gap-1 text-xs text-cinema-red-glow hover:underline">
                  <X size={12} /> Clear
                </button>
              )}
            </div>
            <FilterGroup title="Genre" options={GENRES} selected={genres} onToggle={toggle(setGenres)} />
            <FilterGroup title="Language" options={LANGUAGES} selected={languages} onToggle={toggle(setLanguages)} />
            <FilterGroup title="City" options={CITIES} selected={cities} onToggle={toggle(setCities)} />
            <FilterGroup title="Format" options={FORMATS} selected={formats} onToggle={toggle(setFormats)} />
          </div>
        </aside>

        {/* Results */}
        <div>
          <p className="mb-4 text-sm text-slate-400">{filtered.length} movies found</p>
          {loading ? (
            <MovieGridSkeleton count={8} />
          ) : filtered.length === 0 ? (
            <div className="glass-card grid place-items-center p-16 text-center">
              <p className="text-lg font-semibold">No movies match your filters</p>
              <p className="mt-1 text-sm text-slate-400">Try adjusting or clearing the filters.</p>
              <button onClick={clearAll} className="btn-primary mt-5">Reset filters</button>
            </div>
          ) : (
            <motion.div layout className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
              {filtered.map((m, i) => (
                <MovieCard key={m.id} movie={m} index={i} />
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}
