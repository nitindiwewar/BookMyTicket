import { createContext, useContext, useState, useCallback, useRef } from "react";
import Toast from "../components/feedback/Toast.jsx";
import AlertModal from "../components/feedback/AlertModal.jsx";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const [alertState, setAlertState] = useState({ isOpen: false });
  const resolverRef = useRef(null);

  const addToast = useCallback((message, type = "info", duration = 3500, title = "") => {
    const id = Date.now() + Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type, duration, title }]);

    if (duration > 0) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration);
    }
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Custom Alert Modal (Single OK button)
  const showAlert = useCallback(({ title = "Alert", message = "", type = "info", confirmText = "OK, Got It" } = {}) => {
    return new Promise((resolve) => {
      resolverRef.current = resolve;
      setAlertState({
        isOpen: true,
        title,
        message,
        type,
        confirmText,
        isConfirm: false,
        isRating: false,
        onConfirm: () => {
          resolve(true);
          setAlertState({ isOpen: false });
        },
        onCancel: () => {
          resolve(false);
          setAlertState({ isOpen: false });
        },
      });
    });
  }, []);

  // Custom Confirm Modal (Yes / Cancel buttons)
  const showConfirm = useCallback(({
    title = "Confirm Action",
    message = "Are you sure you want to proceed?",
    type = "warning",
    confirmText = "Yes, Proceed",
    cancelText = "Cancel",
  } = {}) => {
    return new Promise((resolve) => {
      resolverRef.current = resolve;
      setAlertState({
        isOpen: true,
        title,
        message,
        type,
        confirmText,
        cancelText,
        isConfirm: true,
        isRating: false,
        onConfirm: () => {
          resolve(true);
          setAlertState({ isOpen: false });
        },
        onCancel: () => {
          resolve(false);
          setAlertState({ isOpen: false });
        },
      });
    });
  }, []);

  // Custom Star Rating Modal
  const showRatingModal = useCallback(({
    title = "Rate this Movie",
    message = "Share your rating with the BookMySeat community!",
  } = {}) => {
    return new Promise((resolve) => {
      resolverRef.current = resolve;
      setAlertState({
        isOpen: true,
        title,
        message,
        type: "rating",
        confirmText: "Submit Rating",
        cancelText: "Close",
        isConfirm: true,
        isRating: true,
        onConfirm: (rating) => {
          resolve(rating);
          setAlertState({ isOpen: false });
        },
        onCancel: () => {
          resolve(null);
          setAlertState({ isOpen: false });
        },
      });
    });
  }, []);

  const closeAlert = useCallback(() => {
    if (resolverRef.current) {
      resolverRef.current(false);
      resolverRef.current = null;
    }
    setAlertState({ isOpen: false });
  }, []);

  return (
    <ToastContext.Provider
      value={{
        showToast: addToast,
        removeToast,
        showAlert,
        showConfirm,
        showRatingModal,
      }}
    >
      {children}
      <Toast toasts={toasts} onDismiss={removeToast} />
      <AlertModal alertState={alertState} onClose={closeAlert} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    return {
      showToast: () => {},
      removeToast: () => {},
      showAlert: async () => true,
      showConfirm: async () => true,
      showRatingModal: async () => 10,
    };
  }
  return ctx;
}
