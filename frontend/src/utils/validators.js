/**
 * Validates email format
 * @param {string} email - Email to validate
 * @returns {boolean} Whether email is valid
 */
export function isEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || "").trim());
}

/**
 * Validates password strength
 * @param {string} password - Password to validate
 * @param {number} minLength - Minimum password length (default: 6)
 * @returns {boolean} Whether password meets requirements
 */
export function isValidPassword(password, minLength = 6) {
  return Boolean(password && password.length >= minLength);
}

/**
 * Validates seat ID format (e.g., A1, B2, etc.)
 * @param {string} seatId - Seat ID to validate
 * @returns {boolean} Whether seat ID is valid
 */
export function isValidSeatId(seatId) {
  return /^[A-Z]\d+$/.test(
    String(seatId || "")
      .trim()
      .toUpperCase(),
  );
}

/**
 * Validates coupon code format
 * @param {string} coupon - Coupon code to validate
 * @returns {boolean} Whether coupon format is valid
 */
export function isValidCoupon(coupon) {
  return /^[A-Z0-9]{3,20}$/.test(
    String(coupon || "")
      .trim()
      .toUpperCase(),
  );
}
