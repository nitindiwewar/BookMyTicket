import { useMemo } from "react";
import { Link } from "react-router-dom";
import { CheckCircle2, Download, Share2, Ticket, Calendar, MapPin, Armchair, ArrowRight } from "lucide-react";
import BookingStepper from "../components/BookingStepper.jsx";
import Button from "../components/ui/Button.jsx";
import Card from "../components/ui/Card.jsx";
import Badge from "../components/ui/Badge.jsx";
import { useBooking } from "../state/bookingContext.jsx";
import { useToast } from "../state/toastContext.jsx";

function ticketCode(seed) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 33 + seed.charCodeAt(i)) >>> 0;
  return `MT-${String(h).slice(0, 8)}`;
}

export default function Confirmation() {
  const booking = useBooking();
  const { showToast } = useToast();

  const movie = booking.state.movie || {};
  const theater = booking.state.theater || {};
  const show = booking.state.show || {};
  const date = booking.state.date || show.date || "Today";
  const time = booking.state.time || show.time || "19:30";

  const backendBooking = booking.state.bookingResponse;

  const code = useMemo(() => {
    if (backendBooking?.bookingCode) return backendBooking.bookingCode;
    const seed = `${booking.state.showId}:${booking.state.seats.join(",")}`;
    return ticketCode(seed);
  }, [backendBooking, booking.state.seats, booking.state.showId]);



  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      <BookingStepper current="confirmed" />

      {/* Success Banner Header */}
      <div className="text-center space-y-2">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-500 border border-emerald-500/30">
          <CheckCircle2 className="h-8 w-8" />
        </div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          Booking Confirmed!
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
          Your movie tickets have been processed. Show this digital pass at the cinema entrance.
        </p>
      </div>

      {/* Printable Digital Ticket Pass Card */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl">
        <div className="grid gap-6 md:grid-cols-12 items-center">
          {/* Left Pass Details */}
          <div className="md:col-span-8 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <Badge variant="emerald">ACTIVE TICKET PASS</Badge>
              <span className="font-mono text-xs font-bold text-slate-500">
                {code}
              </span>
            </div>

            <div>
              <h2 className="text-2xl font-black text-slate-900">
                {movie ? movie.title : "Movie Title"}
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                {movie?.language} • {movie?.format?.join("/")} • {movie?.certification}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                <div className="flex items-center gap-1.5 text-slate-400 font-medium">
                  <MapPin className="h-3.5 w-3.5 text-red-500" />
                  <span>Cinema</span>
                </div>
                <div className="mt-1 font-bold text-slate-900 truncate">
                  {theater ? theater.name : "—"}
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                <div className="flex items-center gap-1.5 text-slate-400 font-medium">
                  <Calendar className="h-3.5 w-3.5 text-cyan-500" />
                  <span>Showtime</span>
                </div>
                <div className="mt-1 font-bold text-slate-900 truncate">
                  {date} @ {time}
                </div>

              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 text-slate-400 font-medium">
                <Armchair className="h-3.5 w-3.5 text-amber-500" />
                <span>Reserved Seats</span>
              </div>
              <div className="font-bold text-slate-900">
                {booking.state.seats.length ? booking.state.seats.join(", ") : "—"}
              </div>
            </div>

            {/* Payment Receipt Box */}
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-3 text-xs space-y-1.5">
              <div className="flex items-center justify-between font-extrabold text-emerald-800">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span>Payment Confirmed</span>
                </div>
                <span className="text-[10px] bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded-full uppercase tracking-wider">
                  {backendBooking?.paymentStatus || "SUCCESS"}
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-600 font-medium pt-1">
                <span>Transaction Ref:</span>
                <span className="font-mono font-bold text-slate-900">{backendBooking?.paymentTransactionId || `TXN-${String(code).slice(-6)}`}</span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-600 font-medium">
                <span>Method:</span>
                <span className="font-bold text-slate-900 uppercase">{backendBooking?.paymentMethod || booking.state.paymentMethod || "UPI / CARD"}</span>
              </div>
            </div>
          </div>

          {/* Right Scannable QR Code Ticket Stub */}
          <div className="md:col-span-4 flex flex-col items-center justify-center p-4 rounded-2xl border border-slate-200 bg-slate-100 text-center space-y-2">
            <div className="rounded-2xl border border-slate-300 bg-white p-3 shadow-sm">
              <img
                src={backendBooking?.qrCodeUrl || `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(code)}`}
                alt="Ticket QR Code"
                className="h-32 w-32 object-contain mx-auto rounded-lg"
              />
            </div>
            <span className="text-[11px] font-bold text-slate-700 tracking-wide uppercase">
              Scan Pass at Cinema Entrance
            </span>
          </div>

        </div>

        {/* Action CTAs */}
        <div className="mt-6 border-t border-slate-200 pt-4 flex flex-wrap gap-2 sm:flex-row justify-end">
          <Button
            variant="secondary"
            onClick={() => window.print()}
            className="gap-2"
          >
            <Download className="h-4 w-4" />
            Download Ticket
          </Button>

          <Button
            variant="subtle"
            onClick={async () => {
              const text = `My BookMySeat Ticket: ${movie?.title ?? ""} (${code})`;
              if (navigator.share) await navigator.share({ text });
              else {
                await navigator.clipboard.writeText(text);
                showToast("Ticket details copied to clipboard!", "success");
              }
            }}
            className="gap-2"
          >
            <Share2 className="h-4 w-4" />
            Share Ticket
          </Button>

          <Button
            as={Link}
            to="/"
            onClick={() => booking.reset()}
            className="gap-2"
          >
            <span>Book Another Movie</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
