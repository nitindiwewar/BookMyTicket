import gsap from "gsap";

let initialized = false;

export function initHomeTrendingAnimations() {
  // Idempotency (prevents duplicate animations in dev strict mode)
  if (initialized) return;
  initialized = true;

  const items = Array.from(document.querySelectorAll(".js-trending-item"));

  if (!items.length) return;

  // Optimized animation settings for better performance and UX
  gsap.defaults({ overwrite: "auto" });

  // Prefer reduced motion when user requests it
  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (prefersReducedMotion) return;

  gsap.set(items, { willChange: "transform, opacity" });

  gsap.from(items, {
    y: 10,
    opacity: 0,
    scale: 0.99,
    duration: 0.32,
    ease: "power2.out",
    stagger: 0.03,
    force3D: true,
  });
}
