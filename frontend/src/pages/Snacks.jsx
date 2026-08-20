import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Plus, Minus, ArrowRight, SkipForward, Utensils } from "lucide-react";
import BookingStepper from "../components/BookingStepper.jsx";
import Button from "../components/ui/Button.jsx";
import Card from "../components/ui/Card.jsx";
import Badge from "../components/ui/Badge.jsx";
import { getSnacks } from "../api/snackApi.js";
import { useBooking } from "../state/bookingContext.jsx";

const SNACK_PHOTOS = {
  "Classic Salted Popcorn": "https://images.unsplash.com/photo-1578849278619-e73505e9610f?w=300&auto=format&fit=crop",
  "Gourmet Caramel Popcorn": "https://images.unsplash.com/photo-1585647347384-2593bc35786b?w=300&auto=format&fit=crop",
  "Loaded Mexican Nachos": "https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=300&auto=format&fit=crop",
  "Blockbuster Combo": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=300&auto=format&fit=crop",
  "Fountain Pepsi Chill": "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=300&auto=format&fit=crop",
  "Crispy Veg Samosa Trio": "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=300&auto=format&fit=crop",
  "Cheesy Fries": "https://images.unsplash.com/photo-1576107232684-1279f390859f?w=300&auto=format&fit=crop",
  "Cold Coffee": "https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=300&auto=format&fit=crop",
};

function getSnackPhoto(name) {
  if (!name) return "https://images.unsplash.com/photo-1578849278619-e73505e9610f?w=300&auto=format&fit=crop";
  const lower = name.toLowerCase();
  for (const [key, url] of Object.entries(SNACK_PHOTOS)) {
    if (lower.includes(key.toLowerCase()) || key.toLowerCase().includes(lower)) return url;
  }
  if (lower.includes("popcorn")) return "https://images.unsplash.com/photo-1578849278619-e73505e9610f?w=300&auto=format&fit=crop";
  if (lower.includes("nacho") || lower.includes("cheese")) return "https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=300&auto=format&fit=crop";
  if (lower.includes("combo")) return "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=300&auto=format&fit=crop";
  if (lower.includes("pepsi") || lower.includes("drink") || lower.includes("coke")) return "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=300&auto=format&fit=crop";
  return "https://images.unsplash.com/photo-1578849278619-e73505e9610f?w=300&auto=format&fit=crop";
}

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

export default function Snacks() {
  const { id: urlMovieId } = useParams();
  const booking = useBooking();
  const navigate = useNavigate();
  const [snacks, setSnacks] = useState([]);

  useEffect(() => {
    getSnacks().then((data) => {
      if (Array.isArray(data) && data.length > 0) {
        setSnacks(data);
      }
    }).catch(() => {});
  }, []);

  const targetMovieId = urlMovieId || booking.state.movieId;
  const paymentPath = targetMovieId ? `/movies/${targetMovieId}/payment` : "/payment";

  const ticketTotal = useMemo(() => {
    const customPrices = booking.state.seatPrices || {};
    return (booking.state.seats || []).reduce((sum, seatId) => {
      const row = seatId.charAt(0);
      const tier = getTier(row);
      return sum + (customPrices[tier] || SEAT_PRICES[tier]);
    }, 0);
  }, [booking.state.seats, booking.state.seatPrices]);

  const summary = useMemo(() => {
    let items = 0;
    let total = 0;
    for (const s of snacks) {
      const qty = booking.state.snacks[s.id] || 0;
      if (qty) {
        items += qty;
        total += qty * s.price;
      }
    }
    return { items, total };
  }, [booking.state.snacks, snacks]);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-4 sm:px-6 lg:px-8 space-y-4">
      {/* Compact Stepper */}
      <BookingStepper currentStep={3} />

      {/* Header Bar */}
      <div className="flex items-center justify-between gap-4 pt-1">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Utensils className="h-5 w-5 text-[#FF1744]" />
            <span>Food & Beverage Snacks</span>
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Pre-order delicious cinema snacks and skip the concession lines.
          </p>
        </div>

        <Button
          variant="subtle"
          size="sm"
          onClick={() => navigate(paymentPath)}
          className="gap-1.5 text-xs font-bold"
        >
          <span>Skip F&B</span>
          <SkipForward className="h-3.5 w-3.5" />
        </Button>
      </div>

      <div className="grid gap-5 lg:grid-cols-12">
        {/* Snacks Grid */}
        <div className="lg:col-span-8 grid gap-4 sm:grid-cols-2">
          {snacks.map((s) => {
            const qty = booking.state.snacks[s.id] || 0;
            const photoSrc = s.imageUrl || s.image || getSnackPhoto(s.name);
            return (
              <Card key={s.id} hover className="p-4 flex flex-col justify-between space-y-3 bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={photoSrc}
                      alt={s.name}
                      className="h-16 w-16 rounded-2xl object-cover border border-slate-200/80 shadow-2xs shrink-0"
                    />
                    <div className="space-y-0.5">
                      <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 line-clamp-2">
                        {s.name}
                      </h4>
                      <p className="text-xs font-black text-[#FF1744]">
                        ₹{s.price}
                      </p>
                    </div>
                  </div>
                  <Badge variant="subtle" className="text-[10px] shrink-0 font-bold">Add-on</Badge>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <span className="text-xs font-bold text-slate-500">Quantity</span>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      disabled={!qty}
                      onClick={() => booking.setSnackQty(s.id, Math.max(0, qty - 1))}
                      className="flex h-7 w-7 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-30 transition cursor-pointer"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="w-5 text-center text-xs font-black text-slate-900">
                      {qty}
                    </span>
                    <button
                      type="button"
                      onClick={() => booking.setSnackQty(s.id, qty + 1)}
                      className="flex h-7 w-7 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition cursor-pointer"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Cart Summary */}
        <Card className="lg:col-span-4 p-5 flex flex-col justify-between space-y-5 bg-white border border-slate-200/80 shadow-sm h-fit">
          <div className="space-y-4">
            <h3 className="text-base font-extrabold text-slate-900 border-b border-slate-100 pb-3">
              Food & Beverage Cart
            </h3>

            <div className="space-y-2.5 text-xs text-slate-600 font-medium">
              <div className="flex items-center justify-between">
                <span>Reserved Seats ({booking.state.seats.length})</span>
                <span className="font-extrabold text-slate-900">₹{ticketTotal}</span>
              </div>

              {booking.state.seats.length > 0 && (
                <div className="text-[11px] text-slate-400 font-semibold truncate">
                  {booking.state.seats.map((s) => `${s} (${getTier(s.charAt(0))})`).join(", ")}
                </div>
              )}

              <div className="flex items-center justify-between border-t border-slate-100 pt-2">
                <span>Selected F&B Items</span>
                <span className="font-extrabold text-slate-900">{summary.items} ({summary.total ? `₹${summary.total}` : "₹0"})</span>
              </div>

              <div className="border-t border-slate-100 pt-3 flex items-center justify-between text-base font-black text-slate-900">
                <span>Running Subtotal</span>
                <span className="text-[#FF1744]">₹{ticketTotal + summary.total}</span>
              </div>
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <Button
              size="md"
              className="w-full font-extrabold shadow-md shadow-red-500/20"
              onClick={() => navigate(paymentPath)}
            >
              <span>Continue to Payment</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button
              variant="subtle"
              size="sm"
              className="w-full text-xs font-bold"
              onClick={() => navigate(-1)}
            >
              Back to Seats
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
