import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import BookingStepper from "../components/BookingStepper.jsx";
import Button from "../components/ui/Button.jsx";
import Card from "../components/ui/Card.jsx";
import movies from "../data/movies.js";
import { shows, theaters } from "../data/theaters.js";
import { snacks } from "../data/snacks.js";
import { useBooking } from "../state/bookingContext.jsx";
import {
  PAYMENT_METHODS,
  COUPONS,
  BOOKING_FEE_PERCENTAGE,
} from "../constants/index.js";

/**
 * Calculate seat price based on tier
 * @param {string} tier - Seat tier
 * @returns {number} Price for the tier
 */
function seatPrice(tier) {
  const tierData = { VIP: 520, Premium: 360, Regular: 220 };
  return tierData[tier] || 220;
}

/**
 * Calculate discount for coupon code
 * @param {string} coupon - Coupon code
 * @param {number} amount - Amount to discount
 * @returns {number} Discount amount
 */
function calcDiscount(coupon, amount) {
  const code = (coupon || "").trim().toUpperCase();
  if (!code || !COUPONS[code]) return 0;
  const { maxDiscount, percentage } = COUPONS[code];
  return Math.min(maxDiscount, Math.round(amount * percentage));
}

export default function Payment() {
  const booking = useBooking();
  const navigate = useNavigate();
  const [coupon, setCoupon] = useState(booking.state.coupon || "");
  const [method, setMethod] = useState(booking.state.paymentMethod || "upi");
  const [processing, setProcessing] = useState(false);

  const show = shows.find((s) => s.id === booking.state.showId);
  const movie = movies.find((m) => m.id === booking.state.movieId);
  const theater = theaters.find((t) => t.id === booking.state.theaterId);

  const pricing = useMemo(() => {
    const tier = booking.state.seatTier || "Premium";
    const per = seatPrice(tier);
    const seatSubtotal = booking.state.seats.length * per;
    const seatFees = booking.state.seats.length
      ? Math.round(seatSubtotal * BOOKING_FEE_PERCENTAGE)
      : 0;
    let snackTotal = 0;
    for (const s of snacks) {
      const qty = booking.state.snacks[s.id] || 0;
      snackTotal += qty * s.price;
    }
    const beforeDiscount = seatSubtotal + seatFees + snackTotal;
    const discount = calcDiscount(coupon, beforeDiscount);
    const total = Math.max(0, beforeDiscount - discount);
    return {
      tier,
      per,
      seatSubtotal,
      seatFees,
      snackTotal,
      beforeDiscount,
      discount,
      total,
    };
  }, [
    booking.state.seatTier,
    booking.state.seats,
    booking.state.snacks,
    coupon,
  ]);

  const canPay =
    movie &&
    theater &&
    show &&
    booking.state.seats.length > 0 &&
    !processing &&
    method;

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
      <BookingStepper current="payment" />
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white sm:text-3xl">
            Payment
          </h1>
          <p className="mt-1 text-sm text-white/60">
            Complete your booking securely.
          </p>
        </div>
        <Button variant="subtle" onClick={() => navigate(-1)}>
          Back
        </Button>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_360px]">
        <Card className="p-4">
          <div className="text-sm font-semibold text-white">Apply coupon</div>
          <div className="mt-3 flex flex-col gap-2 sm:flex-row">
            <input
              value={coupon}
              onChange={(e) => setCoupon(e.target.value)}
              placeholder="Try: NOIR10"
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/40 outline-none transition focus:border-white/20 focus:bg-white/10"
            />
            <Button
              variant="subtle"
              onClick={() => booking.setCoupon(coupon.trim())}
              className="sm:w-40"
            >
              Apply
            </Button>
          </div>
          <div className="mt-2 text-xs text-white/50">
            Available: <span className="text-white/70">NOIR10</span>,{" "}
            <span className="text-white/70">BMSLIKE</span>
          </div>

          <div className="mt-6 text-sm font-semibold text-white">
            Payment method
          </div>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {PAYMENT_METHODS.map((m) => {
              const active = method === m.id;
              return (
                <button
                  key={m.id}
                  type="button"
                  className={[
                    "rounded-2xl border p-4 text-left transition",
                    active
                      ? "border-white/25 bg-white text-black"
                      : "border-white/10 bg-white/5 text-white/80 hover:bg-white/10 hover:text-white",
                  ].join(" ")}
                  onClick={() => {
                    setMethod(m.id);
                    booking.setPaymentMethod(m.id);
                  }}
                >
                  <div className="text-sm font-semibold">{m.label}</div>
                  <div
                    className={[
                      "mt-1 text-xs",
                      active ? "text-black/70" : "text-white/50",
                    ].join(" ")}
                  >
                    Fast and secure
                  </div>
                </button>
              );
            })}
          </div>

          <Button
            className="mt-6 w-full"
            disabled={!canPay}
            onClick={async () => {
              setProcessing(true);
              booking.setCoupon(coupon.trim());
              booking.setPaymentMethod(method);
              await new Promise((r) => setTimeout(r, 900));
              setProcessing(false);
              navigate("/confirmation");
            }}
          >
            {processing ? "Processing…" : "Pay now"}
          </Button>
        </Card>

        <Card className="p-4">
          <div className="text-sm font-semibold text-white">
            Booking summary
          </div>
          <div className="mt-3 space-y-2 text-sm text-white/70">
            <div className="text-white">
              {movie ? movie.title : "—"}
              <div className="mt-1 text-xs text-white/60">
                {theater ? theater.name : "—"} •{" "}
                {show ? `${show.date} • ${show.time}` : "—"}
              </div>
            </div>

            <div className="mt-3 border-t border-white/10 pt-3 space-y-2">
              <div className="flex items-center justify-between">
                <span>
                  Seats ({pricing.tier}) • ₹{pricing.per} ×{" "}
                  {booking.state.seats.length}
                </span>
                <span className="text-white">₹{pricing.seatSubtotal}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Fees</span>
                <span className="text-white">₹{pricing.seatFees}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Snacks</span>
                <span className="text-white">₹{pricing.snackTotal}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Discount</span>
                <span className="text-white">−₹{pricing.discount}</span>
              </div>
              <div className="flex items-center justify-between text-base font-semibold">
                <span className="text-white">Total</span>
                <span className="text-white">₹{pricing.total}</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
