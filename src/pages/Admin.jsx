import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts'
import {
  LayoutDashboard, Film, Building2, CalendarClock, Armchair, Users, DollarSign,
  TrendingUp, Ticket, Star, Plus, Pencil, Trash2, Search,
} from 'lucide-react'
import { revenueData, genreSplit, adminUsers, adminShows } from '../data/admin'
import { movies } from '../data/movies'
import { theaters } from '../data/theaters'
import { formatMoney, formatRuntime, cx } from '../lib/format'

const tabs = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'movies', label: 'Movies', icon: Film },
  { id: 'theaters', label: 'Theaters', icon: Building2 },
  { id: 'shows', label: 'Shows', icon: CalendarClock },
  { id: 'seats', label: 'Seats', icon: Armchair },
  { id: 'users', label: 'Users', icon: Users },
  { id: 'reports', label: 'Reports', icon: TrendingUp },
]

export default function Admin() {
  const [tab, setTab] = useState('overview')

  return (
    <div className="section py-10">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cinema-purple-glow">Control center</p>
          <h1 className="mt-1 text-3xl font-bold sm:text-4xl">Admin Dashboard</h1>
        </div>
        <button className="btn-primary"><Plus size={16} /> Add Movie</button>
      </div>

      {/* Tab bar */}
      <div className="no-scrollbar mb-8 flex gap-2 overflow-x-auto">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={cx(
              'flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition',
              tab === t.id ? 'bg-purple-red text-white shadow-glow' : 'glass text-slate-300 hover:bg-white/10',
            )}
          >
            <t.icon size={16} /> {t.label}
          </button>
        ))}
      </div>

      <motion.div key={tab} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        {tab === 'overview' && <Overview />}
        {tab === 'movies' && <MoviesAdmin />}
        {tab === 'theaters' && <TheatersAdmin />}
        {tab === 'shows' && <ShowsAdmin />}
        {tab === 'seats' && <SeatsAdmin />}
        {tab === 'users' && <UsersAdmin />}
        {tab === 'reports' && <Reports />}
      </motion.div>
    </div>
  )
}

const kpis = [
  { label: 'Total Revenue', value: '$478.5k', delta: '+12.4%', icon: DollarSign, accent: 'text-emerald-400' },
  { label: 'Tickets Sold', value: '35.8k', delta: '+8.1%', icon: Ticket, accent: 'text-cinema-purple-glow' },
  { label: 'Active Users', value: '12.3k', delta: '+5.6%', icon: Users, accent: 'text-cinema-gold' },
  { label: 'Avg. Rating', value: '4.8', delta: '+0.2', icon: Star, accent: 'text-cinema-red-glow' },
]

