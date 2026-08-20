import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { CheckCircle2, Download, Share2, Ticket, Calendar, MapPin, Armchair, ArrowRight, QrCode } from "lucide-react";
import BookingStepper from "../components/BookingStepper.jsx";
import Button from "../components/ui/Button.jsx";
import Card from "../components/ui/Card.jsx";
import Badge from "../components/ui/Badge.jsx";
import { useBooking } from "../state/bookingContext.jsx";
import { useToast } from "../state/toastContext.jsx";
import { formatCurrency } from "../utils/formatters.js";

function ticketCode(seed) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 33 + seed.charCodeAt(i)) >>> 0;
  return `MT-${String(h).slice(0, 8)}`;
}

export default function Confirmation() {
  const { bookingId } = useParams();
  const booking = useBooking();
  const { showToast } = useToast();

  const movie = booking.state.movie || {};
  const theater = booking.state.theater || {};
  const show = booking.state.show || {};
  const backendBooking = booking.state.bookingResponse;

  const movieTitle = (backendBooking?.movieTitle && backendBooking.movieTitle !== "Selected Movie") ? backendBooking.movieTitle : (movie.title || "Movie");
  const theaterName = (backendBooking?.theaterName) ? backendBooking.theaterName : (theater.name || "Cinema Theater");
  const date = backendBooking?.showDate || booking.state.date || show.date || "Today";
  const time = backendBooking?.showTime || booking.state.time || show.time || "19:30";
  const seatList = backendBooking?.seats?.length ? backendBooking.seats.join(", ") : (booking.state.seats.length ? booking.state.seats.join(", ") : "Standard Reserved Seats");

  const code = useMemo(() => {
    if (bookingId) return bookingId;
    if (backendBooking?.bookingCode) return backendBooking.bookingCode;
    const seed = `${booking.state.showId || "show"}:${booking.state.seats.join(",")}`;
    return ticketCode(seed);
  }, [bookingId, backendBooking, booking.state.seats, booking.state.showId]);

  const qrUrl = useMemo(() => {
    if (backendBooking?.qrCodeUrl) return backendBooking.qrCodeUrl;
    return `https://api.qrserver.com/v1/create-qr-code/?size=300x300&margin=10&data=${encodeURIComponent(code)}`;
  }, [backendBooking, code]);

  const handleDownloadPdf = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      showToast("Please allow popups to download your PDF ticket.", "error");
      return;
    }

    const paidAmount = formatCurrency(backendBooking?.totalAmount || booking.state.totalPrice || 0);

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>BookMySeat_Ticket_${code}</title>
          <style>
            @page { size: A4 portrait; margin: 15mm; }
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #0f172a; margin: 0; padding: 20px; background: #fff; }
            .ticket-card { border: 2px solid #e2e8f0; border-radius: 24px; padding: 32px; max-width: 620px; margin: 0 auto; box-shadow: 0 10px 30px rgba(0,0,0,0.06); background: #ffffff; }
            .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px dashed #cbd5e1; padding-bottom: 18px; margin-bottom: 24px; }
            .logo { font-size: 24px; font-weight: 900; color: #dc2626; letter-spacing: -0.5px; }
            .badge { background: #dcfce7; color: #15803d; padding: 6px 14px; border-radius: 50px; font-weight: 800; font-size: 11px; text-transform: uppercase; border: 1px solid #bbf7d0; }
            .movie-title { font-size: 26px; font-weight: 900; margin: 0 0 6px 0; color: #0f172a; }
            .meta { font-size: 13px; color: #64748b; font-weight: 700; margin-bottom: 24px; }
            .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 18px; }
            .info-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 16px; padding: 14px; }
            .label { font-size: 10px; font-weight: 800; text-transform: uppercase; color: #94a3b8; margin-bottom: 4px; letter-spacing: 0.5px; }
            .value { font-size: 14px; font-weight: 800; color: #0f172a; }
            .qr-section { text-align: center; background: #f1f5f9; border-radius: 20px; padding: 22px; margin-top: 22px; border: 1px solid #e2e8f0; }
            .qr-img { width: 170px; height: 170px; margin: 0 auto 10px auto; display: block; border-radius: 12px; background: #fff; padding: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); }
            .instructions { font-size: 11px; color: #64748b; text-align: center; margin-top: 20px; line-height: 1.5; font-weight: 600; }
            .footer { border-top: 2px border-slate-100; margin-top: 24px; padding-top: 16px; display: flex; justify-content: space-between; font-size: 13px; font-weight: 800; color: #1e293b; background: #f8fafc; padding: 12px 18px; border-radius: 14px; }
          </style>
        </head>
        <body>
          <div class="ticket-card">
            <div class="header">
              <div class="logo">🎟️ BOOKMYSEAT</div>
              <div class="badge">ACTIVE E-TICKET PASS</div>
            </div>

            <h1 class="movie-title">${movieTitle}</h1>
            <div class="meta">${movie.language || "Hindi"} • ${movie.format ? (Array.isArray(movie.format) ? movie.format.join("/") : movie.format) : "2D"} • ${movie.certification || "U/A"}</div>

            <div class="grid">
              <div class="info-box">
                <div class="label">Cinema Theater</div>
                <div class="value">${theaterName}</div>
              </div>
              <div class="info-box">
                <div class="label">Show Date & Time</div>
                <div class="value">${date} @ ${time}</div>
              </div>
            </div>

            <div class="grid">
              <div class="info-box">
                <div class="label">Reserved Seats</div>
                <div class="value">${seatList}</div>
              </div>
              <div class="info-box">
                <div class="label">Booking Pass Code</div>
                <div class="value" style="font-family: monospace; color: #dc2626;">${code}</div>
              </div>
            </div>

            <div class="qr-section">
              <img src="${qrUrl}" class="qr-img" alt="Scannable QR Ticket Pass" />
              <div style="font-size: 12px; font-weight: 900; color: #0f172a; tracking-wide: 0.5px;">SCAN QR CODE AT CINEMA ENTRANCE</div>
            </div>

            <div class="footer">
              <span>Paid Amount: ${paidAmount}</span>
              <span style="color: #16a34a;">STATUS: PAYMENT SUCCESSFUL ✓</span>
            </div>

            <div class="instructions">
              Please arrive 15 minutes before showtime. Show this digital PDF pass or physical printout at the cinema turnstile.
            </div>
          </div>
          <script>
            window.onload = function() {
              window.print();
              setTimeout(function() { window.close(); }, 800);
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
    showToast("PDF Ticket Pass generated successfully!", "success");
  };

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
          Your movie tickets have been processed. Show this digital pass or scan the QR code at the cinema entrance.
        </p>
      </div>

      {/* Printable Digital Ticket Pass Card */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl">
        <div className="grid gap-6 md:grid-cols-12 items-center">
          {/* Left Pass Details */}
          <div className="md:col-span-8 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <Badge variant="emerald" className="font-extrabold">ACTIVE TICKET PASS</Badge>
              <span className="font-mono text-xs font-bold text-slate-500">
                {code}
              </span>
            </div>

            <div>
              <h2 className="text-2xl font-black text-slate-900">
                {movieTitle}
              </h2>
              <p className="text-xs text-slate-500 font-semibold mt-1">
                {movie?.language || "Hindi"} • {movie?.format ? (Array.isArray(movie.format) ? movie.format.join("/") : movie.format) : "2D"} • {movie?.certification || "U/A"}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                <div className="flex items-center gap-1.5 text-slate-400 font-medium">
                  <MapPin className="h-3.5 w-3.5 text-red-500" />
                  <span>Cinema</span>
                </div>
                <div className="mt-1 font-bold text-slate-900 truncate">
                  {theaterName}
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
                {seatList}
              </div>
            </div>

            {/* Payment Receipt Box */}
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-3 text-xs space-y-1.5">
              <div className="flex items-center justify-between font-extrabold text-emerald-800">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span>Payment Confirmed</span>
                </div>
                <span className="text-[10px] bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded-full uppercase tracking-wider font-extrabold">
                  {backendBooking?.paymentStatus || "SUCCESS"}
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-600 font-medium pt-1">
                <span>Transaction Ref:</span>
                <span className="font-mono font-bold text-slate-900">{backendBooking?.paymentTransactionId || `TXN-${String(code).slice(-6)}`}</span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-600 font-medium">
                <span>Method:</span>
                <span className="font-bold text-slate-900 uppercase">{backendBooking?.paymentMethod || booking.state.paymentMethod || "Razorpay / UPI"}</span>
              </div>
              <div className="flex items-center justify-between text-xs font-bold text-emerald-900 pt-1.5 border-t border-emerald-200">
                <span>Total Amount Paid:</span>
                <span className="text-sm font-black text-emerald-900">{formatCurrency(backendBooking?.totalAmount || 0)}</span>
              </div>
            </div>
          </div>

          {/* Right Scannable QR Code Ticket Stub */}
          <div className="md:col-span-4 flex flex-col items-center justify-center p-4 rounded-2xl border border-slate-200 bg-slate-50 text-center space-y-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
              <img
                src={qrUrl}
                alt="Ticket QR Code"
                className="h-36 w-36 object-contain mx-auto rounded-lg"
              />
            </div>
            <span className="text-[11px] font-extrabold text-slate-700 tracking-wide uppercase flex items-center justify-center gap-1 pt-1">
              <QrCode className="h-3.5 w-3.5 text-red-600" />
              <span>Scan QR Code Pass</span>
            </span>
          </div>

        </div>

        {/* Action CTAs */}
        <div className="mt-6 border-t border-slate-200 pt-4 flex flex-wrap gap-2 sm:flex-row justify-end">
          <Button
            variant="danger"
            onClick={handleDownloadPdf}
            className="gap-2 font-extrabold cursor-pointer"
          >
            <Download className="h-4 w-4" />
            <span>Download PDF E-Ticket</span>
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
            className="gap-2 font-bold cursor-pointer"
          >
            <Share2 className="h-4 w-4" />
            <span>Share Ticket</span>
          </Button>

          <Button
            as={Link}
            to="/"
            onClick={() => booking.reset()}
            className="gap-2 font-bold cursor-pointer"
          >
            <span>Book Another Movie</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
