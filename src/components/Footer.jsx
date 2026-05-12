import { Link } from "react-router-dom";

const links = [
  { to: "/", label: "Home" },
  { to: "/movies", label: "Movies" },
  { to: "/support", label: "Support" },
  { to: "/profile", label: "Profile" },
];

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-white/10 bg-black">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-3">
        <div>
          <div className="text-sm font-semibold text-white">BookMySeat</div>
          <p className="mt-2 text-sm text-white/60">
            A premium movie booking UI inspired by BookMyShow.
          </p>
        </div>

        <div>
          <div className="text-sm font-semibold text-white">Quick links</div>
          <div className="mt-3 grid gap-2">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="text-sm text-white/60 hover:text-white"
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <div className="text-sm font-semibold text-white">Social</div>
          <div className="mt-3 flex flex-wrap gap-2">
            {[
              { label: "X", href: "https://x.com" },
              { label: "Instagram", href: "https://instagram.com" },
              { label: "YouTube", href: "https://youtube.com" },
            ].map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/80 transition hover:bg-white/10 hover:text-white"
              >
                {s.label}
              </a>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 text-xs text-white/50 sm:px-6">
          <span>© {new Date().getFullYear()} MovieTicket</span>
          <span className="hidden sm:inline">Built with React + Tailwind</span>
        </div>
      </div>
    </footer>
  );
}
