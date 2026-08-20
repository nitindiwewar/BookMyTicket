import { useEffect, useMemo, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Ticket,
  Star,
  TrendingUp,
  Clock,
  Flame,
  ArrowRight,
  Play,
  History,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Award,
  Film,
  X,
  Percent,
  Tag,
  ShieldCheck,
  Gift,
} from "lucide-react";
import Button from "../components/ui/Button.jsx";
import Card from "../components/ui/Card.jsx";
import Badge from "../components/ui/Badge.jsx";
import MovieCard, { trackRecentlyViewed } from "../components/MovieCard.jsx";
import { getMovies } from "../api/movieApi.js";
import { syncPopularTmdbMovies } from "../api/tmdbApi.js";
import { useLocationCity } from "../state/locationContext.jsx";
import { useBooking } from "../state/bookingContext.jsx";



function getEmbedTrailerUrl(url) {
  if (!url) return "https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1";
  if (url.includes("youtube.com/embed/")) return url.includes("autoplay=") ? url : `${url}?autoplay=1`;
  if (url.includes("watch?v=")) {
    const videoId = url.split("watch?v=")[1]?.split("&")[0];
    return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
  }
  if (url.includes("youtu.be/")) {
    const videoId = url.split("youtu.be/")[1]?.split("?")[0];
    return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
  }
  return url;
}



const RECENT_KEY = "movieticket-recent-movies";


