import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { User, Ticket, Heart, CreditCard, Bell, Award, Star, Calendar, Clock, MapPin, Plus, Trash2 } from 'lucide-react'
import MovieCard from '../components/MovieCard'
import Poster from '../components/ui/Poster'
import { useApp } from '../context/AppContext'
import { currentUser, bookingHistory } from '../data/user'
import { getMovieById } from '../data/movies'
import { getTheaterById } from '../data/theaters'
import { movies } from '../data/movies'
import { formatMoney, formatDate, cx } from '../lib/format'

const tabs = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'bookings', label: 'Bookings', icon: Ticket },
  { id: 'favorites', label: 'Favorites', icon: Heart },
  { id: 'payments', label: 'Payments', icon: CreditCard },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'rewards', label: 'Rewards', icon: Award },
]

export default function Dashboard() {
  const [tab, setTab] = useState('bookings')
  const { state } = useApp()
  const favoriteMovies = movies.filter((m) => state.favorites.includes(m.id))

  return (
    <div className="section py-10">
      {/* Header */}
      <div className="glass-card mb-8 flex flex-col items-start gap-5 p-6 sm:flex-row sm:items-center">
        <span
          className="grid h-20 w-20 shrink-0 place-items-center rounded-2xl font-display text-2xl font-bold text-white shadow-glow"
          style={{ background: `linear-gradient(135deg, ${currentUser.avatar.from}, ${currentUser.avatar.to})` }}
        >
          {currentUser.avatar.initials}
        </span>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold">{currentUser.name}</h1>
            <span className="chip border-cinema-gold/40 text-cinema-gold">{currentUser.tier} Member</span>
          </div>
          <p className="text-sm text-slate-400">{currentUser.email} · {currentUser.city}</p>
          <p className="text-xs text-slate-500">Member since {formatDate(currentUser.memberSince)}</p>
        </div>
        <div className="flex gap-6">
          <Stat value={bookingHistory.length} label="Bookings" />
          <Stat value={currentUser.rewardPoints} label="Points" />
          <Stat value={favoriteMovies.length} label="Favorites" />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[230px_1fr]">
        {/* Tabs */}
        <aside>
          <div className="glass-card flex gap-2 overflow-x-auto p-2 lg:flex-col">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={cx(
                  'flex shrink-0 items-center gap-2.5 rounded-xl px-4 py-3 text-sm font-medium transition',
                  tab === t.id ? 'bg-purple-red text-white shadow-glow' : 'text-slate-300 hover:bg-white/5',
                )}
              >
                <t.icon size={17} /> {t.label}
              </button>
            ))}
          </div>
        </aside>

        {/* Content */}
        <motion.div key={tab} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          {tab === 'profile' && <ProfileTab />}
          {tab === 'bookings' && <BookingsTab />}
          {tab === 'favorites' && <FavoritesTab movies={favoriteMovies} />}
          {tab === 'payments' && <PaymentsTab />}
          {tab === 'notifications' && <NotificationsTab />}
          {tab === 'rewards' && <RewardsTab />}
        </motion.div>
      </div>
    </div>
  )
}

function Stat({ value, label }) {
  return (
    <div className="text-center">
      <p className="font-display text-2xl font-bold">{value}</p>
      <p className="text-xs text-slate-400">{label}</p>
    </div>
  )
}

function Card({ title, children }) {
  return (
    <section className="glass-card p-6">
      {title && <h2 className="mb-4 text-lg font-bold">{title}</h2>}
      {children}
    </section>
  )
}

function ProfileTab() {
  const fields = [
    ['Full name', currentUser.name],
    ['Email', currentUser.email],
    ['Phone', currentUser.phone],
    ['City', currentUser.city],
  ]
  return (
    <Card title="Profile Information">
      <div className="grid gap-4 sm:grid-cols-2">
        {fields.map(([label, value]) => (
          <div key={label}>
            <label className="mb-1 block text-xs text-slate-400">{label}</label>
            <input className="input" defaultValue={value} />
          </div>
        ))}
      </div>
      <button className="btn-primary mt-5">Save changes</button>
    </Card>
  )
}

