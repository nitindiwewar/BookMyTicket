import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BadgeCheck,
  CalendarDays,
  Gift,
  History,
  LayoutDashboard,
  LogOut,
  Settings,
  Wallet,
  Ticket,
  Film,
  HelpCircle,
  Headphones,
  QrCode,
  MapPin,
  Clock,
  ExternalLink,
} from "lucide-react";

import { useAuth } from "../state/authContext.jsx";
import Card from "../components/ui/Card.jsx";
import Button from "../components/ui/Button.jsx";
import Badge from "../components/ui/Badge.jsx";
import Tabs from "../components/ui/Tabs.jsx";
import EmptyState from "../components/common/EmptyState.jsx";
import { getUserBookingsApi, getMyBookingsApi } from "../api/bookingApi.js";
import { formatCurrency } from "../utils/formatters.js";

const TAB_ITEMS = [
  { key: "overview", label: "Overview", icon: LayoutDashboard },
  { key: "upcoming", label: "Upcoming Bookings", icon: CalendarDays },
  { key: "history", label: "Booking History", icon: History },
  { key: "watchlist", label: "Watchlist", icon: Film },
  { key: "payments", label: "Payments", icon: Wallet },
  { key: "rewards", label: "Rewards", icon: Gift },
  { key: "support", label: "Help & Support", icon: HelpCircle },
  { key: "contact", label: "Contact Us", icon: Headphones },
  { key: "settings", label: "Settings", icon: Settings },
];

