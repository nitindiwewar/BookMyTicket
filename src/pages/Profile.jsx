import { useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  BadgeCheck,
  CalendarDays,
  Edit3,
  Gift,
  Grid2X2,
  History,
  LayoutDashboard,
  LogOut,
  Moon,
  Bell,
  Play,
  Search,
  Settings,
  Shield,
  Sparkles,
  Star,
  Sun,
  TrendingUp,
  Wallet,
  Watch,
  Zap,
} from "lucide-react";

import { useAuth } from "../state/authContext.jsx";
import { ThemeContext } from "../state/themeContext.jsx";
import LoadingOrEmpty from "../components/LoadingOrEmpty.jsx";

const TAB_ITEMS = [
  { key: "overview", label: "Overview", icon: LayoutDashboard },
  { key: "upcoming", label: "Upcoming", icon: CalendarDays },
  { key: "history", label: "History", icon: History },
  { key: "watchlist", label: "Watchlist", icon: Watch },
  { key: "payments", label: "Payments", icon: Wallet },
  { key: "rewards", label: "Rewards", icon: Gift },
  { key: "settings", label: "Settings", icon: Settings },
];

function GlassCard({ className = "", children }) {
  return (
    <div
      className={
        "rounded-2xl border border-white/10 bg-white/5 shadow-[0_12px_40px_rgba(0,0,0,0.45)] backdrop-blur " +
        className
      }
    >
      {children}
    </div>
  );
}

function Skeleton({ className = "" }) {
  return (
    <div className={"animate-pulse rounded-xl bg-white/10 " + className} />
  );
}

