import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import {
  LayoutDashboard, Users, Film, MapPin, Calendar, Ticket, CreditCard,
  TrendingUp, Plus, Trash2, Edit, ShieldCheck, CheckCircle2, AlertTriangle,
  Search, RefreshCw, X, ChevronRight, UserPlus, FileText, ArrowUpRight, BarChart3,
  Eye, Receipt, Printer, Ban, LogOut, Bell, BellRing, CheckCheck, Clock, Sparkles
} from "lucide-react";
import Card from "../components/ui/Card.jsx";
import Button from "../components/ui/Button.jsx";
import Badge from "../components/ui/Badge.jsx";
import Input from "../components/ui/Input.jsx";
import Modal from "../components/ui/Modal.jsx";
import { useToast } from "../state/toastContext.jsx";
import { useAuth } from "../state/authContext.jsx";
import { formatCurrency } from "../utils/formatters.js";

import {
  getAdminStatsApi,
  getAdminMoviesApi, createAdminMovieApi, updateAdminMovieApi, deleteAdminMovieApi,
  getAdminTheatersApi, createAdminTheaterApi, updateAdminTheaterApi, deleteAdminTheaterApi,
  getAdminShowsApi, createAdminShowApi, updateAdminShowApi, deleteAdminShowApi,
  getAdminUsersApi, createAdminUserApi, updateAdminUserRoleApi, updateAdminUserVerificationApi, deleteAdminUserApi,
  getAdminBookingsApi, createAdminSampleBookingApi, updateAdminBookingStatusApi, deleteAdminBookingApi,
  getAdminAnalyticsApi, getAdminNotificationsApi
} from "../api/adminApi.js";

const NAV_MODULES = [
  { id: "overview", label: "Dashboard Overview", icon: LayoutDashboard },
  { id: "users", label: "Users Directory", icon: Users },
  { id: "movies", label: "Movies Catalog", icon: Film },
  { id: "theaters", label: "Theaters & Screens", icon: MapPin },
  { id: "shows", label: "Showtime Scheduler", icon: Calendar },
  { id: "bookings", label: "Customer Bookings", icon: Ticket },
  { id: "payments", label: "Payments & Txns", icon: CreditCard },
  { id: "analytics", label: "Reports & Analytics", icon: TrendingUp },
];

