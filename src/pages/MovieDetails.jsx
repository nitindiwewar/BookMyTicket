import { Link, useNavigate, useParams } from "react-router-dom";
import Button from "../components/ui/Button.jsx";
import Card from "../components/ui/Card.jsx";
import movies from "../data/movies.js";
import { useBooking } from "../state/bookingContext.jsx";

export default function MovieDetails() {
  const { id } = useParams();
  const movie = movies.find((m) => m.id === id);
  const navigate = useNavigate();
  const booking = useBooking();

  const backdropSrc =
    movie?.hero?.backdrop ??
    "https://via.placeholder.com/1200x600?text=Backdrop";

  // prevent missing poster/backdrop from breaking layout/typography
  const safePosterSrc =
    movie?.hero?.poster ?? "https://via.placeholder.com/400x600?text=Poster";

  const safeTrailerUrl = movie?.hero?.trailer;
  const posterSrc = safePosterSrc;
  const trailerUrl = safeTrailerUrl;
  const movieGenres = movie?.genre?.join(" / ") ?? "N/A";
  const movieFormat = movie?.format?.join(" / ") ?? "N/A";
  const movieTags = movie?.tags ?? [];
  const movieCast = movie?.cast ?? [];
  const movieCrew = movie?.crew ?? [];

  if (!movie) {
    return (
      <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
        <Card className="p-6">
          <div className="text-sm font-semibold text-white">
            Movie not found
          </div>
          <div className="mt-1 text-sm text-white/60">
            Please go back to the movies list.
          </div>
          <Button as={Link} to="/movies" className="mt-4" variant="subtle">
            Back to Movies
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
      <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5">
        {/* Ensure typography stays readable on top of posters/backdrops */}
        <div className="absolute inset-0">
          <img
            src={backdropSrc}
            alt={movie?.title ?? "Movie backdrop"}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-r from-black/90 via-black/55 to-black/25" />
        </div>

        <div className="relative grid gap-6 p-6 md:grid-cols-[220px_1fr] md:p-10">
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/40">
            <img
              src={posterSrc}
              alt={`${movie?.title ?? "Movie"} poster`}
              className="h-full w-full object-cover"
            />
          </div>

          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              {movieTags.map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold text-white"
                >
                  {t}
                </span>
              ))}
              <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-semibold text-white/80">
                {movie.certification}
              </span>
              <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-semibold text-white/80">
                {movie.runtimeMins}m
              </span>
            </div>

            <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              {movie.title}
            </h1>

            <div className="text-sm text-white/70">
              {movie?.language ?? "Unknown"} • {movieGenres} • {movieFormat}
            </div>

            <p className="max-w-2xl text-sm leading-6 text-white/70">
              {movie?.synopsis ?? "Synopsis unavailable."}
            </p>

            <div className="flex flex-col gap-2 sm:flex-row">
              <Button
                onClick={() => {
                  booking.setMovie(movie.id);
                  navigate(`/movies/${movie.id}/theaters`);
                }}
              >
                Book Tickets
              </Button>
              {trailerUrl ? (
                <Button
                  variant="subtle"
                  onClick={() =>
                    window.open(trailerUrl, "_blank", "noreferrer")
                  }
                >
                  Watch Trailer
                </Button>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      <div className="mt-8 grid gap-4 lg:grid-cols-3">
        <Card className="p-5 lg:col-span-2">
          <div className="text-sm font-semibold text-white">Cast</div>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {movieCast.length > 0 ? (
              movieCast.map((name, i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:bg-white/10"
                >
                  <div className="text-sm font-semibold text-white">{name}</div>
                </div>
              ))
            ) : (
              <div className="text-sm text-white/60">
                Cast information is unavailable.
              </div>
            )}
          </div>
        </Card>

        <Card className="p-5">
          <div className="text-sm font-semibold text-white">Crew</div>
          <div className="mt-3 grid gap-3">
            {movieCrew.length > 0 ? (
              movieCrew.map((name, i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:bg-white/10"
                >
                  <div className="text-sm font-semibold text-white">{name}</div>
                </div>
              ))
            ) : (
              <div className="text-sm text-white/60">
                Crew information is unavailable.
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
