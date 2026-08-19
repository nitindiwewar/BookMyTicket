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
  seatPrices: {},
  snacks: {}, // { snackId: qty }
  coupon: "",
  paymentMethod: "",
  bookingResponse: null,
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
      setBookingResponse(bookingResponse) {
        setState((s) => ({ ...s, bookingResponse }));
      },
      setMovie(movieData) {
        const movieId = typeof movieData === "string" ? movieData : movieData?.id;
        setState((s) => ({
          ...s,
          movie: typeof movieData === "object" ? movieData : s.movie,
          movieId,
        }));
      },
      setTheater(theaterContainer) {
        const theaterId = typeof theaterContainer === "string" ? theaterContainer : theaterContainer?.id;
        setState((s) => ({
          ...s,
          theater: typeof theaterContainer === "object" ? theaterContainer : s.theater,
          theaterId,
        }));
      },
      setDate(date) {
        setState((s) => ({ ...s, date }));
      },
      setTime(time) {
        setState((s) => ({ ...s, time }));
      },
      setShow(showData) {
        if (!showData) return;
        const showId = typeof showData === "string" ? showData : showData?.id;
        setState((s) => ({
          ...s,
          show: typeof showData === "object" ? showData : s.show,
          showId,
          theaterId: showData.theaterId || s.theaterId,
          date: showData.date || s.date,
          time: showData.time || s.time,
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
      addSeat(seatId) {
        setState((s) => ({
          ...s,
          seats: s.seats.includes(seatId) ? s.seats : [...s.seats, seatId],
        }));
      },
      removeSeat(seatId) {
        setState((s) => ({
          ...s,
          seats: s.seats.filter((x) => x !== seatId),
        }));
      },
      clearSeats() {
        setState((s) => ({ ...s, seats: [] }));
      },
      setSeats(seats) {
        setState((s) => ({ ...s, seats: Array.from(new Set(seats)) }));
      },
      setSeatTier(seatTier) {
        setState((s) => ({ ...s, seatTier }));
      },
      setSeatPrices(seatPrices) {
        setState((s) => ({ ...s, seatPrices: { ...s.seatPrices, ...seatPrices } }));
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
