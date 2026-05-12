import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import BookingStepper from "../components/BookingStepper.jsx";
import Button from "../components/ui/Button.jsx";
import Card from "../components/ui/Card.jsx";
import movies from "../data/movies.js";
import { shows, theaters } from "../data/theaters.js";
import { useBooking } from "../state/bookingContext.jsx";

function formatTime(time) {
  const [hh, mm] = time.split(":");
  const h = Number(hh);
  const suffix = h >= 12 ? "PM" : "AM";
  const h12 = ((h + 11) % 12) + 1;
  return `${h12}:${mm} ${suffix}`;
}

function hourOf(time) {
  return Number((time || "0:00").split(":")[0] || 0);
}

function demandTag(time) {
  const h = hourOf(time);
  if (h >= 9 && h < 13)
    return { label: "Price Drop", cls: "text-white bg-white/10" };
  if (h >= 13 && h < 18)
    return { label: "Best Value", cls: "text-black bg-white" };
  return { label: "Peak", cls: "text-white/70 bg-white/5" };
}

export default function Theaters() {
  const { id } = useParams();
  const movie = movies.find((m) => m.id === id);
  const booking = useBooking();
  const navigate = useNavigate();

  const [query, setQuery] = useState("");
  const [date, setDate] = useState(() => {
    const d = new Date();
    return d.toISOString().slice(0, 10);
  });

  const list = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const todaysShows = shows.filter(
      (s) => s.movieId === id && s.date === date,
    );
    const byTheater = new Map();
    for (const s of todaysShows) {
      const arr = byTheater.get(s.theaterId) || [];
      arr.push(s);
      byTheater.set(s.theaterId, arr);
    }

    return theaters
      .filter((t) => byTheater.has(t.id))
      .filter((t) => {
        if (!needle) return true;
        return `${t.name} ${t.area}`.toLowerCase().includes(needle);
      })
      .map((t) => ({
        theater: t,
        showList: (byTheater.get(t.id) || []).sort((a, b) =>
          a.time.localeCompare(b.time),
        ),
      }));
  }, [date, id, query]);

  const insights = useMemo(() => {
    const all = list.flatMap(({ theater, showList }) =>
      showList.map((s) => ({
        ...s,
        theater: theater.name,
        score:
          hourOf(s.time) >= 9 && hourOf(s.time) < 13
            ? 1
            : hourOf(s.time) < 18
              ? 2
              : 3,
      })),
    );
    return all.sort((a, b) => a.score - b.score).slice(0, 3);
  }, [list]);

  if (!movie) {
    return (
      <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
        <Card className="p-6">
          <div className="text-sm font-semibold text-white">
            Movie not found
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
      <BookingStepper current="theaters" />
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white sm:text-3xl">
            Select Theater & Showtime
          </h1>
          <p className="mt-1 text-sm text-white/60">
            {movie.title} • {movie.language}
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search theaters…"
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/40 outline-none transition focus:border-white/20 focus:bg-white/10 sm:w-64"
          />
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white outline-none transition focus:border-white/20 sm:w-44"
          />
        </div>
      </div>

      <div className="mt-6 grid gap-3">
        {insights.length ? (
          <Card className="p-4">
            <div className="text-sm font-semibold text-white">
              Smart Time Predictor
            </div>
            <div className="mt-1 text-xs text-white/60">
              Suggested slots based on quieter windows and expected pricing.
            </div>
            <div className="mt-3 grid gap-2 sm:grid-cols-3">
              {insights.map((i) => {
                const tag = demandTag(i.time);
                return (
                  <div
                    key={i.id}
                    className="rounded-2xl border border-white/10 bg-white/5 p-3"
                  >
                    <div className="text-xs text-white/60">{i.theater}</div>
                    <div className="mt-1 text-sm font-semibold text-white">
                      {formatTime(i.time)}
                    </div>
                    <div className="mt-2">
                      <span
                        className={`rounded-full px-2 py-1 text-[10px] font-semibold ${tag.cls}`}
                      >
                        {tag.label}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        ) : null}

        {list.length ? (
          list.map(({ theater, showList }) => (
            <Card key={theater.id} className="p-4">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="text-sm font-semibold text-white">
                    {theater.name}
                  </div>
                  <div className="mt-1 text-xs text-white/60">
                    {theater.area} • {theater.facilities.join(" • ")}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {showList.map((s) => {
                    const tag = demandTag(s.time);
                    return (
                      <Button
                        key={s.id}
                        variant="subtle"
                        size="sm"
                        className="gap-2"
                        onClick={() => {
                          booking.setMovie(movie.id);
                          booking.setShow({
                            theaterId: theater.id,
                            showId: s.id,
                            date: s.date,
                            time: s.time,
                          });
                          navigate(`/seats/${s.id}`);
                        }}
                      >
                        {formatTime(s.time)}
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${tag.cls}`}
                        >
                          {tag.label}
                        </span>
                      </Button>
                    );
                  })}
                </div>
              </div>
            </Card>
          ))
        ) : (
          <Card className="p-6">
            <div className="text-sm font-semibold text-white">
              No shows available
            </div>
            <div className="mt-1 text-sm text-white/60">
              Try a different date or adjust your search.
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
