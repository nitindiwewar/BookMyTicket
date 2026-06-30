import { useMemo, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ZoomIn, ZoomOut, ArrowRight, Info } from 'lucide-react'
import BookingSteps from '../components/BookingSteps'
import { useApp } from '../context/AppContext'
import { getMovieById } from '../data/movies'
import { getTheaterById } from '../data/theaters'
import { generateSeatMap, SEAT_PRICES } from '../data/seats'
import { formatMoney, cx } from '../lib/format'

const legend = [
  { key: 'available', label: 'Available', cls: 'bg-white/10 border-white/20' },
  { key: 'selected', label: 'Selected', cls: 'bg-purple-red border-transparent' },
  { key: 'booked', label: 'Booked', cls: 'bg-slate-700/60 border-slate-600' },
  { key: 'premium', label: `Premium · ${formatMoney(SEAT_PRICES.premium)}`, cls: 'bg-cinema-purple/30 border-cinema-purple-glow/50' },
  { key: 'vip', label: `VIP · ${formatMoney(SEAT_PRICES.vip)}`, cls: 'bg-cinema-gold/20 border-cinema-gold/60' },
]

const MAX_SEATS = 10

export default function SeatSelection() {
  const navigate = useNavigate()
  const { state, setSeats } = useApp()
  const { movieId, theaterId, show } = state.booking
  const movie = getMovieById(movieId)
  const theater = getTheaterById(theaterId)

  const [zoom, setZoom] = useState(1)
  const [selected, setSelected] = useState(state.booking.seats.map((s) => s.id))

  const seatMap = useMemo(
    () => generateSeatMap(show?.id || 'preview', show?.fillRate ?? 0.4),
    [show],
  )

  if (!movie || !show) {
    return (
      <div className="section grid min-h-[60vh] place-items-center text-center">
        <div>
          <h1 className="text-2xl font-bold">No show selected</h1>
          <p className="mt-2 text-slate-400">Pick a movie and showtime to choose your seats.</p>
          <Link to="/movies" className="btn-primary mt-5">Browse movies</Link>
        </div>
      </div>
    )
  }

  const flatSeats = seatMap.flatMap((r) => r.seats)
  const selectedSeats = flatSeats.filter((s) => selected.includes(s.id))
  const subtotal = selectedSeats.reduce((sum, s) => sum + s.price, 0)

  const toggleSeat = (seat) => {
    if (seat.status === 'booked') return
    setSelected((prev) => {
      if (prev.includes(seat.id)) return prev.filter((id) => id !== seat.id)
      if (prev.length >= MAX_SEATS) return prev
      return [...prev, seat.id]
    })
  }

  const proceed = () => {
    setSeats(selectedSeats.map((s) => ({ id: s.id, type: s.type, price: s.price })))
    navigate('/checkout')
  }

  const seatColor = (seat) => {
    if (seat.status === 'booked') return 'cursor-not-allowed bg-slate-700/60 border-slate-600 text-slate-500'
    if (selected.includes(seat.id)) return 'bg-purple-red border-transparent text-white shadow-glow scale-105'
    if (seat.type === 'vip') return 'bg-cinema-gold/20 border-cinema-gold/60 text-cinema-gold hover:bg-cinema-gold/30'
    if (seat.type === 'premium') return 'bg-cinema-purple/30 border-cinema-purple-glow/50 text-white hover:bg-cinema-purple/50'
    return 'bg-white/10 border-white/20 text-slate-300 hover:bg-white/20'
  }

  return (
    <div className="section py-10">
      <BookingSteps current={0} />

      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold sm:text-3xl">{movie.title}</h1>
        <p className="mt-1 text-sm text-slate-400">
          {theater?.name} · {show.time} · {show.format}
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        {/* Seat map */}
        <div className="glass-card overflow-hidden p-5">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex flex-wrap gap-x-4 gap-y-2">
              {legend.map((l) => (
                <span key={l.key} className="flex items-center gap-1.5 text-xs text-slate-300">
                  <span className={cx('inline-block h-4 w-4 rounded border', l.cls)} />
                  {l.label}
                </span>
              ))}
            </div>
            <div className="flex gap-1">
              <button onClick={() => setZoom((z) => Math.max(0.7, z - 0.15))} className="grid h-9 w-9 place-items-center rounded-lg glass hover:bg-white/10" aria-label="Zoom out">
                <ZoomOut size={16} />
              </button>
              <button onClick={() => setZoom((z) => Math.min(1.6, z + 0.15))} className="grid h-9 w-9 place-items-center rounded-lg glass hover:bg-white/10" aria-label="Zoom in">
                <ZoomIn size={16} />
              </button>
            </div>
          </div>

          {/* Screen */}
          <div className="mb-8 mt-2 overflow-x-auto">
            <div style={{ transform: `scale(${zoom})`, transformOrigin: 'top center' }} className="mx-auto w-max transition-transform">
              <div className="mx-auto mb-8 w-3/4">
                <div className="h-2 rounded-full bg-gradient-to-r from-transparent via-cinema-purple-glow to-transparent shadow-glow" />
                <p className="mt-2 text-center text-xs uppercase tracking-[0.3em] text-slate-500">Screen this way</p>
              </div>

              <div className="space-y-2">
                {seatMap.map((row) => (
                  <div key={row.row} className="flex items-center justify-center gap-2">
                    <span className="w-5 text-center text-xs font-semibold text-slate-500">{row.row}</span>
                    <div className="flex gap-1.5">
                      {row.seats.map((seat) => (
                        <button
                          key={seat.id}
                          onClick={() => toggleSeat(seat)}
                          disabled={seat.status === 'booked'}
                          aria-label={`Seat ${seat.id} ${seat.status}`}
                          className={cx(
                            'h-7 w-7 rounded-t-lg border text-[10px] font-medium transition-all',
                            seatColor(seat),
                            seat.aisleAfter && 'mr-4',
                          )}
                        >
                          {seat.number}
                        </button>
                      ))}
                    </div>
                    <span className="w-5 text-center text-xs font-semibold text-slate-500">{row.row}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Summary */}
        <aside className="lg:sticky lg:top-20 lg:h-max">
          <div className="glass-card space-y-4 p-5">
            <h2 className="text-lg font-bold">Booking Summary</h2>

            <div className="space-y-1 text-sm">
              <div className="flex justify-between"><span className="text-slate-400">Movie</span><span className="font-medium">{movie.title}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Theater</span><span className="font-medium text-right">{theater?.name}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Show</span><span className="font-medium">{show.time} · {show.format}</span></div>
            </div>

            <div className="border-t border-white/10 pt-4">
              <p className="mb-2 text-sm text-slate-400">Selected seats ({selectedSeats.length})</p>
              {selectedSeats.length === 0 ? (
                <p className="flex items-center gap-1.5 text-sm text-slate-500"><Info size={14} /> No seats selected yet</p>
              ) : (
                <div className="flex flex-wrap gap-1.5">
                  {selectedSeats.map((s) => (
                    <span key={s.id} className="chip border-cinema-purple-glow/40 text-cinema-purple-glow">{s.id}</span>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center justify-between border-t border-white/10 pt-4">
              <span className="text-slate-400">Subtotal</span>
              <span className="font-display text-xl font-bold">{formatMoney(subtotal)}</span>
            </div>

            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={proceed}
              disabled={selectedSeats.length === 0}
              className="btn-primary w-full py-3"
            >
              Continue <ArrowRight size={18} />
            </motion.button>
            <p className="text-center text-xs text-slate-500">You can select up to {MAX_SEATS} seats.</p>
          </div>
        </aside>
      </div>
    </div>
  )
}