export default function AdminDashboard() {
  const { userData, logout } = useAuth();
  const { showToast } = useToast();
  const [activeModule, setActiveModule] = useState("overview");
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState("ALL");
  const [filterStatus, setFilterStatus] = useState("ALL");

  // Data states
  const [stats, setStats] = useState({
    totalUsers: 0, totalBookings: 0, totalRevenue: 0, activeUsers: 0,
    pendingBookings: 0, completedBookings: 0, cancelledBookings: 0,
    totalMovies: 0, totalTheaters: 0
  });
  const [movies, setMovies] = useState([]);
  const [theaters, setTheaters] = useState([]);
  const [shows, setShows] = useState([]);
  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);

  // Modals state
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [userForm, setUserForm] = useState({ name: "", email: "", mobile: "", password: "", role: "ROLE_USER", emailVerified: true, mobileVerified: true });

  const [isMovieModalOpen, setIsMovieModalOpen] = useState(false);
  const [editingMovie, setEditingMovie] = useState(null);
  const [movieForm, setMovieForm] = useState({
    title: "", description: "", posterUrl: "", backdropUrl: "", trailerUrl: "",
    durationMinutes: 120, rating: 8.5, certification: "U/A", language: "Hindi", releaseDate: "",
    genres: "Action, Drama", format: "2D, 3D"
  });

  const [isTheaterModalOpen, setIsTheaterModalOpen] = useState(false);
  const [editingTheater, setEditingTheater] = useState(null);
  const [theaterForm, setTheaterForm] = useState({
    name: "", city: "Mumbai", area: "", latitude: 19.076, longitude: 72.877, facilities: "Dolby Atmos, Recliners, Food Court"
  });

  const [isShowModalOpen, setIsShowModalOpen] = useState(false);
  const [showForm, setShowForm] = useState({
    movieId: "", theaterId: "", showDate: new Date().toISOString().split("T")[0], showTime: "19:30", basePrice: 250
  });

  const [selectedBookingModal, setSelectedBookingModal] = useState(null);

  // Live Notifications State
  const [notifications, setNotifications] = useState([]);
  const [isNotifDropdownOpen, setIsNotifDropdownOpen] = useState(false);
  const [notifFilter, setNotifFilter] = useState("ALL");
  const [readNotifIds, setReadNotifIds] = useState(() => {
    try {
      const stored = localStorage.getItem("bmt_admin_read_notifs");
      return stored ? new Set(JSON.parse(stored)) : new Set();
    } catch {
      return new Set();
    }
  });
  const notifDropdownRef = useRef(null);
  const isInitialNotifFetch = useRef(true);
  const previousNotifIds = useRef(new Set());

  // Fetch data
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [stData, mList, tList, sList, uList, bList] = await Promise.all([
        getAdminStatsApi().catch(() => ({})),
        getAdminMoviesApi().catch(() => []),
        getAdminTheatersApi().catch(() => []),
        getAdminShowsApi().catch(() => []),
        getAdminUsersApi().catch(() => []),
        getAdminBookingsApi().catch(() => []),
      ]);

      setStats(stData);
      setMovies(mList);
      setTheaters(tList);
      setShows(sList);
      setUsers(uList);
      setBookings(bList || []);
    } catch {
      showToast("Error loading system data", "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  const loadNotifications = useCallback(async (isPolling = false) => {
    try {
      const list = await getAdminNotificationsApi();
      setNotifications(list || []);

      // If new notifications arrived during live polling
      if (!isInitialNotifFetch.current && isPolling && list && list.length > 0) {
        const latestNotifs = list.filter(n => !previousNotifIds.current.has(n.id));
        if (latestNotifs.length > 0) {
          const newest = latestNotifs[0];
          showToast(`🔔 ${newest.title}: ${newest.message}`, "info");
          // Refresh background statistics silently
          getAdminStatsApi().then(st => st && setStats(st)).catch(() => {});
          getAdminBookingsApi().then(b => b && setBookings(b)).catch(() => {});
          getAdminUsersApi().then(u => u && setUsers(u)).catch(() => {});
        }
      }

      if (list && list.length > 0) {
        previousNotifIds.current = new Set(list.map(n => n.id));
      }
      isInitialNotifFetch.current = false;
    } catch {
      // ignore transient error
    }
  }, [showToast]);

  useEffect(() => {
    loadData();
    loadNotifications(false);
  }, [loadData, loadNotifications]);

  // Live periodic polling for real-time registrations and bookings (every 10 seconds)
  useEffect(() => {
    const timer = setInterval(() => {
      loadNotifications(true);
    }, 10000);
    return () => clearInterval(timer);
  }, [loadNotifications]);

  // Close notifications dropdown on click outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (notifDropdownRef.current && !notifDropdownRef.current.contains(e.target)) {
        setIsNotifDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const unreadNotifCount = useMemo(() => {
    return notifications.filter(n => !readNotifIds.has(n.id)).length;
  }, [notifications, readNotifIds]);

  const filteredNotifications = useMemo(() => {
    if (notifFilter === "BOOKINGS") {
      return notifications.filter(n => n.type.includes("BOOKING"));
    }
    if (notifFilter === "USERS") {
      return notifications.filter(n => n.type === "USER_REGISTERED");
    }
    return notifications;
  }, [notifications, notifFilter]);

  const handleMarkAllRead = () => {
    const allIds = new Set([...readNotifIds, ...notifications.map(n => n.id)]);
    setReadNotifIds(allIds);
    try {
      localStorage.setItem("bmt_admin_read_notifs", JSON.stringify(Array.from(allIds)));
    } catch {}
    showToast("All notifications marked as read", "success");
  };

  const handleNotificationClick = (notif) => {
    const updated = new Set(readNotifIds);
    updated.add(notif.id);
    setReadNotifIds(updated);
    try {
      localStorage.setItem("bmt_admin_read_notifs", JSON.stringify(Array.from(updated)));
    } catch {}
    setIsNotifDropdownOpen(false);

    if (notif.type.includes("BOOKING")) {
      const foundBooking = bookings.find(b => b.bookingCode === notif.linkId);
      if (foundBooking) {
        setSelectedBookingModal(foundBooking);
      } else {
        setActiveModule("bookings");
        setSearchQuery(notif.linkId || "");
      }
    } else if (notif.type === "USER_REGISTERED") {
      setActiveModule("users");
      const foundUser = users.find(u => String(u.id) === String(notif.linkId));
      if (foundUser) {
        setSearchQuery(foundUser.email || foundUser.name || "");
      }
    }
  };

  const formatTimeAgo = (isoString) => {
    if (!isoString) return "Recently";
    try {
      const date = new Date(isoString);
      const now = new Date();
      const diffSec = Math.floor((now - date) / 1000);
      if (diffSec < 45) return "Just now";
      if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`;
      if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`;
      return `${Math.floor(diffSec / 86400)}d ago`;
    } catch {
      return "Recently";
    }
  };

  // Handlers
  const handleSaveUser = async (e) => {
    e.preventDefault();
    if (!userForm.name || !userForm.email) {
      showToast("Name and email are required", "error");
      return;
    }
    try {
      await createAdminUserApi(userForm);
      showToast("New user account created!", "success");
      setIsUserModalOpen(false);
      loadData();
    } catch (err) {
      showToast(err.message || "Failed to create user", "error");
    }
  };

  const handleToggleUserRole = async (u) => {
    const targetRole = u.role === "ROLE_ADMIN" ? "ROLE_USER" : "ROLE_ADMIN";
    try {
      await updateAdminUserRoleApi(u.id, targetRole);
      showToast(`User role updated to ${targetRole}`, "success");
      loadData();
    } catch (err) {
      showToast(err.message || "Failed to update role", "error");
    }
  };

  const handleDeleteUser = async (u) => {
    if (u.email === userData?.email) {
      showToast("Safety Protection: You cannot delete your own admin account!", "error");
      return;
    }
    if (!window.confirm(`Are you sure you want to delete user ${u.name}?`)) return;
    try {
      await deleteAdminUserApi(u.id);
      showToast("User deleted successfully", "success");
      loadData();
    } catch (err) {
      showToast(err.message || "Failed to delete user", "error");
    }
  };

  const handleSaveMovie = async (e) => {
    e.preventDefault();
    if (!movieForm.title.trim()) {
      showToast("Movie title is required", "error");
      return;
    }
    const payload = {
      ...movieForm,
      genres: typeof movieForm.genres === "string" ? movieForm.genres.split(",").map(g => g.trim()) : movieForm.genres,
      format: typeof movieForm.format === "string" ? movieForm.format.split(",").map(f => f.trim()) : movieForm.format,
      durationMinutes: Number(movieForm.durationMinutes),
      rating: Number(movieForm.rating)
    };
    try {
      if (editingMovie) {
        await updateAdminMovieApi(editingMovie.id, payload);
        showToast("Movie details updated!", "success");
      } else {
        await createAdminMovieApi(payload);
        showToast("New movie added to catalog!", "success");
      }
      setIsMovieModalOpen(false);
      loadData();
    } catch {
      showToast("Failed to save movie", "error");
    }
  };

  const handleDeleteMovie = async (id) => {
    if (!window.confirm("Are you sure you want to delete this movie?")) return;
    try {
      await deleteAdminMovieApi(id);
      showToast("Movie deleted", "success");
      loadData();
    } catch {
      showToast("Failed to delete movie", "error");
    }
  };

  const handleSaveTheater = async (e) => {
    e.preventDefault();
    if (!theaterForm.name || !theaterForm.city) {
      showToast("Name and City are required", "error");
      return;
    }
    const payload = {
      ...theaterForm,
      facilities: typeof theaterForm.facilities === "string" ? theaterForm.facilities.split(",").map(f => f.trim()) : theaterForm.facilities
    };
    try {
      if (editingTheater) {
        await updateAdminTheaterApi(editingTheater.id, payload);
        showToast("Theater updated!", "success");
      } else {
        await createAdminTheaterApi(payload);
        showToast("New theater added!", "success");
      }
      setIsTheaterModalOpen(false);
      loadData();
    } catch {
      showToast("Failed to save theater", "error");
    }
  };

  const handleDeleteTheater = async (id) => {
    if (!window.confirm("Are you sure you want to delete this theater?")) return;
    try {
      await deleteAdminTheaterApi(id);
      showToast("Theater deleted", "success");
      loadData();
    } catch {
      showToast("Failed to delete theater", "error");
    }
  };

  const handleSaveShow = async (e) => {
    e.preventDefault();
    if (!showForm.movieId || !showForm.theaterId) {
      showToast("Movie and Theater selections are required", "error");
      return;
    }
    const payload = {
      movieId: String(showForm.movieId),
      theaterId: String(showForm.theaterId),
      date: showForm.showDate,
      time: showForm.showTime,
      basePrice: Number(showForm.basePrice)
    };
    try {
      await createAdminShowApi(payload);
      showToast("New showtime scheduled!", "success");
      setIsShowModalOpen(false);
      loadData();
    } catch {
      showToast("Failed to schedule showtime", "error");
    }
  };

  const handleDeleteShow = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this showtime?")) return;
    try {
      await deleteAdminShowApi(id);
      showToast("Showtime cancelled", "success");
      loadData();
    } catch {
      showToast("Failed to delete showtime", "error");
    }
  };

  const handleCreateSampleBooking = async () => {
    try {
      await createAdminSampleBookingApi();
      showToast("Test booking created & saved into Database!", "success");
      loadData();
    } catch (err) {
      showToast(err.message || "Failed to create sample booking in database", "error");
    }
  };

  const handleCancelBooking = async (id) => {
    if (!window.confirm("Are you sure you want to cancel & mark refund for this booking?")) return;
    try {
      await updateAdminBookingStatusApi(id, "CANCELLED");
      showToast("Booking marked as CANCELLED", "success");
      if (selectedBookingModal && selectedBookingModal.id === id) {
        setSelectedBookingModal({ ...selectedBookingModal, status: "CANCELLED", paymentStatus: "REFUNDED" });
      }
      loadData();
    } catch {
      showToast("Failed to update booking status", "error");
    }
  };

  const handleDeleteBookingRecord = async (id) => {
    if (!window.confirm("Are you sure you want to permanently delete this booking record?")) return;
    try {
      await deleteAdminBookingApi(id);
      showToast("Booking record deleted", "success");
      setSelectedBookingModal(null);
      loadData();
    } catch {
      showToast("Failed to delete booking record", "error");
    }
  };

  // Filtered lists
  const filteredUsers = useMemo(() => {
    return users.filter(u => {
      const matchSearch = (u.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (u.email || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (u.mobile || "").includes(searchQuery);
      const matchRole = filterRole === "ALL" || u.role === filterRole;
      return matchSearch && matchRole;
    });
  }, [users, searchQuery, filterRole]);

  const filteredBookings = useMemo(() => {
    return bookings.filter(b => {
      const matchSearch = (b.bookingCode || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (b.customerEmail || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (b.customerPhone || "").includes(searchQuery) ||
                          (b.show?.movie?.title || "").toLowerCase().includes(searchQuery.toLowerCase());
      const matchStatus = filterStatus === "ALL" || b.status === filterStatus;
      return matchSearch && matchStatus;
    });
  }, [bookings, searchQuery, filterStatus]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col md:flex-row">
      {/* ================= LEFT SIDEBAR NAVIGATION ================= */}
      <aside className="w-full md:w-64 bg-slate-950 text-white p-5 shrink-0 flex flex-col justify-between border-r border-slate-800">
        <div className="space-y-6">
          <div className="flex items-center gap-3 px-1">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#FF1744] text-white shadow-lg shadow-red-600/30">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-base font-black text-white tracking-tight leading-tight">BookMySeat</h2>
              <span className="text-[10px] font-extrabold text-rose-400 uppercase tracking-widest">Admin Control</span>
            </div>
          </div>

          <nav className="space-y-1 pt-2">
            {NAV_MODULES.map((mod) => {
              const Icon = mod.icon;
              const isActive = activeModule === mod.id;
              return (
                <button
                  key={mod.id}
                  onClick={() => { setActiveModule(mod.id); setSearchQuery(""); }}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                    isActive
                      ? "bg-[#FF1744] text-white shadow-md shadow-red-500/30"
                      : "text-slate-400 hover:bg-slate-900 hover:text-white"
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span>{mod.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="pt-4 border-t border-slate-800 px-1 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
            <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="truncate">{userData?.name || "System Admin"}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="inline-block text-[10px] font-black text-emerald-400 uppercase bg-emerald-950 px-2 py-0.5 rounded-md border border-emerald-800">
              ROLE_ADMIN Active
            </span>
          </div>
          <button
            type="button"
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 mt-2 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-bold text-rose-400 border border-slate-800 transition cursor-pointer"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Sign Out Admin</span>
          </button>
        </div>
      </aside>

      {/* ================= MAIN CONTENT CONTAINER ================= */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto">
        {/* TOP SYSTEM HEADER BAR */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200/80 p-5 rounded-2xl shadow-xs">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black text-slate-900 tracking-tight">
                {NAV_MODULES.find(m => m.id === activeModule)?.label}
              </h1>
              <Badge variant="emerald" className="font-extrabold">LIVE SYSTEM</Badge>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Real-time administrative control panel & database metrics
            </p>
          </div>
          <div className="flex items-center gap-3">
            {/* Real-time Notification Bell Popover */}
            <div className="relative" ref={notifDropdownRef}>
              <button
                type="button"
                onClick={() => setIsNotifDropdownOpen(!isNotifDropdownOpen)}
                className={`relative flex items-center justify-center h-9 w-9 rounded-xl border transition cursor-pointer ${
                  isNotifDropdownOpen
                    ? "bg-[#FF1744] text-white border-[#FF1744] shadow-md shadow-red-500/20"
                    : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 hover:text-slate-900"
                }`}
                title="System Notifications"
              >
                {unreadNotifCount > 0 ? (
                  <BellRing className="h-4 w-4 animate-bounce text-[#FF1744] group-hover:text-white" />
                ) : (
                  <Bell className="h-4 w-4" />
                )}

                {unreadNotifCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[#FF1744] px-1 text-[10px] font-black text-white shadow-sm ring-2 ring-white">
                    {unreadNotifCount > 99 ? "99+" : unreadNotifCount}
                  </span>
                )}
              </button>

              {/* Popover Dropdown Tray */}
              {isNotifDropdownOpen && (
                <div className="absolute right-0 top-12 z-50 w-80 sm:w-96 rounded-2xl bg-white border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                  {/* Tray Header */}
                  <div className="flex items-center justify-between p-4 bg-slate-900 text-white">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                      <h4 className="text-xs font-black tracking-tight text-white uppercase">Live Activity Feed</h4>
                      {unreadNotifCount > 0 && (
                        <span className="rounded-md bg-[#FF1744] px-1.5 py-0.5 text-[10px] font-extrabold text-white">
                          {unreadNotifCount} New
                        </span>
                      )}
                    </div>
                    {unreadNotifCount > 0 && (
                      <button
                        type="button"
                        onClick={handleMarkAllRead}
                        className="text-[11px] font-bold text-rose-300 hover:text-white flex items-center gap-1 transition cursor-pointer"
                      >
                        <CheckCheck className="h-3.5 w-3.5" />
                        <span>Mark read</span>
                      </button>
                    )}
                  </div>

                  {/* Filter Tabs */}
                  <div className="flex items-center gap-1 p-2 bg-slate-50 border-b border-slate-100 text-[11px] font-bold">
                    <button
                      type="button"
                      onClick={() => setNotifFilter("ALL")}
                      className={`flex-1 py-1 px-2 rounded-lg transition ${
                        notifFilter === "ALL" ? "bg-white shadow-xs text-[#FF1744] font-black" : "text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      All ({notifications.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setNotifFilter("BOOKINGS")}
                      className={`flex-1 py-1 px-2 rounded-lg transition ${
                        notifFilter === "BOOKINGS" ? "bg-white shadow-xs text-[#FF1744] font-black" : "text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      Bookings ({notifications.filter(n => n.type.includes("BOOKING")).length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setNotifFilter("USERS")}
                      className={`flex-1 py-1 px-2 rounded-lg transition ${
                        notifFilter === "USERS" ? "bg-white shadow-xs text-[#FF1744] font-black" : "text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      Users ({notifications.filter(n => n.type === "USER_REGISTERED").length})
                    </button>
                  </div>

                  {/* Notification List */}
                  <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                    {filteredNotifications.length === 0 ? (
                      <div className="p-8 text-center text-slate-400 space-y-2">
                        <Bell className="h-8 w-8 mx-auto text-slate-300 stroke-1" />
                        <p className="text-xs font-semibold">No recent notifications</p>
                      </div>
                    ) : (
                      filteredNotifications.map((notif) => {
                        const isRead = readNotifIds.has(notif.id);
                        const isBooking = notif.type.includes("BOOKING");
                        const isCancelled = notif.type === "BOOKING_CANCELLED";

                        return (
                          <div
                            key={notif.id}
                            onClick={() => handleNotificationClick(notif)}
                            className={`p-3.5 flex items-start gap-3 transition cursor-pointer hover:bg-slate-50 ${
                              isRead ? "bg-white opacity-80" : "bg-rose-50/30"
                            }`}
                          >
                            {/* Icon Type */}
                            <div
                              className={`h-8 w-8 shrink-0 rounded-xl grid place-items-center text-xs ${
                                isCancelled
                                  ? "bg-rose-100 text-rose-600"
                                  : isBooking
                                  ? "bg-emerald-100 text-emerald-700"
                                  : "bg-purple-100 text-purple-700"
                              }`}
                            >
                              {isCancelled ? (
                                <AlertTriangle className="h-4 w-4" />
                              ) : isBooking ? (
                                <Ticket className="h-4 w-4" />
                              ) : (
                                <UserPlus className="h-4 w-4" />
                              )}
                            </div>

                            {/* Details */}
                            <div className="flex-1 min-w-0 space-y-0.5">
                              <div className="flex items-center justify-between">
                                <span className={`text-xs font-black truncate ${isRead ? "text-slate-700" : "text-slate-900"}`}>
                                  {notif.title}
                                </span>
                                {!isRead && (
                                  <span className="h-2 w-2 rounded-full bg-[#FF1744] shrink-0" />
                                )}
                              </div>
                              <p className="text-[11px] text-slate-600 font-medium line-clamp-2 leading-relaxed">
                                {notif.message}
                              </p>
                              <div className="flex items-center gap-1 text-[10px] text-slate-400 font-bold pt-0.5">
                                <Clock className="h-3 w-3" />
                                <span>{formatTimeAgo(notif.timestamp)}</span>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>

                  {/* Tray Footer */}
                  <div className="p-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 font-bold">
                    <span className="flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Auto-pulse every 10s
                    </span>
                    <button
                      type="button"
                      onClick={() => { loadNotifications(false); loadData(); }}
                      className="text-[#FF1744] hover:underline"
                    >
                      Sync Now
                    </button>
                  </div>
                </div>
              )}
            </div>

            <Button variant="secondary" size="sm" onClick={loadData} disabled={loading} className="gap-2 text-xs font-bold border-slate-200">
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
              <span>Refresh Stats</span>
            </Button>
          </div>
        </div>

        {/* ================= MODULE 1: OVERVIEW DASHBOARD ================= */}
        {activeModule === "overview" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="p-5 bg-white border-slate-200/90 shadow-xs hover:shadow-md transition">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-slate-400 uppercase tracking-wider">Total Revenue</span>
                  <div className="h-10 w-10 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600 grid place-items-center">
                    <TrendingUp className="h-5 w-5" />
                  </div>
                </div>
                <div className="text-2xl font-black text-slate-900 mt-3">{formatCurrency(stats.totalRevenue || 0)}</div>
                <p className="text-[11px] text-emerald-600 font-extrabold mt-1">Confirmed booking payouts</p>
              </Card>

              <Card className="p-5 bg-white border-slate-200/90 shadow-xs hover:shadow-md transition">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-slate-400 uppercase tracking-wider">Total Bookings</span>
                  <div className="h-10 w-10 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-600 grid place-items-center">
                    <Ticket className="h-5 w-5" />
                  </div>
                </div>
                <div className="text-2xl font-black text-slate-900 mt-3">{stats.totalBookings || 0}</div>
                <p className="text-[11px] text-slate-500 font-bold mt-1">{stats.completedBookings || 0} Confirmed • {stats.cancelledBookings || 0} Cancelled</p>
              </Card>

              <Card className="p-5 bg-white border-slate-200/90 shadow-xs hover:shadow-md transition">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-slate-400 uppercase tracking-wider">Registered Users</span>
                  <div className="h-10 w-10 rounded-xl bg-purple-50 border border-purple-200 text-purple-600 grid place-items-center">
                    <Users className="h-5 w-5" />
                  </div>
                </div>
                <div className="text-2xl font-black text-slate-900 mt-3">{stats.totalUsers || 0}</div>
                <p className="text-[11px] text-purple-600 font-extrabold mt-1">{stats.activeUsers || 0} Verified Accounts</p>
              </Card>

              <Card className="p-5 bg-white border-slate-200/90 shadow-xs hover:shadow-md transition">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-slate-400 uppercase tracking-wider">Catalog Size</span>
                  <div className="h-10 w-10 rounded-xl bg-amber-50 border border-amber-200 text-amber-600 grid place-items-center">
                    <Film className="h-5 w-5" />
                  </div>
                </div>
                <div className="text-2xl font-black text-slate-900 mt-3">{stats.totalMovies || 0} Movies</div>
                <p className="text-[11px] text-amber-600 font-extrabold mt-1">{stats.totalTheaters || 0} Cinema Theaters</p>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="p-5 bg-white border-slate-200/90 shadow-xs lg:col-span-2 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-black text-slate-900">Recent Customer Bookings</h3>
                    <p className="text-xs text-slate-400">Live stream of ticket transactions</p>
                  </div>
                  <Button variant="subtle" size="sm" onClick={() => setActiveModule("bookings")} className="text-xs text-[#FF1744] font-bold">
                    View All Bookings
                  </Button>
                </div>
                <div className="overflow-x-auto rounded-xl border border-slate-200">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 font-extrabold text-slate-700 uppercase border-b border-slate-200">
                      <tr>
                        <th className="p-3">Code</th>
                        <th className="p-3">Customer</th>
                        <th className="p-3">Seats</th>
                        <th className="p-3">Amount</th>
                        <th className="p-3">Status</th>
                        <th className="p-3 text-right">Details</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-900 font-medium">
                      {bookings.slice(0, 5).map((b) => (
                        <tr key={b.id} className="hover:bg-slate-50 cursor-pointer" onClick={() => setSelectedBookingModal(b)}>
                          <td className="p-3 font-mono font-bold text-slate-500">{b.bookingCode}</td>
                          <td className="p-3 font-bold">{b.customerEmail}</td>
                          <td className="p-3 text-slate-500">{b.seatNumbers}</td>
                          <td className="p-3 font-extrabold text-emerald-700">{formatCurrency(b.totalAmount || 0)}</td>
                          <td className="p-3">
                            <Badge variant={b.status === "CONFIRMED" ? "emerald" : "amber"}>{b.status}</Badge>
                          </td>
                          <td className="p-3 text-right">
                            <Button variant="subtle" size="sm" className="p-1 text-slate-500 hover:text-slate-900">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>

              <div className="space-y-6">
                <Card className="p-5 bg-white border-slate-200/90 shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-black text-slate-900">Quick Actions</h3>
                    <span className="text-[10px] font-bold text-slate-400">Admin Tools</span>
                  </div>
                  <div className="space-y-2">
                    <Button variant="secondary" size="sm" onClick={() => { setActiveModule("users"); setIsUserModalOpen(true); }} className="w-full justify-start gap-2.5 text-xs font-bold py-2.5 border-slate-200">
                      <UserPlus className="h-4 w-4 text-purple-600" />
                      <span>Create User Account</span>
                    </Button>
                    <Button variant="secondary" size="sm" onClick={() => { setActiveModule("movies"); setIsMovieModalOpen(true); }} className="w-full justify-start gap-2.5 text-xs font-bold py-2.5 border-slate-200">
                      <Plus className="h-4 w-4 text-amber-600" />
                      <span>Add Movie to Catalog</span>
                    </Button>
                    <Button variant="secondary" size="sm" onClick={() => { setActiveModule("shows"); setIsShowModalOpen(true); }} className="w-full justify-start gap-2.5 text-xs font-bold py-2.5 border-slate-200">
                      <Calendar className="h-4 w-4 text-blue-600" />
                      <span>Schedule Showtime</span>
                    </Button>
                  </div>
                </Card>

                {/* Live Activity Feed Widget */}
                <Card className="p-5 bg-white border-slate-200/90 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                      <h4 className="text-xs font-black uppercase text-slate-700 tracking-wider">Live System Stream</h4>
                    </div>
                    <span className="text-[10px] font-bold text-[#FF1744]">Real-time</span>
                  </div>

                  <div className="space-y-2">
                    {notifications.slice(0, 4).map((n) => {
                      const isBooking = n.type.includes("BOOKING");
                      return (
                        <div
                          key={n.id}
                          onClick={() => handleNotificationClick(n)}
                          className="flex items-start gap-2.5 p-2 rounded-xl bg-slate-50 hover:bg-rose-50/50 border border-slate-100 transition cursor-pointer"
                        >
                          <div className={`h-6 w-6 rounded-lg grid place-items-center shrink-0 text-xs ${
                            isBooking ? "bg-emerald-100 text-emerald-700" : "bg-purple-100 text-purple-700"
                          }`}>
                            {isBooking ? <Ticket className="h-3.5 w-3.5" /> : <Users className="h-3.5 w-3.5" />}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-[11px] font-black text-slate-900 truncate">{n.title}</p>
                            <p className="text-[10px] text-slate-500 line-clamp-1">{n.message}</p>
                          </div>
                          <span className="text-[9px] font-bold text-slate-400 shrink-0">{formatTimeAgo(n.timestamp)}</span>
                        </div>
                      );
                    })}
                  </div>
                </Card>
              </div>
            </div>
          </div>
        )}

        {/* ================= MODULE 2: USER MANAGEMENT ================= */}
        {activeModule === "users" && (
          <Card className="p-6 bg-white border-slate-200/90 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="relative w-full sm:w-72">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Search users..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="pl-9 text-xs"
                  />
                </div>
                <select
                  value={filterRole}
                  onChange={e => setFilterRole(e.target.value)}
                  className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700 bg-white"
                >
                  <option value="ALL">All Roles</option>
                  <option value="ROLE_USER">ROLE_USER</option>
                  <option value="ROLE_ADMIN">ROLE_ADMIN</option>
                </select>
              </div>
              <Button variant="danger" size="sm" onClick={() => setUserForm({ name: "", email: "", mobile: "", password: "", role: "ROLE_USER", emailVerified: true, mobileVerified: true }) || setIsUserModalOpen(true)} className="gap-2 font-bold w-full sm:w-auto">
                <UserPlus className="h-4 w-4" />
                <span>Create User Account</span>
              </Button>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-slate-700 uppercase font-extrabold border-b border-slate-200">
                  <tr>
                    <th className="p-3">ID</th>
                    <th className="p-3">User Name</th>
                    <th className="p-3">Email & Contact</th>
                    <th className="p-3">Role</th>
                    <th className="p-3">Verifications</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-900">
                  {filteredUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50">
                      <td className="p-3 font-mono font-bold text-slate-400">#{u.id}</td>
                      <td className="p-3 font-bold">{u.name}</td>
                      <td className="p-3">
                        <div>{u.email}</div>
                        <div className="text-[10px] text-slate-500">{u.mobile ? `${u.countryCode || "+91"} ${u.mobile}` : "No phone"}</div>
                      </td>
                      <td className="p-3">
                        <Badge variant={u.role === "ROLE_ADMIN" ? "emerald" : "slate"} className="font-extrabold">
                          {u.role || "ROLE_USER"}
                        </Badge>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-1.5">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${u.emailVerified ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}`}>
                            Email: {u.emailVerified ? "✓ Verified" : "⚠️ Pending"}
                          </span>
                        </div>
                      </td>
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Button variant="secondary" size="sm" onClick={() => handleToggleUserRole(u)} className="text-[10px] font-bold px-2 py-1 border-slate-200">
                            Make {u.role === "ROLE_ADMIN" ? "User" : "Admin"}
                          </Button>
                          <Button variant="danger" size="sm" onClick={() => handleDeleteUser(u)} className="p-1.5">
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {/* ================= MODULE 3: MOVIES CATALOG ================= */}
        {activeModule === "movies" && (
          <Card className="p-6 bg-white border-slate-200/90 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <Input
                placeholder="Search movies..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-72 text-xs"
              />
              <Button variant="danger" size="sm" onClick={() => {
                setEditingMovie(null);
                setMovieForm({ title: "", description: "", posterUrl: "", backdropUrl: "", trailerUrl: "", durationMinutes: 120, rating: 8.5, certification: "U/A", language: "Hindi", releaseDate: "", genres: "Action, Drama", format: "2D, 3D" });
                setIsMovieModalOpen(true);
              }} className="gap-2 font-bold">
                <Plus className="h-4 w-4" />
                <span>Add Movie</span>
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {movies.filter(m => (m.title || "").toLowerCase().includes(searchQuery.toLowerCase())).map((m) => (
                <Card key={m.id} className="p-4 bg-white border border-slate-200 space-y-3 relative shadow-2xs hover:shadow-xs transition">
                  <div className="flex gap-3">
                    <img src={m.posterUrl || "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba"} alt={m.title} className="h-20 w-14 rounded-lg object-cover" />
                    <div>
                      <h4 className="font-extrabold text-slate-900 text-sm">{m.title}</h4>
                      <p className="text-[11px] text-slate-500">{m.language} • {m.certification} • {m.durationMinutes}m</p>
                      <span className="text-[11px] font-bold text-amber-600">★ {m.rating}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between border-t border-slate-100 pt-2">
                    <Badge variant="amber">{Array.isArray(m.format) ? m.format.join(", ") : m.format || "2D"}</Badge>
                    <div className="flex items-center gap-1.5">
                      <Button variant="subtle" size="sm" onClick={() => {
                        setEditingMovie(m);
                        setMovieForm({ title: m.title || "", description: m.description || "", posterUrl: m.posterUrl || "", backdropUrl: m.backdropUrl || "", trailerUrl: m.trailerUrl || "", durationMinutes: m.durationMinutes || 120, rating: m.rating || 8.5, certification: m.certification || "U/A", language: m.language || "Hindi", releaseDate: m.releaseDate || "", genres: Array.isArray(m.genres) ? m.genres.join(", ") : m.genres || "", format: Array.isArray(m.format) ? m.format.join(", ") : m.format || "" });
                        setIsMovieModalOpen(true);
                      }} className="p-1.5"><Edit className="h-3.5 w-3.5" /></Button>
                      <Button variant="danger" size="sm" onClick={() => handleDeleteMovie(m.id)} className="p-1.5"><Trash2 className="h-3.5 w-3.5" /></Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </Card>
        )}

        {/* ================= MODULE 4: THEATERS ================= */}
        {activeModule === "theaters" && (
          <Card className="p-6 bg-white border-slate-200/90 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-slate-900">Cinema Theaters</h3>
              <Button variant="danger" size="sm" onClick={() => {
                setEditingTheater(null);
                setTheaterForm({ name: "", city: "Mumbai", area: "", latitude: 19.076, longitude: 72.877, facilities: "Dolby Atmos, Recliners, Food Court" });
                setIsTheaterModalOpen(true);
              }} className="gap-2 font-bold">
                <Plus className="h-4 w-4" />
                <span>Add Theater</span>
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {theaters.map((t) => (
                <Card key={t.id} className="p-4 bg-white border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <Badge variant="indigo">{t.city}</Badge>
                    <div className="flex items-center gap-1">
                      <Button variant="subtle" size="sm" onClick={() => {
                        setEditingTheater(t);
                        setTheaterForm({ name: t.name, city: t.city, area: t.area || "", latitude: t.latitude || 19.076, longitude: t.longitude || 72.877, facilities: Array.isArray(t.facilities) ? t.facilities.join(", ") : t.facilities || "" });
                        setIsTheaterModalOpen(true);
                      }} className="p-1.5"><Edit className="h-3.5 w-3.5" /></Button>
                      <Button variant="danger" size="sm" onClick={() => handleDeleteTheater(t.id)} className="p-1.5"><Trash2 className="h-3.5 w-3.5" /></Button>
                    </div>
                  </div>
                  <h4 className="font-extrabold text-slate-900 text-base">{t.name}</h4>
                  <p className="text-xs text-slate-500">{t.area || t.city}</p>
                </Card>
              ))}
            </div>
          </Card>
        )}

        {/* ================= MODULE 5: SHOWTIMES ================= */}
        {activeModule === "shows" && (
          <Card className="p-6 bg-white border-slate-200/90 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-slate-900">Showtimes Schedule</h3>
              <Button variant="danger" size="sm" onClick={() => {
                setShowForm({ movieId: movies[0]?.id || "", theaterId: theaters[0]?.id || "", showDate: new Date().toISOString().split("T")[0], showTime: "19:30", basePrice: 250 });
                setIsShowModalOpen(true);
              }} className="gap-2 font-bold">
                <Plus className="h-4 w-4" />
                <span>Schedule Showtime</span>
              </Button>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-slate-700 uppercase font-extrabold border-b border-slate-200">
                  <tr>
                    <th className="p-3">Show ID</th>
                    <th className="p-3">Movie</th>
                    <th className="p-3">Theater</th>
                    <th className="p-3">Date & Time</th>
                    <th className="p-3">Price</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-900">
                  {shows.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-50">
                      <td className="p-3 font-mono font-bold text-slate-400">#{s.id}</td>
                      <td className="p-3 font-bold">{s.movie?.title || s.movieId}</td>
                      <td className="p-3 text-slate-600">{s.theater?.name || s.theaterId}</td>
                      <td className="p-3">
                        <div className="font-bold">{s.date}</div>
                        <div className="text-[10px] text-slate-400">@ {s.time}</div>
                      </td>
                      <td className="p-3 font-extrabold text-emerald-700">{formatCurrency(s.basePrice || 250)}</td>
                      <td className="p-3 text-right">
                        <Button variant="danger" size="sm" onClick={() => handleDeleteShow(s.id)} className="p-1.5"><Trash2 className="h-3.5 w-3.5" /></Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {/* ================= MODULE 6: CUSTOMER BOOKINGS (ENHANCED) ================= */}
        {activeModule === "bookings" && (
          <Card className="p-6 bg-white border-slate-200/90 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="relative w-full sm:w-72">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Search code, email, movie..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="pl-9 text-xs"
                  />
                </div>
                <select
                  value={filterStatus}
                  onChange={e => setFilterStatus(e.target.value)}
                  className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700 bg-white"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="CONFIRMED">CONFIRMED</option>
                  <option value="CANCELLED">CANCELLED</option>
                </select>
              </div>

              <div className="flex items-center gap-3">
                <Button variant="danger" size="sm" onClick={handleCreateSampleBooking} className="gap-1.5 font-bold text-xs">
                  <Plus className="h-4 w-4" />
                  <span>Insert DB Test Booking</span>
                </Button>
                <div className="text-xs font-bold text-slate-500">
                  Total Bookings: <span className="text-slate-900 font-extrabold">{filteredBookings.length}</span>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-slate-700 uppercase font-extrabold border-b border-slate-200">
                  <tr>
                    <th className="p-3">Booking Code</th>
                    <th className="p-3">Customer Email / Phone</th>
                    <th className="p-3">Movie & Showtime</th>
                    <th className="p-3">Seats</th>
                    <th className="p-3">Total Paid</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-900">
                  {filteredBookings.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-slate-400">
                        <Ticket className="h-8 w-8 mx-auto mb-2 text-slate-300" />
                        <p className="font-bold text-slate-700 text-sm">No Bookings Currently Saved in Database</p>
                        <p className="text-xs text-slate-400 mt-1">When users book tickets, their records are stored directly in your database.</p>
                        <Button variant="danger" size="sm" onClick={handleCreateSampleBooking} className="mt-3 gap-1.5 font-bold text-xs inline-flex">
                          <Plus className="h-3.5 w-3.5" />
                          <span>Insert Test Booking into Database</span>
                        </Button>
                      </td>
                    </tr>
                  ) : (
                    filteredBookings.map((b) => (
                      <tr key={b.id} className="hover:bg-slate-50 transition cursor-pointer" onClick={() => setSelectedBookingModal(b)}>
                        <td className="p-3 font-mono font-black text-rose-600">{b.bookingCode}</td>
                        <td className="p-3 font-bold">
                          <div>{b.customerEmail}</div>
                          <div className="text-[10px] text-slate-400 font-normal">{b.customerPhone || "No phone"}</div>
                        </td>
                        <td className="p-3">
                          <div className="font-extrabold text-slate-900">{b.show?.movie?.title || "Movie Ticket"}</div>
                          <div className="text-[10px] text-slate-500">{b.show?.date} @ {b.show?.time}</div>
                        </td>
                        <td className="p-3 text-slate-700 font-bold">{b.seatNumbers}</td>
                        <td className="p-3 font-black text-emerald-700">{formatCurrency(b.totalAmount || 0)}</td>
                        <td className="p-3">
                          <Badge variant={b.status === "CONFIRMED" ? "emerald" : "amber"}>{b.status}</Badge>
                        </td>
                        <td className="p-3 text-right" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-end gap-1.5">
                            <Button variant="secondary" size="sm" onClick={() => setSelectedBookingModal(b)} className="text-[10px] px-2 py-1 gap-1 border-slate-200">
                              <Eye className="h-3 w-3" />
                              <span>Details</span>
                            </Button>
                            {b.status === "CONFIRMED" && (
                              <Button variant="subtle" size="sm" onClick={() => handleCancelBooking(b.id)} className="text-[10px] px-2 py-1 text-amber-700 hover:bg-amber-50">
                                Cancel
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {/* ================= MODULE 7: PAYMENTS ================= */}
        {activeModule === "payments" && (
          <Card className="p-6 bg-white border-slate-200/90 shadow-xs space-y-4">
            <h3 className="text-lg font-black text-slate-900">Payments & Transaction Logs</h3>
            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-slate-700 uppercase font-extrabold border-b border-slate-200">
                  <tr>
                    <th className="p-3">Transaction ID</th>
                    <th className="p-3">Customer</th>
                    <th className="p-3">Method</th>
                    <th className="p-3">Amount</th>
                    <th className="p-3">Payment Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-900">
                  {bookings.map((b) => (
                    <tr key={b.id} className="hover:bg-slate-50">
                      <td className="p-3 font-mono text-slate-500">{b.razorpayPaymentId || b.paymentTransactionId || `TXN-${b.id}`}</td>
                      <td className="p-3 font-bold">{b.customerEmail}</td>
                      <td className="p-3 text-slate-600 uppercase">{b.paymentMethod || "UPI / Card"}</td>
                      <td className="p-3 font-extrabold text-emerald-700">{formatCurrency(b.totalAmount || 0)}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${b.paymentStatus === "SUCCESS" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}`}>
                          {b.paymentStatus || "SUCCESS"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {/* ================= MODULE 8: REPORTS & ANALYTICS ================= */}
        {activeModule === "analytics" && (
          <div className="space-y-6">
            <Card className="p-6 bg-white border-slate-200/90 shadow-xs space-y-4">
              <h3 className="text-lg font-black text-slate-900">Financial Reports & User Breakdown</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                  <h4 className="text-xs font-bold text-slate-500 uppercase">Booking Status Distribution</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-slate-800 font-bold">
                      <span>Confirmed Bookings</span>
                      <span className="text-emerald-700">{stats.completedBookings || 0}</span>
                    </div>
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div className="bg-emerald-600 h-full" style={{ width: `${stats.totalBookings ? ((stats.completedBookings || 0) / stats.totalBookings) * 100 : 100}%` }} />
                    </div>
                    <div className="flex justify-between text-xs text-slate-800 font-bold pt-2">
                      <span>Cancelled Bookings</span>
                      <span className="text-amber-700">{stats.cancelledBookings || 0}</span>
                    </div>
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div className="bg-amber-600 h-full" style={{ width: `${stats.totalBookings ? ((stats.cancelledBookings || 0) / stats.totalBookings) * 100 : 0}%` }} />
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                  <h4 className="text-xs font-bold text-slate-500 uppercase">User Accounts Verification</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-slate-800 font-bold">
                      <span>Verified Users</span>
                      <span className="text-purple-700">{stats.activeUsers || 0}</span>
                    </div>
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div className="bg-purple-600 h-full" style={{ width: `${stats.totalUsers ? ((stats.activeUsers || 0) / stats.totalUsers) * 100 : 100}%` }} />
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}
      </main>

      {/* ================= VIEW BOOKING RECEIPT MODAL ================= */}
      <Modal isOpen={Boolean(selectedBookingModal)} onClose={() => setSelectedBookingModal(null)} title="Booking E-Ticket Receipt">
        {selectedBookingModal && (
          <div className="space-y-4 text-slate-900 text-xs">
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-100 border border-slate-200">
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase">Booking Pass Code</span>
                <div className="text-base font-black text-rose-600 font-mono">{selectedBookingModal.bookingCode}</div>
              </div>
              <Badge variant={selectedBookingModal.status === "CONFIRMED" ? "emerald" : "amber"}>
                {selectedBookingModal.status}
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-3 border-y border-slate-100 py-3">
              <div>
                <span className="text-slate-400 font-bold block">Customer Email:</span>
                <span className="font-extrabold text-slate-900">{selectedBookingModal.customerEmail}</span>
              </div>
              <div>
                <span className="text-slate-400 font-bold block">Customer Phone:</span>
                <span className="font-extrabold text-slate-900">{selectedBookingModal.customerPhone || "N/A"}</span>
              </div>
              <div>
                <span className="text-slate-400 font-bold block">Movie Title:</span>
                <span className="font-extrabold text-slate-900">{selectedBookingModal.show?.movie?.title || "Movie"}</span>
              </div>
              <div>
                <span className="text-slate-400 font-bold block">Theater:</span>
                <span className="font-extrabold text-slate-900">{selectedBookingModal.show?.theater?.name || "Cinema"}</span>
              </div>
              <div>
                <span className="text-slate-400 font-bold block">Show Date & Time:</span>
                <span className="font-extrabold text-slate-900">{selectedBookingModal.show?.date} @ {selectedBookingModal.show?.time}</span>
              </div>
              <div>
                <span className="text-slate-400 font-bold block">Reserved Seats:</span>
                <span className="font-black text-rose-600 text-sm">{selectedBookingModal.seatNumbers}</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 space-y-1.5 font-medium border border-slate-200/80">
              <div className="flex justify-between">
                <span>Tickets Amount:</span>
                <span className="font-bold">{formatCurrency(selectedBookingModal.ticketAmount || selectedBookingModal.totalAmount || 0)}</span>
              </div>
              {selectedBookingModal.snackAmount > 0 && (
                <div className="flex justify-between">
                  <span>Food & Snacks:</span>
                  <span className="font-bold">{formatCurrency(selectedBookingModal.snackAmount)}</span>
                </div>
              )}
              {selectedBookingModal.discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Discount Applied:</span>
                  <span>-{formatCurrency(selectedBookingModal.discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-black border-t border-slate-200 pt-1.5 text-slate-900">
                <span>Total Amount Paid:</span>
                <span className="text-emerald-700">{formatCurrency(selectedBookingModal.totalAmount || 0)}</span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              {selectedBookingModal.status === "CONFIRMED" && (
                <Button type="button" variant="secondary" onClick={() => handleCancelBooking(selectedBookingModal.id)} className="gap-1 font-bold text-amber-700 border-slate-200">
                  <Ban className="h-3.5 w-3.5" />
                  <span>Cancel Booking</span>
                </Button>
              )}
              <Button type="button" variant="danger" onClick={() => handleDeleteBookingRecord(selectedBookingModal.id)} className="gap-1 font-bold">
                <Trash2 className="h-3.5 w-3.5" />
                <span>Delete Record</span>
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* CREATE USER MODAL */}
      <Modal isOpen={isUserModalOpen} onClose={() => setIsUserModalOpen(false)} title="Create User Account">
        <form onSubmit={handleSaveUser} className="space-y-3 text-slate-900">
          <Input label="Full Name" value={userForm.name} onChange={e => setUserForm({...userForm, name: e.target.value})} required />
          <Input label="Email Address" type="email" value={userForm.email} onChange={e => setUserForm({...userForm, email: e.target.value})} required />
          <Input label="Mobile Number" value={userForm.mobile} onChange={e => setUserForm({...userForm, mobile: e.target.value})} />
          <Input label="Password" type="password" value={userForm.password} onChange={e => setUserForm({...userForm, password: e.target.value})} placeholder="DefaultPassword123" />
          <div>
            <label className="text-xs font-bold block mb-1">Assign User Role</label>
            <select value={userForm.role} onChange={e => setUserForm({...userForm, role: e.target.value})} className="w-full border border-slate-200 rounded-xl p-2 text-xs font-bold">
              <option value="ROLE_USER">Standard User (ROLE_USER)</option>
              <option value="ROLE_ADMIN">System Admin (ROLE_ADMIN)</option>
            </select>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="secondary" onClick={() => setIsUserModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="danger">Create Account</Button>
          </div>
        </form>
      </Modal>

      {/* CREATE / EDIT MOVIE MODAL */}
      <Modal isOpen={isMovieModalOpen} onClose={() => setIsMovieModalOpen(false)} title={editingMovie ? "Edit Movie" : "Add Movie"}>
        <form onSubmit={handleSaveMovie} className="space-y-3 text-slate-900">
          <Input label="Movie Title" value={movieForm.title} onChange={e => setMovieForm({...movieForm, title: e.target.value})} required />
          <Input label="Poster URL" value={movieForm.posterUrl} onChange={e => setMovieForm({...movieForm, posterUrl: e.target.value})} />
          <div className="grid grid-cols-2 gap-2">
            <Input label="Language" value={movieForm.language} onChange={e => setMovieForm({...movieForm, language: e.target.value})} />
            <Input label="Certification" value={movieForm.certification} onChange={e => setMovieForm({...movieForm, certification: e.target.value})} />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Input label="Duration (mins)" type="number" value={movieForm.durationMinutes} onChange={e => setMovieForm({...movieForm, durationMinutes: e.target.value})} />
            <Input label="Rating" type="number" step="0.1" value={movieForm.rating} onChange={e => setMovieForm({...movieForm, rating: e.target.value})} />
          </div>
          <Input label="Genres (comma separated)" value={movieForm.genres} onChange={e => setMovieForm({...movieForm, genres: e.target.value})} />
          <Input label="Formats (e.g. 2D, 3D, IMAX)" value={movieForm.format} onChange={e => setMovieForm({...movieForm, format: e.target.value})} />
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="secondary" onClick={() => setIsMovieModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="danger">Save Movie</Button>
          </div>
        </form>
      </Modal>

      {/* THEATER MODAL */}
      <Modal isOpen={isTheaterModalOpen} onClose={() => setIsTheaterModalOpen(false)} title={editingTheater ? "Edit Theater" : "Add Theater"}>
        <form onSubmit={handleSaveTheater} className="space-y-3 text-slate-900">
          <Input label="Theater Name" value={theaterForm.name} onChange={e => setTheaterForm({...theaterForm, name: e.target.value})} required />
          <Input label="City" value={theaterForm.city} onChange={e => setTheaterForm({...theaterForm, city: e.target.value})} required />
          <Input label="Area" value={theaterForm.area} onChange={e => setTheaterForm({...theaterForm, area: e.target.value})} />
          <Input label="Facilities (comma separated)" value={theaterForm.facilities} onChange={e => setTheaterForm({...theaterForm, facilities: e.target.value})} />
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="secondary" onClick={() => setIsTheaterModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="danger">Save Theater</Button>
          </div>
        </form>
      </Modal>

      {/* SHOWTIME MODAL */}
      <Modal isOpen={isShowModalOpen} onClose={() => setIsShowModalOpen(false)} title="Schedule Showtime">
        <form onSubmit={handleSaveShow} className="space-y-3 text-slate-900">
          <div>
            <label className="text-xs font-bold block mb-1">Select Movie</label>
            <select value={showForm.movieId} onChange={e => setShowForm({...showForm, movieId: e.target.value})} className="w-full border border-slate-200 rounded-xl p-2 text-xs font-bold bg-white">
              <option value="">Select Movie</option>
              {movies.map(m => <option key={m.id} value={m.id}>{m.title}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-bold block mb-1">Select Theater</label>
            <select value={showForm.theaterId} onChange={e => setShowForm({...showForm, theaterId: e.target.value})} className="w-full border border-slate-200 rounded-xl p-2 text-xs font-bold bg-white">
              <option value="">Select Theater</option>
              {theaters.map(t => <option key={t.id} value={t.id}>{t.name} ({t.city})</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Input label="Show Date" type="date" value={showForm.showDate} onChange={e => setShowForm({...showForm, showDate: e.target.value})} required />
            <Input label="Show Time" type="time" value={showForm.showTime} onChange={e => setShowForm({...showForm, showTime: e.target.value})} required />
          </div>
          <Input label="Base Seat Price (₹)" type="number" value={showForm.basePrice} onChange={e => setShowForm({...showForm, basePrice: e.target.value})} />
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="secondary" onClick={() => setIsShowModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="danger">Schedule Show</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