export default function Profile() {
  const navigate = useNavigate();
  const { isLoggedIn, userData, logout } = useAuth();

  const [activeTab, setActiveTab] = useState("overview");
  const [userBookings, setUserBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    const fetchBookings = async () => {
      setLoading(true);
      const email = userData?.email;
      const phone = userData?.mobile;
      let list = await getUserBookingsApi(email, phone);
      if ((!list || !list.length) && isLoggedIn) {
        list = await getMyBookingsApi();
      }
      setUserBookings(list || []);
      setLoading(false);
    };

    fetchBookings();
  }, [isLoggedIn, navigate, userData]);

  const profile = useMemo(
    () => ({
      name: userData?.name || (userData?.email ? userData.email.split("@")[0] : "Movie Member"),
      email: userData?.email || "No email linked",
      phone: userData?.mobile
        ? `${userData.countryCode || "+91"} ${userData.mobile}`
        : "No phone linked",
      avatarText: userData?.name
        ? userData.name.substring(0, 2).toUpperCase()
        : userData?.email
          ? userData.email.substring(0, 2).toUpperCase()
          : "US",
    }),
    [userData],
  );

  const totalSpent = useMemo(() => {
    return userBookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0);
  }, [userBookings]);

  const rewardPoints = useMemo(() => {
    return Math.floor(totalSpent / 10);
  }, [totalSpent]);

  const vipTier = useMemo(() => {
    if (totalSpent >= 2000) return "Platinum VIP";
    if (totalSpent >= 1000) return "Gold VIP";
    return "Silver Member";
  }, [totalSpent]);

  const quickStats = useMemo(
    () => [
      { label: "Real Bookings", value: `${userBookings.length}`, icon: Ticket },
      { label: "Total Spent", value: formatCurrency(totalSpent), icon: Wallet },
      { label: "Rewards Earned", value: `${rewardPoints} pts`, icon: Gift },
      { label: "Membership", value: vipTier, icon: BadgeCheck },
    ],
    [userBookings.length, totalSpent, rewardPoints, vipTier]
  );

  const renderBookingCard = (b) => (
    <Card key={b.bookingId || b.bookingCode} className="p-5 overflow-hidden border border-slate-200 shadow-md">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4 w-full md:w-auto">
          {b.moviePoster && (
            <img
              src={b.moviePoster}
              alt={b.movieTitle || "Movie"}
              className="h-24 w-16 rounded-xl object-cover shadow-sm shrink-0"
            />
          )}
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge variant="primary" size="sm">
                {b.bookingCode}
              </Badge>
              <Badge variant="emerald" size="sm">
                {b.status || "CONFIRMED"}
              </Badge>
            </div>
            <h3 className="text-lg font-black text-slate-900">{b.movieTitle || "Cinema Show"}</h3>
            <p className="text-xs font-bold text-slate-600 flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-red-500" />
              {b.theaterName} {b.theaterArea ? `(${b.theaterArea})` : ""}
            </p>
            <p className="text-xs text-slate-500 font-semibold flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-slate-400" />
              {b.showDate} @ {b.showTime}
            </p>
            <p className="text-xs text-slate-500 font-medium">
              Seats: <span className="font-bold text-slate-800">{b.seats ? (Array.isArray(b.seats) ? b.seats.join(", ") : b.seats) : "Reserved"}</span>
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center md:items-end justify-between gap-3 w-full md:w-auto border-t md:border-t-0 border-slate-100 pt-3 md:pt-0">
          <div className="text-center md:text-right">
            <div className="text-xs text-slate-400 font-bold uppercase">Paid via {b.paymentMethod || "RAZORPAY"}</div>
            <div className="text-xl font-black text-slate-900">{formatCurrency(b.totalAmount || 0)}</div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="secondary"
              className="gap-1 text-xs font-bold"
              onClick={() => navigate(`/confirmation/${b.bookingCode}`)}
            >
              <ExternalLink className="h-3.5 w-3.5" />
              <span>View Pass</span>
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      {/* Profile Header */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-tr from-red-600 to-rose-500 text-xl font-black text-white shadow-lg shadow-red-600/20">
              {profile.avatarText}
            </div>
            <div>
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900">
                  {profile.name}
                </h1>
                <Badge variant="amber" className="flex items-center gap-1">
                  <BadgeCheck className="h-3.5 w-3.5" />
                  {vipTier}
                </Badge>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-1">
                {profile.email} • {profile.phone}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="danger"
              size="sm"
              onClick={() => {
                logout();
                navigate("/login");
              }}
              className="gap-2"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </Button>
          </div>
        </div>
      </Card>

      {/* Tabs Navigation */}
      <Tabs items={TAB_ITEMS} activeTab={activeTab} onChange={setActiveTab} />

      {/* Tab Panels */}
      <main>
        {activeTab === "overview" && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {quickStats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <Card key={stat.label} className="p-4 space-y-2">
                    <div className="flex items-center justify-between text-slate-400">
                      <span className="text-xs font-bold uppercase">
                        {stat.label}
                      </span>
                      <Icon className="h-4 w-4 text-red-500" />
                    </div>
                    <div className="text-lg sm:text-xl font-black text-slate-900">
                      {stat.value}
                    </div>
                  </Card>
                );
              })}
            </div>

            {/* Recent Bookings Section */}
            <div className="space-y-3 pt-2">
              <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                <Ticket className="h-5 w-5 text-red-600" />
                <span>Your Database Ticket Bookings</span>
              </h3>

              {loading ? (
                <div className="py-8 text-center text-sm font-bold text-slate-400">Loading your database tickets...</div>
              ) : userBookings.length > 0 ? (
                <div className="space-y-4">
                  {userBookings.slice(0, 3).map(renderBookingCard)}
                </div>
              ) : (
                <EmptyState
                  icon={Ticket}
                  title="No Database Bookings Found"
                  description="You haven't booked any tickets yet. Select a movie and book your seats!"
                />
              )}
            </div>

            {/* Customer Support & Contact Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <Card className="p-5 flex items-center justify-between bg-slate-900 text-white shadow-xl">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 font-bold text-red-400 text-sm">
                    <HelpCircle className="h-5 w-5 text-red-500" />
                    <span>Customer Support & FAQs</span>
                  </div>
                  <p className="text-xs text-slate-300">Have questions about tickets, refunds or seats?</p>
                </div>
                <Button variant="danger" size="sm" onClick={() => navigate("/support")}>
                  Help Center
                </Button>
              </Card>

              <Card className="p-5 flex items-center justify-between border-slate-200 shadow-sm bg-white">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                    <Headphones className="h-5 w-5 text-red-600" />
                    <span>Contact Support Team</span>
                  </div>
                  <p className="text-xs text-slate-500">Reach out directly to our 24/7 assistance team</p>
                </div>
                <Button variant="secondary" size="sm" onClick={() => navigate("/contact")}>
                  Contact Us
                </Button>
              </Card>
            </div>
          </div>
        )}

        {(activeTab === "upcoming" || activeTab === "history") && (
          <div className="space-y-4">
            {loading ? (
              <div className="py-8 text-center text-sm font-bold text-slate-400">Loading tickets...</div>
            ) : userBookings.length > 0 ? (
              userBookings.map(renderBookingCard)
            ) : (
              <EmptyState
                icon={Ticket}
                title="No Bookings Found"
                description="No database ticket records found under your logged in account."
              />
            )}
          </div>
        )}

        {activeTab === "support" && (
          <div className="space-y-6 text-center py-6">
            <Card className="p-8 max-w-2xl mx-auto space-y-4">
              <HelpCircle className="h-12 w-12 text-red-600 mx-auto" />
              <h2 className="text-2xl font-black text-slate-900">Customer Support Center</h2>
              <p className="text-sm text-slate-600">Access quick answers, booking help, refund policies, and live chat assistance.</p>
              <Button size="lg" className="font-bold" onClick={() => navigate("/support")}>
                Go to Full Support Center
              </Button>
            </Card>
          </div>
        )}

        {activeTab === "contact" && (
          <div className="space-y-6 text-center py-6">
            <Card className="p-8 max-w-2xl mx-auto space-y-4">
              <Headphones className="h-12 w-12 text-red-600 mx-auto" />
              <h2 className="text-2xl font-black text-slate-900">Contact Us</h2>
              <p className="text-sm text-slate-600">Send us a direct message or view our customer care phone line and email details.</p>
              <Button size="lg" className="font-bold" onClick={() => navigate("/contact")}>
                Open Contact Page
              </Button>
            </Card>
          </div>
        )}

        {!["overview", "upcoming", "history", "support", "contact"].includes(activeTab) && (
          <EmptyState
            icon={Film}
            title={`No ${activeTab} items found`}
            description={`You do not have any active entries in your ${activeTab} section right now.`}
          />
        )}
      </main>
    </div>
  );
}
