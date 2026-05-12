import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import BookingStepper from "../components/BookingStepper.jsx";
import Button from "../components/ui/Button.jsx";
import Card from "../components/ui/Card.jsx";
import { snacks } from "../data/snacks.js";
import { useBooking } from "../state/bookingContext.jsx";

export default function Snacks() {
  const booking = useBooking();
  const navigate = useNavigate();

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
  }, [booking.state.snacks]);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
      <BookingStepper current="snacks" />
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white sm:text-3xl">
            Food & Snacks
          </h1>
          <p className="mt-1 text-sm text-white/60">
            Add snacks to your booking (optional).
          </p>
        </div>
        <Button variant="subtle" onClick={() => navigate("/payment")}>
          Skip
        </Button>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_340px]">
        <div className="grid gap-3 sm:grid-cols-2">
          {snacks.map((s) => {
            const qty = booking.state.snacks[s.id] || 0;
            return (
              <Card key={s.id} className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-sm font-semibold text-white">
                      {s.name}
                    </div>
                    <div className="mt-1 text-xs text-white/60">₹{s.price}</div>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-white/70">
                    Add-on
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <div className="text-xs text-white/60">Quantity</div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      className="h-9 w-9 rounded-xl border border-white/10 bg-white/5 text-white/80 transition hover:bg-white/10 hover:text-white disabled:opacity-40"
                      disabled={!qty}
                      onClick={() =>
                        booking.setSnackQty(s.id, Math.max(0, qty - 1))
                      }
                      aria-label={`Decrease ${s.name}`}
                    >
                      −
                    </button>
                    <div className="w-8 text-center text-sm font-semibold text-white">
                      {qty}
                    </div>
                    <button
                      type="button"
                      className="h-9 w-9 rounded-xl border border-white/10 bg-white/5 text-white/80 transition hover:bg-white/10 hover:text-white"
                      onClick={() => booking.setSnackQty(s.id, qty + 1)}
                      aria-label={`Increase ${s.name}`}
                    >
                      +
                    </button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        <Card className="p-4">
          <div className="text-sm font-semibold text-white">Cart Summary</div>
          <div className="mt-3 space-y-2 text-sm text-white/70">
            <div className="flex items-center justify-between">
              <span>Items</span>
              <span className="text-white">{summary.items}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Total</span>
              <span className="text-white">₹{summary.total}</span>
            </div>
          </div>

          <Button className="mt-5 w-full" onClick={() => navigate("/payment")}>
            Continue to Payment
          </Button>
          <Button
            className="mt-2 w-full"
            variant="subtle"
            onClick={() => navigate(-1)}
          >
            Back
          </Button>
        </Card>
      </div>
    </div>
  );
}
