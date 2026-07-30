import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Sparkles, SlidersHorizontal, Search, RotateCcw, Filter, Film } from "lucide-react";
import MovieCard from "../components/MovieCard.jsx";
import Card from "../components/ui/Card.jsx";
import Button from "../components/ui/Button.jsx";
import Input from "../components/ui/Input.jsx";
import PageHeader from "../components/common/PageHeader.jsx";
import EmptyState from "../components/common/EmptyState.jsx";
import TmdbImportModal from "../components/common/TmdbImportModal.jsx";
import { getMovies } from "../api/movieApi.js";
import { syncPopularTmdbMovies } from "../api/tmdbApi.js";
import { getUnique } from "../utils/formatters.js";

const DEFAULT_GENRES = ["Action", "Adventure", "Comedy", "Crime", "Drama", "Fantasy", "Horror", "Mystery", "Romance", "Sci-Fi", "Sports", "Thriller"];
const DEFAULT_LANGUAGES = ["Hindi", "English", "Tamil", "Telugu", "Kannada", "Malayalam"];


export default function Movies() {
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const q = (params.get("q") || "").trim();
  const filterParam = (params.get("filter") || params.get("status") || "").trim().toLowerCase();
  const [query, setQuery] = useState(q);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [tmdbModalOpen, setTmdbModalOpen] = useState(false);
  const [movies, setMovies] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadMoviesList = async () => {
    try {
      setRefreshing(true);
      let data = await getMovies();
      let list = Array.isArray(data) ? data : (data?.data && Array.isArray(data.data) ? data.data : []);
      if (list.length < 20) {
        const syncRes = await syncPopularTmdbMovies();
        if (syncRes?.data && Array.isArray(syncRes.data) && syncRes.data.length > 0) {
          list = syncRes.data;
        } else {
          data = await getMovies();
          list = Array.isArray(data) ? data : (data?.data && Array.isArray(data.data) ? data.data : []);
        }
      }
      setMovies(list);
    } catch (err) {
      console.error("Failed to load movies list:", err);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadMoviesList();
  }, []);

  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [minRating, setMinRating] = useState(0);
  const [format, setFormat] = useState("All");
  const [sort, setSort] = useState("popular");

  const formats = useMemo(() => {
    const allFormats = movies.flatMap((m) => (Array.isArray(m.format) ? m.format : []));
    return ["All", ...getUnique(allFormats)];
  }, [movies]);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    let list = movies.filter((m) => {
      if (filterParam === "upcoming") {
        const isUp = m.releaseStatus === "Upcoming" || m.release === "Upcoming" || m.releaseStatus === "Coming Soon";
        if (!isUp) return false;
      } else if (filterParam === "nowshowing" || filterParam === "now-showing") {
        const isNow = m.releaseStatus === "Now Showing" || m.release === "Now Showing" || !m.releaseStatus || m.releaseStatus === "Released";
        if (!isNow) return false;
      }

      if (needle) {
        const genreStr = Array.isArray(m.genre) ? m.genre.join(" ") : "";
        const text = `${m.title || ""} ${m.language || ""} ${genreStr} ${m.releaseStatus || ""}`;
        if (!text.toLowerCase().includes(needle)) return false;
      }
      if (selectedLanguages.length && !selectedLanguages.includes(m.language))
        return false;
      if (
        selectedGenres.length &&
        (!Array.isArray(m.genre) || !selectedGenres.some((g) => m.genre.includes(g)))
      )
        return false;
      if (format !== "All" && (!Array.isArray(m.format) || !m.format.includes(format))) return false;
      if (minRating && m.rating < minRating) return false;
      return true;
    });

    if (sort === "rating") list = list.sort((a, b) => b.rating - a.rating);
    if (sort === "title")
      list = list.sort((a, b) => a.title.localeCompare(b.title));
    if (sort === "popular") list = list.sort((a, b) => b.votes - a.votes);
    return list;
  }, [filterParam, format, minRating, movies, query, selectedGenres, selectedLanguages, sort]);

  const resetFilters = () => {
    setSelectedLanguages([]);
    setSelectedGenres([]);
    setMinRating(0);
    setFormat("All");
    setSort("popular");
    setQuery("");
    setParams({});
  };

  return (
    <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-[#E5E7EB]">
        <div>
          <h1 className="section-title text-[#111827]">All Movies</h1>
          <p className="subtitle-text mt-1 text-sm">
            Browse all latest cinema releases, filter by language, genre or format, and reserve optimal showtimes.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setFiltersOpen((v) => !v)}
          >
            <Filter className="h-4 w-4 text-[#FF1744]" />
            <span>{filtersOpen ? "Hide Filters" : "Filter Movies"}</span>
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              const pool = filtered.length ? filtered : movies;
              const pick = pool[Math.floor(Math.random() * pool.length)];
              if (pick) navigate(`/movies/${pick.id}`);
            }}
          >
            <Sparkles className="h-4 w-4" />
            <span>Surprise Pick</span>
          </Button>
        </div>
      </div>

      {/* Search Bar & Sort controls */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-white p-4 sm:p-5 rounded-[22px] shadow-md shadow-slate-200/50 border border-[#E5E7EB]">
        <form
          className="w-full sm:max-w-md"
          onSubmit={(e) => {
            e.preventDefault();
            const next = query.trim();
            setParams(next ? { q: next } : {});
          }}
        >
          <Input
            icon={Search}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search titles, actors, genres..."
          />
        </form>

        <div className="flex items-center justify-between sm:justify-end gap-4 text-xs font-bold">
          <div className="flex items-center gap-2">
            <span className="text-[#6B7280]">Sort by:</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="rounded-full bg-slate-100 px-4 py-2 text-[#111827] outline-none font-bold cursor-pointer border border-slate-200"
            >
              <option value="popular">Most Popular</option>
              <option value="rating">Highest Rated</option>
              <option value="title">Title (A-Z)</option>
            </select>
          </div>

          <span className="rounded-full bg-red-50 px-4 py-2 text-[#FF1744] font-extrabold border border-red-200/50">
            {filtered.length} Movies Found
          </span>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-12">
        {/* Filter Drawer / Sidebar */}
        {filtersOpen && (
          <aside className="lg:col-span-3 space-y-6">
            <Card className="p-6 bg-white shadow-md shadow-slate-200/50 border border-[#E5E7EB] space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="text-base font-extrabold text-[#111827]">
                  Refine Movies
                </div>
                <button
                  type="button"
                  onClick={resetFilters}
                  className="flex items-center gap-1 text-xs text-[#FF1744] font-extrabold hover:underline cursor-pointer"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  Reset
                </button>
              </div>

              {/* Language */}
              <div>
                <div className="text-xs font-extrabold text-[#6B7280] uppercase tracking-wider mb-3">
                  Language
                </div>
                <div className="flex flex-col gap-2">
                  {DEFAULT_LANGUAGES.map((l) => {
                    const checked = selectedLanguages.includes(l);
                    return (
                      <label
                        key={l}
                        className={`flex items-center justify-between p-2.5 rounded-xl border text-xs font-medium cursor-pointer transition ${
                          checked
                            ? "border-red-500 bg-red-500/10 text-red-500 font-bold"
                            : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                        }`}
                      >
                        <span>{l}</span>
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() =>
                            setSelectedLanguages((prev) =>
                              prev.includes(l) ? prev.filter((x) => x !== l) : [...prev, l]
                            )
                          }
                          className="h-3.5 w-3.5 rounded-xs accent-red-600"
                        />
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Genre Filter */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Genres
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {DEFAULT_GENRES.map((g) => {
                    const checked = selectedGenres.includes(g);
                    return (
                      <button
                        key={g}
                        type="button"
                        onClick={() =>
                          setSelectedGenres((prev) =>
                            prev.includes(g) ? prev.filter((x) => x !== g) : [...prev, g]
                          )
                        }
                        className={`rounded-full px-3 py-1 text-xs font-medium transition cursor-pointer ${
                          checked
                            ? "bg-red-500 text-white shadow-xs"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        }`}
                      >
                        {g}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Format */}
              <div>
                <div className="text-xs font-extrabold text-[#6B7280] uppercase tracking-wider mb-3">
                  Format
                </div>
                <div className="flex flex-wrap gap-2">
                  {formats.map((f) => {
                    const active = format === f;
                    return (
                      <button
                        key={f}
                        type="button"
                        onClick={() => setFormat(f)}
                        className={`rounded-full px-3.5 py-1.5 text-xs font-extrabold transition cursor-pointer ${
                          active
                            ? "bg-cyan-50 text-cyan-700 border border-cyan-200"
                            : "bg-slate-100 text-[#6B7280] hover:bg-slate-200/80 hover:text-[#111827]"
                        }`}
                      >
                        {f}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Rating */}
              <div>
                <div className="flex items-center justify-between text-xs font-extrabold text-[#6B7280] mb-2">
                  <span>Minimum Rating</span>
                  <span className="text-amber-600">⭐ {minRating}+</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="5"
                  step="0.5"
                  value={minRating}
                  onChange={(e) => setMinRating(parseFloat(e.target.value))}
                  className="w-full accent-[#FF1744] cursor-pointer"
                />
              </div>
            </Card>
          </aside>
        )}

        {/* Responsive Grid: Desktop (6 cards), Tablet (3-4 cards), Mobile (2 cards) */}
        <main className={filtersOpen ? "lg:col-span-9" : "lg:col-span-12"}>
          {filtered.length ? (
            <div
              className={`grid gap-6 ${
                filtersOpen
                  ? "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5"
                  : "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-6 2xl:grid-cols-6"
              }`}
            >
              {filtered.map((movie, idx) => (
                <MovieCard key={movie.id} movie={movie} priority={idx < 6} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No movies match your filters"
              description="Try clearing your language or genre selections to see all available releases."
              actionLabel="Reset All Filters"
              onAction={resetFilters}
            />
          )}
        </main>
      </div>

      <TmdbImportModal
        isOpen={tmdbModalOpen}
        onClose={() => setTmdbModalOpen(false)}
        onMovieImported={() => {
          loadMoviesList();
        }}
      />
    </div>
  );
}

