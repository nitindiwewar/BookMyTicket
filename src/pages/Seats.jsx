import { useEffect, useMemo, useState } from "react";
import {
  Link,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import BookingStepper from "../components/BookingStepper.jsx";
import Button from "../components/ui/Button.jsx";
import Card from "../components/ui/Card.jsx";
import movies from "../data/movies.js";
import { shows, theaters } from "../data/theaters.js";
import { useBooking } from "../state/bookingContext.jsx";
import { getSeatId } from "../utils/formatters.js";
import {
  SEAT_TIERS,
  BOOKING_FEE_PERCENTAGE,
  MAX_SEATS_PER_BOOKING,
} from "../constants/index.js";

function pseudoOccupied(seed, id) {
  let h = 0;
  const s = `${seed}:${id}`;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h % 9 === 0;
}

export default function Seats() {
  const { showId } = useParams();
  const [searchParams] = useSearchParams();
  const booking = useBooking();
  const navigate = useNavigate();

  const show = shows.find((s) => s.id === showId);
  const movie = movies.find(
    (m) => m.id === (show?.movieId || booking.state.movieId),
  );
  const theater = theaters.find(
    (t) => t.id === (show?.theaterId || booking.state.theaterId),
  );

  const tierParam = searchParams.get("tier");
  const seatsParam = searchParams.get("seats") || "";
  const importedSeats = seatsParam
    .split(",")
    .map((x) => x.trim().toUpperCase())
    .filter(Boolean);

  const [tier, setTier] = useState(
    booking.state.seatTier ||
      (tierParam && SEAT_TIERS.some((t) => t.id === tierParam)
        ? tierParam
        : "Premium"),
  );
  const [ticketTarget, setTicketTarget] = useState(
    importedSeats.length
      ? Math.min(MAX_SEATS_PER_BOOKING, Math.max(1, importedSeats.length))
      : 2,
  );
  const [roomId, setRoomId] = useState(searchParams.get("room") || "");
  const [liveMembers, setLiveMembers] = useState(1);

  const occupied = useMemo(() => {
    const set = new Set();
    for (let r = 0; r < 10; r++) {
      for (let c = 0; c < 14; c++) {
        const id = getSeatId(r, c);
        if (pseudoOccupied(showId, id)) set.add(id);
      }
    }
    return set;
  }, [showId]);

  const pricePer = SEAT_TIERS.find((t) => t.id === tier)?.price ?? 0;
  const seatCount = booking.state.seats.length;
  const subtotal = seatCount * pricePer;
  const fees = seatCount ? Math.round(subtotal * BOOKING_FEE_PERCENTAGE) : 0;
  const total = subtotal + fees;

  useEffect(() => {
    const tierParam = searchParams.get("tier");
    if (tierParam && SEAT_TIERS.some((t) => t.id === tierParam)) {
      if (tierParam !== booking.state.seatTier) {
        booking.setSeatTier(tierParam);
      }
    }

    if (importedSeats.length) {
      booking.setSeats(importedSeats);
    }
  }, [searchParams, booking, importedSeats]);

  useEffect(() => {
    if (!roomId || typeof BroadcastChannel === "undefined") return;
    const channel = new BroadcastChannel(`mt-room-${roomId}`);
    const peerId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const peers = new Set([peerId]);
    let isActive = true;

    const emitState = () => {
      if (!isActive) return;
      try {
        channel.postMessage({
          type: "state",
          from: peerId,
          seats: booking.state.seats,
          tier,
        });
      } catch {
        // Channel might be closed
      }
    };

    const emitJoin = () => {
      if (!isActive) return;
      try {
        channel.postMessage({ type: "join", from: peerId });
      } catch {
        // Channel might be closed
      }
    };
    const emitLeave = () => {
      if (!isActive) return;
      try {
        channel.postMessage({ type: "leave", from: peerId });
      } catch {
        // Channel might be closed
      }
    };

    channel.onmessage = (event) => {
      if (!isActive) return;
      const msg = event.data || {};
      if (!msg.from || msg.from === peerId) return;
      if (msg.type === "join") {
        peers.add(msg.from);
        setLiveMembers(peers.size);
        try {
          channel.postMessage({ type: "presence", from: peerId });
        } catch {
          // Channel might be closed
        }
        return;
      }
      if (msg.type === "presence") {
        peers.add(msg.from);
        setLiveMembers(peers.size);
        return;
      }
      if (msg.type === "leave") {
        peers.delete(msg.from);
        setLiveMembers(Math.max(1, peers.size));
        return;
      }
      if (msg.type === "state") {
        if (Array.isArray(msg.seats)) booking.setSeats(msg.seats);
        if (msg.tier && SEAT_TIERS.some((t) => t.id === msg.tier)) {
          setTier(msg.tier);
          booking.setSeatTier(msg.tier);
        }
      }
    };

    emitJoin();
    const ping = setInterval(() => {
      if (!isActive) return;
      try {
        channel.postMessage({ type: "presence", from: peerId });
        emitState();
      } catch {
        // Channel might be closed
      }
    }, 2500);
    emitState();

    return () => {
      isActive = false;
      clearInterval(ping);
      emitLeave();
      try {
        channel.close();
      } catch {
        // Channel might already be closed
      }
    };
  }, [roomId, tier, booking]);

  function scoreSeat(r, c) {
    const centerR = 5;
    const centerC = 6.5;
    return Math.abs(r - centerR) * 2 + Math.abs(c - centerC);
  }

  function findBestBlock(count) {
    let best = null;
    for (let r = 0; r < 10; r++) {
      for (let start = 0; start <= 14 - count; start++) {
        const block = [];
        let ok = true;
        for (let k = 0; k < count; k++) {
          const c = start + k;
          const id = getSeatId(r, c);
          if (occupied.has(id)) {
            ok = false;
            break;
          }
          block.push({ id, r, c });
        }
        if (!ok) continue;
        const score =
          block.reduce((sum, s) => sum + scoreSeat(s.r, s.c), 0) / block.length;
        if (!best || score < best.score)
          best = { ids: block.map((b) => b.id), score };
      }
    }
    return best?.ids || [];
  }

  if (!show || !movie || !theater) {
    return (
      <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
        <Card className="p-6">
          <div className="text-sm font-semibold text-white">Invalid show</div>
          <div className="mt-1 text-sm text-white/60">
            Please start from the movie page.
          </div>
          <Button as={Link} to="/movies" variant="subtle" className="mt-4">
            Browse Movies
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
      <BookingStepper current="seats" />
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white sm:text-3xl">
            Select Seats
          </h1>
          <p className="mt-1 text-sm text-white/60">
            {movie.title} • {theater.name} • {show.date} • {show.time}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {SEAT_TIERS.map((t) => {
            const active = tier === t.id;
            return (
              <button
                key={t.id}
                type="button"
                className={[
                  "rounded-xl border px-3 py-2 text-xs font-semibold transition",
                  active
                    ? "border-white/25 bg-white text-black"
                    : "border-white/10 bg-white/5 text-white/80 hover:bg-white/10 hover:text-white",
                ].join(" ")}
                onClick={() => {
                  setTier(t.id);
                  booking.setSeatTier(t.id);
                }}
              >
                {t.id} • ₹{t.price}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <div className="text-xs font-semibold text-white/60">
          Smart seat picker
        </div>
        {[1, 2, 3, 4, 5, 6].map((n) => (
          <button
            key={n}
            type="button"
            className={[
              "rounded-lg border px-2 py-1 text-xs font-semibold transition",
              ticketTarget === n
                ? "border-white/25 bg-white text-black"
                : "border-white/10 bg-white/5 text-white/80 hover:bg-white/10",
            ].join(" ")}
            onClick={() => setTicketTarget(n)}
          >
            {n}
          </button>
        ))}
        <Button
          size="sm"
          variant="subtle"
          onClick={() => {
            const best = findBestBlock(ticketTarget);
            if (best.length) booking.setSeats(best);
          }}
        >
          Auto Best Seats
        </Button>
        <Button
          size="sm"
          variant="subtle"
          onClick={async () => {
            const selected = booking.state.seats;
            const qp = new URLSearchParams();
            if (selected.length) qp.set("seats", selected.join(","));
            qp.set("tier", tier);
            const url = `${window.location.origin}/seats/${showId}?${qp.toString()}`;
            if (navigator.share)
              await navigator.share({ url, text: "Join my seat selection" });
            else await navigator.clipboard.writeText(url);
          }}
        >
          Group Sync Link
        </Button>
        <Button
          size="sm"
          variant="subtle"
          onClick={() => {
            const id =
              roomId || Math.random().toString(36).slice(2, 8).toUpperCase();
            setRoomId(id);
            const url = new URL(window.location.href);
            url.searchParams.set("room", id);
            window.history.replaceState({}, "", url.toString());
          }}
        >
          {roomId ? `Room ${roomId}` : "Create Sync Room"}
        </Button>
        {roomId ? (
          <span className="rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-xs text-white/70">
            Live members: {liveMembers}
          </span>
        ) : null}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_340px]">
        <Card className="p-4">
          <div className="mx-auto max-w-4xl">
            <div className="mb-4 text-center text-xs font-semibold text-white/60">
              SCREEN THIS WAY
            </div>
            <div className="mx-auto mb-6 h-2 w-3/4 rounded-full bg-white/10 shadow-[0_10px_50px_rgba(255,255,255,0.08)]" />

            <div className="grid gap-2">
              {Array.from({ length: 10 }).map((_, r) => (
                <div key={r} className="flex items-center gap-2">
                  <div className="w-6 text-xs font-semibold text-white/50">
                    {String.fromCharCode(65 + r)}
                  </div>
                  <div className="grid flex-1 grid-cols-[repeat(14,minmax(0,1fr))] gap-1.5">
                    {Array.from({ length: 14 }).map((__, c) => {
                      const id = getSeatId(r, c);
                      const isOccupied = occupied.has(id);
                      const isSelected = booking.state.seats.includes(id);
                      return (
                        <button
                          key={id}
                          type="button"
                          disabled={isOccupied}
                          onClick={() => booking.toggleSeat(id)}
                          className={[
                            "h-7 rounded-md border text-[10px] font-semibold transition",
                            isOccupied
                              ? "cursor-not-allowed border-white/5 bg-white/5 text-white/25"
                              : isSelected
                                ? "border-white/30 bg-white text-black shadow-sm shadow-white/10"
                                : "border-white/10 bg-white/0 text-white/70 hover:bg-white/10 hover:text-white",
                          ].join(" ")}
                          aria-label={`Seat ${id}`}
                        >
                          {id}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 text-xs text-white/60">
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-2">
                  <span className="h-3 w-3 rounded-sm border border-white/10 bg-transparent" />
                  Available
                </span>
                <span className="inline-flex items-center gap-2">
                  <span className="h-3 w-3 rounded-sm border border-white/30 bg-white" />
                  Selected
                </span>
                <span className="inline-flex items-center gap-2">
                  <span className="h-3 w-3 rounded-sm border border-white/5 bg-white/5" />
                  Occupied
                </span>
              </div>
              <div className="text-white/50">Tap seats to select</div>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="text-sm font-semibold text-white">
            Booking Summary
          </div>
          <div className="mt-3 space-y-2 text-sm text-white/70">
            <div className="flex items-center justify-between gap-3">
              <span>Seats</span>
              <span className="text-white">
                {seatCount ? booking.state.seats.join(", ") : "—"}
              </span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span>Tier</span>
              <span className="text-white">{tier}</span>
            </div>
            <div className="mt-3 border-t border-white/10 pt-3 space-y-2">
              <div className="flex items-center justify-between gap-3">
                <span>Subtotal</span>
                <span className="text-white">₹{subtotal}</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span>Fees</span>
                <span className="text-white">₹{fees}</span>
              </div>
              <div className="flex items-center justify-between gap-3 text-base font-semibold">
                <span className="text-white">Total</span>
                <span className="text-white">₹{total}</span>
              </div>
            </div>
          </div>

          <Button
            className="mt-5 w-full"
            disabled={!seatCount}
            onClick={() => navigate("/snacks")}
          >
            Continue
          </Button>

          <Button
            className="mt-2 w-full"
            variant="subtle"
            onClick={() => navigate(`/movies/${movie.id}/theaters`)}
          >
            Change showtime
          </Button>
        </Card>
      </div>
    </div>
  );
}
