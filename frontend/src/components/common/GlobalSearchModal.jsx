import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Film, MapPin, Ticket, ArrowRight, X } from "lucide-react";
import Modal from "../ui/Modal.jsx";
import { getMovies } from "../../api/movieApi.js";
import { getTheaters } from "../../api/theaterApi.js";
import { useBooking } from "../../state/bookingContext.jsx";
import { trackRecentlyViewed } from "../MovieCard.jsx";

export default function GlobalSearchModal({ isOpen, onClose }) {
  const [query, setQuery] = useState("");
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const booking = useBooking();
  const [liveMovies, setLiveMovies] = useState([]);
  const [liveTheaters, setLiveTheaters] = useState([]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      getMovies().then((res) => { if (Array.isArray(res)) setLiveMovies(res); }).catch(() => {});
      getTheaters().then((res) => { if (Array.isArray(res)) setLiveTheaters(res); }).catch(() => {});
    } else {
      setQuery("");
    }
  }, [isOpen]);

  const results = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) {
      return { movies: liveMovies.slice(0, 4), theaters: liveTheaters.slice(0, 3) };
    }

    const matchedMovies = liveMovies.filter((m) => {
      const text = `${m.title} ${m.language} ${m.genre?.join(" ")} ${m.certification}`;
      return text.toLowerCase().includes(needle);
    });

    const matchedTheaters = liveTheaters.filter((t) => {
      const text = `${t.name} ${t.area} ${t.facilities?.join(" ")}`;
      return text.toLowerCase().includes(needle);
    });

    return { movies: matchedMovies, theaters: matchedTheaters };
  }, [query, liveMovies, liveTheaters]);

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="" maxW="max-w-2xl">
      <div className="space-y-4">
        {/* Search Header Input */}
        <div className="relative flex items-center">
          <Search className="absolute left-3.5 h-5 w-5 text-slate-400" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search movies, theaters, genres, or formats... (e.g. Action, IMAX, PVR)"
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-10 text-sm font-medium text-slate-900 placeholder-slate-400 outline-hidden transition focus:border-red-500 focus:bg-white focus:ring-3 focus:ring-red-500/10"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-3 grid h-6 w-6 place-items-center rounded-full bg-slate-200 text-slate-600 hover:bg-slate-300"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Results List */}
        <div className="max-h-[60vh] overflow-y-auto space-y-6 pr-1 custom-scrollbar">
          {/* Movies Section */}
          <div>
            <div className="flex items-center justify-between mb-3 px-1">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Film className="h-3.5 w-3.5 text-red-500" />
                Movies {results.movies.length > 0 && `(${results.movies.length})`}
              </h4>
            </div>

            {results.movies.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {results.movies.map((movie) => (
                  <button
                    key={movie.id}
                    onClick={() => {
                      trackRecentlyViewed(movie.id);
                      onClose();
                      navigate(`/movies/${movie.id}`);
                    }}
                    className="flex items-center gap-3 p-2.5 rounded-2xl border border-slate-100 bg-white hover:border-red-200 hover:bg-red-50/30 transition text-left group cursor-pointer"
                  >
                    <img
                      src={movie.posterUrl || movie.poster || movie.hero?.poster}
                      alt={movie.title}
                      className="h-14 w-10 rounded-lg object-cover shadow-xs"
                    />
                    <div className="min-w-0 flex-1">
                      <h5 className="text-xs font-bold text-slate-900 group-hover:text-red-600 transition truncate">
                        {movie.title}
                      </h5>
                      <p className="text-[11px] text-slate-500 mt-0.5 truncate">
                        {movie.language} • {Array.isArray(movie.genre) ? movie.genre.slice(0, 2).join(", ") : movie.genre}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic px-1 py-2">No matching movies found</p>
            )}
          </div>

          {/* Theaters Section */}
          <div>
            <div className="flex items-center justify-between mb-3 px-1">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-red-500" />
                Theaters {results.theaters.length > 0 && `(${results.theaters.length})`}
              </h4>
            </div>

            {results.theaters.length > 0 ? (
              <div className="space-y-2">
                {results.theaters.map((theater) => (
                  <button
                    key={theater.id}
                    onClick={() => {
                      booking.setTheater(theater);
                      onClose();
                      navigate(`/theaters?theaterId=${theater.id}`);
                    }}
                    className="w-full flex items-center justify-between p-3 rounded-2xl border border-slate-100 bg-white hover:border-red-200 hover:bg-red-50/30 transition text-left group cursor-pointer"
                  >
                    <div>
                      <h5 className="text-xs font-bold text-slate-900 group-hover:text-red-600 transition">
                        {theater.name}
                      </h5>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {theater.area || theater.location}
                      </p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-red-500 transition" />
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic px-1 py-2">No matching theaters found</p>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}
