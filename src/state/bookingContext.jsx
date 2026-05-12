/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { STORAGE_KEYS } from "../constants/index.js";

const BookingContext = createContext(null);

function safeParse(json) {
  try {
    return JSON.parse(json);
  } catch {
    return null;
  }
}

const initialState = {
  movieId: null,
  theaterId: null,
  showId: null,
  date: null,
  time: null,
  seats: [],
  seatTier: null,
  snacks: {}, // { snackId: qty }
  coupon: "",
  paymentMethod: "",
};

export function BookingProvider({ children }) {
  const [state, setState] = useState(() => {
    const saved = safeParse(localStorage.getItem(STORAGE_KEYS.BOOKING) || "");
    return saved ? { ...initialState, ...saved } : initialState;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.BOOKING, JSON.stringify(state));
  }, [state]);

  const api = useMemo(() => {
    return {
      state,
      setMovie(movieId) {
        setState((s) => ({
          ...s,
          movieId,
          theaterId: null,
          showId: null,
          date: null,
          time: null,
          seats: [],
          seatTier: null,
          snacks: {},
          coupon: "",
          paymentMethod: "",
        }));
      },
      setShow({ theaterId, showId, date, time }) {
        setState((s) => ({
          ...s,
          theaterId,
          showId,
          date,
          time,
          seats: [],
          seatTier: null,
          snacks: {},
          coupon: "",
          paymentMethod: "",
        }));
      },
      toggleSeat(seatId) {
        setState((s) => {
          const has = s.seats.includes(seatId);
          const seats = has
            ? s.seats.filter((x) => x !== seatId)
            : [...s.seats, seatId];
          return { ...s, seats };
        });
      },
      setSeats(seats) {
        setState((s) => ({ ...s, seats: Array.from(new Set(seats)) }));
      },
      setSeatTier(seatTier) {
        setState((s) => ({ ...s, seatTier }));
      },
      setSnackQty(snackId, qty) {
        setState((s) => {
          const snacks = { ...s.snacks };
          if (!qty) delete snacks[snackId];
          else snacks[snackId] = qty;
          return { ...s, snacks };
        });
      },
      setCoupon(coupon) {
        setState((s) => ({ ...s, coupon }));
      },
      setPaymentMethod(paymentMethod) {
        setState((s) => ({ ...s, paymentMethod }));
      },
      reset() {
        setState(initialState);
      },
    };
  }, [state]);

  return (
    <BookingContext.Provider value={api}>{children}</BookingContext.Provider>
  );
}

export function useBooking() {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error("useBooking must be used within BookingProvider");
  return ctx;
}
