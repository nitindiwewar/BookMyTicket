import { motion } from "framer-motion";

/**
 * SuccessAnimation - Animated checkmark on successful verification
 * @param {Object} props
 * @param {string} props.message - Success message to display
 * @param {Function} props.onComplete - Callback after animation completes
 */
export default function SuccessAnimation({
  message = "Verification successful!",
  onComplete,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      onAnimationComplete={onComplete}
      className="flex flex-col items-center justify-center py-8"
    >
      {/* Circular checkmark */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{
          delay: 0.15,
          type: "spring",
          stiffness: 200,
          damping: 15,
        }}
        className="relative mb-5"
      >
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-green-500/20 to-emerald-500/10 ring-1 ring-green-500/20">
          <motion.svg
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: 0.4, duration: 0.5, ease: "easeOut" }}
            className="h-10 w-10 text-green-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20 6L9 17l-5-5" />
          </motion.svg>
        </div>
        {/* Glow effect */}
        <div className="absolute inset-0 rounded-full bg-green-500/10 blur-xl" />
      </motion.div>

      {/* Success text */}
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.4 }}
        className="text-sm font-semibold text-green-400"
      >
        {message}
      </motion.p>
    </motion.div>
  );
}
