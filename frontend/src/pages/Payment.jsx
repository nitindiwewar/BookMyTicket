import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CreditCard,
  QrCode,
  Building,
  Wallet,
  ShieldCheck,
  CheckCircle2,
  Tag,
  Clock,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import BookingStepper from "../components/BookingStepper.jsx";
import Button from "../components/ui/Button.jsx";
import Card from "../components/ui/Card.jsx";
import Badge from "../components/ui/Badge.jsx";
import Input from "../components/ui/Input.jsx";
import { useBooking } from "../state/bookingContext.jsx";
import { formatCurrency } from "../utils/formatters.js";
import { validateCouponApi } from "../api/couponApi.js";
import { createBookingApi } from "../api/bookingApi.js";
import { useAuth } from "../state/authContext.jsx";
import { createRazorpayOrderApi, verifyPaymentApi } from "../api/paymentApi.js";

function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}




const SNACK_PRICES = {
  Popcorn: 220,
  Soda: 120,
  Combo: 310,
  Nachos: 190,
};

const SNACK_THUMBS = {
  Popcorn: "https://images.unsplash.com/photo-1578849278619-e73505e9610f?q=80&w=200&auto=format&fit=crop",
  Soda: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?q=80&w=200&auto=format&fit=crop",
  Combo: "https://images.unsplash.com/photo-1585647347483-22b66260dfff?q=80&w=200&auto=format&fit=crop",
  Nachos: "https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?q=80&w=200&auto=format&fit=crop",
};

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

