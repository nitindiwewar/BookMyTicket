import { useMemo } from "react";
import { Link } from "react-router-dom";
import BookingStepper from "../components/BookingStepper.jsx";
import Button from "../components/ui/Button.jsx";
import Card from "../components/ui/Card.jsx";
import movies from "../data/movies.js";
import { shows, theaters } from "../data/theaters.js";
import { useBooking } from "../state/bookingContext.jsx";

function ticketCode(seed) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 33 + seed.charCodeAt(i)) >>> 0;
  return `MT-${String(h).slice(0, 8)}`;
}

export default function Confirmation() {
  const booking = useBooking();
  const show = shows.find((s) => s.id === booking.state.showId);
  const movie = movies.find((m) => m.id === booking.state.movieId);
  const theater = theaters.find((t) => t.id === booking.state.theaterId);

  const code = useMemo(() => {
    const seed = `${booking.state.showId}:${booking.state.seats.join(",")}`;
    return ticketCode(seed);
  }, [booking.state.seats, booking.state.showId]);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
      <BookingStepper current="confirmed" />
      <div className="mx-auto max-w-2xl">
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-1">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.14),transparent_55%),radial-gradient(circle_at_70%_60%,rgba(255,255,255,0.10),transparent_55%)]" />
          <Card className="relative p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-xs font-semibold text-white/60">
                  Booking confirmed
                </div>
                <h1 className="mt-2 text-2xl font-semibold text-white">
                  Enjoy the show.
                </h1>
                <p className="mt-2 text-sm text-white/60">
                  Your tickets are confirmed. Enjoy the movie!
                </p>
              </div>
              <div className="grid h-12 w-12 place-items-center rounded-2xl border border-white/15 bg-white/10 text-white">
                ✓
              </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="text-xs font-semibold text-white/60">
                  Ticket
                </div>
                <div className="mt-1 text-sm font-semibold text-white">
                  {code}
                </div>
                <div className="mt-2 text-xs text-white/60">
                  {movie ? movie.title : "—"}
                </div>
                <div className="mt-1 text-xs text-white/60">
                  {theater ? theater.name : "—"}
                </div>
                <div className="mt-1 text-xs text-white/60">
                  {show ? `${show.date} • ${show.time}` : "—"}
                </div>
                <div className="mt-2 text-xs text-white/60">
                  Seats:{" "}
                  <span className="text-white">
                    {booking.state.seats.length
                      ? booking.state.seats.join(", ")
                      : "—"}
                  </span>
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="text-xs font-semibold text-white/60">QR</div>
                <div className="mt-3 grid place-items-center rounded-2xl border border-white/10 bg-black p-4">
                  <div className="grid grid-cols-8 gap-1">
                    {Array.from({ length: 64 }).map((_, i) => {
                      const on = (i * 17 + code.length * 13) % 7 < 3;
                      return (
                        <span
                          key={i}
                          className={
                            on ? "h-2 w-2 bg-white" : "h-2 w-2 bg-white/10"
                          }
                        />
                      );
                    })}
                  </div>
                </div>
                <div className="mt-2 text-xs text-white/50">
                  Show this at the cinema entrance.
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-2 sm:flex-row">
              <Button
                className="sm:flex-1"
                onClick={() => {
                  window.print();
                }}
              >
                Download Ticket
              </Button>
              <Button
                variant="subtle"
                className="sm:flex-1"
                onClick={async () => {
                  const text = `My booking: ${movie?.title ?? ""} (${code})`;
                  if (navigator.share) await navigator.share({ text });
                  else await navigator.clipboard.writeText(text);
                }}
              >
                Share
              </Button>
              <Button
                variant="subtle"
                className="sm:flex-1"
                as={Link}
                to="/"
                onClick={() => booking.reset()}
              >
                Book Another
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
