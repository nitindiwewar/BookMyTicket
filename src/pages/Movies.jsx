import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import MovieCard from "../components/MovieCard.jsx";
import Card from "../components/ui/Card.jsx";
import movies, { genres, languages } from "../data/movies.js";
import { getUnique, parseNumber } from "../utils/formatters.js";

export default function Movies() {
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const q = (params.get("q") || "").trim();
  const [query, setQuery] = useState(q);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [minRating, setMinRating] = useState(0);
  const [format, setFormat] = useState("All"); // All | 2D | IMAX | 4DX
  const [sort, setSort] = useState("popular"); // popular | rating | title

  const formats = useMemo(() => {
    return ["All", ...getUnique(movies.flatMap((m) => m.format))];
  }, []);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    let list = movies.filter((m) => {
      if (needle) {
        const text = `${m.title} ${m.language} ${m.genre.join(" ")} ${m.release}`;
        if (!text.toLowerCase().includes(needle)) return false;
      }
      if (selectedLanguages.length && !selectedLanguages.includes(m.language))
        return false;
      if (
        selectedGenres.length &&
        !selectedGenres.some((g) => m.genre.includes(g))
      )
        return false;
      if (format !== "All" && !m.format.includes(format)) return false;
      if (minRating && m.rating < minRating) return false;
      return true;
    });

    if (sort === "rating") list = list.sort((a, b) => b.rating - a.rating);
    if (sort === "title")
      list = list.sort((a, b) => a.title.localeCompare(b.title));
    if (sort === "popular") list = list.sort((a, b) => b.votes - a.votes);
    return list;
  }, [format, minRating, query, selectedGenres, selectedLanguages, sort]);

  return (
    <div className="mx-auto w-full max-w-7xl px-2 py-8 sm:px-3">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white sm:text-3xl">
            Movies
          </h1>
          <p className="mt-1 text-sm text-white/60">
            Browse titles, filter by language/genre/rating, and book in a few
            clicks.
          </p>
        </div>

        <form
          className="w-full md:max-w-md"
          onSubmit={(e) => {
            e.preventDefault();
            const next = query.trim();
            setParams(next ? { q: next } : {});
          }}
        >
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search movies…"
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/40 outline-none transition focus:border-white/20 focus:bg-white/10"
          />
        </form>
      </div>

      <div className="mt-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white/80 transition hover:bg-white/10 hover:text-white"
            onClick={() => setFiltersOpen((v) => !v)}
          >
            {filtersOpen ? "Hide Filters" : "Filters"}
            <span className="text-white/50">{filtersOpen ? "⌃" : "⌄"}</span>
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white px-4 py-2.5 text-sm font-semibold text-black transition hover:bg-white/90"
            onClick={() => {
              const pool = filtered.length ? filtered : movies;
              const pick = pool[Math.floor(Math.random() * pool.length)];
              if (pick) navigate(`/movies/${pick.id}`);
            }}
          >
            Surprise Me
          </button>
        </div>
        <div className="text-sm text-white/60">
          <span className="text-white">{filtered.length}</span> results
        </div>
      </div>

      <div
        className={[
          "mt-6 grid gap-4",
          filtersOpen ? "lg:grid-cols-[320px_1fr]" : "lg:grid-cols-1",
        ].join(" ")}
      >
        {/* Sidebar filters (all screens when opened) */}
        {filtersOpen ? (
          <Card className="p-4">
            <div className="text-sm font-semibold text-white">Filters</div>

            <div className="mt-4">
              <div className="text-xs font-semibold text-white/70">
                Language
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {languages.map((l) => {
                  const active = selectedLanguages.includes(l);
                  return (
                    <button
                      key={l}
                      type="button"
                      className={[
                        "rounded-full border px-3 py-1 text-xs font-semibold transition",
                        active
                          ? "border-white/25 bg-white text-black"
                          : "border-white/10 bg-white/5 text-white/80 hover:bg-white/10 hover:text-white",
                      ].join(" ")}
                      onClick={() =>
                        setSelectedLanguages((s) =>
                          active ? s.filter((x) => x !== l) : [...s, l],
                        )
                      }
                    >
                      {l}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-5">
              <div className="text-xs font-semibold text-white/70">Genre</div>
              <div className="mt-2 flex flex-wrap gap-2">
                {genres.map((g) => {
                  const active = selectedGenres.includes(g);
                  return (
                    <button
                      key={g}
                      type="button"
                      className={[
                        "rounded-full border px-3 py-1 text-xs font-semibold transition",
                        active
                          ? "border-white/25 bg-white text-black"
                          : "border-white/10 bg-white/5 text-white/80 hover:bg-white/10 hover:text-white",
                      ].join(" ")}
                      onClick={() =>
                        setSelectedGenres((s) =>
                          active ? s.filter((x) => x !== g) : [...s, g],
                        )
                      }
                    >
                      {g}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <label className="block">
                <div className="text-xs font-semibold text-white/70">
                  Format
                </div>
                <select
                  value={format}
                  onChange={(e) => setFormat(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none transition focus:border-white/20"
                >
                  {formats.map((f) => (
                    <option key={f} value={f} className="bg-black">
                      {f}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block">
                <div className="text-xs font-semibold text-white/70">
                  Min rating
                </div>
                <select
                  value={minRating}
                  onChange={(e) =>
                    setMinRating(parseNumber(e.target.value) || 0)
                  }
                  className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none transition focus:border-white/20"
                >
                  {[0, 3.5, 4.0, 4.2, 4.5].map((r) => (
                    <option key={r} value={r} className="bg-black">
                      {r ? `${r}+` : "Any"}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="mt-5">
              <div className="text-xs font-semibold text-white/70">Sort</div>
              <div className="mt-2 grid grid-cols-3 gap-2">
                {[
                  { id: "popular", label: "Popular" },
                  { id: "rating", label: "Rating" },
                  { id: "title", label: "Title" },
                ].map((s) => {
                  const active = sort === s.id;
                  return (
                    <button
                      key={s.id}
                      type="button"
                      className={[
                        "rounded-xl border px-3 py-2 text-xs font-semibold transition",
                        active
                          ? "border-white/25 bg-white text-black"
                          : "border-white/10 bg-white/5 text-white/80 hover:bg-white/10 hover:text-white",
                      ].join(" ")}
                      onClick={() => setSort(s.id)}
                    >
                      {s.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </Card>
        ) : null}

        <div>
          <div className="mb-3 text-sm text-white/60">
            Showing <span className="text-white">{filtered.length}</span>{" "}
            results
          </div>

          {filtered.length ? (
            <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {filtered.map((m) => (
                <MovieCard key={m.id} movie={m} />
              ))}
            </div>
          ) : (
            <Card className="p-6">
              <div className="text-sm font-semibold text-white">
                No matches found
              </div>
              <div className="mt-1 text-sm text-white/60">
                Try removing filters or searching with a different term.
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
