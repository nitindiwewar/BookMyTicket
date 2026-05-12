import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Footer from "../components/Footer.jsx";
import LocationPicker from "../components/LocationPicker.jsx";
import MovieCard from "../components/MovieCard.jsx";
import Button from "../components/ui/Button.jsx";
import Card from "../components/ui/Card.jsx";
import movies, { genres } from "../data/movies.js";
import { useLocationCity } from "../state/locationContext.jsx";
import { initHomeTrendingAnimations } from "../animations/homeTrendingAnimations.js";

// Section header component for consistency (defined outside to avoid re-creation)
function SectionHeader({ title, subtitle, linkText, linkTo }) {
  return (
    <div className="flex items-end justify-between gap-4 mb-6">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-1.5 h-6 bg-linear-to-b from-cyan-400 to-blue-500 rounded-full" />
          <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
            {title}
          </h2>
        </div>
        {subtitle && (
          <p className="text-sm text-white/60 font-medium leading-relaxed ml-5">
            {subtitle}
          </p>
        )}
      </div>
      {linkText && linkTo && (
        <Button
          variant="subtle"
          as={Link}
          to={linkTo}
          className="hidden sm:inline-flex text-xs! px-4! py-2! group whitespace-nowrap"
        >
          {linkText}
          <svg
            className="w-3.5 h-3.5 ml-1 transition-transform group-hover:translate-x-0.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </Button>
      )}
    </div>
  );
}

