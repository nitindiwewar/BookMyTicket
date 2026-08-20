import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  Play,
  Ticket,
  Star,
  Clock,
  ArrowLeft,
  Users,
  Clapperboard,
  Calendar,
  ShieldCheck,
  Award,
  Sparkles,
  MapPin,
  Flame,
  ThumbsUp,
  Globe,
  Film,
  Share2,
} from "lucide-react";
import Button from "../components/ui/Button.jsx";
import Card from "../components/ui/Card.jsx";
import Badge from "../components/ui/Badge.jsx";
import MovieCard, { trackRecentlyViewed } from "../components/MovieCard.jsx";
import { formatDuration } from "../utils/formatters.js";
import { getMovieById, getMovies } from "../api/movieApi.js";
import { getTheaters } from "../api/theaterApi.js";
import { useBooking } from "../state/bookingContext.jsx";
import { useLocationCity } from "../state/locationContext.jsx";
const REAL_ACTOR_PHOTOS = {
  // Hollywood Stars
  "milly alcock": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop",
  "jason momoa": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop",
  "matthias schoenaerts": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop",
  "eve ridley": "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop",
  "cillian murphy": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&auto=format&fit=crop",
  "leonardo dicaprio": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop",
  "timothée chalamet": "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300&auto=format&fit=crop",
  "timothee chalamet": "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300&auto=format&fit=crop",
  "ryan reynolds": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&auto=format&fit=crop",
  "hugh jackman": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop",
  "zendaya": "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=300&auto=format&fit=crop",
  "tom holland": "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300&auto=format&fit=crop",
  "scarlett johansson": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop",
  "margot robbie": "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop",
  "florence pugh": "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=300&auto=format&fit=crop",
  "robert downey": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop",
  "christian bale": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop",
  "heath ledger": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&auto=format&fit=crop",
  "al pacino": "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=300&auto=format&fit=crop",
  "marlon brando": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop",
  "morgan freeman": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop",
  "tim robbins": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&auto=format&fit=crop",

  // Indian Stars
  "shah rukh khan": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop",
  "prabhas": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop",
  "deepika padukone": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop",
  "ranbir kapoor": "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300&auto=format&fit=crop",
  "ranveer singh": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop",
  "allu arjun": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&auto=format&fit=crop",
  "jr ntr": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop",
  "ram charan": "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300&auto=format&fit=crop",
  "vijay": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop",
  "rashmika mandanna": "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop",
  "kiara advani": "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=300&auto=format&fit=crop",
  "alia bhatt": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop",

  // Directors & Filmmakers
  "christopher nolan": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop",
  "denis villeneuve": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop",
  "james cameron": "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=300&auto=format&fit=crop",
  "ss rajamouli": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop",
  "s.s. rajamouli": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop",
  "quentin tarantino": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&auto=format&fit=crop",
  "steven spielberg": "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=300&auto=format&fit=crop",
};

function getCastAvatar(actor) {
  if (!actor) return "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop";

  if (typeof actor === "object") {
    if (actor.photoUrl || actor.photo || actor.profilePath || actor.image) {
      return actor.photoUrl || actor.photo || actor.profilePath || actor.image;
    }
  }

  const name = typeof actor === "object" ? actor.name || "Actor" : actor;
  const lower = name.toLowerCase();

  for (const [key, url] of Object.entries(REAL_ACTOR_PHOTOS)) {
    if (lower.includes(key) || key.includes(lower)) return url;
  }

  // Portrait fallback gallery based on character code hashing
  const fallbackGallery = [
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=300&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&auto=format&fit=crop",
  ];

  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % fallbackGallery.length;
  return fallbackGallery[index];
}

