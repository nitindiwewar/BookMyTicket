/**
 * Combines class names, filtering out falsy values
 * @param {...any[]} parts - Class name parts to combine
 * @returns {string} Combined class names
 */
export function classNames(...parts) {
  return parts.filter(Boolean).join(" ");
}