function Overview() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((k) => (
          <div key={k.label} className="glass-card p-5">
            <div className="flex items-center justify-between">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-white/5"><k.icon size={20} className={k.accent} /></span>
              <span className="text-xs font-semibold text-emerald-400">{k.delta}</span>
            </div>
            <p className="mt-4 font-display text-2xl font-bold">{k.value}</p>
            <p className="text-xs text-slate-400">{k.label}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <Panel title="Revenue Trend">
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={revenueData} margin={{ left: -10, right: 10, top: 10 }}>
              <defs>
                <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#7c3aed" stopOpacity={0.6} />
                  <stop offset="100%" stopColor="#7c3aed" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis dataKey="month" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v / 1000}k`} />
              <Tooltip contentStyle={tooltipStyle} formatter={(v) => formatMoney(v)} />
              <Area type="monotone" dataKey="revenue" stroke="#a855f7" strokeWidth={2} fill="url(#rev)" />
            </AreaChart>
          </ResponsiveContainer>
        </Panel>

        <Panel title="Bookings by Genre">
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={genreSplit} dataKey="value" nameKey="name" innerRadius={60} outerRadius={95} paddingAngle={3}>
                {genreSplit.map((g) => <Cell key={g.name} fill={g.color} stroke="none" />)}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} formatter={(v) => `${v}%`} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-2 flex flex-wrap justify-center gap-3">
            {genreSplit.map((g) => (
              <span key={g.name} className="flex items-center gap-1.5 text-xs text-slate-300">
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: g.color }} /> {g.name}
              </span>
            ))}
          </div>
        </Panel>
      </div>

      <Panel title="Tickets Sold per Month">
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={revenueData} margin={{ left: -10, right: 10, top: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
            <XAxis dataKey="month" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
            <Bar dataKey="tickets" radius={[6, 6, 0, 0]} fill="#e11d48" />
          </BarChart>
        </ResponsiveContainer>
      </Panel>
    </div>
  )
}

function MoviesAdmin() {
  return (
    <Panel title="Movie Management" action="Add Movie">
      <Table head={['Title', 'Genre', 'Language', 'Duration', 'Rating', '']}>
        {movies.map((m) => (
          <tr key={m.id} className="border-t border-white/5 hover:bg-white/[0.03]">
            <Td className="font-medium">{m.title}</Td>
            <Td className="text-slate-400">{m.genres.join(', ')}</Td>
            <Td className="text-slate-400">{m.language}</Td>
            <Td className="text-slate-400">{formatRuntime(m.duration)}</Td>
            <Td><span className="chip text-cinema-gold"><Star size={11} className="fill-cinema-gold" />{m.rating}</span></Td>
            <Td><RowActions /></Td>
          </tr>
        ))}
      </Table>
    </Panel>
  )
}

function TheatersAdmin() {
  return (
    <Panel title="Theater Management" action="Add Theater">
      <Table head={['Name', 'City', 'Screens', 'Rating', 'Amenities', '']}>
        {theaters.map((t) => (
          <tr key={t.id} className="border-t border-white/5 hover:bg-white/[0.03]">
            <Td className="font-medium">{t.name}</Td>
            <Td className="text-slate-400">{t.city}</Td>
            <Td className="text-slate-400">{t.screens}</Td>
            <Td><span className="chip text-cinema-gold"><Star size={11} className="fill-cinema-gold" />{t.rating}</span></Td>
            <Td className="text-slate-400">{t.amenities.slice(0, 2).join(', ')}</Td>
            <Td><RowActions /></Td>
          </tr>
        ))}
      </Table>
    </Panel>
  )
}

function ShowsAdmin() {
  return (
    <Panel title="Show Scheduling" action="Schedule Show">
      <Table head={['Movie', 'Theater', 'Screen', 'Time', 'Format', 'Occupancy', '']}>
        {adminShows.map((s) => {
          const pct = Math.round((s.sold / s.capacity) * 100)
          return (
            <tr key={s.id} className="border-t border-white/5 hover:bg-white/[0.03]">
              <Td className="font-medium">{s.movie}</Td>
              <Td className="text-slate-400">{s.theater}</Td>
              <Td className="text-slate-400">{s.screen}</Td>
              <Td className="text-slate-400">{s.time}</Td>
              <Td><span className="chip">{s.format}</span></Td>
              <Td>
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-20 overflow-hidden rounded-full bg-white/10">
                    <div className={cx('h-full rounded-full', pct > 85 ? 'bg-cinema-red' : 'bg-cinema-purple-glow')} style={{ width: `${pct}%` }} />
                  </div>
                  <span className="text-xs text-slate-400">{pct}%</span>
                </div>
              </Td>
              <Td><RowActions /></Td>
            </tr>
          )
        })}
      </Table>
    </Panel>
  )
}

function SeatsAdmin() {
  const types = [
    { label: 'Regular', price: 12, count: 96, color: 'bg-white/10 border-white/20' },
    { label: 'Premium', price: 18, count: 48, color: 'bg-cinema-purple/30 border-cinema-purple-glow/50' },
    { label: 'VIP', price: 28, count: 16, color: 'bg-cinema-gold/20 border-cinema-gold/60' },
  ]
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {types.map((t) => (
        <Panel key={t.label} title={`${t.label} Seats`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-display text-3xl font-bold">{t.count}</p>
              <p className="text-xs text-slate-400">seats configured</p>
            </div>
            <span className={cx('h-12 w-12 rounded-lg border', t.color)} />
          </div>
          <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-4 text-sm">
            <span className="text-slate-400">Base price</span>
            <input className="input w-24 py-1.5 text-right" defaultValue={t.price} />
          </div>
        </Panel>
      ))}
    </div>
  )
}

function UsersAdmin() {
  return (
    <Panel title="User Management">
      <div className="mb-4 relative max-w-xs">
        <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
        <input className="input pl-9" placeholder="Search users..." />
      </div>
      <Table head={['Name', 'Email', 'Bookings', 'Tier', 'Status', '']}>
        {adminUsers.map((u) => (
          <tr key={u.id} className="border-t border-white/5 hover:bg-white/[0.03]">
            <Td className="font-medium">{u.name}</Td>
            <Td className="text-slate-400">{u.email}</Td>
            <Td className="text-slate-400">{u.bookings}</Td>
            <Td><span className="chip">{u.tier}</span></Td>
            <Td>
              <span className={cx('chip', u.status === 'Active' ? 'border-emerald-400/40 text-emerald-300' : 'border-cinema-red/40 text-cinema-red-glow')}>{u.status}</span>
            </Td>
            <Td><RowActions /></Td>
          </tr>
        ))}
      </Table>
    </Panel>
  )
}

function Reports() {
  const reports = [
    ['Monthly Revenue Report', 'PDF · Aug 2026'],
    ['Occupancy Analytics', 'XLSX · Q3 2026'],
    ['Top Performing Movies', 'PDF · Aug 2026'],
    ['Concession Sales', 'CSV · Aug 2026'],
  ]
  return (
    <div className="space-y-6">
      <Panel title="Revenue vs Tickets">
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={revenueData} margin={{ left: -10, right: 10, top: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
            <XAxis dataKey="month" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip contentStyle={tooltipStyle} />
            <Area type="monotone" dataKey="revenue" stroke="#a855f7" fill="rgba(124,58,237,0.2)" strokeWidth={2} />
            <Area type="monotone" dataKey="tickets" stroke="#fb7185" fill="rgba(225,29,72,0.15)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </Panel>
      <Panel title="Downloadable Reports">
        <div className="grid gap-3 sm:grid-cols-2">
          {reports.map(([name, meta]) => (
            <div key={name} className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-4">
              <div>
                <p className="text-sm font-semibold">{name}</p>
                <p className="text-xs text-slate-400">{meta}</p>
              </div>
              <button className="btn-outline px-3 py-1.5 text-xs">Download</button>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  )
}

/* ---- shared admin primitives ---- */
const tooltipStyle = {
  background: '#0e0c16',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: 12,
  color: '#fff',
  fontSize: 12,
}

function Panel({ title, action, children }) {
  return (
    <section className="glass-card p-5">
      {title && (
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold">{title}</h2>
          {action && <button className="btn-outline px-3 py-1.5 text-xs"><Plus size={14} /> {action}</button>}
        </div>
      )}
      {children}
    </section>
  )
}

function Table({ head, children }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead>
          <tr className="text-xs uppercase tracking-wider text-slate-500">
            {head.map((h, i) => <th key={i} className="pb-3 pr-4 font-medium">{h}</th>)}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  )
}

function Td({ children, className }) {
  return <td className={cx('py-3 pr-4', className)}>{children}</td>
}

function RowActions() {
  return (
    <div className="flex gap-1.5">
      <button className="grid h-8 w-8 place-items-center rounded-lg glass text-slate-400 hover:text-white" aria-label="Edit"><Pencil size={14} /></button>
      <button className="grid h-8 w-8 place-items-center rounded-lg glass text-slate-400 hover:text-cinema-red-glow" aria-label="Delete"><Trash2 size={14} /></button>
    </div>
  )
}
