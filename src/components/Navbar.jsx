import { useContext, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Search, Sun, Moon, Menu, X, User } from "lucide-react";
import LocationPicker from "./LocationPicker.jsx";
import { ThemeContext } from "../state/themeContext.jsx";
import { useAuth } from "../state/authContext.jsx";

const navItems = [
  { label: "Home", to: "/" },
  { label: "Movies", to: "/movies" },
  { label: "Support", to: "/support" },
  { label: "Contact", to: "/contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const { theme, toggleTheme } = useContext(ThemeContext);

  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800/60 bg-slate-950/95 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <div className="flex items-center gap-4">
          <NavLink
            to="/"
            className="group inline-flex items-center gap-2 rounded-md focus:outline-none focus:ring-2 focus:ring-white/30 focus:ring-offset-2 focus:ring-offset-black"
          >
            <span className="grid h-9 w-9 place-items-center rounded-lg border border-white/15 bg-white/5 text-sm font-bold text-white shadow-sm shadow-black/30">
              BMS
            </span>
            <div className="leading-tight hidden sm:block">
              <div className="text-sm font-semibold text-white">BookMySeat</div>
              <div className="text-xs text-white/50 group-hover:text-white/70">
                Premium booking
              </div>
            </div>
          </NavLink>

          <div className="hidden md:flex items-center gap-2">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `rounded-full px-3 py-2 text-sm font-medium transition ${
                    isActive
                      ? "bg-white/10 text-white"
                      : "text-white/70 hover:bg-white/5 hover:text-white"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </div>
        </div>

        <div className="flex flex-1 items-center justify-end gap-3 md:gap-4">
          <div className="hidden md:block flex-1">
            <form
              className="w-full"
              onSubmit={(e) => {
                e.preventDefault();
                const q = query.trim();
                navigate(q ? `/movies?q=${encodeURIComponent(q)}` : "/movies");
              }}
            >
              <label className="relative block">
                <span className="sr-only">Search movies</span>
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search movies, cinemas, genres…"
                  className="w-full rounded-2xl border border-slate-700/80 bg-slate-900/80 px-4 py-2 text-sm text-white placeholder:text-slate-400 shadow-sm shadow-black/30 outline-none transition focus:border-slate-500 focus:bg-slate-900"
                />
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                  <Search className="h-4 w-4" />
                </span>
              </label>
            </form>
          </div>

          <div className="hidden items-center gap-3 md:flex">
            <LocationPicker compact />
            <button
              type="button"
              onClick={toggleTheme}
              className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-white transition hover:bg-white/10"
            >
              <span className="inline-flex items-center gap-1.5">
                {theme === "dark" ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
                {theme === "dark" ? "Light" : "Dark"}
              </span>
            </button>
            <NavLink
              to={isLoggedIn ? "/profile" : "/login"}
              className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white hover:text-black focus:outline-none focus:ring-2 focus:ring-white/30 focus:ring-offset-2 focus:ring-offset-slate-950"
            >
              <User className="h-4 w-4" />
              {isLoggedIn ? "Profile" : "Sign In"}
            </NavLink>
          </div>

          <button
            type="button"
            className="inline-flex items-center justify-center rounded-md p-2 text-white/80 hover:bg-white/5 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/30 focus:ring-offset-2 focus:ring-offset-black md:hidden"
            aria-label="Open menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </nav>

      {open ? (
        <div
          id="mobile-menu"
          className="border-t border-white/10 bg-slate-950/95 backdrop-blur md:hidden"
        >
          <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-4 sm:px-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <span className="text-sm font-semibold text-white">Menu</span>
              </div>
              <button
                type="button"
                className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-white transition hover:bg-white/10"
                onClick={toggleTheme}
              >
                <span className="inline-flex items-center gap-1.5">
                  {theme === "dark" ? (
                    <Sun className="h-4 w-4" />
                  ) : (
                    <Moon className="h-4 w-4" />
                  )}
                  {theme === "dark" ? "Light" : "Dark"}
                </span>
              </button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const q = query.trim();
                navigate(q ? `/movies?q=${encodeURIComponent(q)}` : "/movies");
              }}
            >
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search movies…"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/40 outline-none transition focus:border-white/20 focus:bg-white/10"
              />
            </form>

            <div className="flex flex-col gap-2">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className="rounded-xl px-4 py-3 text-sm font-medium text-white/80 transition hover:bg-white/5 hover:text-white"
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </NavLink>
              ))}
            </div>

            <LocationPicker />

            <NavLink
              to={isLoggedIn ? "/profile" : "/login"}
              className="inline-flex w-full items-center justify-center rounded-lg bg-white/10 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white hover:text-black focus:outline-none focus:ring-2 focus:ring-white/30 focus:ring-offset-2 focus:ring-offset-black"
              onClick={() => setOpen(false)}
            >
              {isLoggedIn ? "Profile" : "Sign In"}
            </NavLink>
          </div>
        </div>
      ) : null}
    </header>
  );
}
