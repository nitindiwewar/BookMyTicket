import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Menu, X, Film, User, Bell } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { currentUser } from '../data/user'
import { cx } from '../lib/format'

const links = [
  { to: '/', label: 'Home', end: true },
  { to: '/movies', label: 'Movies' },
  { to: '/theaters', label: 'Theaters' },
  { to: '/offers', label: 'Offers' },
  { to: '/dashboard', label: 'My Bookings' },
  { to: '/admin', label: 'Admin' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const navigate = useNavigate()
  const { state } = useApp()
  const unread = currentUser.notifications.filter((n) => n.unread).length

  const submitSearch = (e) => {
    e.preventDefault()
    navigate(`/movies?q=${encodeURIComponent(query)}`)
    setOpen(false)
  }

  return (
    <header className="sticky top-0 z-50">
      <div className="glass-strong border-b border-white/10">
        <nav className="section flex h-16 items-center gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-purple-red shadow-glow">
              <Film size={18} className="text-white" />
            </span>
            <span className="font-display text-xl font-extrabold tracking-tight">
              Cine<span className="gradient-text">Verse</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="ml-4 hidden items-center gap-6 lg:flex">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.end}
                className={({ isActive }) => cx('nav-link', isActive && 'active')}
              >
                {l.label}
              </NavLink>
            ))}
          </div>

          <div className="ml-auto flex items-center gap-2">
            {/* Search (desktop) */}
            <form onSubmit={submitSearch} className="relative hidden md:block">
              <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search movies..."
                className="input w-44 pl-9 lg:w-56"
                aria-label="Search movies"
              />
            </form>

            <Link to="/dashboard" className="relative grid h-10 w-10 place-items-center rounded-full glass hover:bg-white/10" aria-label="Notifications">
              <Bell size={18} />
              {unread > 0 && (
                <span className="absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-cinema-red px-1 text-[10px] font-bold text-white">
                  {unread}
                </span>
              )}
            </Link>

            {state.loggedIn ? (
              <Link to="/dashboard" aria-label="Profile" className="hidden sm:block">
                <span
                  className="grid h-10 w-10 place-items-center rounded-full text-sm font-bold text-white shadow-glow"
                  style={{ background: `linear-gradient(135deg, ${currentUser.avatar.from}, ${currentUser.avatar.to})` }}
                >
                  {currentUser.avatar.initials}
                </span>
              </Link>
            ) : (
              <Link to="/login" className="btn-primary hidden sm:inline-flex">
                <User size={15} /> Login
              </Link>
            )}

            <button
              className="grid h-10 w-10 place-items-center rounded-full glass lg:hidden"
              onClick={() => setOpen((o) => !o)}
              aria-label="Toggle menu"
            >
              {open ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden glass-strong border-b border-white/10 lg:hidden"
          >
            <div className="section space-y-1 py-4">
              <form onSubmit={submitSearch} className="relative mb-3">
                <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search movies..."
                  className="input pl-9"
                />
              </form>
              {links.map((l) => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  end={l.end}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    cx(
                      'block rounded-xl px-4 py-3 text-sm font-medium transition',
                      isActive ? 'bg-white/10 text-white' : 'text-slate-300 hover:bg-white/5',
                    )
                  }
                >
                  {l.label}
                </NavLink>
              ))}
              <Link to="/login" onClick={() => setOpen(false)} className="btn-primary mt-2 w-full">
                <User size={15} /> Login
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
