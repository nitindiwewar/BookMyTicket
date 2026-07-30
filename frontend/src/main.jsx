import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import { BookingProvider } from "./state/bookingContext.jsx";
import { LocationProvider } from "./state/locationContext.jsx";
import { ThemeProvider } from "./state/themeContext.jsx";
import { AuthProvider } from "./state/authContext.jsx";
import { ToastProvider } from "./state/toastContext.jsx";

window.addEventListener("unhandledrejection", (event) => {
  try {
    console.error("Unhandled rejection (guarded):", event?.reason);
  } catch {
    // ignore
  }
});

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <ThemeProvider>
      <LocationProvider>
        <BookingProvider>
          <AuthProvider>
            <ToastProvider>
              <App />
            </ToastProvider>
          </AuthProvider>
        </BookingProvider>
      </LocationProvider>
    </ThemeProvider>
  </BrowserRouter>
);