export default function Payment() {
  const booking = useBooking();
  const navigate = useNavigate();

  const show = booking.state.show || {};
  const movie = booking.state.movie || {};
  const theater = booking.state.theater || {};


  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [couponError, setCouponError] = useState("");
  const [couponSuccess, setCouponSuccess] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  // 10-minute countdown timer state
  const [timeLeft, setTimeLeft] = useState(600); // 10 mins

  useEffect(() => {
    if (timeLeft <= 0) return;
    const interval = setInterval(() => {
      setTimeLeft((t) => t - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timeLeft]);

  const formattedTime = useMemo(() => {
    const m = Math.floor(timeLeft / 60);
    const s = timeLeft % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }, [timeLeft]);

  const ticketTotal = useMemo(() => {
    const customPrices = booking.state.seatPrices || {};
    return booking.state.seats.reduce((sum, seatId) => {
      const row = seatId.charAt(0);
      const tier = getTier(row);
      const price = customPrices[tier] || SEAT_PRICES[tier];
      return sum + price;
    }, 0);
  }, [booking.state.seats, booking.state.seatPrices]);

  const snackTotal = useMemo(() => {
    return Object.entries(booking.state.snacks).reduce((sum, [key, count]) => {
      return sum + (SNACK_PRICES[key] || 0) * count;
    }, 0);
  }, [booking.state.snacks]);

  const fee = 30;
  const subtotal = ticketTotal + snackTotal + fee;
  const finalTotal = Math.max(0, subtotal - discount);

  const applyCouponCode = async (codeToApply) => {

    const code = (codeToApply || coupon).trim().toUpperCase();
    setCoupon(code);
    try {
      const res = await validateCouponApi(code, subtotal);
      if (res.valid) {
        setDiscount(res.discountAmount || 0);
        setCouponSuccess(res.message || `Coupon ${code} applied!`);
        setCouponError("");
      } else {
        setCouponError(res.message || "Invalid coupon code.");
        setCouponSuccess("");
        setDiscount(0);
      }
    } catch {
      setCouponError("Could not validate coupon. Please try again.");
      setCouponSuccess("");
      setDiscount(0);
    }
  };

  const { isLoggedIn, userData, openLoginModal } = useAuth();

  useEffect(() => {
    if (!isLoggedIn) {
      openLoginModal();
    }
  }, [isLoggedIn, openLoginModal]);

  const handlePay = async () => {
    if (!isLoggedIn || !userData) {
      openLoginModal();
      return;
    }
    setIsProcessing(true);
    const email = userData.email || "";
    const phone = userData.mobile || "";


    const processFinalBooking = async (rzpDetails = {}) => {
      try {
        const activeShowId = booking.state.showId || booking.state.show?.id || `s-${booking.state.movieId || "m1"}-${booking.state.theaterId || "t1"}-${booking.state.date || "today"}-${booking.state.time?.replace(":", "") || "1930"}`;
        const payload = {
          showId: activeShowId,
          movieId: movie?.id || booking.state.movieId,
          theaterId: theater?.id || booking.state.theaterId,
          showDate: booking.state.date || show?.date,
          showTime: booking.state.time || show?.time,
          seats: booking.state.seats,
          seatTier: booking.state.seatTier || "Premium",
          snacks: booking.state.snacks,
          coupon: coupon,
          paymentMethod: rzpDetails.razorpayPaymentId ? "RAZORPAY" : paymentMethod.toUpperCase(),
          paymentTransactionId: rzpDetails.razorpayPaymentId || `TXN-${Date.now()}`,
          paymentStatus: "SUCCESS",
          paymentDetails: paymentMethod.toUpperCase() === "UPI" ? "UPI Instant Payment (Google Pay / PhonePe)" : (paymentMethod.toUpperCase() === "CARD" ? "Credit / Debit Card Payment" : "Verified Digital Payment"),
          customerEmail: email,
          customerPhone: phone,
          razorpayOrderId: rzpDetails.razorpayOrderId || null,
          razorpayPaymentId: rzpDetails.razorpayPaymentId || null,
          razorpaySignature: rzpDetails.razorpaySignature || null,
        };

        const res = await createBookingApi(payload);
        if (res && booking.setBookingResponse) {
          booking.setBookingResponse(res);
          if (res.movieTitle) {
            booking.setMovie({
              ...(movie || {}),
              id: booking.state.movieId || movie?.id,
              title: res.movieTitle,
              posterUrl: res.moviePoster || movie?.posterUrl,
            });
          }
        }
        setIsProcessing(false);
        navigate("/confirmation");
      } catch (err) {
        setIsProcessing(false);
        console.warn("Backend booking request error:", err.message);
        alert(err.message || "Booking failed: Selected seats are already booked. Please choose available seats.");
        const redirectMovieId = booking.state.movieId || "m1";
        const redirectShowId = booking.state.showId || "s-m1-t1-2026-07-29-1030";
        navigate(`/movies/${redirectMovieId}/seats/${redirectShowId}`);
      }
    };

    try {
      const orderResp = await createRazorpayOrderApi(finalTotal, `rec_${Date.now()}`);
      const orderData = orderResp?.orderId ? orderResp : orderResp?.data;
      if (orderData && orderData.orderId) {
        const { orderId, keyId, amount, currency } = orderData;
        const scriptLoaded = await loadRazorpayScript();
        if (scriptLoaded && window.Razorpay) {

          const options = {
            key: keyId,
            amount: amount,
            currency: currency || "INR",
            name: "BookMySeat",
            description: `Movie Tickets (${movie?.title || "Cinema"})`,
            order_id: orderId,
            prefill: {
              name: userData?.name || "Customer",
              email: email,
              contact: phone,
              method: "upi",
            },
            config: {
              display: {
                blocks: {
                  upi: {
                    name: "Pay using QR Code or UPI App",
                    instruments: [
                      {
                        method: "upi",
                        flows: ["qr", "intent", "collect"],
                      },
                    ],
                  },
                },
                sequence: ["block.upi", "block.other"],
                preferences: {
                  show_default_blocks: true,
                },
              },
            },
            theme: {
              color: "#E11D48",
            },
            handler: async function (response) {
              try {
                // Verify payment signature via backend API before creating booking
                const verifyRes = await verifyPaymentApi(
                  response.razorpay_order_id,
                  response.razorpay_payment_id,
                  response.razorpay_signature
                );

                if (verifyRes && (verifyRes.verified || verifyRes.success !== false)) {
                  await processFinalBooking({
                    razorpayOrderId: response.razorpay_order_id,
                    razorpayPaymentId: response.razorpay_payment_id,
                    razorpaySignature: response.razorpay_signature,
                  });
                } else {
                  setIsProcessing(false);
                  alert("Payment verification failed! Invalid signature received.");
                }
              } catch (verificationErr) {
                setIsProcessing(false);
                console.error("Signature verification error:", verificationErr);
                alert("Payment verification failed! Could not confirm payment signature.");
              }
            },
            modal: {
              ondismiss: function () {
                setIsProcessing(false);
                alert("Payment cancelled by user. No tickets were booked.");
              },
            },
          };

          const rzp = new window.Razorpay(options);
          rzp.open();
          return;
        }
      }
      setIsProcessing(false);
      alert("Failed to initialize Razorpay checkout. Please check your network and try again.");
    } catch (err) {
      setIsProcessing(false);
      console.error("Razorpay order creation error:", err);
      alert("Failed to create Razorpay payment order: " + (err.message || "Unknown error"));
    }
  };





  if (!booking.state.seats.length) {
    return (
      <div className="mx-auto w-full max-w-6xl px-4 py-12">
        <EmptyState
          title="No seats selected"
          description="Please select your seats before proceeding to payment."
          actionLabel="Select Seats"
          onAction={() => navigate("/movies")}
        />
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      <BookingStepper current="payment" />

      {/* Seats Held Sticky Countdown Banner */}
      <div className="flex items-center justify-between gap-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 p-4 text-amber-900 shadow-xs">
        <div className="flex items-center gap-2.5">
          <Clock className="h-5 w-5 text-amber-600 animate-pulse shrink-0" />
          <div className="text-xs sm:text-sm font-bold">
            Seats Reserved for <span className="font-mono text-base font-black text-amber-700">{formattedTime}</span> mins
          </div>
        </div>
        <Badge variant="amber" size="sm" className="hidden sm:inline-flex">
          Session Active
        </Badge>
      </div>

      <div className="grid gap-6 md:grid-cols-12">
        {/* Left Column: Payment Methods */}
        <div className="md:col-span-7 space-y-6">
          <Card className="p-6 space-y-5 bg-white shadow-xs">
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-red-600" />
              <span>Select Payment Method</span>
            </h2>

            {/* Payment Method Radio Tabs */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { id: "upi", label: "UPI & QR", icon: QrCode },
                { id: "card", label: "Credit/Debit Card", icon: CreditCard },
                { id: "netbanking", label: "Netbanking", icon: Building },
                { id: "wallet", label: "Wallets", icon: Wallet },
              ].map((m) => {
                const Icon = m.icon;
                const active = paymentMethod === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setPaymentMethod(m.id)}
                    className={`flex items-center gap-3 rounded-2xl border p-3.5 text-left text-xs font-bold transition ${
                      active
                        ? "border-red-600 bg-red-50 text-red-600 font-extrabold shadow-2xs"
                        : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    <Icon className={`h-4 w-4 ${active ? "text-red-600" : "text-slate-500"}`} />
                    <span>{m.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Method Inputs */}
            {paymentMethod === "upi" && (
              <div className="space-y-3 pt-2">
                <Input placeholder="Enter VPA / UPI ID (e.g. user@okhdfcbank)" />
                <p className="text-[11px] font-medium text-slate-500">
                  A payment request will be sent to your UPI app (GPay, PhonePe, Paytm).
                </p>
              </div>
            )}

            {paymentMethod === "card" && (
              <div className="space-y-3 pt-2">
                <Input placeholder="Card Number (16 digits)" />
                <div className="grid grid-cols-2 gap-3">
                  <Input placeholder="MM/YY" />
                  <Input placeholder="CVV" type="password" />
                </div>
                <Input placeholder="Cardholder Name" />
              </div>
            )}

            {paymentMethod === "netbanking" && (
              <div className="pt-2">
                <select className="w-full rounded-2xl bg-slate-100 p-3 text-xs font-bold text-slate-800 outline-none">
                  <option>Select Popular Bank</option>
                  <option>HDFC Bank</option>
                  <option>ICICI Bank</option>
                  <option>State Bank of India</option>
                  <option>Axis Bank</option>
                </select>
              </div>
            )}

            {paymentMethod === "wallet" && (
              <div className="pt-2">
                <select className="w-full rounded-2xl bg-slate-100 p-3 text-xs font-bold text-slate-800 outline-none">
                  <option>Select Digital Wallet</option>
                  <option>Amazon Pay</option>
                  <option>Paytm Wallet</option>
                  <option>Mobikwik</option>
                </select>
              </div>
            )}
          </Card>

          {/* One-Tap Coupon Code Validator */}
          <Card className="p-6 space-y-4 bg-white shadow-xs">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                <Tag className="h-4 w-4 text-red-600" />
                <span>Apply Promo Code</span>
              </h3>
              <Badge variant="cyan" size="sm">Available Offers</Badge>
            </div>

            {/* One-Tap Clickable Coupon Chips */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => applyCouponCode("NOIR10")}
                className="flex items-center gap-1.5 rounded-xl border border-dashed border-red-300 bg-red-50 px-3 py-1.5 text-xs font-extrabold text-red-700 hover:bg-red-100 transition"
              >
                <Sparkles className="h-3 w-3 text-red-600" />
                <span>NOIR10 (10% OFF)</span>
              </button>

              <button
                type="button"
                onClick={() => applyCouponCode("BMSLIKE")}
                className="flex items-center gap-1.5 rounded-xl border border-dashed border-cyan-300 bg-cyan-50 px-3 py-1.5 text-xs font-extrabold text-cyan-700 hover:bg-cyan-100 transition"
              >
                <Sparkles className="h-3 w-3 text-cyan-600" />
                <span>BMSLIKE (₹100 OFF)</span>
              </button>
            </div>

            <div className="flex gap-2">
              <Input
                value={coupon}
                onChange={(e) => setCoupon(e.target.value)}
                placeholder="Enter promo code..."
                containerClassName="flex-1"
              />
              <Button size="md" variant="subtle" onClick={() => applyCouponCode()}>
                Apply
              </Button>
            </div>

            {couponError && <p className="text-xs font-bold text-red-600">{couponError}</p>}
            {couponSuccess && <p className="text-xs font-bold text-emerald-600">{couponSuccess}</p>}
          </Card>
        </div>

        {/* Right Column: Order Summary with Snack Thumbnails */}
        <div className="md:col-span-5 space-y-6">
          <Card className="p-6 space-y-5 bg-white shadow-xs">
            <h2 className="text-lg font-black text-slate-900 border-b border-slate-100 pb-3">
              Order Breakdown
            </h2>

            {/* Movie & Theater Info */}
            <div className="space-y-1">
              <div className="text-base font-black text-slate-900">
                {movie ? movie.title : "Movie"}
              </div>
              <div className="text-xs font-medium text-slate-500">
                {theater ? theater.name : "Theater"} • {show?.date} @ {show?.time}
              </div>
            </div>

            {/* Seats Breakdown */}
            <div className="rounded-2xl bg-slate-50 p-3 text-xs space-y-1">
              <div className="font-bold text-slate-700">
                Seats ({booking.state.seats.length}):
              </div>
              <div className="font-black text-red-600">
                {booking.state.seats.join(", ")}
              </div>
            </div>

            {/* Pre-ordered Snack Items with Thumbnails */}
            {Object.entries(booking.state.snacks).some(([_, count]) => count > 0) && (
              <div className="space-y-2 border-t border-slate-100 pt-3">
                <div className="text-xs font-bold text-slate-700">Pre-ordered Concessions:</div>
                <div className="space-y-2">
                  {Object.entries(booking.state.snacks).map(([name, count]) => {
                    if (!count) return null;
                    return (
                      <div key={name} className="flex items-center justify-between text-xs font-medium bg-slate-50 p-2 rounded-xl">
                        <div className="flex items-center gap-2">
                          <img
                            src={SNACK_THUMBS[name] || SNACK_THUMBS.Popcorn}
                            alt={name}
                            className="h-8 w-8 rounded-lg object-cover"
                          />
                          <span>{name} x {count}</span>
                        </div>
                        <span className="font-bold text-slate-900">
                          {formatCurrency((SNACK_PRICES[name] || 0) * count)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Price Calculations */}
            <div className="space-y-2 border-t border-slate-100 pt-3 text-xs font-semibold text-slate-600">
              <div className="flex justify-between">
                <span>Ticket Amount</span>
                <span>{formatCurrency(ticketTotal)}</span>
              </div>
              {snackTotal > 0 && (
                <div className="flex justify-between">
                  <span>Concessions</span>
                  <span>{formatCurrency(snackTotal)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Convenience Fee & GST</span>
                <span>{formatCurrency(fee)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-extrabold">
                  <span>Promo Discount</span>
                  <span>-{formatCurrency(discount)}</span>
                </div>
              )}

              <div className="flex justify-between border-t border-slate-200 pt-3 text-base font-black text-slate-900">
                <span>Amount Payable</span>
                <span className="text-red-600">{formatCurrency(finalTotal)}</span>
              </div>
            </div>

            {/* Pay Button */}
            <Button
              size="lg"
              className="w-full shadow-xl shadow-red-600/30 font-black text-sm py-3"
              onClick={handlePay}
              disabled={isProcessing}
            >
              {isProcessing ? (
                "Processing Secure Payment..."
              ) : (
                <>
                  <ShieldCheck className="h-5 w-5" />
                  <span>Pay {formatCurrency(finalTotal)}</span>
                  <ArrowRight className="h-4 w-4 ml-auto" />
                </>
              )}
            </Button>

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 font-semibold text-center">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
              <span>256-bit SSL Encrypted & Guaranteed Instant Ticket Refund</span>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
