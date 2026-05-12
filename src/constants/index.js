/**
 * Seat tier definitions with prices
 */
export const SEAT_TIERS = [
  { id: "VIP", price: 520 },
  { id: "Premium", price: 360 },
  { id: "Regular", price: 220 },
];

/**
 * Seat tier default
 */
export const DEFAULT_SEAT_TIER = "Premium";

/**
 * Seat booking fees percentage
 */
export const BOOKING_FEE_PERCENTAGE = 0.06; // 6%

/**
 * Payment methods available
 */
export const PAYMENT_METHODS = [
  { id: "upi", label: "UPI" },
  { id: "card", label: "Credit / Debit Card" },
  { id: "wallet", label: "Wallet" },
  { id: "netbanking", label: "Net Banking" },
];

/**
 * Coupon codes and their discount rules
 */
export const COUPONS = {
  NOIR10: { maxDiscount: 200, percentage: 0.1 },
  BMSLIKE: { maxDiscount: 150, percentage: 0.08 },
};

/**
 * Movie formats available
 */
export const MOVIE_FORMATS = ["2D", "IMAX", "4DX"];

/**
 * Form validation rules
 */
export const VALIDATION = {
  PASSWORD_MIN_LENGTH: 6,
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  COUPON_REGEX: /^[A-Z0-9]{3,20}$/,
  SEAT_ID_REGEX: /^[A-Z]\d+$/,
};

/**
 * LocalStorage keys
 */
export const STORAGE_KEYS = {
  BOOKING: "mt.booking.v1",
  LOCATION: "mt.location.v1",
  THEME: "mt.theme.v1",
};

/**
 * Cities for location selection
 */
export const CITY_OPTIONS = [
  "Mumbai",
  "Delhi NCR",
  "Bengaluru",
  "Hyderabad",
  "Chennai",
  "Kolkata",
  "Pune",
  "Ahmedabad",
];

export const CITY_COORDINATES = {
  Mumbai: [19.076, 72.8777],
  "Delhi NCR": [28.6139, 77.209],
  Bengaluru: [12.9716, 77.5946],
  Hyderabad: [17.385, 78.4867],
  Chennai: [13.0827, 80.2707],
  Kolkata: [22.5726, 88.3639],
  Pune: [18.5204, 73.8567],
  Ahmedabad: [23.0225, 72.5714],
};

/**
 * Seat grid dimensions
 */
export const SEAT_GRID = {
  ROWS: 10,
  COLS: 14,
};

/**
 * Maximum seats that can be selected at once
 */
export const MAX_SEATS_PER_BOOKING = 6;

/**
 * Booking flow steps
 */
export const BOOKING_STEPS = [
  { id: "movies", label: "Select Movie" },
  { id: "theaters", label: "Select Theater" },
  { id: "seats", label: "Select Seats" },
  { id: "snacks", label: "Add Snacks" },
  { id: "payment", label: "Payment" },
];

/**
 * Theme options
 */
export const THEMES = {
  DARK: "dark",
  LIGHT: "light",
};
