import { useEffect, useMemo, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
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
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  Mail,
  User,
  Phone,
  Calendar,
  ShieldCheck,
  Save,
  X,
  Sparkles,
} from "lucide-react";

import { useAuth } from "../state/authContext.jsx";
import Card from "../components/ui/Card.jsx";
import Button from "../components/ui/Button.jsx";
import Badge from "../components/ui/Badge.jsx";
import Tabs from "../components/ui/Tabs.jsx";
import EmptyState from "../components/common/EmptyState.jsx";
import { getUserBookingsApi, getMyBookingsApi } from "../api/bookingApi.js";
import { formatCurrency, calculateAgeFromDob } from "../utils/formatters.js";

const TAB_ITEMS = [
  { key: "overview", label: "Overview", icon: LayoutDashboard },
  { key: "upcoming", label: "Upcoming Bookings", icon: CalendarDays },
  { key: "history", label: "Booking History", icon: History },
  { key: "watchlist", label: "Watchlist", icon: Film },
  { key: "payments", label: "Payments", icon: Wallet },
  { key: "rewards", label: "Rewards", icon: Gift },
  { key: "support", label: "Help & Support", icon: HelpCircle },
  { key: "settings", label: "Account Settings", icon: Settings },
];

function isUpcomingBooking(booking) {
  if (!booking) return false;

  const rawDate = booking.showDate || booking.date || (booking.createdAt ? String(booking.createdAt).substring(0, 10) : null);
  if (!rawDate) return true;

  const now = new Date();
  let showDateObj = new Date(rawDate);
  if (isNaN(showDateObj.getTime())) {
    showDateObj = new Date(String(rawDate).replace(/-/g, "/"));
  }

  if (!isNaN(showDateObj.getTime())) {
    showDateObj.setHours(23, 59, 59, 999);
    
    if (booking.showTime || booking.time) {
      const timeStr = (booking.showTime || booking.time).trim();
      const match = timeStr.match(/(\d+):(\d+)\s*(AM|PM)?/i);
      if (match) {
        let hours = parseInt(match[1], 10);
        const minutes = parseInt(match[2], 10);
        const ampm = match[3];
        if (ampm) {
          if (ampm.toUpperCase() === "PM" && hours < 12) hours += 12;
          if (ampm.toUpperCase() === "AM" && hours === 12) hours = 0;
        }
        showDateObj.setHours(hours, minutes, 0, 0);
      }
    }

    return showDateObj >= now;
  }

  return true;
}

