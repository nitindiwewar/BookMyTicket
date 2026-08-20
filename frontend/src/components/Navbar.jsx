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
  const { isLoggedIn, userData, openLoginModal, logout } = useAuth();
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
        <div className="mx-auto flex h-14 sm:h-18 max-w-[1400px] items-center justify-between px-2.5 xs:px-4 sm:px-6 lg:px-8">
          {/* Brand Logo - Responsive & Non-breaking */}
          <NavLink to="/" className="flex items-center gap-1.5 sm:gap-2.5 group shrink-0 min-w-0">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex h-7.5 w-7.5 xs:h-8 xs:w-8 sm:h-9 sm:w-9 items-center justify-center rounded-lg sm:rounded-xl bg-gradient-to-tr from-[#FF1744] to-[#FF4F6D] text-white shadow-xs shrink-0"
            >
              <Ticket className="h-4 w-4 sm:h-5 sm:w-5 stroke-[2.2]" />
            </motion.div>
            <div className="flex flex-col">
              <span className="text-[15px] xs:text-base sm:text-xl font-extrabold tracking-tight text-[#111827] group-hover:text-[#FF1744] transition-colors font-heading whitespace-nowrap">
                BookMy<span className="text-[#FF1744]">Seat</span>
              </span>
            </div>
          </NavLink>

          {/* Center Navigation Links (Desktop only) */}
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

          {/* Right Section: Search, Location Picker, Sign In, Menu */}
          <div className="flex items-center gap-1.5 xs:gap-2 sm:gap-3 shrink-0">
            {/* Desktop Search Bar */}
            <button
              type="button"
              onClick={() => setSearchModalOpen(true)}
              className="hidden sm:flex items-center gap-2 rounded-full bg-slate-100/90 hover:bg-slate-200/80 px-3 py-1.5 text-xs text-[#6B7280] transition-all duration-200 border border-slate-200/50 cursor-pointer group"
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
              className="sm:hidden grid h-7.5 w-7.5 place-items-center rounded-full bg-slate-100 text-[#111827] hover:bg-slate-200 transition cursor-pointer shrink-0"
              aria-label="Open Search"
            >
              <Search className="h-3.5 w-3.5" />
            </button>

            {/* Location Selector */}
            <LocationPicker compact />

            {/* Sign In / Profile CTA */}
            {isLoggedIn ? (
              <div className="flex items-center gap-1.5 shrink-0">
                {(userData?.role === "ROLE_ADMIN" || userData?.role === "ADMIN") ? (
                  <>
                    <NavLink
                      to="/admin"
                      className="flex items-center gap-1 rounded-full bg-red-600 px-2.5 xs:px-3.5 py-1 sm:py-1.5 text-[11px] sm:text-xs font-black text-white shadow-xs shadow-red-600/30 hover:bg-red-700 transition-all shrink-0"
                    >
                      <Sparkles className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                      <span className="hidden xs:inline">Admin</span>
                    </NavLink>
                    <button
                      type="button"
                      onClick={logout}
                      className="hidden sm:inline-block rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-extrabold text-slate-700 hover:bg-slate-50 transition cursor-pointer shrink-0"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <NavLink
                    to="/profile"
                    className="flex items-center gap-1.5 rounded-full bg-white border border-[#E5E7EB] px-2 xs:px-3 py-1 sm:py-1.5 text-xs font-bold text-[#111827] shadow-2xs hover:shadow-xs transition-all shrink-0"
                  >
                    <div className="grid h-5 w-5 place-items-center rounded-full bg-gradient-to-tr from-[#FF1744] to-[#FF4F6D] text-[9px] font-extrabold text-white shrink-0">
                      {userData?.name ? userData.name.substring(0, 2).toUpperCase() : "U"}
                    </div>
                    <span className="hidden sm:inline font-extrabold max-w-[80px] truncate">{userData?.name || "Profile"}</span>
                  </NavLink>
                )}
              </div>
            ) : (
              <button
                type="button"
                onClick={openLoginModal}
                className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-[#FF1744] to-[#FF4F6D] px-2.5 xs:px-3.5 py-1 sm:py-1.5 text-[11px] sm:text-xs font-extrabold text-white shadow-xs hover:shadow-red-500/35 transition-all cursor-pointer whitespace-nowrap shrink-0"
              >
                <User className="h-3 w-3 sm:h-3.5 sm:w-3.5 stroke-[2.2]" />
                <span className="hidden xs:inline">Sign In</span>
              </button>
            )}

            {/* Mobile Hamburger Menu Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen((v) => !v)}
              className="md:hidden grid h-7.5 w-7.5 xs:h-8 xs:w-8 place-items-center rounded-full bg-slate-100 text-[#111827] hover:bg-slate-200 transition cursor-pointer shrink-0"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
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
              className="md:hidden overflow-hidden bg-white/98 backdrop-blur-2xl border-b border-slate-200/80 px-4 py-3 space-y-1.5 shadow-xl"
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
                    className={`flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-extrabold transition ${
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

              {/* Mobile Drawer Auth Actions */}
              <div className="pt-2 border-t border-slate-100 space-y-1.5">
                {isLoggedIn ? (
                  <>
                    <NavLink
                      to="/profile"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-extrabold text-slate-800 hover:bg-slate-100 transition"
                    >
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-[#FF1744]" />
                        <span>My Profile ({userData?.name || "User"})</span>
                      </div>
                    </NavLink>
                    {(userData?.role === "ROLE_ADMIN" || userData?.role === "ADMIN") && (
                      <NavLink
                        to="/admin"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-extrabold text-red-600 bg-red-50 hover:bg-red-100/70 transition"
                      >
                        <div className="flex items-center gap-2">
                          <Sparkles className="h-4 w-4 text-[#FF1744]" />
                          <span>Admin Console</span>
                        </div>
                      </NavLink>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        logout();
                      }}
                      className="w-full text-left rounded-xl px-3.5 py-2.5 text-xs font-extrabold text-slate-500 hover:text-red-600 hover:bg-slate-100 transition cursor-pointer"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      openLoginModal();
                    }}
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#FF1744] to-[#FF4F6D] py-2.5 text-xs font-extrabold text-white shadow-xs cursor-pointer"
                  >
                    <User className="h-3.5 w-3.5" />
                    <span>Sign In / Register</span>
                  </button>
                )}
              </div>
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


