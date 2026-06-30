import { useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CheckCircle2, Download, Share2, Calendar, Clock, MapPin, Armchair, Ticket, PartyPopper } from 'lucide-react'
import QRCode from '../components/ui/QRCode'
import { useApp } from '../context/AppContext'
import { getMovieById } from '../data/movies'
import { getTheaterById } from '../data/theaters'
import { formatMoney, formatDate } from '../lib/format'

export default function Confirmation() {
  const navigate = useNavigate()
  const { state, resetBooking } = useApp()
  const { movieId, theaterId, show, seats, bookingId } = state.booking
  const movie = getMovieById(movieId)
  const theater = getTheaterById(theaterId)

  useEffect(() => {
    if (!bookingId) navigate('/movies', { replace: true })
  }, [bookingId, navigate])

  if (!bookingId || !movie) return null

  const seatTotal = seats.reduce((s, x) => s + x.price, 0)

  const handleShare = async () => {
    const shareData = {
      title: 'CineVerse Ticket',
      text: `I'm watching ${movie.title} at ${theater?.name}! Booking ${bookingId}`,
      url: window.location.href,
    }
    if (navigator.share) {
      try { await navigator.share(shareData) } catch { /* cancelled */ }
    } else {
      await navigator.clipboard?.writeText(`${shareData.text} — ${shareData.url}`)
      alert('Ticket details copied to clipboard!')
    }
  }

  return (
    <div className="section py-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="mx-auto mb-8 max-w-xl text-center"
      >
        <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-full bg-emerald-500/15 text-emerald-400">
          <CheckCircle2 size={36} />
        </div>
        <h1 className="flex items-center justify-center gap-2 text-3xl font-extrabold">
          Booking Confirmed <PartyPopper className="text-cinema-gold" />
        </h1>
        <p className="mt-2 text-slate-400">Your tickets are ready. Enjoy the show!</p>
      </motion.div>

      {/* Ticket */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        id="ticket"
        className="mx-auto max-w-2xl"
      >
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-cinema-panel shadow-card">
          <div className="h-2 bg-purple-red" />
          <div className="grid gap-6 p-6 sm:grid-cols-[1fr_auto] sm:p-8">
            <div>
              <span className="chip border-cinema-purple-glow/40 text-cinema-purple-glow">
                <Ticket size={13} /> E-Ticket
              </span>
              <h2 className="mt-3 font-display text-2xl font-bold">{movie.title}</h2>
              <p className="text-sm text-slate-400">{movie.certificate} · {movie.language} · {show.format}</p>

              <div className="mt-5 grid grid-cols-2 gap-4 text-sm">
                <Detail icon={MapPin} label="Theater" value={theater?.name} sub={`${theater?.area}, ${theater?.city}`} />
                <Detail icon={Calendar} label="Date" value={formatDate(new Date().toISOString())} />
                <Detail icon={Clock} label="Time" value={show.time} />
                <Detail icon={Armchair} label="Seats" value={seats.map((s) => s.id).join(', ')} />
              </div>
            </div>

            <div className="flex flex-col items-center justify-center gap-3 border-t border-dashed border-white/15 pt-6 sm:border-l sm:border-t-0 sm:pl-6 sm:pt-0">
              <QRCode value={bookingId} size={132} />
              <div className="text-center">
                <p className="text-xs text-slate-500">Booking ID</p>
                <p className="font-mono text-sm font-bold tracking-wider">{bookingId}</p>
              </div>
            </div>
          </div>

          {/* perforated edge */}
          <div className="relative border-t border-dashed border-white/15">
            <span className="absolute -left-3 -top-3 h-6 w-6 rounded-full bg-cinema-black" />
            <span className="absolute -right-3 -top-3 h-6 w-6 rounded-full bg-cinema-black" />
            <div className="flex items-center justify-between p-6 text-sm">
              <span className="text-slate-400">Total Paid</span>
              <span className="font-display text-xl font-bold gradient-text">{formatMoney(seatTotal)}+</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button onClick={() => window.print()} className="btn-primary px-6 py-3">
            <Download size={18} /> Download PDF
          </button>
          <button onClick={handleShare} className="btn-ghost px-6 py-3">
            <Share2 size={18} /> Share Ticket
          </button>
          <Link to="/dashboard" className="btn-outline px-6 py-3">View in My Bookings</Link>
          <Link to="/movies" onClick={resetBooking} className="btn-outline px-6 py-3">Book Another</Link>
        </div>
      </motion.div>
    </div>
  )
}

function Detail({ icon: Icon, label, value, sub }) {
  return (
    <div>
      <p className="flex items-center gap-1.5 text-xs text-slate-500"><Icon size={13} /> {label}</p>
      <p className="mt-0.5 font-semibold">{value}</p>
      {sub && <p className="text-xs text-slate-500">{sub}</p>}
    </div>
  )
}
