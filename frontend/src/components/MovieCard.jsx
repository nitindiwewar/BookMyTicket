import { useState, useEffect, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Star, Clock, Bookmark, Heart, Check, Sparkles } from "lucide-react";
import { useBooking } from "../state/bookingContext.jsx";

const RECENT_KEY = "movieticket-recent-movies";
const FALLBACK_POSTER =
  "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=600&auto=format&fit=crop";

export function trackRecentlyViewed(movieId) {
  try {
    const raw = localStorage.getItem(RECENT_KEY);
    let list = raw ? JSON.parse(raw) : [];
    list = [movieId, ...list.filter((id) => id !== movieId)].slice(0, 8);
    localStorage.setItem(RECENT_KEY, JSON.stringify(list));
  } catch {
    // ignore
  }
}

function MovieCard({ movie, priority = false, titleColor = "default" }) {
  const navigate = useNavigate();
  const posterPath = movie?.posterUrl || movie?.poster || movie?.hero?.poster || FALLBACK_POSTER;
  const [imgSrc, setImgSrc] = useState(posterPath);

  useEffect(() => {
    setImgSrc(movie?.posterUrl || movie?.poster || movie?.hero?.poster || FALLBACK_POSTER);
  }, [movie]);

  if (!movie) return null;

  const handleCardClick = (e) => {
    trackRecentlyViewed(movie.id);
    navigate(`/movies/${movie.id}`);
  };

  const isTrending = movie.releaseStatus === "Trending" || movie.release === "Trending" || movie.rating >= 4.6;

  // Title color handler mapping
  const getTitleColorClass = () => {
    switch (titleColor) {
      case "primary":
        return "text-[#FF1744] font-extrabold group-hover:text-[#D50000]";
      case "gradient":
        return "bg-gradient-to-r from-[#FF1744] via-[#FF4F6D] to-[#E60023] bg-clip-text text-transparent font-extrabold";
      case "amber":
        return "text-amber-500 font-extrabold group-hover:text-amber-600";
      case "blue":
        return "text-blue-600 font-extrabold group-hover:text-indigo-600";
      case "light":
        return "text-slate-100 group-hover:text-white font-extrabold";
      default:
        return "text-[#0F172A] font-extrabold group-hover:text-[#FF1744]";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-20px" }}
      whileHover={{ y: -6, scale: 1.01 }}
      transition={{ duration: 0.25, ease: [0.25, 1, 0.5, 1] }}
      onClick={handleCardClick}
      className="group relative flex flex-col overflow-hidden rounded-[20px] bg-white border border-slate-200/80 shadow-sm hover:shadow-xl hover:shadow-slate-300/60 hover:border-slate-300 transition-all duration-300 cursor-pointer"
    >
      {/* Clean Poster Container */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-slate-900">
        <img
          src={imgSrc}
          alt={movie.title}
          onError={() => setImgSrc(FALLBACK_POSTER)}
          loading={priority ? "eager" : "lazy"}
          className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />

        {/* Subtle overlay gradient at bottom of poster */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Optional Format / Status Badge on Poster Bottom */}
        <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between z-10">
          {isTrending && (
            <span className="inline-flex items-center gap-1 rounded-full bg-[#FF1744] px-2.5 py-0.5 text-[10px] font-extrabold text-white shadow-md">
              <Sparkles className="h-2.5 w-2.5" />
              TRENDING
            </span>
          )}

          {movie.format?.length > 0 && (
            <span className="inline-flex items-center rounded-full bg-slate-900/80 backdrop-blur-md px-2 py-0.5 text-[10px] font-extrabold text-cyan-300 border border-cyan-500/20 ml-auto">
              {movie.format[0]}
            </span>
          )}
        </div>
      </div>

      {/* Clean Typography & Details Section */}
      <div className="flex flex-1 flex-col justify-between p-3.5 sm:p-4 space-y-1.5 bg-white">
        <div>
          {/* Movie Title with Custom Color & Hover State */}
          <h3 className={`text-base sm:text-lg tracking-tight transition-colors duration-200 line-clamp-1 ${getTitleColorClass()}`}>
            {movie.title}
          </h3>

          {/* Genre / Subtitle */}
          <p className="text-xs sm:text-sm font-medium text-slate-500 line-clamp-1 mt-0.5">
            {Array.isArray(movie.genre) && movie.genre.length > 0
              ? movie.genre.slice(0, 2).join(" • ")
              : movie.language || "Movie"}
          </p>
        </div>

        {/* Metadata Footer: Language & Duration */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs font-semibold text-slate-500">
          <span className="text-slate-700 font-bold">{movie.language || "English"}</span>
          
          <div className="flex items-center gap-1 text-slate-500">
            <Clock className="h-3.5 w-3.5 text-slate-400" />
            <span>{movie.runtimeMins ? `${movie.runtimeMins}m` : "145m"}</span>
          </div>

          <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold uppercase text-slate-600">
            {movie.certification || "UA"}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

export default memo(MovieCard);

