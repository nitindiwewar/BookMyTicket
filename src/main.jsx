// import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import { BookingProvider } from "./state/bookingContext.jsx";
import { LocationProvider } from "./state/locationContext.jsx";
import { ThemeProvider } from "./state/themeContext.jsx";
import { AuthProvider } from "./state/authContext.jsx";
// Global robustness: handle unhandled promises to avoid noisy UI breaks.
// Note: the error reported looks like an external messaging listener; we still guard app-level unhandled rejections.
window.addEventListener("unhandledrejection", (event) => {
  try {
    // Prevent noisy overlays/log spam for promise-channel listener issues.
    console.error("Unhandled rejection (guarded):", event?.reason);
  } catch {
    // ignore
  }
});

createRoot(document.getElementById("root")).render(
  // <StrictMode> // Temporarily disabled to avoid useEffect double execution issues
  <BrowserRouter>
    <ThemeProvider>
      <LocationProvider>
        <BookingProvider>
          <AuthProvider>
            <App />
          </AuthProvider>
        </BookingProvider>
      </LocationProvider>
    </ThemeProvider>
  </BrowserRouter>,
  // </StrictMode>
);
