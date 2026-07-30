import { useState, useEffect } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Menu,
  X,
  User,
  Ticket,
  Command,
  Sparkles,
} from "lucide-react";
import LocationPicker from "./LocationPicker.jsx";
import GlobalSearchModal from "./common/GlobalSearchModal.jsx";
import LoginModal from "./auth/LoginModal.jsx";
import { useAuth } from "../state/authContext.jsx";

const navItems = [
  { label: "Home", to: "/" },
  { label: "Movies", to: "/movies" },
  { label: "Support", to: "/support" },
  { label: "Contact", to: "/contact" },
];

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn, userData, openLoginModal } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchModalOpen(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      <header
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${
          isScrolled
            ? "bg-white/90 backdrop-blur-2xl shadow-sm border-b border-slate-200/50"
            : "bg-transparent backdrop-blur-md"
        }`}
      >
        <div className="mx-auto flex h-16 sm:h-18 max-w-[1400px] items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Brand Logo - Ultra Minimal Borderless */}
          <NavLink to="/" className="flex items-center gap-2.5 group">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-[#FF1744] to-[#FF4F6D] text-white shadow-sm"
            >
              <Ticket className="h-5 w-5 stroke-[2.2]" />
            </motion.div>
            <div className="flex flex-col">
              <span className="text-lg sm:text-xl font-extrabold tracking-tight text-[#111827] group-hover:text-[#FF1744] transition-colors font-heading">
                BookMy<span className="text-[#FF1744]">Seat</span>
              </span>
            </div>
          </NavLink>

          {/* Center Navigation Links - Minimal Underline Indicator */}
          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => {
              const isActive =
                item.to === "/"
                  ? location.pathname === "/"
                  : location.pathname.startsWith(item.to);

              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={`relative py-1.5 text-sm font-extrabold transition-colors duration-200 ${
                    isActive ? "text-[#FF1744]" : "text-[#6B7280] hover:text-[#111827]"
                  }`}
                >
                  <span>{item.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="minimalNavUnderline"
                      className="absolute -bottom-1 left-0 right-0 h-0.5 rounded-full bg-[#FF1744]"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                </NavLink>
              );
            })}
          </nav>

          {/* Right Section: Compact Search, Location Picker, Sign In */}
          <div className="flex items-center gap-3">
            {/* Compact Search Bar Button */}
            <button
              type="button"
              onClick={() => setSearchModalOpen(true)}
              className="hidden sm:flex items-center gap-2 rounded-full bg-slate-100/90 hover:bg-slate-200/80 px-3.5 py-1.5 text-xs text-[#6B7280] transition-all duration-200 border border-slate-200/50 cursor-pointer group"
            >
              <Search className="h-3.5 w-3.5 text-[#6B7280] group-hover:text-[#FF1744] transition-colors" />
              <span className="font-bold text-[#6B7280] group-hover:text-[#111827]">
                Search...
              </span>
              <kbd className="inline-flex items-center gap-0.5 rounded-full bg-white px-1.5 py-0.5 text-[9px] font-extrabold text-slate-400 border border-slate-200/80">
                <Command className="h-2 w-2" />K
              </kbd>
            </button>

            {/* Mobile Search Icon Button */}
            <button
              type="button"
              onClick={() => setSearchModalOpen(true)}
              className="sm:hidden grid h-8 w-8 place-items-center rounded-full bg-slate-100 text-[#111827] hover:bg-slate-200 transition cursor-pointer"
              aria-label="Open Search"
            >
              <Search className="h-4 w-4" />
            </button>

            {/* Location Selector */}
            <LocationPicker compact />

            {/* Sign In CTA */}
            {isLoggedIn ? (
              <NavLink
                to="/profile"
                className="flex items-center gap-2 rounded-full bg-white border border-[#E5E7EB] px-3.5 py-1.5 text-xs font-bold text-[#111827] shadow-2xs hover:shadow-xs transition-all"
              >
                <div className="grid h-5 w-5 place-items-center rounded-full bg-gradient-to-tr from-[#FF1744] to-[#FF4F6D] text-[9px] font-extrabold text-white">
                  {userData?.name ? userData.name.substring(0, 2).toUpperCase() : "U"}
                </div>
                <span className="hidden sm:inline font-extrabold">{userData?.name || "Profile"}</span>
              </NavLink>
            ) : (
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                <button
                  type="button"
                  onClick={openLoginModal}
                  className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#FF1744] to-[#FF4F6D] px-4 py-1.5 text-xs font-extrabold text-white shadow-md shadow-red-500/20 hover:shadow-red-500/35 transition-all cursor-pointer"
                >
                  <User className="h-3.5 w-3.5 stroke-[2.2]" />
                  <span>Sign In</span>
                </button>
              </motion.div>
            )}

            {/* Mobile Hamburger Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen((v) => !v)}
              className="md:hidden grid h-8 w-8 place-items-center rounded-full bg-slate-100 text-[#111827] hover:bg-slate-200 transition cursor-pointer"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="h-4.5 w-4.5" /> : <Menu className="h-4.5 w-4.5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden overflow-hidden bg-white/95 backdrop-blur-2xl border-b border-slate-200/80 px-4 py-3 space-y-1 shadow-lg"
            >
              {navItems.map((item) => {
                const isActive =
                  item.to === "/"
                    ? location.pathname === "/"
                    : location.pathname.startsWith(item.to);

                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center justify-between rounded-xl px-4 py-2.5 text-xs font-extrabold transition ${
                      isActive
                        ? "bg-red-50 text-[#FF1744]"
                        : "text-[#111827] hover:bg-slate-100"
                    }`}
                  >
                    <span>{item.label}</span>
                    {isActive && (
                      <span className="h-1.5 w-1.5 rounded-full bg-[#FF1744]" />
                    )}
                  </NavLink>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Global Instant Search Modal */}
      <GlobalSearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
      />

      {/* Global Pop-up Login Modal */}
      <LoginModal />
    </>
  );
}


