import { createContext, useContext, useMemo, useReducer } from 'react'

const AppContext = createContext(null)

const initialState = {
  // Booking flow
  booking: {
    movieId: null,
    theaterId: null,
    show: null, // { id, time, format, price }
    seats: [], // [{ id, type, price }]
    food: {}, // { foodId: qty }
    promo: null, // { code, ... }
    bookingId: null,
  },
  favorites: [],
  loggedIn: true,
}

function reducer(state, action) {
  switch (action.type) {
    case 'START_BOOKING':
      return {
        ...state,
        booking: {
          ...initialState.booking,
          movieId: action.movieId,
          theaterId: action.theaterId,
          show: action.show,
        },
      }
    case 'SET_SEATS':
      return { ...state, booking: { ...state.booking, seats: action.seats } }
    case 'SET_FOOD':
      return { ...state, booking: { ...state.booking, food: action.food } }
    case 'SET_PROMO':
      return { ...state, booking: { ...state.booking, promo: action.promo } }
    case 'CONFIRM_BOOKING':
      return { ...state, booking: { ...state.booking, bookingId: action.bookingId } }
    case 'RESET_BOOKING':
      return { ...state, booking: { ...initialState.booking } }
    case 'TOGGLE_FAVORITE': {
      const exists = state.favorites.includes(action.movieId)
      return {
        ...state,
        favorites: exists
          ? state.favorites.filter((id) => id !== action.movieId)
          : [...state.favorites, action.movieId],
      }
    }
    case 'TOGGLE_LOGIN':
      return { ...state, loggedIn: !state.loggedIn }
    default:
      return state
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState)

  const value = useMemo(() => {
    const actions = {
      startBooking: (movieId, theaterId, show) =>
        dispatch({ type: 'START_BOOKING', movieId, theaterId, show }),
      setSeats: (seats) => dispatch({ type: 'SET_SEATS', seats }),
      setFood: (food) => dispatch({ type: 'SET_FOOD', food }),
      setPromo: (promo) => dispatch({ type: 'SET_PROMO', promo }),
      confirmBooking: (bookingId) => dispatch({ type: 'CONFIRM_BOOKING', bookingId }),
      resetBooking: () => dispatch({ type: 'RESET_BOOKING' }),
      toggleFavorite: (movieId) => dispatch({ type: 'TOGGLE_FAVORITE', movieId }),
      toggleLogin: () => dispatch({ type: 'TOGGLE_LOGIN' }),
    }
    return { state, ...actions }
  }, [state])

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