export default function Home() {
  const loc = useLocationCity();

  const heroRef = useRef(null);
  const featured = useMemo(() => movies.slice(0, 3), []);
  const trending = useMemo(
    () => movies.filter((m) => m.release === "Trending" || m.rating >= 4.6),
    [],
  );
  const recommended = useMemo(
    () => movies.filter((m) => m.rating >= 4.5 && m.votes >= 100000),
    [],
  );
  const recentlyReleased = useMemo(
    () => movies.filter((m) => m.release === "Now Showing"),
    [],
  );
  const upcoming = useMemo(
    () => movies.filter((m) => m.release === "Upcoming"),
    [],
  );
  const recommendedStrip = useMemo(() => {
    const seen = new Set();
    const out = [];
    for (const m of [...recommended, ...movies]) {
      if (seen.has(m.id)) continue;
      seen.add(m.id);
      out.push(m);
    }
    return out.slice(0, 10);
  }, [recommended]);

  const [active, setActive] = useState(0);
  const [mood, setMood] = useState("thrill"); // thrill | feel-good | mind-bend
  const activeFeatured = featured[active] ??
    featured[0] ?? {
      id: "",
      title: "No featured movie",
      synopsis: "No featured movie is available right now.",
      hero: {},
    };

  useEffect(() => {
    if (!featured.length) return undefined;
    const t = setInterval(
      () => setActive((a) => (a + 1) % featured.length),
      5000,
    );
    return () => clearInterval(t);
  }, [featured.length]);

  useEffect(() => {
    // Kick animations only after DOM is ready
    const t = setTimeout(() => initHomeTrendingAnimations(), 0);
    return () => clearTimeout(t);
  }, [trending]);

  const smartPick = useMemo(() => {
    const moodMap = {
      thrill: ["Thriller", "Action", "Mystery"],
      "feel-good": ["Drama", "Romance"],
      "mind-bend": ["Sci‑Fi", "Mystery"],
    };
    const targets = moodMap[mood] || [];
    const sorted = [...movies].sort((a, b) => {
      const aScore =
        (targets.some((g) => a.genre.includes(g)) ? 2 : 0) +
        (a.rating >= 4.5 ? 1 : 0) +
        a.rating / 5;
      const bScore =
        (targets.some((g) => b.genre.includes(g)) ? 2 : 0) +
        (b.rating >= 4.5 ? 1 : 0) +
        b.rating / 5;
      return bScore - aScore;
    });
    return sorted[0];
  }, [mood]);

  return (
    <div className="relative">
      {/* Background decorative elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative mx-auto w-full max-w-7xl px-2 py-6 sm:px-4 sm:py-8">
        {/* Hero Section - Enhanced */}
        <section
          ref={heroRef}
          className="relative overflow-hidden rounded-2xl border border-white/10 bg-linear-to-br from-slate-900/80 via-slate-800/60 to-slate-900/80 backdrop-blur-xl shadow-[0_12px_48px_rgba(0,0,0,0.5)]"
        >
          {/* Animated background gradient */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0 bg-linear-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20" />
          </div>

          <div className="absolute inset-0">
            <img
              src={
                activeFeatured.hero?.backdrop ??
                "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1200&h=600&fit=crop"
              }
              alt={activeFeatured.title ?? "Featured movie backdrop"}
              className="h-full w-full object-cover opacity-50 blur-sm"
              loading="lazy"
              decoding="async"
            />
            {/* Enhanced gradient overlay with better contrast */}
            <div className="absolute inset-0 bg-linear-to-r from-slate-950/90 via-slate-900/70 to-slate-950/40" />
            <div className="absolute inset-0 bg-linear-to-t from-slate-950/80 via-transparent to-slate-950/20" />
          </div>

          <div className="relative grid gap-8 p-6 md:p-12 min-h-95 md:min-h-105">
            <div className="space-y-5 max-w-2xl z-10">
              {/* Badge */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/40 bg-cyan-500/15 backdrop-blur-md px-4 py-1.5 text-xs font-bold text-cyan-300 shadow-lg shadow-cyan-500/10">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                  FEATURED PREMIERE
                </div>
                <LocationPicker compact />
              </div>

              {/* Title - Larger and bolder */}
              <h1 className="text-balance text-4xl font-black tracking-tight text-white sm:text-5xl md:text-6xl drop-shadow-2xl leading-tight">
                {activeFeatured.title}
              </h1>

              {/* Synopsis */}
              <p className="max-w-xl text-sm leading-7 text-white/85 line-clamp-3 font-medium">
                {activeFeatured.synopsis}
              </p>

              {/* Movie info bar */}
              <div className="flex flex-wrap items-center gap-3 text-xs text-white/70 font-semibold">
                {activeFeatured.language && (
                  <>
                    <span>{activeFeatured.language}</span>
                    <span className="text-white/30">•</span>
                  </>
                )}
                {activeFeatured.genre && (
                  <>
                    <span>{activeFeatured.genre.slice(0, 2).join(", ")}</span>
                    <span className="text-white/30">•</span>
                  </>
                )}
                {activeFeatured.rating && (
                  <span className="flex items-center gap-1 bg-yellow-500/20 text-yellow-300 px-2.5 py-1 rounded-full border border-yellow-500/30">
                    <svg
                      className="w-3 h-3 fill-yellow-400"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    {activeFeatured.rating.toFixed(1)}
                  </span>
                )}
              </div>

              {/* Action buttons */}
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center pt-3">
                <Button
                  as={Link}
                  to={
                    activeFeatured.id
                      ? `/movies/${activeFeatured.id}`
                      : "/movies"
                  }
                  className="px-7! py-3.5! text-base! shadow-xl shadow-white/20 font-bold"
                >
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  Book Tickets
                </Button>
                <Button
                  variant="subtle"
                  onClick={() =>
                    document
                      .getElementById("trending")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                  className="px-7! py-3.5! text-base! backdrop-blur-md font-bold"
                >
                  Explore More
                  <svg
                    className="w-4 h-4 ml-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 14l-7 7m0 0l-7-7m7 7V3"
                    />
                  </svg>
                </Button>
              </div>

              {/* Pagination dots */}
              <div className="flex gap-3 pt-4">
                {featured.map((m, idx) => (
                  <button
                    key={m.id}
                    type="button"
                    className={[
                      "h-2.5 rounded-full transition-all duration-300 border",
                      idx === active
                        ? "w-10 bg-white border-white/70 shadow-lg shadow-white/30"
                        : "w-2.5 bg-white/40 border-white/20 hover:bg-white/60",
                    ].join(" ")}
                    aria-label={`Go to ${m.title}`}
                    onClick={() => setActive(idx)}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Smart Match Section */}
        <section className="mt-10">
          <Card className="relative overflow-hidden p-5 backdrop-blur-xl bg-white/4 border-white/8">
            {/* Decorative background */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-linear-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-2xl" />

            <div className="relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                  <div className="text-sm font-bold text-white tracking-wide uppercase">
                    Smart Match
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                    Exclusive
                  </span>
                </div>
                <div className="mt-2 text-sm text-white/60">
                  Personalized movie suggestion for{" "}
                  <span className="text-white font-semibold">{loc.city}</span>.
                </div>
              </div>

              {/* Mood selector */}
              <div className="flex flex-wrap gap-2">
                {[
                  ["thrill", "🔥 Thrill"],
                  ["feel-good", "😊 Feel Good"],
                  ["mind-bend", "🧠 Mind Bend"],
                ].map(([id, label]) => (
                  <button
                    key={id}
                    type="button"
                    className={[
                      "rounded-xl border px-4 py-2.5 text-xs font-semibold transition-all duration-200 backdrop-blur-sm",
                      mood === id
                        ? "border-white/30 bg-white text-black shadow-lg shadow-white/20 scale-105"
                        : "border-white/10 bg-white/5 text-white/70 hover:bg-white/15 hover:text-white",
                    ].join(" ")}
                    onClick={() => setMood(id)}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {smartPick ? (
              <div className="relative mt-5 flex flex-col items-start justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 md:flex-row md:items-center backdrop-blur-sm">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-linear-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white">
                      {smartPick.title}
                    </div>
                    <div className="mt-0.5 text-xs text-white/60 flex items-center gap-2">
                      <span>{smartPick.language}</span>
                      <span className="text-white/30">•</span>
                      <span>{smartPick.genre.slice(0, 2).join(" / ")}</span>
                      <span className="text-white/30">•</span>
                      <span className="flex items-center gap-1">
                        <svg
                          className="w-3 h-3 text-yellow-400"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        {smartPick.rating.toFixed(1)}
                      </span>
                    </div>
                  </div>
                </div>
                <Button
                  as={Link}
                  to={`/movies/${smartPick.id}`}
                  size="sm"
                  className="shadow-lg shadow-cyan-500/20"
                >
                  Open Smart Pick
                  <svg
                    className="w-3.5 h-3.5 ml-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </Button>
              </div>
            ) : null}
          </Card>
        </section>

        {/* Recently Released Section */}
        <section className="mt-14">
          <SectionHeader
            title="Now Showing"
            subtitle="Fresh releases playing in theaters near you"
            linkText="See all"
            linkTo="/movies"
          />
          <div className="relative">
            {/* Gradient fade on right edge */}
            <div className="absolute right-0 top-0 bottom-0 w-20 bg-linear-to-l from-(--app-bg) to-transparent z-10 pointer-events-none rounded-r-lg" />
            <div className="flex gap-4 overflow-x-auto pb-2 pt-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden scroll-smooth snap-x snap-mandatory">
              {recentlyReleased.map((m) => (
                <div key={m.id} className="w-40 md:w-48 shrink-0 snap-center">
                  <MovieCard movie={m} />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Trending Section */}
        <section id="trending" className="mt-14">
          <SectionHeader
            title="Trending Now"
            subtitle="Most watched movies in your city right now"
            linkText="View all"
            linkTo="/movies"
          />
          <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {trending.slice(0, 10).map((m, idx) => (
              <div
                key={m.id}
                className="js-trending-item group perspective"
                style={{ animationDelay: `${idx * 30}ms` }}
              >
                <div className="relative overflow-hidden rounded-xl">
                  <MovieCard movie={m} />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Recommended Section */}
        <section className="mt-14">
          <SectionHeader
            title="Handpicked For You"
            subtitle="Movies we think you'll love based on your preferences"
            linkText="See more"
            linkTo="/movies"
          />
          <div className="relative">
            <div className="absolute right-0 top-0 bottom-0 w-20 bg-linear-to-l from-(--app-bg) to-transparent z-10 pointer-events-none rounded-r-lg" />
            <div className="flex gap-4 overflow-x-auto pb-2 pt-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden scroll-smooth snap-x snap-mandatory">
              {recommendedStrip.map((m) => (
                <div key={m.id} className="w-40 md:w-48 shrink-0 snap-center">
                  <MovieCard movie={m} />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Upcoming Section */}
        <section className="mt-14">
          <SectionHeader
            title="Coming Soon"
            subtitle="Exciting movies releasing soon - be first to book"
            linkText="See all upcoming"
            linkTo="/movies"
          />
          <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {upcoming.slice(0, 6).map((m) => (
              <MovieCard key={m.id} movie={m} />
            ))}
          </div>
        </section>

        {/* Genres Section */}
        <section className="mt-12">
          <SectionHeader
            title="Browse by Genre"
            subtitle="Quick jump to your favorite categories"
          />
          <div className="flex flex-wrap gap-3">
            {genres.map((g) => (
              <Link
                key={g}
                to={`/movies?q=${encodeURIComponent(g)}`}
                className="group relative overflow-hidden rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white/80 transition-all duration-200 hover:border-white/25 hover:bg-white/10 hover:text-white hover:shadow-lg hover:shadow-white/5"
              >
                <span className="relative z-10">{g}</span>
                <div className="absolute inset-0 bg-linear-to-r from-white/0 via-white/5 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              </Link>
            ))}
          </div>
        </section>

        {/* Info Cards Section */}
        <section className="mt-12 grid gap-4 lg:grid-cols-2">
          <Card className="relative overflow-hidden p-5 backdrop-blur-xl bg-white/4 border-white/8">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-linear-to-br from-yellow-500/20 to-orange-500/20 flex items-center justify-center border border-yellow-500/30">
                <svg
                  className="w-5 h-5 text-yellow-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"
                  />
                </svg>
              </div>
              <div>
                <div className="text-sm font-bold text-white">
                  Offers & Promotions
                </div>
                <div className="text-xs text-white/60">
                  Exclusive deals for you
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              {["NOIR10", "BMSLIKE"].map((c) => (
                <div
                  key={c}
                  className="group flex items-center gap-2 rounded-xl border border-dashed border-white/20 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white/80 transition-all hover:border-white/30 hover:bg-white/10 cursor-pointer"
                >
                  <svg
                    className="w-4 h-4 text-green-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
                    />
                  </svg>
                  {c}
                </div>
              ))}
            </div>
          </Card>

          <Card className="relative overflow-hidden p-5 backdrop-blur-xl bg-white/4 border-white/8">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-linear-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center border border-blue-500/30">
                <svg
                  className="w-5 h-5 text-blue-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <div>
                <div className="text-sm font-bold text-white">
                  Nearby Cinemas
                </div>
                <div className="text-xs text-white/60">
                  Theaters near your location
                </div>
              </div>
            </div>
            <div className="grid gap-2">
              {[
                "CineHaus Downtown • City Center",
                "Silver Screen Mall • North Mall",
                "Noir Multiplex • Riverside",
              ].map((t) => (
                <div
                  key={t}
                  className="group flex items-center gap-3 rounded-xl border border-white/5 bg-white/2 p-3 text-sm text-white/80 transition-all hover:border-white/15 hover:bg-white/10 cursor-pointer"
                >
                  <div className="w-2 h-2 rounded-full bg-green-400" />
                  {t}
                  <svg
                    className="w-4 h-4 ml-auto text-white/40 group-hover:text-white/70 transition-colors"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              ))}
            </div>
          </Card>
        </section>

        {/* Decorative divider */}
        <div className="mt-16 mb-8 relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/5" />
          </div>
          <div className="relative flex justify-center">
            <div className="bg-(--app-bg) px-4">
              <div className="flex items-center gap-2 text-xs text-white/30">
                <span className="w-1 h-1 rounded-full bg-white/30" />
                <span>BookMyTicket</span>
                <span className="w-1 h-1 rounded-full bg-white/30" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
