import { useState, useEffect } from "react";
import { Search, Film, Download, CheckCircle2, Loader2, X, Sparkles, Star, Calendar } from "lucide-react";
import Button from "../ui/Button.jsx";
import { searchTmdbMovies, getNowPlayingTmdbMovies, importTmdbMovie, syncPopularTmdbMovies } from "../../api/tmdbApi.js";

export default function TmdbImportModal({ isOpen, onClose, onMovieImported }) {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [importingId, setImportingId] = useState(null);
  const [importedIds, setImportedIds] = useState(new Set());
  const [syncing, setSyncing] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (isOpen) {
      loadNowPlaying();
    }
  }, [isOpen]);

  const loadNowPlaying = async () => {
    setLoading(true);
    try {
      const res = await getNowPlayingTmdbMovies();
      if (res?.data) {
        setMovies(res.data);
      }
    } catch (err) {
      console.error("Failed to load TMDB movies:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await searchTmdbMovies(query);
      if (res?.data) {
        setMovies(res.data);
      }
    } catch (err) {
      console.error("Failed to search TMDB:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleImport = async (movie) => {
    setImportingId(movie.id);
    setMessage("");
    try {
      const res = await importTmdbMovie(movie.id);
      if (res?.data) {
        setImportedIds((prev) => new Set([...prev, movie.id]));
        setMessage(`Successfully imported "${movie.title}" into database with showtimes!`);
        if (onMovieImported) onMovieImported(res.data);
      }
    } catch (err) {
      setMessage("Error importing movie: " + (err.message || "Failed"));
    } finally {
      setImportingId(null);
    }
  };

  const handleSyncPopular = async () => {
    setSyncing(true);
    setMessage("");
    try {
      const res = await syncPopularTmdbMovies();
      if (res?.data) {
        setMessage(`Synced ${res.data.length} trending movies into the booking database!`);
        const ids = res.data.map((m) => {
          const numId = m.id.replace("tmdb-", "");
          return parseInt(numId, 10);
        });
        setImportedIds((prev) => new Set([...prev, ...ids]));
        if (onMovieImported) onMovieImported();
      }
    } catch (err) {
      setMessage("Sync error: " + (err.message || "Failed"));
    } finally {
      setSyncing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-slate-200">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 bg-gradient-to-r from-slate-900 via-slate-800 to-red-950 text-white border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-red-600/30 rounded-2xl border border-red-500/30">
              <Film className="w-6 h-6 text-red-400" />
            </div>
            <div>
              <h2 className="text-xl font-black tracking-tight flex items-center gap-2">
                TMDB Live Movie Catalog
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/30 font-semibold">
                  Live API & Demo Mode
                </span>
              </h2>
              <p className="text-xs text-slate-300 mt-0.5">
                Search, fetch live posters, trailers, and import movies with automated showtime scheduling.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-full hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action & Search Bar */}
        <div className="p-6 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <form onSubmit={handleSearch} className="flex-1 w-full flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search TMDB titles (e.g. Inception, Dune, Avatar...)"
                className="w-full pl-10 pr-4 py-2.5 bg-white rounded-xl border border-slate-300 text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
            <Button type="submit" variant="primary" size="md">
              Search
            </Button>
          </form>

          <Button
            type="button"
            variant="secondary"
            size="md"
            onClick={handleSyncPopular}
            disabled={syncing}
            className="w-full sm:w-auto text-xs font-bold"
          >
            {syncing ? (
              <Loader2 className="w-4 h-4 animate-spin text-red-600" />
            ) : (
              <Sparkles className="w-4 h-4 text-amber-500" />
            )}
            <span>Bulk Sync Popular</span>
          </Button>
        </div>

        {/* Status Message */}
        {message && (
          <div className="px-6 py-3 bg-emerald-50 text-emerald-800 text-xs font-semibold border-b border-emerald-200 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              {message}
            </span>
            <button onClick={() => setMessage("")} className="text-emerald-600 hover:underline">Dismiss</button>
          </div>
        )}

        {/* Movies Catalog Grid */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 max-h-[55vh]">
          {loading ? (
            <div className="py-20 text-center flex flex-col items-center justify-center space-y-3">
              <Loader2 className="w-10 h-10 text-red-600 animate-spin" />
              <p className="text-sm font-medium text-slate-600">Fetching movies from TMDB...</p>
            </div>
          ) : movies.length === 0 ? (
            <div className="py-16 text-center space-y-2">
              <Film className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-700">No TMDB movies found</h3>
              <p className="text-xs text-slate-500">Try searching for a different movie title.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {movies.map((movie) => {
                const isImported = importedIds.has(movie.id);
                const isImporting = importingId === movie.id;

                return (
                  <div
                    key={movie.id}
                    className="flex bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition p-3 gap-3"
                  >
                    <img
                      src={movie.posterPath}
                      alt={movie.title}
                      className="w-24 h-36 object-cover rounded-xl bg-slate-100 flex-shrink-0"
                    />
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-1">
                          <h4 className="text-sm font-black text-slate-900 line-clamp-1">
                            {movie.title}
                          </h4>
                          <span className="flex items-center gap-1 text-[11px] font-extrabold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200/60">
                            <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                            {movie.voteAverage ? movie.voteAverage.toFixed(1) : "N/A"}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-1">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-slate-400" />
                            {movie.releaseDate ? movie.releaseDate.split("-")[0] : "2024"}
                          </span>
                          <span>•</span>
                          <span className="uppercase text-[10px] font-bold tracking-wider bg-slate-100 px-1.5 py-0.5 rounded">
                            {movie.originalLanguage || "EN"}
                          </span>
                        </div>

                        <p className="text-xs text-slate-600 line-clamp-2 mt-2 leading-relaxed">
                          {movie.overview}
                        </p>
                      </div>

                      <div className="mt-3 flex items-center justify-end">
                        {isImported ? (
                          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Imported & Scheduled
                          </span>
                        ) : (
                          <Button
                            size="sm"
                            variant="primary"
                            disabled={isImporting}
                            onClick={() => handleImport(movie)}
                            className="text-xs font-bold px-3 py-1.5"
                          >
                            {isImporting ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <Download className="w-3.5 h-3.5" />
                            )}
                            <span>Import Movie</span>
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-100 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>Powered by TMDB API Integration</span>
          <Button variant="secondary" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>

      </div>
    </div>
  );
}
