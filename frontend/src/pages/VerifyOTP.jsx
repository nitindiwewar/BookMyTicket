import { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Smartphone } from "lucide-react";
import AuthLayout from "../components/auth/AuthLayout.jsx";
import AuthCard from "../components/auth/AuthCard.jsx";
import OTPInput from "../components/auth/OTPInput.jsx";
import CountdownTimer from "../components/auth/CountdownTimer.jsx";
import LoadingButton from "../components/auth/LoadingButton.jsx";
import SuccessAnimation from "../components/auth/SuccessAnimation.jsx";
import { useAuth } from "../state/authContext.jsx";

export default function VerifyOTP() {
  const navigate = useNavigate();
  const location = useLocation();
  const { verifyOtp, sendOtp } = useAuth();

  const { countryCode, mobile } = location.state || {};

  useEffect(() => {
    if (!mobile) {
      navigate("/login", { replace: true });
    }
  }, [mobile, navigate]);

  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [verified, setVerified] = useState(false);
  const [seconds, setSeconds] = useState(30);
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    if (verified) return;
    const timer = setInterval(() => {
      setSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [verified]);

  const handleResend = useCallback(async () => {
    setSeconds(30);
    setOtp("");
    setError("");
    setTouched(false);
    if (mobile) {
      await sendOtp(mobile, countryCode);
    }
  }, [countryCode, mobile, sendOtp]);

  const handleVerify = async () => {
    setTouched(true);
    if (otp.length !== 6) {
      setError("Please enter all 6 digits of the OTP");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await verifyOtp(mobile, countryCode, otp);
      setVerified(true);

      const isNew = Boolean(res?.newUser || res?.isNewUser || res?.data?.newUser || res?.data?.isNewUser);
      if (isNew) {
        setTimeout(() => {
          navigate("/complete-profile", {
            state: { countryCode, mobile },
            replace: true,
          });
        }, 1000);
      } else {
        setTimeout(() => {
          navigate("/", { replace: true });
        }, 1000);
      }

    } catch {
      setError("Invalid OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };


  const handleChangeMobile = () => {
    navigate("/login", { replace: true });
  };

  if (!mobile) return null;

  return (
    <AuthLayout>
      <AuthCard className="p-6 sm:p-8">
        {verified ? (
          <SuccessAnimation message="OTP verified successfully!" />
        ) : (
          <div className="space-y-6">
            {/* Header */}
            <div className="text-center space-y-1">
              <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-600 shadow-xs">
                <Smartphone className="h-6 w-6" />
              </div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                Verify Mobile Number
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Enter the 6-digit code sent to{" "}
                <span className="font-bold text-slate-800">
                  {countryCode} {mobile}
                </span>
              </p>
            </div>

            {/* OTP Input */}
            <div className="space-y-6">
              <OTPInput
                value={otp}
                onChange={(val) => {
                  setOtp(val);
                  if (touched && val.length === 6) setError("");
                }}
                error={touched ? error : ""}
                disabled={loading}
              />

              <CountdownTimer
                seconds={seconds}
                onResend={handleResend}
                disabled={loading}
              />

              <LoadingButton
                type="button"
                loading={loading}
                onClick={handleVerify}
                variant="primary"
                className="w-full shadow-md shadow-red-600/20"
              >
                Verify & Proceed
              </LoadingButton>
            </div>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={handleChangeMobile}
                disabled={loading}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 transition"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Change mobile number
              </button>
            </div>
          </div>
        )}
      </AuthCard>
    </AuthLayout>
  );
}
