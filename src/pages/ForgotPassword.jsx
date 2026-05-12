import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { KeyRound, ArrowLeft } from "lucide-react";
import Card from "../components/ui/Card.jsx";
import Button from "../components/ui/Button.jsx";
import Input from "../components/ui/Input.jsx";

function isEmail(v) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v || "").trim());
}

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [touched, setTouched] = useState(false);
  const navigate = useNavigate();

  const error = useMemo(() => {
    if (!touched) return "";
    if (!email.trim()) return "Email is required.";
    if (!isEmail(email)) return "Enter a valid email.";
    return "";
  }, [email, touched]);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mx-auto max-w-md"
      >
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-2xl border border-white/10 bg-white/5">
              <KeyRound className="h-5 w-5 text-white/70" />
            </div>
            <div>
              <div className="text-sm font-semibold text-white">
                Forgot password
              </div>
              <div className="mt-0.5 text-sm text-white/60">
                We'll send an OTP to verify your identity.
              </div>
            </div>
          </div>

          <form
            className="mt-6 grid gap-4"
            onSubmit={(e) => {
              e.preventDefault();
              setTouched(true);
              if (error) return;
              navigate(`/otp?email=${encodeURIComponent(email.trim())}`);
            }}
          >
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              error={error}
              autoComplete="email"
            />

            <Button type="submit" className="w-full">
              <span className="inline-flex items-center gap-2">
                <KeyRound className="h-4 w-4" />
                Send OTP
              </span>
            </Button>
          </form>

          <div className="mt-4 text-sm text-white/60">
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 text-white hover:underline"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to login
            </Link>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
