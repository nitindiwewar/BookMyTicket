import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, ArrowLeft } from "lucide-react";
import Button from "../components/ui/Button.jsx";
import Card from "../components/ui/Card.jsx";

export default function NotFound() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Card className="p-12 text-center">
          <div className="mx-auto grid h-20 w-20 place-items-center rounded-3xl border border-white/10 bg-white/5">
            <span className="text-4xl font-black text-white/20">404</span>
          </div>
          <h1 className="mt-6 text-2xl font-semibold text-white">
            Page not found
          </h1>
          <p className="mt-2 text-sm text-white/60">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button as={Link} to="/">
              <span className="inline-flex items-center gap-2">
                <Home className="h-4 w-4" />
                Go Home
              </span>
            </Button>
            <Button variant="subtle" onClick={() => window.history.back()}>
              <span className="inline-flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Go Back
              </span>
            </Button>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
