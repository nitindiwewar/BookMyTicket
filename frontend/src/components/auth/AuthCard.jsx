import { motion } from "framer-motion";

export default function AuthCard({ children, className = "", delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      className={`rounded-3xl bg-white p-6 sm:p-8 shadow-xl border border-slate-100 ${className}`}
    >
      {children}
    </motion.div>
  );
}
