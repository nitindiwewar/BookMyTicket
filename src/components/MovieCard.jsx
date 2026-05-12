import { memo, useState } from "react";
import { Link } from "react-router-dom";
import Button from "./ui/Button.jsx";
import Card from "./ui/Card.jsx";
import { formatRating } from "../utils/formatters.js";

function formatVotes(votes) {
  if (!votes) return "—";
  if (votes >= 100000) return `${(votes / 1000).toFixed(1)}K`;
  if (votes >= 1000) return `${(votes / 1000).toFixed(1)}K`;
  return String(votes);
}

/**
 * MovieCard component for displaying movie information
 * Enhanced with loading states, error handling, and improved styling
 * @component
 * @param {Object} props
 * @param {Object} props.movie - Movie data object
 * @returns {JSX.Element}
 */
function MovieCard({ movie }) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const posterSrc = movie.hero?.poster;
  const fallbackPoster =
    "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&h=600&fit=crop";
  const displaySrc = imageError ? fallbackPoster : posterSrc || fallbackPoster;

  const title = movie.title ?? "Untitled movie";
  const genreText = movie.genre?.join(" / ") ?? "";

  return (
    <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-[0_8px_32px_rgba(0,0,0,0.4)] hover:border-white/20 hover:-translate-y-1 flex flex-col">
      <Link to={`/movies/${movie.id}`} className="block">
        <div className="relative aspect-2/3 overflow-hidden rounded-lg">
          {/* Shimmer loading effect */}
          {!imageLoaded && (
            <div className="absolute inset-0 bg-linear-to-r from-white/5 via-white/10 to-white/5 animate-shimmer z-20" />
          )}

          <img
            src={displaySrc}
            alt={`${title} poster`}
            className={`h-full w-full object-cover transition-all duration-700 group-hover:scale-105 ${
              imageLoaded ? "opacity-100" : "opacity-0"
            }`}
            loading="lazy"
            decoding="async"
            width="400"
            height="600"
            onLoad={() => setImageLoaded(true)}
            onError={() => {
              setImageError(true);
              setImageLoaded(true);
            }}
          />
        </div>
      </Link>

      {/* Title Section */}
      <div className="flex-1 flex flex-col p-3 gap-2">
        <Link to={`/movies/${movie.id}`}>
          <div className="text-base font-bold text-white leading-snug hover:text-white/80 transition-colors line-clamp-2">
            {title}
          </div>
        </Link>

        <div className="text-xs text-white/70">{genreText || "Unknown"}</div>
      </div>

      {/* Bottom rating bar */}
      <div className="flex items-center justify-between gap-2 p-3 border-t border-white/10 bg-white/0.03">
        <div className="flex items-center gap-2">
          <svg
            className="w-4 h-4 text-yellow-400"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          <div className="flex items-center gap-1 text-xs">
            <span className="font-bold text-yellow-400">
              {formatRating(movie.rating)}
            </span>
            <span className="text-white/50">
              {formatVotes(movie.votes)} Votes
            </span>
          </div>
        </div>

        <Button
          as={Link}
          to={`/movies/${movie.id}`}
          size="sm"
          variant="subtle"
          className="py-1 px-2 text-10px hover:bg-white/15"
        >
          Book
        </Button>
      </div>
    </Card>
  );
}

export default memo(MovieCard);
