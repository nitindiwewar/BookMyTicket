import { lazy, Suspense } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Footer from "./components/Footer.jsx";
import Navbar from "./components/Navbar.jsx";
import ErrorBoundary from "./components/ErrorBoundary.jsx";
import { Loader2 } from "lucide-react";

// Lazy load pages for optimal performance
const Home = lazy(() => import("./pages/Home.jsx"));
const Booking = lazy(() => import("./pages/Booking.jsx"));
const Contact = lazy(() => import("./pages/Contact.jsx"));
const MovieDetails = lazy(() => import("./pages/MovieDetails.jsx"));
const Movies = lazy(() => import("./pages/Movies.jsx"));
const NotFound = lazy(() => import("./pages/NotFound.jsx"));
const Payment = lazy(() => import("./pages/Payment.jsx"));
const Profile = lazy(() => import("./pages/Profile.jsx"));
const Support = lazy(() => import("./pages/Support.jsx"));
const Snacks = lazy(() => import("./pages/Snacks.jsx"));
const Seats = lazy(() => import("./pages/Seats.jsx"));
const Theaters = lazy(() => import("./pages/Theaters.jsx"));
const Confirmation = lazy(() => import("./pages/Confirmation.jsx"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard.jsx"));
import AdminRoute from "./components/auth/AdminRoute.jsx";

// OTP-based auth pages
const VerifyOTP = lazy(() => import("./pages/VerifyOTP.jsx"));
const CompleteProfile = lazy(() => import("./pages/CompleteProfile.jsx"));

function PageLoader() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center p-8">
      <div className="flex flex-col items-center gap-3 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-600">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
        <p className="text-xs font-bold text-slate-400 tracking-wider uppercase">
          Loading Page...
        </p>
      </div>
    </div>
  );
}

function App() {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith("/admin");
  const isAuthPage = [
    "/enter-mobile",
    "/verify-otp",
    "/complete-profile",
  ].includes(location.pathname) || isAdminPage;

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[var(--app-bg)] text-[var(--app-text)] transition-colors duration-300">
      {!isAuthPage && <Navbar />}
      <main className="flex-1">
        <ErrorBoundary>
          <Suspense fallback={<PageLoader />}>
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 12, scale: 0.995 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.995 }}
                transition={{ duration: 0.28, ease: "easeOut" }}
              >
                <Routes location={location} key={location.pathname}>
                  <Route path="/" element={<Home />} />
                  <Route path="/home" element={<Navigate to="/" replace />} />
                  <Route path="/movies/:id/seats/:showId" element={<Seats />} />
                  <Route path="/movies/:id/theaters" element={<Theaters />} />
                  <Route path="/movies/:id/snacks" element={<Snacks />} />
                  <Route path="/movies/:id/payment" element={<Payment />} />
                  <Route path="/movies/:id" element={<MovieDetails />} />
                  <Route path="/movies" element={<Movies />} />
                  <Route path="/seats/:showId" element={<Seats />} />
                  <Route path="/snacks" element={<Snacks />} />
                  <Route path="/payment" element={<Payment />} />
                  <Route path="/confirmation" element={<Confirmation />} />
                  <Route path="/confirmation/:bookingId" element={<Confirmation />} />

                  <Route path="/login" element={<Navigate to="/" replace />} />
                  <Route path="/enter-mobile" element={<Navigate to="/" replace />} />
                  <Route path="/verify-otp" element={<VerifyOTP />} />
                  <Route path="/complete-profile" element={<CompleteProfile />} />
                  <Route path="/signup" element={<Navigate to="/" replace />} />
                  <Route path="/forgot" element={<Navigate to="/" replace />} />
                  <Route path="/otp" element={<Navigate to="/" replace />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
                  <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
                  <Route path="/admin/*" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/support" element={<Support />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </motion.div>
            </AnimatePresence>
          </Suspense>
        </ErrorBoundary>
      </main>
      {!isAuthPage && <Footer />}
    </div>
  );
}

export default App;