function BookingsTab() {
  return (
    <div className="space-y-4">
      {bookingHistory.map((b) => {
        const movie = getMovieById(b.movieId)
        const theater = getTheaterById(b.theaterId)
        return (
          <div key={b.id} className="glass-card flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
            <div className="h-24 w-16 shrink-0 overflow-hidden rounded-lg">
              {movie && <Poster movie={movie} showTitle={false} />}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold">{movie?.title}</h3>
                <span className={cx('chip text-[10px]', b.status === 'Upcoming' ? 'border-emerald-400/40 text-emerald-300' : 'text-slate-400')}>{b.status}</span>
              </div>
              <p className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-400">
                <span className="flex items-center gap-1"><MapPin size={12} /> {theater?.name}</span>
                <span className="flex items-center gap-1"><Calendar size={12} /> {formatDate(b.date)}</span>
                <span className="flex items-center gap-1"><Clock size={12} /> {b.time} · {b.format}</span>
              </p>
              <p className="mt-1 text-xs text-slate-500">Seats: {b.seats.join(', ')} · ID {b.id}</p>
            </div>
            <div className="text-right">
              <p className="font-display text-lg font-bold">{formatMoney(b.total)}</p>
              <button className="btn-outline mt-1 px-3 py-1.5 text-xs">View ticket</button>
            </div>
          </div>
        )
      })}
    </div>
  )
}

function FavoritesTab({ movies: favs }) {
  if (favs.length === 0) {
    return (
      <Card>
        <div className="py-12 text-center">
          <Heart className="mx-auto mb-3 text-slate-600" size={40} />
          <p className="font-semibold">No favorites yet</p>
          <p className="mt-1 text-sm text-slate-400">Tap the heart on any movie to save it here.</p>
          <Link to="/movies" className="btn-primary mt-5">Browse movies</Link>
        </div>
      </Card>
    )
  }
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
      {favs.map((m, i) => <MovieCard key={m.id} movie={m} index={i} />)}
    </div>
  )
}

function PaymentsTab() {
  return (
    <Card title="Saved Payment Methods">
      <div className="space-y-3">
        {currentUser.savedCards.map((c) => (
          <div key={c.id} className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-4">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-14 place-items-center rounded-lg bg-purple-red text-xs font-bold text-white">{c.brand}</span>
              <div>
                <p className="text-sm font-semibold">•••• •••• •••• {c.last4}</p>
                <p className="text-xs text-slate-400">Expires {c.expiry}</p>
              </div>
            </div>
            <button className="grid h-9 w-9 place-items-center rounded-lg glass text-slate-400 hover:text-cinema-red-glow" aria-label="Remove card"><Trash2 size={16} /></button>
          </div>
        ))}
      </div>
      <button className="btn-outline mt-4"><Plus size={16} /> Add new card</button>
    </Card>
  )
}

function NotificationsTab() {
  return (
    <Card title="Notifications">
      <div className="space-y-2">
        {currentUser.notifications.map((n) => (
          <div key={n.id} className={cx('flex items-start gap-3 rounded-xl border p-4', n.unread ? 'border-cinema-purple-glow/30 bg-cinema-purple/10' : 'border-white/10 bg-white/5')}>
            <span className={cx('mt-1 h-2 w-2 shrink-0 rounded-full', n.unread ? 'bg-cinema-purple-glow' : 'bg-slate-600')} />
            <div className="flex-1">
              <p className="text-sm">{n.text}</p>
              <p className="text-xs text-slate-500">{n.time}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}

function RewardsTab() {
  const nextTier = 3000
  const pct = Math.min(100, (currentUser.rewardPoints / nextTier) * 100)
  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-purple-red p-6 shadow-glow">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_-20%,rgba(255,255,255,0.3),transparent_50%)]" />
        <div className="relative">
          <p className="text-sm text-white/80">CineVerse Rewards</p>
          <p className="mt-1 font-display text-4xl font-extrabold text-white">{currentUser.rewardPoints} <span className="text-lg font-medium">pts</span></p>
          <div className="mt-4">
            <div className="mb-1 flex justify-between text-xs text-white/80">
              <span>{currentUser.tier}</span><span>Platinum at {nextTier}</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-black/30">
              <div className="h-full rounded-full bg-white" style={{ width: `${pct}%` }} />
            </div>
          </div>
        </div>
      </div>
      <Card title="Ways to earn">
        <ul className="space-y-3 text-sm">
          {[['Book any ticket', '+100 pts'], ['Refer a friend', '+250 pts'], ['Write a review', '+50 pts'], ['Weekend bookings', '2x pts']].map(([a, b]) => (
            <li key={a} className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3">
              <span className="flex items-center gap-2"><Star size={15} className="text-cinema-gold" /> {a}</span>
              <span className="font-semibold text-cinema-purple-glow">{b}</span>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  )
}
