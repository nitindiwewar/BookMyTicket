import { Navigate } from "react-router-dom";
import { useAuth } from "../../state/authContext.jsx";
import { useToast } from "../../state/toastContext.jsx";
import { useEffect } from "react";

export default function AdminRoute({ children }) {
  const { isLoggedIn, userData } = useAuth();
  const { showToast } = useToast();

  const isAdmin = isLoggedIn && userData && (userData.role === "ROLE_ADMIN" || userData.role === "ADMIN");

  useEffect(() => {
    if (isLoggedIn && !isAdmin) {
      showToast("Access Denied. Admin privileges required.", "error");
    }
  }, [isLoggedIn, isAdmin, showToast]);

  if (!isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
}
