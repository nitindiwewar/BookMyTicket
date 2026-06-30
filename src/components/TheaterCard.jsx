import { motion } from 'framer-motion'
import { MapPin, Star, Clapperboard } from 'lucide-react'

export default function TheaterCard({ theater, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.06, 0.4) }}
      className="glass-card group relative overflow-hidden p-5 transition hover:border-cinema-purple-glow/50 hover:shadow-glow"
    >
      <div
        className="absolute -right-10 -top-10 h-28 w-28 rounded-full opacity-20 blur-2xl transition group-hover:opacity-40"
        style={{ background: theater.accent }}
      />
      <div className="flex items-start justify-between">
        <div
          className="grid h-12 w-12 place-items-center rounded-xl text-white"
          style={{ background: `linear-gradient(135deg, ${theater.accent}, #0e0c16)` }}
        >
          <Clapperboard size={22} />
        </div>
        <span className="chip text-cinema-gold">
          <Star size={12} className="fill-cinema-gold" /> {theater.rating}
        </span>
      </div>
      <h3 className="mt-4 font-display text-lg font-semibold">{theater.name}</h3>
      <p className="mt-1 flex items-center gap-1 text-sm text-slate-400">
        <MapPin size={14} /> {theater.area}, {theater.city}
      </p>
      <p className="mt-1 text-xs text-slate-500">{theater.screens} screens</p>
      <div className="mt-4 flex flex-wrap gap-1.5">
        {theater.amenities.slice(0, 3).map((a) => (
          <span key={a} className="chip text-[10px]">{a}</span>
        ))}
      </div>
    </motion.div>
  )
}