export default function Profile() {
  const navigate = useNavigate();
  const { isLoggedIn, userData, logout, openLoginModal, updateProfile, sendEmailOtp, verifyEmailOtp } = useAuth();

  const [activeTab, setActiveTab] = useState("overview");
  const [userBookings, setUserBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Edit Personal Details Form State
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    mobile: "",
    countryCode: "+91",
    dob: "",
    age: "",
    gender: "Male",
  });
  const [saving, setSaving] = useState(false);
  const [profileMsg, setProfileMsg] = useState({ type: "", text: "" });

  // Email Verification Modal State
  const [emailOtpModalOpen, setEmailOtpModalOpen] = useState(false);
  const [emailOtpDigits, setEmailOtpDigits] = useState(["", "", "", "", "", ""]);
  const [emailOtpLoading, setEmailOtpLoading] = useState(false);
  const [emailOtpError, setEmailOtpError] = useState("");
  const [emailOtpSuccess, setEmailOtpSuccess] = useState("");

  const otpInputRefs = [
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
  ];

  // Sync userData into editForm
  useEffect(() => {
    if (userData) {
      setEditForm({
        name: userData.name || "",
        email: userData.email || "",
        mobile: userData.mobile || "",
        countryCode: userData.countryCode || "+91",
        dob: userData.dob || "",
        age: userData.age ? String(userData.age) : "",
        gender: userData.gender || "Male",
      });
    }
  }, [userData]);

  useEffect(() => {
    if (!isLoggedIn) {
      openLoginModal();
      navigate("/");
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
  }, [isLoggedIn, navigate, userData, openLoginModal]);

  const profile = useMemo(
    () => ({
      name: userData?.name || (userData?.email ? userData.email.split("@")[0] : "Movie Member"),
      email: userData?.email || "No email linked",
      phone: userData?.mobile
        ? `${userData.countryCode || "+91"} ${userData.mobile}`
        : "No phone linked",
      isEmailVerified: Boolean(userData?.emailVerified),
      isMobileVerified: Boolean(userData?.mobileVerified),
      isFullyVerified: Boolean(userData?.emailVerified) && Boolean(userData?.mobileVerified),
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
      { label: "Total Bookings", value: userBookings.length, icon: Ticket },
      { label: "Total Amount Spent", value: formatCurrency(totalSpent), icon: Wallet },
      { label: "Rewards Earned", value: `${rewardPoints} Pts`, icon: Gift },
      { label: "Membership Tier", value: vipTier, icon: BadgeCheck },
    ],
    [userBookings.length, totalSpent, rewardPoints, vipTier],
  );

  // Handle Profile Update Form Submission
  const handleSaveProfile = async (e) => {
    e?.preventDefault();
    if (!editForm.name || !editForm.name.trim()) {
      setProfileMsg({ type: "error", text: "Full Name cannot be empty." });
      return;
    }
    if (!editForm.email || !editForm.email.trim() || !editForm.email.includes("@")) {
      setProfileMsg({ type: "error", text: "Please enter a valid, non-empty email address." });
      return;
    }
    if (!editForm.mobile || !editForm.mobile.trim() || editForm.mobile.trim().length !== 10) {
      setProfileMsg({ type: "error", text: "Please enter a valid 10-digit mobile number." });
      return;
    }
    if (!editForm.dob || !editForm.dob.trim()) {
      setProfileMsg({ type: "error", text: "Date of Birth cannot be empty." });
      return;
    }
    const computedAge = calculateAgeFromDob(editForm.dob) || parseInt(editForm.age);
    if (!computedAge || isNaN(computedAge) || computedAge < 1 || computedAge > 120) {
      setProfileMsg({ type: "error", text: "Please select a valid Date of Birth." });
      return;
    }
    if (!editForm.gender || !editForm.gender.trim()) {
      setProfileMsg({ type: "error", text: "Please select a gender option." });
      return;
    }

    setSaving(true);
    setProfileMsg({ type: "", text: "" });

    try {
      await updateProfile({
        name: editForm.name.trim(),
        email: editForm.email.trim(),
        mobile: editForm.mobile.trim(),
        countryCode: editForm.countryCode || "+91",
        dob: editForm.dob.trim(),
        age: computedAge,
        gender: editForm.gender.trim(),
      });
      setProfileMsg({ type: "success", text: "Personal details updated successfully!" });
    } catch (err) {
      setProfileMsg({ type: "error", text: err.message || "Failed to update profile details." });
    } finally {
      setSaving(false);
    }
  };

  // Trigger Email Verification OTP
  const handleTriggerEmailVerification = async () => {
    const emailToVerify = editForm.email || userData?.email;
    if (!emailToVerify || !emailToVerify.includes("@")) {
      setProfileMsg({ type: "error", text: "Please enter a valid email to verify." });
      return;
    }

    setEmailOtpLoading(true);
    setEmailOtpError("");
    setEmailOtpSuccess("");

    try {
      const resMsg = await sendEmailOtp(emailToVerify);
      setEmailOtpModalOpen(true);
      setEmailOtpDigits(["", "", "", "", "", ""]);
      setEmailOtpSuccess(typeof resMsg === "string" ? resMsg : `Verification code sent to ${emailToVerify}`);
    } catch (err) {
      setProfileMsg({ type: "error", text: err.message || "Failed to send email verification OTP." });
    } finally {
      setEmailOtpLoading(false);
    }
  };

  // Verify Email OTP Submission
  const handleVerifyEmailOtpSubmit = async (e) => {
    e?.preventDefault();
    const otpCode = emailOtpDigits.join("");
    if (otpCode.length < 6) {
      setEmailOtpError("Please enter the complete 6-digit OTP");
      return;
    }

    setEmailOtpLoading(true);
    setEmailOtpError("");

    try {
      const emailToVerify = editForm.email || userData?.email;
      await verifyEmailOtp(emailToVerify, otpCode);
      setEmailOtpModalOpen(false);
      setProfileMsg({ type: "success", text: "Email address verified successfully!" });
    } catch (err) {
      setEmailOtpError(err.message || "Invalid verification code. Please try again.");
    } finally {
      setEmailOtpLoading(false);
    }
  };

  const handleOtpDigitChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newDigits = [...emailOtpDigits];
    newDigits[index] = value.slice(-1);
    setEmailOtpDigits(newDigits);
    setEmailOtpError("");

    if (value && index < 5) {
      otpInputRefs[index + 1].current?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !emailOtpDigits[index] && index > 0) {
      otpInputRefs[index - 1].current?.focus();
    }
  };

  const renderBookingCard = (b) => (
    <Card key={b.id || b.bookingCode} className="p-5 border-slate-200 hover:shadow-md transition">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Badge variant="emerald" className="font-bold uppercase tracking-wider text-[10px]">
              {b.status || "CONFIRMED"}
            </Badge>
            <span className="text-xs font-mono font-bold text-slate-400">
              #{b.bookingCode || `BK-${b.id}`}
            </span>
          </div>

          <div>
            <h4 className="text-lg font-black text-slate-900">{b.movieTitle || "Movie Show"}</h4>
            <p className="text-xs text-slate-500 font-semibold flex items-center gap-1.5 mt-0.5">
              <span>{b.theaterName}</span>
              {b.screenName && <span>• {b.screenName}</span>}
            </p>
          </div>

          <div className="flex flex-wrap gap-4 text-xs font-medium text-slate-600 pt-1">
            <p className="flex items-center gap-1">
              <CalendarDays className="h-3.5 w-3.5 text-red-500" />
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
              className="gap-1 text-xs font-bold cursor-pointer"
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
      <Card className="p-6 bg-gradient-to-r from-slate-900 via-slate-850 to-slate-950 text-white shadow-xl">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-tr from-red-600 to-rose-500 text-xl font-black text-white shadow-lg shadow-red-600/30">
              {profile.avatarText}
            </div>
            <div>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-white">
                  {profile.name}
                </h1>
                <Badge variant="amber" className="flex items-center gap-1">
                  <BadgeCheck className="h-3.5 w-3.5" />
                  {vipTier}
                </Badge>

                {profile.isEmailVerified ? (
                  <Badge variant="emerald" className="flex items-center gap-1 font-bold">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Verified Email
                  </Badge>
                ) : (
                  <Badge variant="amber" className="flex items-center gap-1 font-bold">
                    <AlertTriangle className="h-3.5 w-3.5" />
                    Email Unverified
                  </Badge>
                )}
              </div>
              <p className="text-xs text-slate-300 font-medium mt-1">
                {profile.email} • {profile.phone}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setActiveTab("settings")}
              className="gap-2 text-xs font-bold"
            >
              <Settings className="h-4 w-4" />
              <span>Edit Details</span>
            </Button>
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

      {/* Message Banner */}
      {profileMsg.text && (
        <div
          className={`p-4 rounded-2xl font-bold text-xs flex items-center justify-between shadow-sm ${
            profileMsg.type === "error"
              ? "bg-rose-50 text-rose-700 border border-rose-200"
              : "bg-emerald-50 text-emerald-700 border border-emerald-200"
          }`}
        >
          <div className="flex items-center gap-2">
            {profileMsg.type === "error" ? (
              <AlertTriangle className="h-4 w-4 shrink-0" />
            ) : (
              <CheckCircle2 className="h-4 w-4 shrink-0" />
            )}
            <span>{profileMsg.text}</span>
          </div>
          <button onClick={() => setProfileMsg({ type: "", text: "" })} className="cursor-pointer">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

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

            {/* Customer Support Section */}
            <div className="mt-6">
              <Card className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900 text-white shadow-xl">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 font-bold text-red-400 text-sm">
                    <HelpCircle className="h-5 w-5 text-red-500" />
                    <span>Customer Support & FAQs</span>
                  </div>
                  <p className="text-xs text-slate-300">Have questions about tickets, refunds or seat selections?</p>
                </div>
                <Button variant="danger" size="sm" onClick={() => navigate("/support")}>
                  Help Center
                </Button>
              </Card>
            </div>
          </div>
        )}

        {activeTab === "upcoming" && (
          <div className="space-y-4">
            {loading ? (
              <div className="py-8 text-center text-sm font-bold text-slate-400">Loading tickets...</div>
            ) : userBookings.filter(isUpcomingBooking).length > 0 ? (
              userBookings.filter(isUpcomingBooking).map(renderBookingCard)
            ) : (
              <EmptyState
                icon={Ticket}
                title="No Upcoming Bookings"
                description="You don't have any upcoming movie shows. Past shows are available under Booking History."
              />
            )}
          </div>
        )}

        {activeTab === "history" && (
          <div className="space-y-4">
            {loading ? (
              <div className="py-8 text-center text-sm font-bold text-slate-400">Loading tickets...</div>
            ) : userBookings.filter((b) => !isUpcomingBooking(b)).length > 0 ? (
              userBookings.filter((b) => !isUpcomingBooking(b)).map(renderBookingCard)
            ) : (
              <EmptyState
                icon={History}
                title="No Booking History"
                description="No past completed movie shows found under your account."
              />
            )}
          </div>
        )}

        {/* ACCOUNT SETTINGS: EDIT PERSONAL DETAILS & VERIFY EMAIL */}
        {activeTab === "settings" && (
          <div className="grid md:grid-cols-12 gap-6">
            {/* Left Col: Personal Details Form */}
            <div className="md:col-span-8 space-y-6">
              <Card className="p-6 space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="grid h-10 w-10 place-items-center rounded-xl bg-red-50 text-red-600">
                      <User className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-slate-900">Personal Details</h3>
                      <p className="text-xs text-slate-500 font-medium">Update your account information and contact preferences</p>
                    </div>
                  </div>
                </div>

                <form onSubmit={handleSaveProfile} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    {/* Full Name */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                        <User className="h-3.5 w-3.5 text-slate-400" />
                        <span>Full Name</span>
                      </label>
                      <input
                        type="text"
                        value={editForm.name}
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                        placeholder="John Doe"
                        className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/10"
                      />
                    </div>

                    {/* Gender */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">Gender</label>
                      <select
                        value={editForm.gender}
                        onChange={(e) => setEditForm({ ...editForm, gender: e.target.value })}
                        className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/10"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                        <option value="Prefer not to say">Prefer not to say</option>
                      </select>
                    </div>
                  </div>

                  {/* Email & Verification status */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                        <Mail className="h-3.5 w-3.5 text-slate-400" />
                        <span>Email Address</span>
                      </label>

                      {profile.isEmailVerified ? (
                        <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          Verified
                        </span>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="flex items-center gap-1 text-[11px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                            <AlertTriangle className="h-3 w-3" />
                            Unverified
                          </span>
                          <button
                            type="button"
                            onClick={handleTriggerEmailVerification}
                            disabled={emailOtpLoading}
                            className="text-xs font-black text-red-600 hover:text-red-700 underline cursor-pointer"
                          >
                            Verify Now
                          </button>
                        </div>
                      )}
                    </div>

                    <input
                      type="email"
                      value={editForm.email}
                      onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                      placeholder="user@example.com"
                      className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/10"
                    />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    {/* Mobile Number & Verification Status */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                          <Phone className="h-3.5 w-3.5 text-slate-400" />
                          <span>Mobile Phone</span>
                        </label>

                        {userData?.mobileVerified ? (
                          <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            Verified
                          </span>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span className="flex items-center gap-1 text-[11px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                              <AlertTriangle className="h-3 w-3" />
                              Unverified
                            </span>
                            <button
                              type="button"
                              onClick={handleTriggerEmailVerification}
                              className="text-xs font-black text-red-600 hover:text-red-700 underline cursor-pointer"
                            >
                              Verify Mobile
                            </button>
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={editForm.countryCode}
                          onChange={(e) => setEditForm({ ...editForm, countryCode: e.target.value })}
                          className="w-16 rounded-xl border border-slate-200 px-2.5 py-2.5 text-xs font-bold text-center text-slate-800"
                        />
                        <input
                          type="tel"
                          maxLength={10}
                          value={editForm.mobile}
                          onChange={(e) => setEditForm({ ...editForm, mobile: e.target.value.replace(/\D/g, "") })}
                          placeholder="9876543210"
                          className="flex-1 rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/10"
                        />
                      </div>
                    </div>

                    {/* Date of Birth & Age (Auto-calculated) */}
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5 text-slate-400" />
                          <span>Date of Birth</span>
                        </label>
                        <input
                          type="date"
                          value={editForm.dob}
                          onChange={(e) => {
                            const newDob = e.target.value;
                            const newAge = calculateAgeFromDob(newDob);
                            setEditForm({ ...editForm, dob: newDob, age: newAge });
                          }}
                          className="w-full rounded-xl border border-slate-200 px-2.5 py-2 text-xs font-semibold text-slate-900 focus:border-red-500 focus:outline-none"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-700">Calculated Age</label>
                        <input
                          type="text"
                          value={
                            editForm.dob
                              ? `${calculateAgeFromDob(editForm.dob) || editForm.age || "--"} yrs (Auto)`
                              : "Auto-calculated"
                          }
                          readOnly
                          disabled
                          className="w-full rounded-xl bg-slate-100 border border-slate-200 px-3.5 py-2 text-xs font-bold text-slate-600 cursor-not-allowed"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 flex justify-end">
                    <Button
                      type="submit"
                      variant="danger"
                      disabled={saving}
                      className="px-6 py-2.5 text-xs font-extrabold rounded-xl shadow-md shadow-red-500/20 cursor-pointer flex items-center gap-2"
                    >
                      <Save className="h-4 w-4" />
                      <span>{saving ? "Saving Changes..." : "Save Changes"}</span>
                    </Button>
                  </div>
                </form>
              </Card>
            </div>

            {/* Right Col: Account Security Status Card */}
            <div className="md:col-span-4 space-y-6">
              <Card className="p-6 space-y-4 bg-slate-900 text-white">
                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-rose-500/20 text-rose-400">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-base font-black">Account Security</h4>
                    <p className="text-xs text-slate-400 font-medium">Identity & verification status</p>
                  </div>
                </div>

                <div className="space-y-3 pt-2 border-t border-white/10 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 font-bold">Email Verification:</span>
                    {profile.isEmailVerified ? (
                      <span className="text-emerald-400 font-bold flex items-center gap-1">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Verified
                      </span>
                    ) : (
                      <button
                        onClick={handleTriggerEmailVerification}
                        className="text-rose-400 hover:text-rose-300 font-bold underline cursor-pointer"
                      >
                        Verify Email Now
                      </button>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 font-bold">Phone Number:</span>
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Linked
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 font-bold">VIP Membership:</span>
                    <span className="text-amber-400 font-bold">{vipTier}</span>
                  </div>
                </div>
              </Card>
            </div>
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

        {!["overview", "upcoming", "history", "payments", "rewards", "support", "settings"].includes(activeTab) && (
          <EmptyState
            icon={Film}
            title={`No ${activeTab} items found`}
            description={`You do not have any active entries in your ${activeTab} section right now.`}
          />
        )}
      </main>

      {/* ================= EMAIL VERIFICATION OTP MODAL ================= */}
      <AnimatePresence>
        {emailOtpModalOpen && (
          <div className="fixed inset-0 z-[99999] grid place-items-center bg-slate-950/75 p-4 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 15 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white p-6 shadow-2xl border border-slate-100 space-y-5"
            >
              <button
                type="button"
                onClick={() => setEmailOtpModalOpen(false)}
                className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-full bg-slate-100 text-slate-400 hover:bg-slate-200 transition cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="space-y-1 pr-6">
                <div className="flex items-center gap-2 text-rose-600 font-bold text-xs uppercase tracking-wider">
                  <Sparkles className="h-4 w-4" />
                  <span>Email Verification</span>
                </div>
                <h3 className="text-xl font-black text-slate-900">Verify Your Email Address</h3>
                <p className="text-xs font-medium text-slate-500">
                  Enter the 6-digit OTP code sent to <strong className="text-slate-800">{editForm.email || userData?.email}</strong>
                </p>
                <p className="text-[11px] font-semibold text-slate-500 pt-1">
                  Check your email inbox or spam folder for your 6-digit code
                </p>
              </div>

              {emailOtpSuccess && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-700 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                  <span>{emailOtpSuccess}</span>
                </div>
              )}

              {emailOtpError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs font-bold text-rose-700 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 shrink-0" />
                  <span>{emailOtpError}</span>
                </div>
              )}

              <form onSubmit={handleVerifyEmailOtpSubmit} className="space-y-5">
                <div className="flex justify-between items-center gap-2">
                  {emailOtpDigits.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={otpInputRefs[idx]}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpDigitChange(idx, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                      className="h-12 w-12 rounded-xl border border-slate-200 text-center text-lg font-black text-slate-900 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/10 shadow-2xs"
                    />
                  ))}
                </div>

                <Button
                  type="submit"
                  variant="danger"
                  disabled={emailOtpLoading}
                  className="w-full py-3 text-xs font-extrabold rounded-2xl shadow-md shadow-red-500/20 cursor-pointer"
                >
                  <span>{emailOtpLoading ? "Verifying..." : "Verify Email"}</span>
                </Button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
