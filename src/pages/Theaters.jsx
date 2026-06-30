import { useState } from 'react'
import TheaterCard from '../components/TheaterCard'
import { theaters } from '../data/theaters'
import { CITIES } from '../data/movies'
import { cx } from '../lib/format'

export default function Theaters() {
  const [city, setCity] = useState('All')
  const filtered = city === 'All' ? theaters : theaters.filter((t) => t.city === city)

  return (
    <div className="section py-10">
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cinema-purple-glow">Find a screen near you</p>
        <h1 className="mt-1 text-3xl font-bold sm:text-4xl">Popular Theaters</h1>
      </div>

      <div className="mb-8 flex flex-wrap gap-2">
        {['All', ...CITIES].map((c) => (
          <button
            key={c}
            onClick={() => setCity(c)}
            className={cx(
              'rounded-full border px-4 py-2 text-sm font-medium transition',
              city === c ? 'border-transparent bg-purple-red text-white shadow-glow' : 'border-white/10 bg-white/5 text-slate-300 hover:border-white/30',
            )}
          >
            {c}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="glass-card p-16 text-center text-slate-400">No theaters in {city} yet.</div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((t, i) => <TheaterCard key={t.id} theater={t} index={i} />)}
        </div>
      )}
    </div>
  )
}
