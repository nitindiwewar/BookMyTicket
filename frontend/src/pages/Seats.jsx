import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { Sparkles, Ticket, Trash2, ArrowRight, ZoomIn, ZoomOut } from "lucide-react";
import BookingStepper from "../components/BookingStepper.jsx";
import Button from "../components/ui/Button.jsx";
import Card from "../components/ui/Card.jsx";
import Badge from "../components/ui/Badge.jsx";
import EmptyState from "../components/common/EmptyState.jsx";
import { useBooking } from "../state/bookingContext.jsx";
import { useAuth } from "../state/authContext.jsx";
import { formatCurrency } from "../utils/formatters.js";
import { getMovieById } from "../api/movieApi.js";
import { getTheaters, getShowSeats } from "../api/theaterApi.js";


const ROWS = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
const COLS = Array.from({ length: 14 }, (_, i) => i + 1);

const SEAT_PRICES = {
  Silver: 180,
  Gold: 250,
  Recliner: 450,
};

function getTier(row) {
  if (["A", "B", "C"].includes(row)) return "Silver";
  if (["D", "E", "F", "G", "H"].includes(row)) return "Gold";
  return "Recliner";
}

export default function Seats() {
  const { id: urlMovieId, showId } = useParams();
  const booking = useBooking();
  const { isLoggedIn, openLoginModal } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleProceedNext = () => {
    if (!isLoggedIn) {
      openLoginModal();
      return;
    }
    const targetMovieId = urlMovieId || booking.state.movieId || "m1";
    navigate(targetMovieId ? `/movies/${targetMovieId}/snacks` : "/snacks");
  };

  const [activeTier, setActiveTier] = useState("All");
  const [zoomScale, setZoomScale] = useState(1);

  // Clear previous/recent seat selections on mount
  useEffect(() => {
    booking.clearSeats();
  }, [showId]);


  // Robust showtime resolution
  const show = useMemo(() => {
    if (booking.state.show && booking.state.show.id === showId) {
      return booking.state.show;
    }
    if (booking.state.showId === showId) {
      return {
        id: showId,
        movieId: booking.state.movieId,
        theaterId: booking.state.theaterId,
        date: booking.state.date || new Date().toISOString().slice(0, 10),
        time: booking.state.time || "19:30",
      };
    }
    if (showId?.startsWith("s-")) {
      const parts = showId.split("-");
      return {
        id: showId,
        movieId: parts[1] || "m1",
        theaterId: parts[2] || "t1",
        date: new Date().toISOString().slice(0, 10),
        time: "19:30",
      };
    }
    return {
      id: showId || "s1",
      movieId: booking.state.movieId || "m1",
      theaterId: booking.state.theaterId || "t1",
      date: new Date().toISOString().slice(0, 10),
      time: "19:30",
    };
  }, [booking.state, showId]);

  const targetMovieId = urlMovieId || show.movieId || booking.state.movieId || "m1";

  const [fetchedMovie, setFetchedMovie] = useState(null);
  const [fetchedTheater, setFetchedTheater] = useState(null);

  useEffect(() => {
    if (!booking.state.movie?.title && targetMovieId) {
      getMovieById(targetMovieId).then((data) => {
        if (data) {
          setFetchedMovie(data);
          booking.setMovie(data);
        }
      }).catch(() => {});
    }
    if (!booking.state.theater?.name) {
      getTheaters().then((list) => {
        if (Array.isArray(list) && list.length > 0) {
          const t = list.find((x) => x.id === show.theaterId) || list[0];
          setFetchedTheater(t);
          booking.setTheater(t);
        }
      }).catch(() => {});
    }
  }, [targetMovieId, show.theaterId]);

  const movie = booking.state.movie?.title ? booking.state.movie : (fetchedMovie || { title: "Selected Movie" });
  const theater = booking.state.theater?.name ? booking.state.theater : (fetchedTheater || { name: "PVR INOX Cinema" });

  const [backendSeats, setBackendSeats] = useState([]);
  const [seatPrices, setSeatPrices] = useState(SEAT_PRICES);

  useEffect(() => {
    if (showId) {
      if (booking.setShow) {
        booking.setShow({ ...show, id: showId });
      }
      getShowSeats(showId).then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setBackendSeats(data);
          const priceMap = {};
          data.forEach((s) => {
            if (s.tier && s.price) {
              const tierName = s.tier === "VIP" ? "Recliner" : s.tier === "PREMIUM" ? "Gold" : "Silver";
              priceMap[tierName] = s.price;
            }
          });
          if (Object.keys(priceMap).length > 0) {
            setSeatPrices((prev) => ({ ...prev, ...priceMap }));
          }
        }
      }).catch((err) => console.warn("Error fetching seats from backend:", err));
    }
  }, [showId]);

  // Extract occupied seats directly from database response
  const occupiedSet = useMemo(() => {
    const set = new Set();
    if (backendSeats.length > 0) {
      backendSeats.forEach((s) => {
        if (s.status === "BOOKED" || s.status === "BLOCKED") {
          set.add(s.seatNumber);
        }
      });
    } else {
      const idSeed = showId || "s1";
      let seed = 0;
      for (let i = 0; i < idSeed.length; i++) seed += idSeed.charCodeAt(i);
      for (const r of ROWS) {
        for (const c of COLS) {
          if ((r.charCodeAt(0) * c + seed) % 7 === 0) {
            set.add(`${r}${c}`);
          }
        }
      }
    }
    return set;
  }, [backendSeats, showId]);

  const selectedSeats = booking.state.seats || [];

  const totalAmount = useMemo(() => {
    return selectedSeats.reduce((sum, seatId) => {
      const row = seatId.charAt(0);
      const tier = getTier(row);
      return sum + (seatPrices[tier] || SEAT_PRICES[tier]);
    }, 0);
  }, [selectedSeats, seatPrices]);


  const toggleSeat = (seatId) => {
    if (occupiedSet.has(seatId)) return;
    if (selectedSeats.includes(seatId)) {
      booking.removeSeat(seatId);
    } else {
      if (selectedSeats.length >= 8) return;
      booking.addSeat(seatId);
    }
  };

  const handleAutoSelect = (count = 2) => {
    booking.clearSeats();
    for (const r of ["E", "F", "G", "D", "H"]) {
      let run = [];
      for (const c of COLS) {
        const id = `${r}${c}`;
        if (!occupiedSet.has(id)) {
          run.push(id);
          if (run.length === count) {
            run.forEach((s) => booking.addSeat(s));
            return;
          }
        } else {
          run = [];
        }
      }
    }
  };

  if (!movie || !theater) {
    return (
      <div className="mx-auto w-full max-w-6xl px-4 py-12">
        <EmptyState title="Showtime not found" description="The requested showtime is invalid." />
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8 space-y-6 pb-24 lg:pb-8">
      <BookingStepper current="seats" />

      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Select Your Seats
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 font-medium">
            {movie.title} • {theater.name} • {show.date} @ {show.time}
          </p>
        </div>

        {/* Tier Tabs & Zoom Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Zoom Controls */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl border border-slate-200/60">
            <button
              type="button"
              onClick={() => setZoomScale((s) => Math.max(0.75, s - 0.15))}
              className="p-1.5 rounded-xl text-slate-700 hover:bg-white transition"
              title="Zoom Out"
            >
              <ZoomOut className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setZoomScale(1)}
              className="px-2 text-xs font-bold text-slate-600 hover:bg-white rounded-xl transition"
              title="Reset Zoom"
            >
              {Math.round(zoomScale * 100)}%
            </button>
            <button
              type="button"
              onClick={() => setZoomScale((s) => Math.min(1.4, s + 0.15))}
              className="p-1.5 rounded-xl text-slate-700 hover:bg-white transition"
              title="Zoom In"
            >
              <ZoomIn className="h-4 w-4" />
            </button>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-2xl">
            {["All", "Silver", "Gold", "Recliner"].map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setActiveTier(t)}
                className={`rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                  activeTier === t
                    ? "bg-white text-slate-900 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {t} {t !== "All" && `(₹${SEAT_PRICES[t]})`}
              </button>
            ))}
          </div>

          <Button
            variant="subtle"
            size="sm"
            onClick={() => handleAutoSelect(2)}
            className="text-xs font-bold"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Auto-Pick 2 Best
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        {/* Main Seat Canvas */}
        <Card className="lg:col-span-8 p-6 space-y-6 overflow-hidden bg-white shadow-xs">
          {/* Curved Cinema Screen Bar */}
          <div className="space-y-2 text-center">
            <div className="mx-auto h-2.5 w-3/4 rounded-b-full bg-gradient-to-b from-red-500/40 via-red-500/20 to-transparent shadow-md shadow-red-500/10" />
            <div className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
              All Eyes This Way — Cinema Screen
            </div>
          </div>

          {/* Seat Grid Map with Scale Transform */}
          <div className="overflow-x-auto pb-4 pt-2">
            <div
              className="min-w-[560px] mx-auto flex flex-col items-center space-y-2.5 transition-transform duration-200 origin-top"
              style={{ transform: `scale(${zoomScale})` }}
            >
              {ROWS.map((row) => {
                const tier = getTier(row);
                const matchesTier = activeTier === "All" || activeTier === tier;

                return (
                  <div
                    key={row}
                    className={`flex items-center gap-2 transition-opacity duration-200 ${
                      matchesTier ? "opacity-100" : "opacity-35"
                    }`}
                  >
                    <span className="w-5 text-center text-xs font-extrabold text-slate-400">
                      {row}
                    </span>

                    <div className="flex items-center gap-1.5">
                      {COLS.map((col) => {
                        const seatId = `${row}${col}`;
                        const isOccupied = occupiedSet.has(seatId);
                        const isSelected = selectedSeats.includes(seatId);

                        let colorClass = "bg-slate-100 text-slate-700 hover:bg-slate-200 cursor-pointer";
                        if (isOccupied) {
                          colorClass = "bg-slate-200 text-slate-400 cursor-not-allowed";
                        } else if (isSelected) {
                          colorClass = "bg-red-600 text-white font-bold shadow-md shadow-red-600/30 scale-110 cursor-pointer";
                        }

                        const isAisle = col === 3 || col === 11;

                        return (
                          <div key={seatId} className="flex items-center">
                            <button
                              type="button"
                              disabled={isOccupied}
                              onClick={() => toggleSeat(seatId)}
                              className={`h-7 w-7 sm:h-8 sm:w-8 rounded-lg text-[10px] font-bold transition-all duration-150 flex items-center justify-center ${colorClass}`}
                            >
                              {col}
                            </button>
                            {isAisle && <div className="w-3" />}
                          </div>
                        );
                      })}
                    </div>

                    <span className="w-5 text-center text-xs font-extrabold text-slate-400">
                      {row}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Seat Map Legend */}
          <div className="flex flex-wrap items-center justify-center gap-6 border-t border-slate-100 pt-4 text-xs font-bold text-slate-600">
            <div className="flex items-center gap-2">
              <span className="h-4 w-4 rounded-md bg-slate-100 border border-slate-200" />
              <span>Available</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-4 w-4 rounded-md bg-red-600" />
              <span>Selected</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-4 w-4 rounded-md bg-slate-200" />
              <span>Sold Out</span>
            </div>
          </div>
        </Card>

        {/* Desktop Sidebar Summary */}
        <aside className="lg:col-span-4 space-y-6">
          <Card className="p-6 space-y-5 bg-white shadow-xs sticky top-24">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-black text-slate-900">Seat Summary</h3>
              {selectedSeats.length > 0 && (
                <button
                  type="button"
                  onClick={() => booking.clearSeats()}
                  className="flex items-center gap-1 text-xs text-red-600 font-bold hover:underline"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Clear All
                </button>
              )}
            </div>

            {selectedSeats.length ? (
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {selectedSeats.map((seatId) => (
                    <Badge key={seatId} variant="primary" size="md">
                      {seatId} ({getTier(seatId.charAt(0))})
                    </Badge>
                  ))}
                </div>

                <div className="space-y-2 border-t border-slate-100 pt-3 text-xs font-semibold text-slate-600">
                  <div className="flex justify-between">
                    <span>Ticket Price ({selectedSeats.length} seats)</span>
                    <span className="font-bold text-slate-900">
                      {formatCurrency(totalAmount)}
                    </span>
                  </div>
                </div>

                <Button
                  size="lg"
                  className="w-full shadow-lg shadow-red-600/20 font-black"
                  onClick={handleProceedNext}
                >
                  <span>Proceed to Food & Snacks</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="py-6 text-center text-xs text-slate-500 font-medium space-y-2">
                <Ticket className="mx-auto h-8 w-8 text-slate-300" />
                <p>No seats selected yet. Click on available seats in the map above.</p>
              </div>
            )}
          </Card>
        </aside>
      </div>

      {/* Floating Mobile Checkout Bar */}
      {selectedSeats.length > 0 && (
        <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white border-t border-slate-200 p-4 shadow-2xl flex items-center justify-between gap-4">
          <div>
            <div className="text-xs font-bold text-slate-500">
              {selectedSeats.length} Seat{selectedSeats.length > 1 ? "s" : ""} ({selectedSeats.join(", ")})
            </div>
            <div className="text-lg font-black text-slate-900">
              {formatCurrency(totalAmount)}
            </div>
          </div>

          <Button size="md" onClick={handleProceedNext} className="gap-2 font-black">
            <span>Next</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      )}

    </div>
  );
}

