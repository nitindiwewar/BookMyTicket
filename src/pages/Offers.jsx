import { useState } from 'react'
import { motion } from 'framer-motion'
import { Copy, Check, Tag, Sparkles } from 'lucide-react'
import { offers } from '../data/foodAndOffers'

export default function Offers() {
  const [copied, setCopied] = useState(null)

  const copy = (code) => {
    navigator.clipboard?.writeText(code)
    setCopied(code)
    setTimeout(() => setCopied(null), 1800)
  }

  return (
    <div className="section py-10">
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cinema-purple-glow">Save more, watch more</p>
        <h1 className="mt-1 text-3xl font-bold sm:text-4xl">Offers & Promotions</h1>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {offers.map((o, i) => (
          <motion.div
            key={o.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className="glass-card group relative overflow-hidden p-6"
          >
            <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full opacity-25 blur-2xl transition group-hover:opacity-40" style={{ background: o.accent }} />
            <div className="relative">
              <div className="flex items-center justify-between">
                <span className="grid h-11 w-11 place-items-center rounded-xl text-white" style={{ background: `linear-gradient(135deg, ${o.accent}, #0e0c16)` }}>
                  <Sparkles size={20} />
                </span>
                <span className="chip">{o.tag}</span>
              </div>
              <h3 className="mt-4 font-display text-xl font-bold">{o.title}</h3>
              <p className="mt-2 text-sm text-slate-400">{o.desc}</p>

              <div className="mt-5 flex items-center justify-between rounded-xl border border-dashed border-white/20 bg-white/5 px-4 py-3">
                <span className="flex items-center gap-2 font-mono text-sm font-bold tracking-wider">
                  <Tag size={15} className="text-cinema-purple-glow" /> {o.code}
                </span>
                <button onClick={() => copy(o.code)} className="flex items-center gap-1 text-xs font-semibold text-cinema-purple-glow hover:underline">
                  {copied === o.code ? (<><Check size={14} /> Copied</>) : (<><Copy size={14} /> Copy</>)}
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
