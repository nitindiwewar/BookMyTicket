import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Footer from "./components/Footer.jsx";
import Navbar from "./components/Navbar.jsx";
import ErrorBoundary from "./components/ErrorBoundary.jsx";

// Lazy load pages for better performance
const Home = lazy(() => import("./pages/Home.jsx"));
const Booking = lazy(() => import("./pages/Booking.jsx"));
const Contact = lazy(() => import("./pages/Contact.jsx"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword.jsx"));
const Login = lazy(() => import("./pages/Login.jsx"));
const MovieDetails = lazy(() => import("./pages/MovieDetails.jsx"));
const Movies = lazy(() => import("./pages/Movies.jsx"));
const NotFound = lazy(() => import("./pages/NotFound.jsx"));
const OtpVerification = lazy(() => import("./pages/OtpVerification.jsx"));
const Payment = lazy(() => import("./pages/Payment.jsx"));
const Profile = lazy(() => import("./pages/Profile.jsx"));
const Support = lazy(() => import("./pages/Support.jsx"));
const SignUp = lazy(() => import("./pages/SignUp.jsx"));
const Snacks = lazy(() => import("./pages/Snacks.jsx"));
const Seats = lazy(() => import("./pages/Seats.jsx"));
const Theaters = lazy(() => import("./pages/Theaters.jsx"));
const Confirmation = lazy(() => import("./pages/Confirmation.jsx"));

// Loading fallback component
function PageLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-white/20 border-t-white"></div>
        <p className="text-sm text-white/60">Loading...</p>
      </div>
    </div>
  );
}

function App() {
  return (
    <div className="min-h-dvh">
      <Navbar />
      <main>
        <ErrorBoundary>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/home" element={<Navigate to="/" replace />} />
              <Route path="/movies" element={<Movies />} />
              <Route path="/movies/:id" element={<MovieDetails />} />
              <Route path="/movies/:id/theaters" element={<Theaters />} />
              <Route path="/booking" element={<Booking />} />
              <Route path="/support" element={<Support />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/seats/:showId" element={<Seats />} />
              <Route path="/snacks" element={<Snacks />} />
              <Route path="/payment" element={<Payment />} />
              <Route path="/confirmation" element={<Confirmation />} />
              <Route path="/login" element={<Login />} />
              <Route path="/forgot" element={<ForgotPassword />} />
              <Route path="/otp" element={<OtpVerification />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </main>
      <Footer />
    </div>
  );
}

export default App;
