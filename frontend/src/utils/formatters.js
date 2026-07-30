/**
 * Formats rating to 1 decimal place or returns placeholder
 * @param {number} rating - Rating value
 * @returns {string} Formatted rating
 */
export function formatRating(rating) {
  return rating ? rating.toFixed(1) : "—";
}

/**
 * Generates seat ID from row and column
 * @param {number} row - Row index (0-based)
 * @param {number} col - Column index (0-based)
 * @returns {string} Seat ID (e.g., A1, B2)
 */
export function getSeatId(row, col) {
  return `${String.fromCharCode(65 + row)}${col + 1}`;
}

/**
 * Parses string to number safely
 * @param {string|number} value - Value to parse
 * @returns {number|null} Parsed number or null if invalid
 */
export function parseNumber(value) {
  const num = Number(value);
  return Number.isFinite(num) ? num : null;
}

/**
 * Formats currency value
 * @param {number} amount - Amount to format
 * @param {string} currency - Currency code (default: INR)
 * @returns {string} Formatted currency string
 */
export function formatCurrency(amount, currency = "INR") {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: currency,
  }).format(amount);
}

/**
 * Formats number with commas (e.g., 100000 -> 1,00,000 or 100k)
 * @param {number} val - Number to format
 * @returns {string} Formatted string
 */
export function formatNumber(val) {
  if (!val) return "0";
  if (val >= 100000) return `${(val / 100000).toFixed(1)}L`;
  if (val >= 1000) return `${(val / 1000).toFixed(0)}k`;
  return String(val);
}

/**
 * Gets unique items from array
 * @param {any[]} arr - Array to deduplicate
 * @returns {any[]} Array with unique items
 */
export function getUnique(arr) {
  return Array.from(new Set(arr));
}