export default function Profile() {
  const navigate = useNavigate();
  const { isLoggedIn, logout } = useAuth();

  const { theme, toggleTheme } = useContext(ThemeContext);

  // Icon import compatibility: lucide-react version used here doesn't export `Notify`
  // but it does export `Bell`.

  const [activeTab, setActiveTab] = useState("overview");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isLoggedIn) navigate("/signup");
  }, [isLoggedIn, navigate]);

  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 900);
    return () => clearTimeout(t);
  }, []);

  const membership = useMemo(
    () => ({
      tier: "Premium",
      color: "from-yellow-400/25 to-amber-500/10",
      icon: BadgeCheck,
    }),
    [],
  );

  const profile = useMemo(
    () => ({
      name: "Aarav Sharma",
      email: "aarav@example.com",
      phone: "+91 98765 43210",
      joinedAt: "2024-02-12",
      avatarText: "AS",
    }),
    [],
  );

  // NOTE: No mock data requirement from you, so UI uses fallbacks/empty states.
  // These values are minimal and only for layout; real integrations can replace them.
  const empty = useMemo(() => true, []);

  const quickStats = useMemo(
    () => [
      { label: "Total bookings", value: "—", icon: TrendingUp },
      { label: "Movies watched", value: "—", icon: Play },
      { label: "Favorite genre", value: "—", icon: Star },
      { label: "Money spent", value: "₹0", icon: Wallet },
      { label: "Reward points", value: "0", icon: Zap },
    ],
    [],
  );

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10">
      <div className="flex flex-col gap-6 lg:flex-row">
        {/* Sidebar */}
        <motion.aside
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.25 }}
          className="w-full lg:w-72"
        >
          <GlassCard className="p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/5 text-sm font-bold text-white/90">
                  {profile.avatarText}
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">
                    {profile.name}
                  </div>
                  <div className="text-xs text-white/60">{membership.tier}</div>
                </div>
              </div>

              <motion.button
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={() => {
                  logout();
                  navigate("/signup");
                }}
                className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-black/30 text-white/80 transition hover:bg-white/5"
                aria-label="Logout"
              >
                <LogOut className="h-4 w-4" />
              </motion.button>
            </div>
            <div className="mt-4 rounded-2xl border border-white/10 from-white/5 to-transparent p-3">
              <div className="flex items-center gap-2">
                <div className="rounded-xl p-2 bg-white/5 border border-white/10">
                  <membership.icon className="h-4 w-4 text-amber-200" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-white/80">
                    Membership
                  </div>
                  <div className="text-sm font-semibold text-white">
                    {membership.tier}
                  </div>
                </div>
              </div>
            </div>

            <nav className="mt-4 flex flex-col gap-1">
              {TAB_ITEMS.map((t) => {
                const Icon = t.icon;
                const isActive = activeTab === t.key;
                return (
                  <button
                    key={t.key}
                    type="button"
                    onClick={() => setActiveTab(t.key)}
                    className={
                      "flex items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition " +
                      (isActive
                        ? "bg-white/10 text-white border border-white/15"
                        : "text-white/70 hover:bg-white/5 hover:text-white border border-transparent")
                    }
                  >
                    <Icon className="h-4 w-4" />
                    <span>{t.label}</span>
                  </button>
                );
              })}
            </nav>
          </GlassCard>
        </motion.aside>

        {/* Main */}
        <div className="flex-1">
          {/* Header */}
          <GlassCard className="p-5 sm:p-6">
            {isLoading ? (
              <div className="flex items-center gap-4">
                <Skeleton className="h-14 w-14" />
                <div className="flex-1 space-y-3">
                  <Skeleton className="h-5 w-40" />
                  <Skeleton className="h-4 w-64" />
                </div>
                <Skeleton className="h-10 w-28" />
              </div>
            ) : (
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex items-start gap-4">
                  <div className="relative">
                    <div className="grid h-14 w-14 place-items-center rounded-2xl border border-white/10 bg-white/5 text-sm font-bold text-white/90">
                      {profile.avatarText}
                    </div>
                    <div className="absolute -right-2 -bottom-2 rounded-full border border-white/10 bg-amber-500/15 p-2">
                      <Sparkles className="h-4 w-4 text-amber-200" />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-3">
                      <div className="text-xl font-bold text-white">
                        {profile.name}
                      </div>
                      <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-white/80">
                        <BadgeCheck className="h-3.5 w-3.5 text-amber-200" />
                        {membership.tier}
                      </div>
                    </div>
                    <div className="mt-1 grid gap-1 text-sm text-white/70 sm:grid-cols-2">
                      <div className="inline-flex items-center gap-2">
                        <Sparkles className="h-4 w-4 opacity-70" />
                        {profile.email}
                      </div>
                      <div className="inline-flex items-center gap-2">
                        <CalendarDays className="h-4 w-4 opacity-70" />
                        Joined {new Date(profile.joinedAt).toLocaleDateString()}
                      </div>
                      <div className="inline-flex items-center gap-2">
                        <Bell className="h-4 w-4 opacity-70" />
                        {profile.phone}
                      </div>
                      <div className="inline-flex items-center gap-2">
                        <Grid2X2 className="h-4 w-4 opacity-70" />
                        Manage your account
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white/90 transition hover:bg-white/10"
                    onClick={() => {
                      // placeholder
                      setActiveTab("settings");
                    }}
                  >
                    <Edit3 className="h-4 w-4" />
                    Edit profile
                  </motion.button>

                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/20"
                    onClick={() => setActiveTab("upcoming")}
                  >
                    <CalendarDays className="h-4 w-4" />
                    View bookings
                  </motion.button>
                </div>
              </div>
            )}
          </GlassCard>

          {/* Content Tabs */}
          <div className="mt-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.22 }}
              >
                {activeTab === "overview" && (
                  <div className="space-y-6">
                    {/* Stats */}
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                      <LoadingOrEmpty
                        isLoading={isLoading}
                        isEmpty={false}
                        loadingContent={Array.from({ length: 5 }).map(
                          (_, i) => (
                            <Skeleton key={i} className="h-28" />
                          ),
                        )}
                        emptyContent={null}
                      >
                        {quickStats.map((s) => {
                          const Icon = s.icon;
                          return (
                            <div
                              key={s.label}
                              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-4"
                            >
                              <div className="absolute inset-0 -translate-y-6 opacity-0 transition group-hover:opacity-100 group-hover:translate-y-0">
                                <div className="h-28 w-full bg-linear-to-r from-white/5 via-transparent to-white/5" />
                              </div>
                              <div className="relative">
                                <div className="flex items-center justify-between gap-3">
                                  <div className="text-xs font-semibold text-white/70">
                                    {s.label}
                                  </div>
                                  <div className="rounded-xl border border-white/10 bg-black/20 p-2">
                                    <Icon className="h-4 w-4 text-white/80" />
                                  </div>
                                </div>
                                <div className="mt-2 text-xl font-bold text-white">
                                  {s.value}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </LoadingOrEmpty>
                    </div>

                    {/* Upcoming */}
                    <GlassCard className="p-5 sm:p-6">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <div className="text-sm font-semibold text-white">
                            Upcoming bookings
                          </div>
                          <div className="mt-1 text-sm text-white/60">
                            Your next shows and ticket details.
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setActiveTab("upcoming")}
                          className="text-sm font-semibold text-white/80 hover:text-white"
                        >
                          View all
                        </button>
                      </div>

                      <div className="mt-4">
                        <LoadingOrEmpty
                          isLoading={isLoading}
                          isEmpty={empty}
                          loadingContent={
                            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                              {Array.from({ length: 3 }).map((_, i) => (
                                <Skeleton key={i} className="h-36" />
                              ))}
                            </div>
                          }
                          emptyContent={
                            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center">
                              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
                                <CalendarDays className="h-5 w-5 text-white/80" />
                              </div>
                              <div className="mt-3 text-sm font-semibold text-white">
                                No upcoming bookings
                              </div>
                              <div className="mt-1 text-sm text-white/60">
                                Book tickets to see your upcoming shows here.
                              </div>
                              <div className="mt-4 flex justify-center">
                                <a
                                  href="/booking"
                                  className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/20"
                                >
                                  <Play className="h-4 w-4" />
                                  Book now
                                </a>
                              </div>
                            </div>
                          }
                        >
                          {null}
                        </LoadingOrEmpty>
                      </div>
                    </GlassCard>

                    {/* Watchlist preview */}
                    <GlassCard className="p-5 sm:p-6">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <div className="text-sm font-semibold text-white">
                            Favorite movies
                          </div>
                          <div className="mt-1 text-sm text-white/60">
                            Save titles you want to watch later.
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setActiveTab("watchlist")}
                          className="text-sm font-semibold text-white/80 hover:text-white"
                        >
                          Manage
                        </button>
                      </div>

                      <LoadingOrEmpty
                        isLoading={false}
                        isEmpty={empty}
                        loadingContent={null}
                        emptyContent={
                          <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-6 text-center">
                            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
                              <Watch className="h-5 w-5 text-white/80" />
                            </div>
                            <div className="mt-3 text-sm font-semibold text-white">
                              Watchlist is empty
                            </div>
                            <div className="mt-1 text-sm text-white/60">
                              Add movies to your watchlist to see them here.
                            </div>
                            <div className="mt-4 flex justify-center">
                              <a
                                href="/movies"
                                className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/20"
                              >
                                <Search className="h-4 w-4" />
                                Browse movies
                              </a>
                            </div>
                          </div>
                        }
                      >
                        {null}
                      </LoadingOrEmpty>
                    </GlassCard>
                  </div>
                )}

                {activeTab === "upcoming" && (
                  <div className="space-y-4">
                    <GlassCard className="p-5 sm:p-6">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <div className="text-sm font-semibold text-white">
                            Upcoming bookings
                          </div>
                          <div className="mt-1 text-sm text-white/60">
                            Tickets with download and cancel actions.
                          </div>
                        </div>
                      </div>

                      <LoadingOrEmpty
                        isLoading={isLoading}
                        isEmpty={empty}
                        loadingContent={
                          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                            {Array.from({ length: 6 }).map((_, i) => (
                              <Skeleton key={i} className="h-44" />
                            ))}
                          </div>
                        }
                        emptyContent={
                          <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-6 text-center">
                            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
                              <CalendarDays className="h-5 w-5 text-white/80" />
                            </div>
                            <div className="mt-3 text-sm font-semibold text-white">
                              Nothing scheduled
                            </div>
                            <div className="mt-1 text-sm text-white/60">
                              Your upcoming tickets will appear once you book.
                            </div>
                          </div>
                        }
                      >
                        {null}
                      </LoadingOrEmpty>
                    </GlassCard>
                  </div>
                )}

                {activeTab === "history" && (
                  <GlassCard className="p-5 sm:p-6">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <div className="text-sm font-semibold text-white">
                          Booking history
                        </div>
                        <div className="mt-1 text-sm text-white/60">
                          Ratings and rebook actions.
                        </div>
                      </div>
                    </div>

                    <LoadingOrEmpty
                      isLoading={isLoading}
                      isEmpty={empty}
                      loadingContent={
                        <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
                          {Array.from({ length: 6 }).map((_, i) => (
                            <Skeleton key={i} className="min-w-260px h-44" />
                          ))}
                        </div>
                      }
                      emptyContent={
                        <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-6 text-center">
                          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
                            <History className="h-5 w-5 text-white/80" />
                          </div>
                          <div className="mt-3 text-sm font-semibold text-white">
                            No history yet
                          </div>
                          <div className="mt-1 text-sm text-white/60">
                            Book tickets to start building your history.
                          </div>
                        </div>
                      }
                    >
                      {null}
                    </LoadingOrEmpty>
                  </GlassCard>
                )}

                {activeTab === "watchlist" && (
                  <GlassCard className="p-5 sm:p-6">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <div className="text-sm font-semibold text-white">
                          Favorite movies / Watchlist
                        </div>
                        <div className="mt-1 text-sm text-white/60">
                          Grid with remove actions.
                        </div>
                      </div>
                    </div>

                    <LoadingOrEmpty
                      isLoading={isLoading}
                      isEmpty={empty}
                      loadingContent={
                        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                          {Array.from({ length: 6 }).map((_, i) => (
                            <Skeleton key={i} className="h-40" />
                          ))}
                        </div>
                      }
                      emptyContent={
                        <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-6 text-center">
                          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
                            <Watch className="h-5 w-5 text-white/80" />
                          </div>
                          <div className="mt-3 text-sm font-semibold text-white">
                            Watchlist is empty
                          </div>
                          <div className="mt-1 text-sm text-white/60">
                            Add movies to watch later.
                          </div>
                          <div className="mt-4 flex justify-center">
                            <a
                              href="/movies"
                              className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/20"
                            >
                              <Search className="h-4 w-4" />
                              Browse
                            </a>
                          </div>
                        </div>
                      }
                    >
                      {null}
                    </LoadingOrEmpty>
                  </GlassCard>
                )}

                {activeTab === "payments" && (
                  <GlassCard className="p-5 sm:p-6">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <div className="text-sm font-semibold text-white">
                          Payment methods
                        </div>
                        <div className="mt-1 text-sm text-white/60">
                          Saved cards and UPI options.
                        </div>
                      </div>
                    </div>

                    <LoadingOrEmpty
                      isLoading={isLoading}
                      isEmpty={empty}
                      loadingContent={
                        <div className="mt-4 grid gap-3 sm:grid-cols-2">
                          {Array.from({ length: 4 }).map((_, i) => (
                            <Skeleton key={i} className="h-36" />
                          ))}
                        </div>
                      }
                      emptyContent={
                        <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-6 text-center">
                          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
                            <Wallet className="h-5 w-5 text-white/80" />
                          </div>
                          <div className="mt-3 text-sm font-semibold text-white">
                            No payment methods saved
                          </div>
                          <div className="mt-1 text-sm text-white/60">
                            Add a card or UPI to speed up checkout.
                          </div>
                        </div>
                      }
                    >
                      {null}
                    </LoadingOrEmpty>
                  </GlassCard>
                )}

                {activeTab === "rewards" && (
                  <GlassCard className="p-5 sm:p-6">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <div className="text-sm font-semibold text-white">
                          Rewards & offers
                        </div>
                        <div className="mt-1 text-sm text-white/60">
                          Coupons, cashback, and membership perks.
                        </div>
                      </div>
                    </div>

                    <LoadingOrEmpty
                      isLoading={isLoading}
                      isEmpty={empty}
                      loadingContent={
                        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                          {Array.from({ length: 6 }).map((_, i) => (
                            <Skeleton key={i} className="h-32" />
                          ))}
                        </div>
                      }
                      emptyContent={
                        <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-6 text-center">
                          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
                            <Gift className="h-5 w-5 text-white/80" />
                          </div>
                          <div className="mt-3 text-sm font-semibold text-white">
                            No offers available
                          </div>
                          <div className="mt-1 text-sm text-white/60">
                            Your rewards will show here.
                          </div>
                        </div>
                      }
                    >
                      {null}
                    </LoadingOrEmpty>
                  </GlassCard>
                )}

                {activeTab === "settings" && (
                  <div className="space-y-4">
                    <GlassCard className="p-5 sm:p-6">
                      <div className="text-sm font-semibold text-white">
                        Settings
                      </div>
                      <div className="mt-1 text-sm text-white/60">
                        Personalize your preferences.
                      </div>

                      <div className="mt-5 grid gap-4 lg:grid-cols-2">
                        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                          <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-3">
                              <Sun className="h-4 w-4 text-amber-200" />
                              <div>
                                <div className="text-sm font-semibold text-white">
                                  Dark mode
                                </div>
                                <div className="text-xs text-white/60">
                                  Toggle UI theme.
                                </div>
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={toggleTheme}
                              className="inline-flex items-center rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-xs font-semibold text-white/90 hover:bg-white/5"
                            >
                              {theme === "dark" ? (
                                <span className="inline-flex items-center gap-2">
                                  <Moon className="h-4 w-4" /> Dark
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-2">
                                  <Sun className="h-4 w-4" /> Light
                                </span>
                              )}
                            </button>
                          </div>
                        </div>

                        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                          <div className="flex items-center gap-3">
                            <Bell className="h-4 w-4 text-white/80" />
                            <div>
                              <div className="text-sm font-semibold text-white">
                                Notifications
                              </div>
                              <div className="text-xs text-white/60">
                                Ticket alerts and offers.
                              </div>
                            </div>
                          </div>

                          <div className="mt-3 space-y-2">
                            <button
                              type="button"
                              className="w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-left text-xs font-semibold text-white/90 hover:bg-white/5"
                            >
                              Enable notifications
                            </button>
                          </div>
                        </div>

                        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                          <div className="flex items-center gap-3">
                            <Shield className="h-4 w-4 text-white/80" />
                            <div>
                              <div className="text-sm font-semibold text-white">
                                Privacy
                              </div>
                              <div className="text-xs text-white/60">
                                Control your data visibility.
                              </div>
                            </div>
                          </div>
                          <div className="mt-3">
                            <button
                              type="button"
                              className="w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-xs font-semibold text-white/90 hover:bg-white/5"
                            >
                              Manage privacy
                            </button>
                          </div>
                        </div>

                        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                          <div className="flex items-center gap-3">
                            <Zap className="h-4 w-4 text-white/80" />
                            <div>
                              <div className="text-sm font-semibold text-white">
                                Language
                              </div>
                              <div className="text-xs text-white/60">
                                Choose your preferred language.
                              </div>
                            </div>
                          </div>

                          <div className="mt-3">
                            <select
                              className="w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-xs font-semibold text-white/90 outline-none"
                              defaultValue="en"
                            >
                              <option value="en">English</option>
                              <option value="hi">Hindi</option>
                              <option value="ta">Tamil</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:justify-end">
                        <motion.button
                          whileTap={{ scale: 0.98 }}
                          type="button"
                          className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-black/30 px-4 py-2.5 text-sm font-semibold text-white/90 hover:bg-white/5"
                          onClick={() => {
                            logout();
                            navigate("/signup");
                          }}
                        >
                          <LogOut className="h-4 w-4" />
                          Logout
                        </motion.button>
                      </div>
                    </GlassCard>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