// Section Header Component with 42px Title Hierarchy
function SectionHeader({
  title,
  subtitle,
  linkText,
  linkTo,
  icon: Icon = Flame,
  onScrollLeft,
  onScrollRight,
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
      <div className="space-y-1.5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-red-50 text-[#FF1744] shadow-xs">
            <Icon className="h-5 w-5 stroke-[2.2]" />
          </div>
          <h2 className="section-title text-[#111827]">{title}</h2>
        </div>
        {subtitle && <p className="subtitle-text pl-11">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-3 self-end sm:self-auto">
        {onScrollLeft && onScrollRight && (
          <div className="hidden md:flex items-center gap-1.5 mr-2">
            <button
              type="button"
              onClick={onScrollLeft}
              className="grid h-9 w-9 place-items-center rounded-full bg-white border border-[#E5E7EB] text-[#111827] hover:bg-slate-100 hover:border-slate-300 transition shadow-xs cursor-pointer"
              aria-label="Scroll left"
            >
              <ChevronLeft className="h-4.5 w-4.5" />
            </button>
            <button
              type="button"
              onClick={onScrollRight}
              className="grid h-9 w-9 place-items-center rounded-full bg-white border border-[#E5E7EB] text-[#111827] hover:bg-slate-100 hover:border-slate-300 transition shadow-xs cursor-pointer"
              aria-label="Scroll right"
            >
              <ChevronRight className="h-4.5 w-4.5" />
            </button>
          </div>
        )}

        {linkText && linkTo && (
          <Button
            variant="secondary"
            size="sm"
            as={Link}
            to={linkTo}
            className="group text-xs font-extrabold whitespace-nowrap"
          >
            {linkText}
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
          </Button>
        )}
      </div>
    </div>
  );
}

// Horizontal Scrollable Tray Container
function ScrollableTray({ children, containerRef }) {
  return (
    <div
      ref={containerRef}
      className="flex items-center gap-6 overflow-x-auto pb-4 pt-1 no-scrollbar scroll-smooth snap-x snap-mandatory"
    >
      {children}
    </div>
  );
}

export default function Home() {
  const loc = useLocationCity();
  const booking = useBooking();
  const navigate = useNavigate();

  const [movies, setMovies] = useState(() => {
    try {
      const cached = localStorage.getItem("bmt_cached_movies");
      return cached ? JSON.parse(cached) : [];
    } catch {
      return [];
    }
  });

  const [loading, setLoading] = useState(() => {
    try {
      const cached = localStorage.getItem("bmt_cached_movies");
      return !cached || JSON.parse(cached).length === 0;
    } catch {
      return true;
    }
  });

  const fetchMoviesFromApi = async () => {
    try {
      let data = await getMovies();
      let list = Array.isArray(data) ? data : (data?.data && Array.isArray(data.data) ? data.data : []);

      if (list.length > 0) {
        setMovies(list);
        try {
          localStorage.setItem("bmt_cached_movies", JSON.stringify(list));
        } catch {}
        setLoading(false);
        return;
      }

      // Only auto-seed if database is completely empty
      if (list.length === 0) {
        const syncRes = await syncPopularTmdbMovies();
        if (syncRes?.data && Array.isArray(syncRes.data) && syncRes.data.length > 0) {
          list = syncRes.data;
        } else {
          data = await getMovies();
          list = Array.isArray(data) ? data : (data?.data && Array.isArray(data.data) ? data.data : []);
        }
        setMovies(list);
        try {
          localStorage.setItem("bmt_cached_movies", JSON.stringify(list));
        } catch {}
      }
    } catch (err) {
      console.error("Failed to load movies from API:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMoviesFromApi();
  }, []);

  const featured = useMemo(() => movies.slice(0, 5), [movies]);
  const trending = useMemo(
    () => movies.filter((m) => m.releaseStatus === "Trending" || m.release === "Trending" || (m.rating && m.rating >= 8.0)),
    [movies]
  );
  const nowShowing = useMemo(
    () => movies.filter((m) => m.releaseStatus === "Now Showing" || m.release === "Now Showing" || !m.releaseStatus || m.releaseStatus === "Released"),
    [movies]
  );
  const comingSoon = useMemo(
    () => movies.filter((m) => m.releaseStatus === "Upcoming" || m.release === "Upcoming" || m.releaseStatus === "Coming Soon"),
    [movies]
  );
  const topRated = useMemo(
    () => [...movies].sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, 10),
    [movies]
  );
  const popularThisWeek = useMemo(
    () => [...movies].sort((a, b) => (b.votes || 0) - (a.votes || 0)).slice(0, 10),
    [movies]
  );


  const [activeSlide, setActiveSlide] = useState(0);
  const [categoryTab, setCategoryTab] = useState("all");
  const [formatFilter, setFormatFilter] = useState("all");
  const [mood, setMood] = useState("thrill");
  const [progress, setProgress] = useState(0);
  const [trailerMovie, setTrailerMovie] = useState(null);

  const trendingRef = useRef(null);
  const nowShowingRef = useRef(null);
  const comingSoonRef = useRef(null);
  const topRatedRef = useRef(null);
  const popularRef = useRef(null);

  const activeFeatured = featured[activeSlide] || featured[0];

  // Hero Carousel Auto-Play Timer
  useEffect(() => {
    if (!featured.length) return undefined;
    setProgress(0);
    const interval = 50;
    const totalTime = 7000;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setActiveSlide((a) => (a + 1) % featured.length);
          return 0;
        }
        return prev + (interval / totalTime) * 100;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [activeSlide, featured.length]);

  // Recently Viewed Movies
  const recentlyViewedList = useMemo(() => {
    try {
      const raw = localStorage.getItem(RECENT_KEY);
      const ids = raw ? JSON.parse(raw) : [];
      return ids.map((id) => movies.find((m) => m.id === id)).filter(Boolean);
    } catch {
      return [];
    }
  }, [movies]);

  // Filtered movies by category tab & format filter
  const filteredMovies = useMemo(() => {
    let list = movies;
    if (categoryTab === "trending") list = trending;
    if (categoryTab === "now-showing") list = nowShowing;
    if (categoryTab === "coming-soon") list = comingSoon;

    if (formatFilter !== "all") {
      list = list.filter((m) =>
        m.format ? m.format.some((f) => f.toLowerCase().includes(formatFilter.toLowerCase())) : true
      );
    }
    return list;
  }, [categoryTab, formatFilter, comingSoon, movies, nowShowing, trending]);

  const smartPick = useMemo(() => {
    const moodMap = {
      thrill: ["Thriller", "Action", "Mystery"],
      "feel-good": ["Drama", "Romance", "Comedy"],
      "mind-bend": ["Sci‑Fi", "Mystery"],
      "date-night": ["Romance", "Drama"],
      family: ["Animation", "Action", "Drama"],
    };
    const targets = moodMap[mood] || [];
    const sorted = [...movies].sort((a, b) => {
      const aScore =
        (targets.some((g) => a.genre?.includes(g)) ? 2 : 0) +
        (a.rating >= 4.5 ? 1 : 0) +
        a.rating / 5;
      const bScore =
        (targets.some((g) => b.genre?.includes(g)) ? 2 : 0) +
        (b.rating >= 4.5 ? 1 : 0) +
        b.rating / 5;
      return bScore - aScore;
    });
    return sorted[0];
  }, [mood, movies]);


  const handleScroll = (ref, direction) => {
    if (ref.current) {
      const scrollAmount = direction === "left" ? -400 : 400;
      ref.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <div className="relative min-h-screen pb-12 space-y-8 sm:space-y-10">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-10">
        {/* ================= HERO SECTION ================= */}
        <section className="relative pt-2">
          <div className="relative overflow-hidden rounded-[24px] lg:rounded-[30px] bg-[#111827] text-white shadow-xl border border-slate-800/80">
            {/* Carousel Auto-Progress Bar */}
            <div className="absolute top-0 inset-x-0 h-1 bg-white/10 z-30">
              <div
                className="h-full bg-gradient-to-r from-[#FF1744] to-[#FF4F6D] transition-all duration-75 ease-linear"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Left Floating Chevron Arrow */}
            {featured.length > 1 && (
              <button
                type="button"
                onClick={() => setActiveSlide((a) => (a - 1 + featured.length) % featured.length)}
                className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 z-30 h-10 w-10 grid place-items-center rounded-full bg-slate-900/60 hover:bg-[#FF1744] text-white border border-white/20 backdrop-blur-md transition shadow-lg cursor-pointer"
                aria-label="Previous slide"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
            )}

            {/* Right Floating Chevron Arrow */}
            {featured.length > 1 && (
              <button
                type="button"
                onClick={() => setActiveSlide((a) => (a + 1) % featured.length)}
                className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 z-30 h-10 w-10 grid place-items-center rounded-full bg-slate-900/60 hover:bg-[#FF1744] text-white border border-white/20 backdrop-blur-md transition shadow-lg cursor-pointer"
                aria-label="Next slide"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            )}

            {activeFeatured && (
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeFeatured.id || "hero"}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="relative min-h-[380px] lg:min-h-[420px] grid lg:grid-cols-12 items-center p-5 sm:p-8 lg:p-10"
                >
                  {/* Full-width Backdrop Image with Gradient Overlay */}
                  <div className="absolute inset-0 z-0 overflow-hidden">
                    <img
                      src={
                        activeFeatured.backdropUrl ||
                        activeFeatured.backdrop ||
                        activeFeatured.hero?.backdrop ||
                        activeFeatured.posterUrl ||
                        activeFeatured.poster ||
                        activeFeatured.hero?.poster
                      }
                      alt={activeFeatured.title || "Movie"}
                      className="h-full w-full object-cover opacity-50 blur-none scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#0F172A] via-[#0F172A]/90 to-transparent w-full lg:w-4/5" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-transparent to-transparent" />
                  </div>

                  {/* Left Content */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                    className="relative z-10 lg:col-span-7 flex flex-col justify-center space-y-4"
                  >
                    {/* Badges & Rating */}
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className="rounded-full bg-[#FF1744] px-3 py-0.5 text-xs font-extrabold text-white shadow-md shadow-red-500/20 uppercase tracking-wider">
                        Featured Blockbuster
                      </span>
                      <div className="glass-badge flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-extrabold text-amber-400 border border-white/10 bg-black/40">
                        <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                        <span>{activeFeatured.rating ? `${activeFeatured.rating} IMDb` : "8.5 IMDb"}</span>
                      </div>
                    </div>

                    {/* Hero Title - Bold Bright White */}
                    <h1 className="text-3xl sm:text-4xl lg:text-[46px] font-extrabold leading-tight text-white tracking-tight font-heading drop-shadow-md">
                      {activeFeatured.title || activeFeatured.name || activeFeatured.hero?.title || "Featured Movie"}
                    </h1>

                    {/* Synopsis - Compact 2 lines */}
                    <p className="text-xs sm:text-sm text-slate-200 line-clamp-2 leading-relaxed max-w-xl font-normal">
                      {activeFeatured.synopsis || activeFeatured.description || activeFeatured.hero?.synopsis || "Book tickets for the latest blockbuster cinema experience."}
                    </p>

                    {/* Metadata Row */}
                    <div className="flex flex-wrap items-center gap-2 text-xs font-extrabold text-slate-300">
                      <span className="rounded-md bg-white/15 px-2.5 py-0.5 text-white border border-white/10">
                        {activeFeatured.language || "Hindi"}
                      </span>
                      <span>•</span>
                      <span className="text-slate-200">
                        {Array.isArray(activeFeatured.genre) ? activeFeatured.genre.join(" / ") : "Action, Thriller"}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5 text-cyan-400" />
                        {activeFeatured.runtimeMins || 145} min
                      </span>
                      <span>•</span>
                      <span className="rounded-md bg-white/15 px-2 py-0.5 text-[10px] text-white uppercase font-extrabold border border-white/10">
                        {activeFeatured.certification || "UA"}
                      </span>
                    </div>

                    {/* Quick Showtime Selector Pills */}
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <span className="text-[11px] font-extrabold text-slate-300 uppercase tracking-wider">
                        Quick Showtimes:
                      </span>
                      {["10:30 AM", "02:15 PM", "06:45 PM", "09:30 PM"].map((timeSlot) => (
                        <button
                          key={timeSlot}
                          type="button"
                          onClick={() => {
                            trackRecentlyViewed(activeFeatured.id);
                            booking.setMovie(activeFeatured.id);
                            const cleanTime = timeSlot.replace(":", "").replace(" ", "").toLowerCase();
                            navigate(`/movies/${activeFeatured.id}/seats/s-${activeFeatured.id}-t1-2026-07-29-${cleanTime}`);
                          }}
                          className="px-2.5 py-1 rounded-lg text-xs font-bold bg-white/15 hover:bg-[#FF1744] text-white border border-white/20 transition cursor-pointer"
                        >
                          {timeSlot}
                        </button>
                      ))}
                    </div>

                    {/* Hero Buttons: Primary Gradient & Secondary Glass */}
                    <div className="flex flex-wrap items-center gap-3 pt-2">
                      <Button
                        size="md"
                        onClick={() => {
                          trackRecentlyViewed(activeFeatured.id);
                          booking.setMovie(activeFeatured.id);
                          navigate(`/movies/${activeFeatured.id}/theaters`);
                        }}
                        className="shadow-red-glow"
                      >
                        <Ticket className="h-4.5 w-4.5 stroke-[2.2]" />
                        <span>Book Tickets</span>
                      </Button>

                      <Button
                        variant="secondary"
                        size="md"
                        onClick={() => {
                          trackRecentlyViewed(activeFeatured.id);
                          setTrailerMovie(activeFeatured);
                        }}
                        className="glass-panel text-white hover:bg-white hover:text-[#111827] border-white/20"
                      >
                        <Play className="h-4 w-4 fill-current" />
                        <span>Watch Trailer</span>
                      </Button>
                    </div>
                  </motion.div>

                  {/* Right Floating Movie Poster */}
                  <div className="relative z-10 hidden lg:flex lg:col-span-5 justify-center items-center">
                    <motion.div
                      animate={{ y: [0, -8, 0] }}
                      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                      className="relative group"
                    >
                      <img
                        src={activeFeatured.posterUrl || activeFeatured.poster || activeFeatured.hero?.poster}
                        alt={activeFeatured.title || "Poster"}
                        className="h-[300px] w-[210px] rounded-[22px] shadow-2xl border-2 border-white/20 object-cover transform group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 rounded-[22px] bg-gradient-to-t from-[#FF1744]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                    </motion.div>
                  </div>

                  {/* Carousel Slider Controls */}
                  <div className="absolute bottom-4 right-6 lg:right-8 z-20 flex items-center gap-2">
                    {featured.map((_, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setActiveSlide(i)}
                        className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                          activeSlide === i
                            ? "w-6 bg-[#FF1744]"
                            : "w-2 bg-white/30 hover:bg-white/60"
                        }`}
                        aria-label={`Go to slide ${i + 1}`}
                      />
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            )}
          </div>



          {/* ================= CATEGORY PILLS BELOW HERO ================= */}
          <div className="mt-6 flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
            {[
              { id: "all", label: "🔥 All Movies" },
              { id: "trending", label: "⚡ Trending" },
              { id: "now-showing", label: "🎬 Now Showing" },
              { id: "coming-soon", label: "⏳ Coming Soon" },
            ].map((tab) => {
              const active = categoryTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setCategoryTab(tab.id)}
                  className={`relative rounded-full px-4 py-2 text-xs sm:text-sm font-extrabold transition-all duration-200 cursor-pointer ${
                    active
                      ? "bg-gradient-to-r from-[#FF1744] to-[#FF4F6D] text-white shadow-md shadow-red-500/25"
                      : "bg-white text-[#6B7280] hover:text-[#111827] border border-[#E5E7EB] hover:bg-slate-50"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </section>

        {/* ================= RECENTLY VIEWED TRAY ================= */}
        {recentlyViewedList.length > 0 && (
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-700">
                <div className="grid h-6 w-6 place-items-center rounded-lg bg-red-100 text-[#FF1744]">
                  <History className="h-3.5 w-3.5 stroke-[2.5]" />
                </div>
                <span>Jump Back In — Recently Viewed</span>
              </div>
              <span className="text-[11px] font-extrabold text-slate-400">
                {recentlyViewedList.length} Movies Saved
              </span>
            </div>
            <div className="flex items-center gap-3.5 overflow-x-auto pb-2 pt-1 no-scrollbar">
              {recentlyViewedList.map((m) => (
                <Link
                  key={m.id}
                  to={`/movies/${m.id}`}
                  className="flex items-center gap-3 shrink-0 rounded-2xl bg-white p-2.5 shadow-md shadow-slate-200/60 border border-slate-200/80 hover:border-[#FF1744]/40 hover:shadow-lg hover:-translate-y-0.5 transition-all w-64 group relative overflow-hidden"
                >
                  <img
                    src={m.posterUrl || m.poster || m.hero?.poster}
                    alt={m.title}
                    className="h-14 w-10 rounded-xl object-cover shadow-sm group-hover:scale-105 transition-transform"
                  />
                  <div className="min-w-0 flex-1 space-y-0.5">
                    <div className="text-xs font-black text-slate-900 group-hover:text-[#FF1744] transition truncate">
                      {m.title}
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] font-extrabold text-slate-500">
                      <span className="text-amber-500 font-bold">⭐ {m.rating || "8.5"}</span>
                      <span>•</span>
                      <span>{m.language || "English"}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* ================= RECOMMENDED (AI MOOD WIDGET) ================= */}
        <section>
          <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 p-6 sm:p-8 text-white shadow-2xl border border-slate-800">
            {/* Glowing Backdrop Ring */}
            <div className="absolute -right-20 -bottom-20 h-64 w-64 rounded-full bg-[#FF1744]/20 blur-3xl pointer-events-none" />

            <div className="relative z-10 space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-1.5">
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-white/10 backdrop-blur-md px-3 py-1 text-[11px] font-black text-rose-300 border border-white/15">
                    <Sparkles className="h-3.5 w-3.5 text-[#FF1744]" />
                    <span>AI Cinema Discovery</span>
                  </div>
                  <h3 className="text-xl sm:text-3xl font-black text-white tracking-tight">
                    What's your mood today?
                  </h3>
                  <p className="text-xs sm:text-sm font-medium text-slate-300">
                    Select your mood to discover top recommendations playing in <strong className="text-white">{loc.city}</strong>.
                  </p>
                </div>

                {/* Mood Selector Chips */}
                <div className="flex flex-wrap items-center gap-2">
                  {[
                    { key: "thrill", label: "🔥 Thrill & Action" },
                    { key: "feel-good", label: "✨ Feel Good" },
                    { key: "mind-bend", label: "🧠 Mind Bending" },
                    { key: "family", label: "🍿 Family Blockbuster" },
                  ].map((m) => (
                    <button
                      key={m.key}
                      type="button"
                      onClick={() => setMood(m.key)}
                      className={`rounded-full px-4 py-2 text-xs font-black transition-all cursor-pointer ${
                        mood === m.key
                          ? "bg-gradient-to-r from-[#FF1744] to-[#FF4F6D] text-white shadow-lg shadow-red-500/30 scale-105"
                          : "bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white border border-white/10"
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Smart Pick Match Display */}
              {smartPick && (
                <motion.div
                  key={smartPick.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col sm:flex-row items-center justify-between gap-5 rounded-2xl bg-white/10 backdrop-blur-xl p-4 sm:p-5 border border-white/15 shadow-xl"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={smartPick.posterUrl || smartPick.poster || smartPick.hero?.poster}
                      alt={smartPick.title}
                      className="h-20 w-14 rounded-xl object-cover shadow-lg border border-white/20"
                    />
                    <div className="space-y-1">
                      <span className="inline-block text-[10px] font-black text-rose-400 uppercase tracking-widest bg-rose-500/20 px-2 py-0.5 rounded-md">
                        Top Recommended Match
                      </span>
                      <div className="text-lg font-black text-white">{smartPick.title}</div>
                      <div className="text-xs text-slate-300 font-semibold flex items-center gap-2">
                        <span>{smartPick.genre?.join(", ")}</span>
                        <span>•</span>
                        <span className="text-amber-400 font-extrabold">⭐ {smartPick.rating}</span>
                      </div>
                    </div>
                  </div>

                  <Button
                    size="md"
                    onClick={() => {
                      trackRecentlyViewed(smartPick.id);
                      booking.setMovie(smartPick.id);
                      navigate(`/movies/${smartPick.id}/theaters`);
                    }}
                    className="w-full sm:w-auto shadow-red-glow font-extrabold whitespace-nowrap"
                  >
                    <Ticket className="h-4 w-4" />
                    <span>Book Recommendation</span>
                  </Button>
                </motion.div>
              )}
            </div>
          </div>
        </section>

        {/* ================= DYNAMIC CATEGORY FILTER OR ALL SECTIONS ================= */}
        {categoryTab !== "all" ? (
          <section className="space-y-6 pt-2">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-[#111827] capitalize">
                  {categoryTab.replace("-", " ")} Movies ({filteredMovies.length})
                </h2>
                <p className="text-xs sm:text-sm font-medium text-slate-500 mt-0.5">
                  Showing movies categorized under {categoryTab.replace("-", " ")} in {loc.city}.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setCategoryTab("all")}
                className="text-xs sm:text-sm font-extrabold text-[#FF1744] hover:underline cursor-pointer"
              >
                Reset to All Movies
              </button>
            </div>

            {filteredMovies.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {filteredMovies.map((movie) => (
                  <MovieCard key={movie.id} movie={movie} />
                ))}
              </div>
            ) : (
              <div className="py-12 text-center rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
                <p className="text-slate-600 font-bold text-sm">No movies found under this category filter.</p>
                <button
                  type="button"
                  onClick={() => setCategoryTab("all")}
                  className="inline-flex items-center rounded-full bg-[#FF1744] px-5 py-2 text-xs font-extrabold text-white shadow-md shadow-red-500/20 hover:bg-red-600 transition"
                >
                  View All Movies Catalog
                </button>
              </div>
            )}
          </section>
        ) : (
          <>
            {/* ================= TRENDING MOVIES SECTION ================= */}
            <section>
              <SectionHeader
                title="Trending Movies"
                subtitle={`Top rated blockbusters trending right now in ${loc.city}`}
                linkText="View All Movies"
                linkTo="/movies"
                icon={TrendingUp}
                onScrollLeft={() => handleScroll(trendingRef, "left")}
                onScrollRight={() => handleScroll(trendingRef, "right")}
              />
              <ScrollableTray containerRef={trendingRef}>
                {trending.map((movie) => (
                  <div
                    key={movie.id}
                    className="w-[calc(50%-12px)] sm:w-[calc(33.333%-16px)] md:w-[calc(25%-18px)] lg:w-[calc(16.666%-20px)] shrink-0 snap-start"
                  >
                    <MovieCard movie={movie} priority />
                  </div>
                ))}
              </ScrollableTray>
            </section>

            {/* ================= NOW SHOWING SECTION ================= */}
            <section>
              <SectionHeader
                title="Now Showing"
                subtitle="Reserve showtimes at nearest premium multiplexes"
                linkText="Explore All"
                linkTo="/movies"
                icon={Ticket}
                onScrollLeft={() => handleScroll(nowShowingRef, "left")}
                onScrollRight={() => handleScroll(nowShowingRef, "right")}
              />
              <ScrollableTray containerRef={nowShowingRef}>
                {nowShowing.map((movie) => (
                  <div
                    key={movie.id}
                    className="w-[calc(50%-12px)] sm:w-[calc(33.333%-16px)] md:w-[calc(25%-18px)] lg:w-[calc(16.666%-20px)] shrink-0 snap-start"
                  >
                    <MovieCard movie={movie} />
                  </div>
                ))}
              </ScrollableTray>
            </section>

            {/* ================= COMING SOON SECTION ================= */}
            <section>
              <SectionHeader
                title="Coming Soon"
                subtitle="Get ready for big screen cinema arrivals coming to theaters"
                icon={Clock}
                onScrollLeft={() => handleScroll(comingSoonRef, "left")}
                onScrollRight={() => handleScroll(comingSoonRef, "right")}
              />
              <ScrollableTray containerRef={comingSoonRef}>
                {comingSoon.map((movie) => (
                  <div
                    key={movie.id}
                    className="w-[calc(50%-12px)] sm:w-[calc(33.333%-16px)] md:w-[calc(25%-18px)] lg:w-[calc(16.666%-20px)] shrink-0 snap-start"
                  >
                    <MovieCard movie={movie} />
                  </div>
                ))}
              </ScrollableTray>
            </section>

            {/* ================= TOP RATED SECTION ================= */}
            <section>
              <SectionHeader
                title="Top Rated"
                subtitle="Critically acclaimed movies loved by cinema audiences"
                linkText="See All"
                linkTo="/movies"
                icon={Award}
                onScrollLeft={() => handleScroll(topRatedRef, "left")}
                onScrollRight={() => handleScroll(topRatedRef, "right")}
              />
              <ScrollableTray containerRef={topRatedRef}>
                {topRated.map((movie) => (
                  <div
                    key={movie.id}
                    className="w-[calc(50%-12px)] sm:w-[calc(33.333%-16px)] md:w-[calc(25%-18px)] lg:w-[calc(16.666%-20px)] shrink-0 snap-start"
                  >
                    <MovieCard movie={movie} />
                  </div>
                ))}
              </ScrollableTray>
            </section>

            {/* ================= POPULAR THIS WEEK SECTION ================= */}
            <section>
              <SectionHeader
                title="Popular This Week"
                subtitle="Most booked showtimes across all cinema halls"
                icon={Film}
                onScrollLeft={() => handleScroll(popularRef, "left")}
                onScrollRight={() => handleScroll(popularRef, "right")}
              />
              <ScrollableTray containerRef={popularRef}>
                {popularThisWeek.map((movie) => (
                  <div
                    key={movie.id}
                    className="w-[calc(50%-12px)] sm:w-[calc(33.333%-16px)] md:w-[calc(25%-18px)] lg:w-[calc(16.666%-20px)] shrink-0 snap-start"
                  >
                    <MovieCard movie={movie} />
                  </div>
                ))}
              </ScrollableTray>
            </section>
          </>
        )}
      </div>

      {/* ================= INTERACTIVE YOUTUBE TRAILER MODAL ================= */}
      {trailerMovie && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="relative w-full max-w-4xl rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 px-6 border-b border-slate-800 bg-slate-900/90">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-red-600/20 text-[#FF1744] grid place-items-center">
                  <Play className="h-4 w-4 fill-current ml-0.5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-white text-base sm:text-lg">
                    {trailerMovie.title}
                  </h3>
                  <p className="text-xs text-slate-400 font-medium">Official Cinema Trailer</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setTrailerMovie(null)}
                className="p-2 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
                aria-label="Close trailer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* YouTube Iframe Player */}
            <div className="relative aspect-video w-full bg-black">
              <iframe
                src={getEmbedTrailerUrl(trailerMovie.trailerUrl || trailerMovie.trailer)}
                title={`${trailerMovie.title} Official Trailer`}
                className="h-full w-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            {/* Modal Footer */}
            <div className="p-4 px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900">
              <div className="text-xs text-slate-300 font-medium">
                {trailerMovie.genre?.join(" • ")} • IMDb ⭐ {trailerMovie.rating}
              </div>

              <Button
                size="sm"
                onClick={() => {
                  const mId = trailerMovie.id;
                  setTrailerMovie(null);
                  trackRecentlyViewed(mId);
                  booking.setMovie(mId);
                  navigate(`/movies/${mId}/theaters`);
                }}
              >
                Book Tickets for {trailerMovie.title}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