export default function MovieDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const booking = useBooking();
  const loc = useLocationCity();

  const [movie, setMovie] = useState(null);
  const [moviesList, setMoviesList] = useState([]);
  const [theatersList, setTheatersList] = useState([]);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    getMovieById(id).then((data) => {
      if (data) setMovie(data);
    });
    getMovies().then((list) => {
      if (Array.isArray(list)) setMoviesList(list);
    });
    getTheaters().then((list) => {
      if (Array.isArray(list)) setTheatersList(list);
    });
  }, [id]);

  const [selectedDate, setSelectedDate] = useState("Today");

  const backdropSrc =
    movie?.backdropUrl || movie?.hero?.backdrop || "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1200";
  const posterSrc =
    movie?.posterUrl || movie?.hero?.poster || movie?.poster || "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=600";
  const trailerUrl = movie?.trailerUrl || movie?.hero?.trailer;

  // Similar movies in same genre
  const similarMovies = useMemo(() => {
    if (!movie) return [];
    return moviesList
      .filter((m) => m.id !== movie.id && m.genre?.some((g) => movie.genre?.includes(g)))
      .slice(0, 6);
  }, [movie, moviesList]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: movie?.title, url: window.location.href }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!movie) {
    return (
      <div className="mx-auto w-full max-w-6xl px-4 py-20 text-center">
        <Card className="p-12 flex flex-col items-center max-w-lg mx-auto">
          <h2 className="text-2xl font-extrabold text-[#111827]">
            Movie Not Found
          </h2>
          <p className="mt-2 text-sm text-[#6B7280]">
            The requested movie could not be found or may have been updated.
          </p>
          <Button as={Link} to="/movies" className="mt-6" variant="secondary">
            <ArrowLeft className="h-4 w-4" />
            Back to All Movies
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Back Link */}
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 text-xs font-extrabold text-slate-500 hover:text-slate-900 transition cursor-pointer"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Browse
      </button>

      {/* BookMyShow Style Banner Container */}
      <section className="relative overflow-hidden rounded-[26px] bg-[#0F172A] text-white shadow-2xl border border-slate-800">
        {/* Top Right Share Button */}
        <button
          type="button"
          onClick={handleShare}
          className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20 flex items-center gap-2 rounded-xl bg-slate-900/60 hover:bg-slate-900/90 text-white backdrop-blur-md px-3.5 py-1.5 text-xs font-bold border border-white/15 transition shadow-lg cursor-pointer"
        >
          <Share2 className="h-3.5 w-3.5 text-slate-300" />
          <span>{copied ? "Copied Link!" : "Share"}</span>
        </button>

        {/* Cinematic Backdrop Image with Side Vignette Gradient */}
        <div className="absolute inset-0 z-0">
          <img
            src={backdropSrc}
            alt={movie.title}
            className="h-full w-full object-cover object-right opacity-45 blur-none"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0F172A] via-[#0F172A]/90 to-transparent w-full lg:w-4/5" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-transparent to-transparent" />
        </div>

        <div className="relative z-10 grid gap-6 sm:gap-8 p-5 sm:p-8 lg:p-10 md:grid-cols-[240px_1fr] items-center">
          {/* Left Vertical Poster Container with Trailer Pill & In-Cinemas Strip */}
          <div className="group relative overflow-hidden rounded-[20px] border-2 border-white/15 shadow-2xl bg-slate-950 aspect-[2/3] max-w-[240px] mx-auto md:mx-0">
            <img
              src={posterSrc}
              alt={movie.title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />

            {/* Middle Trailer Button Overlay */}
            {trailerUrl && (
              <button
                type="button"
                onClick={() => window.open(trailerUrl, "_blank", "noreferrer")}
                className="absolute inset-0 m-auto h-9 w-28 flex items-center justify-center gap-1.5 rounded-full bg-slate-950/70 hover:bg-[#FF1744] text-white border border-white/20 backdrop-blur-md text-xs font-bold transition shadow-xl cursor-pointer"
              >
                <Play className="h-3.5 w-3.5 fill-current text-white" />
                <span>Trailer</span>
              </button>
            )}

            {/* Bottom Strip: In Cinemas */}
            <div className="absolute bottom-0 inset-x-0 bg-black/90 py-1.5 text-center text-[11px] font-extrabold text-slate-300 tracking-wider uppercase">
              In cinemas
            </div>
          </div>

          {/* Details Content Column */}
          <div className="space-y-4">
            {/* Title */}
            <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-extrabold text-white tracking-tight leading-tight font-heading">
              {movie.title}
            </h1>

            {/* Rating Box Container (BookMyShow Rating Box) */}
            <div className="inline-flex flex-wrap items-center gap-3 sm:gap-4 rounded-xl bg-slate-950/70 border border-white/15 p-3 backdrop-blur-md">
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 fill-[#FF1744] text-[#FF1744]" />
                <span className="text-base sm:text-lg font-extrabold text-white">
                  {movie.rating ? `${movie.rating}/10` : "8.5/10"}
                </span>
                <span className="text-xs font-medium text-slate-400">
                  ({movie.votes ? `${(movie.votes / 1000).toFixed(1)}K+` : "12.5K+"} Votes) &gt;
                </span>
              </div>

              <button
                type="button"
                onClick={() => alert("Thank you for submitting your rating!")}
                className="rounded-lg bg-white/10 hover:bg-white/20 px-3 py-1 text-xs font-bold text-white border border-white/20 transition cursor-pointer"
              >
                Rate now
              </button>
            </div>

            {/* Meta Line: Runtime • Genres • Certification • Release Date */}
            <div className="text-xs sm:text-sm font-semibold text-slate-200 flex flex-wrap items-center gap-2">
              <span>{formatDuration(movie.runtimeMins)}</span>
              <span>•</span>
              <span>
                {Array.isArray(movie.genre) && movie.genre.length > 0
                  ? movie.genre.join(", ")
                  : "Action, Drama, Thriller"}
              </span>
              <span>•</span>
              <span className="font-extrabold text-white">{movie.certification || "UA"}</span>
              <span>•</span>
              <span>{movie.release || "23 Jul, 2026"}</span>
            </div>

            {/* Format & Language Badges */}
            <div className="flex flex-wrap items-center gap-2 pt-0.5">
              {movie.format && movie.format.length > 0 ? (
                movie.format.map((fmt) => (
                  <span
                    key={fmt}
                    className="rounded-md bg-white/15 px-2.5 py-0.5 text-xs font-extrabold text-white border border-white/10 uppercase"
                  >
                    {fmt}
                  </span>
                ))
              ) : (
                <span className="rounded-md bg-white/15 px-2.5 py-0.5 text-xs font-extrabold text-white border border-white/10 uppercase">
                  2D
                </span>
              )}

              <span className="rounded-md bg-white/15 px-2.5 py-0.5 text-xs font-extrabold text-white border border-white/10">
                {movie.language || "Hindi"}
              </span>
            </div>

            {/* Synopsis Overview */}
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl font-normal line-clamp-2 pt-1">
              {movie.synopsis}
            </p>

            {/* Primary Action Button: Book Tickets */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  trackRecentlyViewed(movie.id);
                  booking.setMovie(movie);
                  navigate(`/movies/${movie.id}/theaters`);
                }}
                className="inline-flex items-center gap-2.5 rounded-xl bg-[#FF1744] hover:bg-[#D50000] text-white px-8 py-3.5 text-sm sm:text-base font-extrabold shadow-lg shadow-red-500/30 transition transform active:scale-98 cursor-pointer"
              >
                <Ticket className="h-5 w-5 stroke-[2.2]" />
                <span>Book tickets</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* QUICK SHOWTIMES & THEATER SELECTION STRIP */}
      <Card className="p-4 bg-white border border-[#E5E7EB] shadow-md shadow-slate-200/50 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-2.5">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-[#FF1744]" />
            <h3 className="text-base font-extrabold text-[#111827]">
              Instant Showtimes in {loc.city}
            </h3>
          </div>

          {/* Date Selector Chips */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            {["Today", "Tomorrow", "Fri, 30 Jul", "Sat, 31 Jul"].map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setSelectedDate(d)}
                className={`rounded-full px-3.5 py-1 text-xs font-extrabold transition cursor-pointer ${
                  selectedDate === d
                    ? "bg-[#FF1744] text-white shadow-sm"
                    : "bg-slate-100 text-[#6B7280] hover:bg-slate-200"
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        {/* Theater Slots Grid */}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {theatersList.slice(0, 3).map((t) => (
            <div
              key={t.id}
              className="flex items-center justify-between rounded-xl bg-slate-50 p-2.5 sm:p-3 border border-slate-200/70 hover:border-red-200 transition"
            >
              <div>
                <div className="text-xs font-extrabold text-[#111827] truncate max-w-[160px] sm:max-w-[200px]">
                  {t.name}
                </div>
                <div className="text-[10px] font-bold text-[#6B7280]">
                  {t.facilities?.slice(0, 2).join(" • ")}
                </div>
              </div>

              <Button
                size="xs"
                variant="primary"
                onClick={() => {
                  trackRecentlyViewed(movie.id);
                  booking.setMovie(movie);
                  navigate(`/movies/${movie.id}/theaters`);
                }}
              >
                Book
              </Button>
            </div>
          ))}
        </div>
      </Card>

      {/* RATINGS, CAST & SPECS GRID */}
      <div className="grid gap-4 md:grid-cols-12">
        {/* Ratings & Approval Breakdown */}
        <Card className="md:col-span-4 p-4 sm:p-5 bg-white border border-[#E5E7EB] shadow-md shadow-slate-200/50 space-y-3.5">
          <div className="flex items-center gap-2 text-base font-extrabold text-[#111827]">
            <Award className="h-4.5 w-4.5 text-amber-500" />
            <span>Audience Score & Critics</span>
          </div>

          <div className="grid grid-cols-2 gap-2.5 text-center">
            <div className="rounded-xl bg-amber-50/80 p-2.5 border border-amber-200/60">
              <div className="text-xl sm:text-2xl font-extrabold text-amber-700 flex items-center justify-center gap-1">
                <Star className="h-5 w-5 fill-amber-500 text-amber-500" />
                {movie.rating}
              </div>
              <div className="text-[10px] font-extrabold text-amber-800 uppercase mt-0.5">
                IMDb Rating
              </div>
            </div>

            <div className="rounded-xl bg-red-50/80 p-2.5 border border-red-200/60">
              <div className="text-xl sm:text-2xl font-extrabold text-[#FF1744] flex items-center justify-center gap-1">
                <ThumbsUp className="h-5 w-5 fill-[#FF1744]" />
                94%
              </div>
              <div className="text-[10px] font-extrabold text-red-800 uppercase mt-0.5">
                Audience Liked
              </div>
            </div>
          </div>

          {/* Technical Specs List */}
          <div className="space-y-1.5 pt-2 border-t border-slate-100 text-xs font-bold text-slate-500">
            <div className="flex justify-between">
              <span>Audio Formats:</span>
              <span className="text-[#111827]">Dolby Atmos, 7.1 Surround</span>
            </div>
            <div className="flex justify-between">
              <span>Subtitles:</span>
              <span className="text-[#111827]">English, Hindi</span>
            </div>
            <div className="flex justify-between">
              <span>Aspect Ratio:</span>
              <span className="text-[#111827]">2.39:1 / IMAX 1.90:1</span>
            </div>
          </div>
        </Card>

        {/* Star Cast with Enriched & Prominent Photo Avatars */}
        <Card className="md:col-span-5 p-3.5 sm:p-4 bg-white border border-[#E5E7EB] shadow-md shadow-slate-200/50 space-y-3">
          <div className="flex items-center gap-2 text-base font-extrabold text-[#111827]">
            <Users className="h-4.5 w-4.5 text-[#FF1744]" />
            <span>Star Cast</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {movie.cast?.map((actor, i) => (
              <div
                key={i}
                className="flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-slate-50 p-2.5 hover:bg-slate-100/90 transition group shadow-2xs"
              >
                <img
                  src={getCastAvatar(actor)}
                  alt={actor}
                  className="h-14 w-14 sm:h-16 sm:w-16 rounded-2xl object-cover border-2 border-red-500/20 group-hover:border-[#FF1744] transition shadow-md shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <div className="text-xs sm:text-sm font-extrabold text-[#111827] truncate group-hover:text-[#FF1744] transition">
                    {actor}
                  </div>
                  <div className="text-[11px] font-bold text-slate-500 truncate mt-0.5">
                    Lead Actor
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Crew & Director with Enriched Avatars */}
        <Card className="md:col-span-3 p-3.5 sm:p-4 bg-white border border-[#E5E7EB] shadow-md shadow-slate-200/50 space-y-3">
          <div className="flex items-center gap-2 text-base font-extrabold text-[#111827]">
            <Clapperboard className="h-4.5 w-4.5 text-cyan-600" />
            <span>Director & Crew</span>
          </div>

          <div className="space-y-2.5">
            {movie.crew?.map((member, i) => (
              <div
                key={i}
                className="flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-slate-50 p-2.5 hover:bg-slate-100/90 transition group shadow-2xs"
              >
                <img
                  src={getCastAvatar(member)}
                  alt={member}
                  className="h-12 w-12 sm:h-14 sm:w-14 rounded-2xl object-cover border-2 border-cyan-500/20 group-hover:border-cyan-500 transition shadow-md shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <div className="text-xs sm:text-sm font-extrabold text-[#111827] truncate">
                    {member}
                  </div>
                  <div className="text-[11px] font-bold text-cyan-600 truncate mt-0.5">
                    Filmmaker
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* MORE LIKE THIS (RECOMMENDED MOVIES GRID) */}
      {similarMovies.length > 0 && (
        <section className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Film className="h-4.5 w-4.5 text-[#FF1744]" />
              <h2 className="section-title text-[#111827]">More Like This</h2>
            </div>
            <Link
              to="/movies"
              className="text-xs font-extrabold text-[#FF1744] hover:underline"
            >
              View All
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6">
            {similarMovies.map((m) => (
              <MovieCard key={m.id} movie={m} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}


