import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Ticket, Heart, Sparkles, Check, X, Shield, FileText } from "lucide-react";
import Button from "./ui/Button.jsx";
import { useLocationCity } from "../state/locationContext.jsx";

export default function Footer() {
  const navigate = useNavigate();
  const loc = useLocationCity();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [toast, setToast] = useState("");
  const [modalType, setModalType] = useState(null); // 'terms' | 'privacy' | null

  const showNotification = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3500);
  };

  const handleCityClick = (cityName) => {
    if (loc?.setCity) {
      loc.setCity(cityName);
    }
    showNotification(`Location set to ${cityName}`);
    navigate("/movies");
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      showNotification("Please enter a valid email address.");
      return;
    }
    setSubscribed(true);
    showNotification("Thank you for subscribing to BookMySeat movie updates!");
  };

  return (
    <footer className="w-full border-t border-[#E5E7EB] bg-white relative">
      {/* Floating Notification Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-xs font-bold text-white shadow-2xl border border-slate-700 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <Check className="h-4 w-4 text-emerald-400" />
          <span>{toast}</span>
        </div>
      )}

      {/* Info Modals (Terms & Privacy) */}
      {modalType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-5">
            <button
              onClick={() => setModalType(null)}
              className="absolute top-5 right-5 grid h-8 w-8 place-items-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 transition cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>

            {modalType === "terms" && (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-2xl bg-red-50 text-[#FF1744]">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-extrabold text-[#111827]">Terms of Service</h3>
                    <p className="text-xs text-slate-500 font-semibold">BookMySeat Terms & User Agreement</p>
                  </div>
                </div>
                <div className="text-xs text-slate-600 font-medium space-y-2.5 max-h-60 overflow-y-auto pr-2 leading-relaxed">
                  <p>1. <strong>Ticket Booking:</strong> All bookings made through BookMySeat are final once confirmed via payment authorization.</p>
                  <p>2. <strong>Cancellations:</strong> Cancellations are permitted up to 4 hours prior to showtime according to multiplex partner policies.</p>
                  <p>3. <strong>Seat Selection:</strong> Reserved seats are guaranteed upon successful transaction confirmation.</p>
                  <p>4. <strong>Age Ratings:</strong> Users must comply with official CBFC cinema certification standards (U, UA, A).</p>
                </div>
              </div>
            )}

            {modalType === "privacy" && (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-2xl bg-red-50 text-[#FF1744]">
                    <Shield className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-extrabold text-[#111827]">Privacy Policy</h3>
                    <p className="text-xs text-slate-500 font-semibold">Data Protection & Security Standard</p>
                  </div>
                </div>
                <div className="text-xs text-slate-600 font-medium space-y-2.5 max-h-60 overflow-y-auto pr-2 leading-relaxed">
                  <p>1. <strong>Data Encryption:</strong> Personal and transaction details are encrypted using SSL industry standards.</p>
                  <p>2. <strong>Usage:</strong> Contact info is strictly utilized for booking tickets, sending M-Tickets, and customer support.</p>
                  <p>3. <strong>No Third-Party Sharing:</strong> Your payment credentials are processed securely via PCI-DSS compliant gateways.</p>
                </div>
              </div>
            )}

            <Button onClick={() => setModalType(null)} className="w-full">
              Close & Continue
            </Button>
          </div>
        </div>
      )}

      <div className="mx-auto max-w-[1400px] px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-5">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#FF1744] to-[#FF4F6D] text-white shadow-lg shadow-red-500/30">
                <Ticket className="h-5 w-5 stroke-[2.2]" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-extrabold tracking-tight text-[#111827] font-heading">
                  BookMy<span className="text-[#FF1744]">Seat</span>
                </span>
                <span className="text-[9px] font-extrabold text-[#6B7280] -mt-1 tracking-widest uppercase flex items-center gap-1">
                  <Sparkles className="h-2.5 w-2.5 text-[#FF1744]" /> Cinema Pass
                </span>
              </div>
            </Link>
            <p className="max-w-sm text-sm text-[#6B7280] leading-relaxed font-medium">
              The premier destination for booking movie tickets, discovering upcoming blockbusters, and enjoying cinema experiences nationwide.
            </p>

            {/* Newsletter input */}
            <form onSubmit={handleSubscribe} className="flex items-center gap-2 max-w-sm pt-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Subscribe for movie updates..."
                className="w-full rounded-full bg-slate-100 px-4 py-2.5 text-xs text-[#111827] placeholder:text-[#6B7280] outline-none focus:bg-slate-200/70 border border-slate-200"
              />
              <Button size="sm" variant="primary" type="submit" className="shrink-0">
                {subscribed ? "Subscribed" : "Join"}
              </Button>
            </form>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#111827] mb-4">
              Explore
            </h4>
            <ul className="space-y-2.5 text-xs font-bold text-[#6B7280]">
              <li>
                <Link to="/movies?status=nowshowing" className="hover:text-[#FF1744] transition flex items-center gap-1.5">
                  Now Showing
                </Link>
              </li>
              <li>
                <Link to="/movies?filter=upcoming" className="hover:text-[#FF1744] transition flex items-center gap-1.5">
                  Upcoming Releases
                </Link>
              </li>
              <li>
                <Link to="/support" className="hover:text-[#FF1744] transition flex items-center gap-1.5">
                  How Booking Works
                </Link>
              </li>
              <li>
                <Link to="/support" className="hover:text-[#FF1744] transition flex items-center gap-1.5">
                  FAQs & Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Top Cities */}
          <div>
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#111827] mb-4">
              Popular Cities
            </h4>
            <ul className="space-y-2.5 text-xs font-bold text-[#6B7280]">
              {["Mumbai", "Delhi NCR", "Bengaluru", "Hyderabad", "Kolkata"].map((city) => (
                <li key={city}>
                  <button
                    type="button"
                    onClick={() => handleCityClick(city)}
                    className="hover:text-[#FF1744] transition text-left cursor-pointer"
                  >
                    {city}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Support & Contact */}
          <div>
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#111827] mb-4">
              Company
            </h4>
            <ul className="space-y-2.5 text-xs font-bold text-[#6B7280]">
              <li>
                <Link to="/contact" className="hover:text-[#FF1744] transition">
                  Contact Us
                </Link>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setModalType("terms")}
                  className="hover:text-[#FF1744] transition cursor-pointer"
                >
                  Terms of Service
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setModalType("privacy")}
                  className="hover:text-[#FF1744] transition cursor-pointer"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <Link to="/contact" className="hover:text-[#FF1744] transition">
                  Cinema Partner Portal
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-slate-100 pt-6 text-xs font-bold text-[#6B7280] sm:flex-row">
          <p>© {new Date().getFullYear()} BookMySeat Inc. All rights reserved.</p>
          <div className="flex items-center gap-1">
            <span>Crafted with</span>
            <Heart className="h-3.5 w-3.5 text-[#FF1744] fill-[#FF1744]" />
            <span>for cinema lovers.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
