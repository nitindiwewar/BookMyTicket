import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ShieldCheck, RefreshCw } from "lucide-react";
import Card from "../components/ui/Card.jsx";
import Button from "../components/ui/Button.jsx";
import Input from "../components/ui/Input.jsx";

function onlyDigits(s) {
  return String(s || "").replace(/\D/g, "");
}

export default function OtpVerification() {
  const [params] = useSearchParams();
  const email = params.get("email") || "";
  const navigate = useNavigate();

  const [otp, setOtp] = useState("");
  const [touched, setTouched] = useState(false);
  const [seconds, setSeconds] = useState(30);

  useEffect(() => {
    const t = setInterval(() => setSeconds((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, []);

  const error = useMemo(() => {
    if (!touched) return "";
    if (onlyDigits(otp).length !== 6) return "Enter the 6-digit OTP.";
    return "";
  }, [otp, touched]);

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
              <ShieldCheck className="h-5 w-5 text-white/70" />
            </div>
            <div>
              <div className="text-sm font-semibold text-white">
                OTP verification
              </div>
              <div className="mt-0.5 text-sm text-white/60">
                Enter the 6-digit code sent to{" "}
                <span className="font-medium text-white">
                  {email || "your email"}
                </span>
              </div>
            </div>
          </div>

          <form
            className="mt-6 grid gap-4"
            onSubmit={(e) => {
              e.preventDefault();
              setTouched(true);
              if (error) return;
              navigate("/login");
            }}
          >
            <Input
              label="OTP"
              value={otp}
              onChange={(e) => setOtp(onlyDigits(e.target.value).slice(0, 6))}
              placeholder="123456"
              inputMode="numeric"
              error={error}
              hint="Mock flow: any 6 digits"
            />

            <Button type="submit" className="w-full">
              <span className="inline-flex items-center gap-2">
                <ShieldCheck className="h-4 w-4" />
                Verify
              </span>
            </Button>
          </form>

          <div className="mt-4 flex items-center justify-between text-sm text-white/60">
            <Link to="/forgot" className="text-white hover:underline">
              Change email
            </Link>
            <button
              type="button"
              className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-white/80 transition hover:bg-white/10 disabled:opacity-50"
              disabled={seconds > 0}
              onClick={() => setSeconds(30)}
            >
              <RefreshCw
                className={`h-3.5 w-3.5 ${seconds > 0 ? "animate-spin" : ""}`}
              />
              Resend {seconds > 0 ? `in ${seconds}s` : ""}
            </button>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
