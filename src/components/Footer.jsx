import { Link } from 'react-router-dom'
import { Film, Twitter, Instagram, Facebook, Youtube, Mail, Phone, MapPin } from 'lucide-react'

const socials = [
  { icon: Twitter, label: 'Twitter' },
  { icon: Instagram, label: 'Instagram' },
  { icon: Facebook, label: 'Facebook' },
  { icon: Youtube, label: 'YouTube' },
]

const columns = [
  { title: 'Explore', links: [['Movies', '/movies'], ['Theaters', '/theaters'], ['Offers', '/offers'], ['My Bookings', '/dashboard']] },
  { title: 'Company', links: [['About Us', '/'], ['Careers', '/'], ['Press', '/'], ['Blog', '/']] },
  { title: 'Support', links: [['Help Center', '/'], ['Terms', '/'], ['Privacy', '/'], ['Refunds', '/']] },
]

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-white/10 bg-cinema-panel/60 backdrop-blur-xl">
      <div className="section py-14">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-purple-red shadow-glow">
                <Film size={18} className="text-white" />
              </span>
              <span className="font-display text-xl font-extrabold">
                Cine<span className="gradient-text">Verse</span>
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm text-slate-400">
              The premium way to discover movies and book the perfect seat. Cinematic experiences, beautifully simple.
            </p>
            <div className="mt-5 space-y-2 text-sm text-slate-400">
              <p className="flex items-center gap-2"><Mail size={15} /> hello@cineverse.app</p>
              <p className="flex items-center gap-2"><Phone size={15} /> +1 (800) 246-3837</p>
              <p className="flex items-center gap-2"><MapPin size={15} /> 100 Marquee Ave, New York</p>
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-300">{col.title}</h4>
              <ul className="space-y-2.5">
                {col.links.map(([label, to]) => (
                  <li key={label}>
                    <Link to={to} className="text-sm text-slate-400 transition hover:text-white">{label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-5 border-t border-white/10 pt-8 sm:flex-row">
          <p className="text-xs text-slate-500">© {new Date().getFullYear()} CineVerse. All rights reserved.</p>
          <div className="flex items-center gap-3">
            {socials.map((s) => (
              <a
                key={s.label}
                href="#"
                aria-label={s.label}
                className="grid h-10 w-10 place-items-center rounded-full glass text-slate-300 transition hover:-translate-y-0.5 hover:text-white hover:shadow-glow"
              >
                <s.icon size={17} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
