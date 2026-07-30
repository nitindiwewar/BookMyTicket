import { motion } from "framer-motion";
import { Ticket, ShieldCheck, Zap, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

export default function AuthLayout({ children }) {
  return (
    <div className="relative min-h-screen bg-slate-50 overflow-hidden">
      <div className="min-h-screen grid lg:grid-cols-12">
        {/* Left Visual Hero Banner (Desktop) - Light SaaS Artwork */}
        <div className="hidden lg:flex lg:col-span-6 relative flex-col justify-between p-12 bg-gradient-to-br from-slate-100 via-rose-50/70 to-red-50 text-slate-900 overflow-hidden border-r border-slate-200/60">
          {/* Ambient Glow Effects */}
          <div className="absolute top-0 right-0 h-[500px] w-[500px] rounded-full bg-red-500/10 blur-[140px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 h-[400px] w-[400px] rounded-full bg-cyan-500/10 blur-[120px] pointer-events-none" />

          {/* Top Brand Logo */}
          <div className="relative z-10">
            <Link to="/" className="inline-flex items-center gap-3 group">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-red-600 to-rose-500 shadow-lg shadow-red-600/20 group-hover:scale-105 transition-transform">
                <Ticket className="h-6 w-6 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black tracking-tight text-slate-900">
                  BookMy<span className="text-red-600">Seat</span>
                </span>
                <span className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">
                  Cinema OS
                </span>
              </div>
            </Link>
          </div>

          {/* Center Graphic & Highlights */}
          <div className="relative z-10 my-auto space-y-8 max-w-lg">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-4"
            >
              <div className="inline-flex items-center gap-2 rounded-full bg-red-100/80 px-3.5 py-1.5 text-xs font-extrabold text-red-600 backdrop-blur-md">
                <Sparkles className="h-4 w-4" />
                <span>ENTERPRISE MOVIE PASS</span>
              </div>

              <h2 className="text-4xl xl:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                Your Ticket to Cinema Wonders
              </h2>

              <p className="text-sm text-slate-600 font-medium leading-relaxed">
                Discover trending movies, reserve optimal seat views with live synchronization, and pre-order concessions instantly.
              </p>
            </motion.div>

            {/* Feature Highlights Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3 rounded-2xl bg-white p-4 shadow-xs border border-slate-200/60">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-50 text-red-600 shrink-0">
                  <Zap className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Instant Booking</div>
                  <div className="text-[11px] text-slate-500">Zero wait times</div>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-2xl bg-white p-4 shadow-xs border border-slate-200/60">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600 shrink-0">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">256-bit Secure</div>
                  <div className="text-[11px] text-slate-500">Encrypted checkout</div>
                </div>
              </div>
            </div>

            {/* Testimonial Quote Pill */}
            <div className="flex items-center gap-3 rounded-2xl bg-white/90 p-4 shadow-xs border border-slate-200/60">
              <div className="flex -space-x-2">
                <div className="grid h-8 w-8 place-items-center rounded-full bg-red-600 text-xs font-bold text-white ring-2 ring-white">
                  AS
                </div>
                <div className="grid h-8 w-8 place-items-center rounded-full bg-cyan-600 text-xs font-bold text-white ring-2 ring-white">
                  RK
                </div>
              </div>
              <div className="text-xs text-slate-600 font-medium">
                <span className="font-extrabold text-slate-900">Over 100,000+</span> movie tickets booked this month.
              </div>
            </div>
          </div>

          {/* Footer Copyright */}
          <div className="relative z-10 text-xs text-slate-400 font-medium">
            © {new Date().getFullYear()} BookMySeat Inc. All rights reserved.
          </div>
        </div>

        {/* Right Form Container (Desktop & Mobile) */}
        <div className="lg:col-span-6 flex flex-col justify-center items-center px-4 py-12 sm:px-8 lg:px-12 bg-slate-50">
          {/* Mobile Top Brand Logo */}
          <div className="lg:hidden mb-8 text-center">
            <Link to="/" className="inline-flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-red-600 to-rose-500 shadow-md">
                <Ticket className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-black text-slate-900">
                BookMy<span className="text-red-600">Seat</span>
              </span>
            </Link>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-md"
          >
            {children}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
