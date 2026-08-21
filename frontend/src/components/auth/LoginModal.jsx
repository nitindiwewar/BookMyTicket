import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { X, ArrowRight, CheckCircle2, Ticket, Sparkles, Utensils, Smartphone, User, Mail, Lock, ShieldCheck, UserCheck } from "lucide-react";
import { useAuth } from "../../state/authContext.jsx";
import MobileInput from "./MobileInput.jsx";
import LoadingButton from "./LoadingButton.jsx";

export default function LoginModal() {
  const navigate = useNavigate();
  const { isLoginModalOpen, closeLoginModal, sendOtp, verifyOtp, completeProfile, login, googleLogin } = useAuth();
  
  const [loginMode, setLoginMode] = useState("user"); // 'user' | 'admin'
  const [step, setStep] = useState("mobile"); // 'mobile' | 'otp' | 'details'
  const [countryCode, setCountryCode] = useState("+91");
  const [mobile, setMobile] = useState("");
  const [otpDigits, setOtpDigits] = useState(["", "", "", "", "", ""]);
  
  // Admin Login Credentials
  const [adminEmail, setAdminEmail] = useState("admin@movieticket.com");
  const [adminPassword, setAdminPassword] = useState("admin123");

  // Profile Details State for New Users
  const [fullName, setFullName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("Male");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const inputRefs = [
    useRef(null), useRef(null), useRef(null), useRef(null), useRef(null), useRef(null)
  ];

  const googleBtnRef = useRef(null);

  useEffect(() => {
    if (!isLoginModalOpen || step !== "mobile" || loginMode !== "user") return;

    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || "88373466926-qajl3kgbgaus8iuc8ma0gp3df67jfq0n.apps.googleusercontent.com";

    const initGoogleGsi = () => {
      if (window.google?.accounts?.id) {
        try {
          window.google.accounts.id.initialize({
            client_id: clientId,
            callback: async (response) => {
              setLoading(true);
              setError("");
              try {
                const base64Url = response.credential.split('.')[1];
                const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''));
                const payload = JSON.parse(jsonPayload);

                const user = await googleLogin({
                  email: payload.email,
                  name: payload.name || payload.given_name || payload.email.split('@')[0],
                  sub: payload.sub,
                  picture: payload.picture,
                });
                closeLoginModal();
                resetForm();
                if (user?.role === "ROLE_ADMIN" || user?.role === "ADMIN") {
                  navigate("/admin");
                }
              } catch (err) {
                setError("Google Login error: " + (err.message || "Invalid account"));
              } finally {
                setLoading(false);
              }
            }
          });

          if (googleBtnRef.current) {
            googleBtnRef.current.innerHTML = "";
            window.google.accounts.id.renderButton(googleBtnRef.current, {
              theme: "outline",
              size: "large",
              width: "100%",
              shape: "rectangular",
              text: "continue_with",
              logo_alignment: "center",
            });
          }

          window.google.accounts.id.prompt();
        } catch (e) {
          console.warn("GSI render warning:", e);
        }
      }
    };

    initGoogleGsi();
    const timer = setTimeout(initGoogleGsi, 500);
    return () => clearTimeout(timer);
  }, [isLoginModalOpen, step, loginMode, googleLogin, closeLoginModal, navigate]);

  if (!isLoginModalOpen) return null;

  const handleAdminLoginSubmit = async (e) => {
    e?.preventDefault();
    if (!adminEmail || !adminPassword) {
      setError("Please enter Admin Email and Password");
      return;
    }
    setLoading(true);
    setError("");

    try {
      const user = await login(adminEmail.trim(), adminPassword);
      closeLoginModal();
      resetForm();
      if (user?.role === "ROLE_ADMIN" || user?.role === "ADMIN") {
        navigate("/admin");
      } else {
        setError("Account does not have ROLE_ADMIN privileges");
      }
    } catch (err) {
      setError(err.message || "Invalid Admin email or password");
    } finally {
      setLoading(false);
    }
  };

  const handleSendOtp = async (e) => {
    e?.preventDefault();
    if (!mobile || mobile.length !== 10) {
      setError("Please enter a valid 10-digit mobile number");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await sendOtp(mobile, countryCode);
      setOtpDigits(["", "", "", "", "", ""]);
      setStep("otp");
    } catch (err) {
      setError(err.message || "Failed to send OTP code.");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index, value) => {
    const val = value.replace(/\D/g, "").slice(-1);
    const updated = [...otpDigits];
    updated[index] = val;
    setOtpDigits(updated);
    setError("");

    if (val && index < 5) {
      inputRefs[index + 1].current?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  };

  const handleVerifyOtp = async (e) => {
    e?.preventDefault();
    const fullOtp = otpDigits.join("");
    if (fullOtp.length < 6) {
      setError("Please enter the complete 6-digit OTP");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await verifyOtp(mobile, countryCode, fullOtp);
      if (res?.isNewUser || res?.newUser || !res?.name || res?.name?.startsWith("User_") || !res?.email || res?.email.includes("@movieticket.com")) {
        setFullName("");
        setUserEmail("");
        setStep("details");
      } else {
        closeLoginModal();
        resetForm();
      }
    } catch (err) {
      setError(err.message || "Invalid OTP code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveDetails = async (e) => {
    e?.preventDefault();
    if (!fullName.trim()) {
      setError("Please enter your full name");
      return;
    }
    if (!userEmail.trim() || !userEmail.includes("@")) {
      setError("Please enter a valid email address");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const user = await completeProfile({
        mobile: mobile.trim(),
        name: fullName.trim(),
        email: userEmail.trim(),
        dob: dob ? dob.trim() : null,
        age: 25,
        gender: gender || "Male",
      });
      closeLoginModal();
      resetForm();
      if (user?.role === "ROLE_ADMIN" || user?.role === "ADMIN") {
        navigate("/admin");
      }
    } catch (err) {
      setError(err.message || "Failed to save profile details.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError("");
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || "88373466926-qajl3kgbgaus8iuc8ma0gp3df67jfq0n.apps.googleusercontent.com";

    try {
      if (window.google?.accounts?.oauth2) {
        const tokenClient = window.google.accounts.oauth2.initTokenClient({
          client_id: clientId,
          scope: "https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email",
          callback: async (tokenResponse) => {
            if (tokenResponse.error) {
              setError("Google authentication was cancelled.");
              setLoading(false);
              return;
            }
            try {
              let userInfo;
              try {
                const res = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
                  headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
                });
                if (!res.ok) throw new Error(`Google API status ${res.status}`);
                userInfo = await res.json();
              } catch (fetchErr) {
                throw new Error("Failed to fetch Google profile: " + fetchErr.message);
              }

              const user = await googleLogin({
                email: userInfo.email,
                name: userInfo.name || userInfo.given_name || userInfo.email.split("@")[0],
                sub: userInfo.sub,
                picture: userInfo.picture,
              });
              closeLoginModal();
              resetForm();
              if (user?.role === "ROLE_ADMIN" || user?.role === "ADMIN") {
                navigate("/admin");
              }
            } catch (err) {
              setError(err.message || "Google login failed.");
            } finally {
              setLoading(false);
            }
          },
        });
        tokenClient.requestAccessToken({ prompt: "select_account" });
        return;
      }

      const googleEmail = window.prompt("Enter your Google Account Email:", "user@gmail.com");
      if (!googleEmail) {
        setLoading(false);
        return;
      }
      const googleName = googleEmail.split("@")[0].replace(/[._]/g, " ").replace(/\b\w/g, c => c.toUpperCase());

      const user = await googleLogin({
        email: googleEmail.trim(),
        name: googleName || "Google User",
        sub: "google_" + Date.now(),
        picture: "https://lh3.googleusercontent.com/a/default-user",
      });

      closeLoginModal();
      resetForm();
      if (user?.role === "ROLE_ADMIN" || user?.role === "ADMIN") {
        navigate("/admin");
      }
    } catch (err) {
      setError(err.message || "Google Authentication failed.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setLoginMode("user");
    setStep("mobile");
    setMobile("");
    setOtpDigits(["", "", "", "", "", ""]);
    setFullName("");
    setUserEmail("");
    setAdminEmail("admin@movieticket.com");
    setAdminPassword("admin123");
    setError("");
  };

  const handleClose = () => {
    closeLoginModal();
    resetForm();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] grid place-items-center overflow-y-auto bg-slate-950/75 p-4 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="relative w-full max-w-2xl overflow-hidden rounded-[28px] bg-white shadow-2xl border border-slate-100 grid md:grid-cols-12"
        >
          {/* Close Button */}
          <button
            type="button"
            onClick={handleClose}
            className="absolute right-4 top-4 z-20 grid h-8 w-8 place-items-center rounded-full bg-slate-100 text-slate-400 hover:bg-slate-200 hover:text-slate-700 transition cursor-pointer"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>

          {/* LEFT BANNER */}
          <div className="hidden md:flex md:col-span-5 relative bg-gradient-to-br from-slate-950 via-slate-900 to-rose-950 p-6 flex-col justify-between text-white overflow-hidden">
            <div className="absolute -left-16 -top-16 h-48 w-48 rounded-full bg-[#FF1744]/25 blur-3xl" />
            <div className="absolute -right-16 -bottom-16 h-48 w-48 rounded-full bg-rose-500/20 blur-3xl" />

            <div className="relative z-10 space-y-4">
              <div className="flex items-center gap-2 text-rose-400">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#FF1744] text-white shadow-md">
                  <Ticket className="h-4 w-4 stroke-[2.4]" />
                </div>
                <span className="text-base font-black tracking-tight font-heading">
                  BookMy<span className="text-rose-400">Seat</span>
                </span>
              </div>

              <div className="space-y-1.5 pt-4">
                <div className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-rose-300 bg-white/10 px-2.5 py-0.5 rounded-full border border-white/10">
                  <Sparkles className="h-3 w-3" />
                  {loginMode === "admin" ? "Admin Control Portal" : "VIP Cinema Access"}
                </div>
                <h3 className="text-xl font-black text-white leading-tight">
                  {loginMode === "admin" ? "Master System Control Panel" : "Unlock Movie Magic & Exclusive Offers"}
                </h3>
                <p className="text-xs text-slate-300 font-medium leading-relaxed">
                  {loginMode === "admin" ? "Manage theater screens, showtimes, user accounts, and financial reports." : "Join millions of movie lovers for seamless seat bookings across your favorite multiplexes."}
                </p>
              </div>
            </div>

            <div className="relative z-10 space-y-3 pt-6 border-t border-white/10">
              <div className="flex items-center gap-2.5 text-xs font-bold text-slate-200">
                <div className="grid h-5 w-5 place-items-center rounded-full bg-rose-500/20 text-rose-400 shrink-0">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                </div>
                <span>{loginMode === "admin" ? "Role-Based Security" : "10-Second Instant Seat Booking"}</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs font-bold text-slate-200">
                <div className="grid h-5 w-5 place-items-center rounded-full bg-rose-500/20 text-rose-400 shrink-0">
                  <ShieldCheck className="h-3.5 w-3.5" />
                </div>
                <span>{loginMode === "admin" ? "Live Analytics & Revenue Reports" : "Instant PDF E-Tickets"}</span>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: LOGIN FORM WITH USER / ADMIN TOGGLE */}
          <div className="md:col-span-7 p-6 sm:p-8 flex flex-col justify-between">
            <div className="space-y-4">
              {/* MODE TOGGLE SWITCH (USER LOGIN vs ADMIN LOGIN) */}
              <div className="flex items-center p-1 rounded-2xl bg-slate-100 border border-slate-200 text-xs font-extrabold">
                <button
                  type="button"
                  onClick={() => { setLoginMode("user"); setError(""); }}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl transition cursor-pointer ${
                    loginMode === "user" ? "bg-white text-[#FF1744] shadow-xs" : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  <User className="h-3.5 w-3.5" />
                  <span>User Login</span>
                </button>
                <button
                  type="button"
                  onClick={() => { setLoginMode("admin"); setError(""); }}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl transition cursor-pointer ${
                    loginMode === "admin" ? "bg-red-600 text-white shadow-xs" : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  <ShieldCheck className="h-3.5 w-3.5" />
                  <span>Admin Portal</span>
                </button>
              </div>

              {/* Header Title */}
              <div className="space-y-1 pr-6">
                <h2 className="text-xl font-black text-slate-900 tracking-tight">
                  {loginMode === "admin"
                    ? "Admin Authentication"
                    : step === "mobile"
                    ? "Get Started"
                    : step === "otp"
                    ? "Verify Phone Number"
                    : "Complete Your Profile"}
                </h2>
                <p className="text-xs font-medium text-slate-500">
                  {loginMode === "admin"
                    ? "Sign in with admin credentials to access the master control panel"
                    : step === "mobile"
                    ? "Login to unlock movie ticket bookings"
                    : step === "otp"
                    ? `Enter code sent to ${countryCode} ${mobile}`
                    : "Please enter your details to set up your account"}
                </p>
              </div>

              {/* ADMIN LOGIN FORM */}
              {loginMode === "admin" ? (
                <form onSubmit={handleAdminLoginSubmit} className="space-y-4 pt-2">
                  <div>
                    <label className="block text-[11px] font-extrabold text-slate-700 uppercase tracking-wider mb-1">
                      Admin Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                      <input
                        type="email"
                        required
                        value={adminEmail}
                        onChange={(e) => { setAdminEmail(e.target.value); setError(""); }}
                        placeholder="admin@movieticket.com"
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-xs font-bold text-slate-900 focus:bg-white focus:border-red-600 focus:ring-2 focus:ring-red-500/20 outline-none transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-extrabold text-slate-700 uppercase tracking-wider mb-1">
                      Admin Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                      <input
                        type="password"
                        required
                        value={adminPassword}
                        onChange={(e) => { setAdminPassword(e.target.value); setError(""); }}
                        placeholder="••••••••"
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-xs font-bold text-slate-900 focus:bg-white focus:border-red-600 focus:ring-2 focus:ring-red-500/20 outline-none transition"
                      />
                    </div>
                  </div>

                  {error && <p className="text-xs font-bold text-red-600 bg-red-50 p-2.5 rounded-xl border border-red-100">{error}</p>}

                  <LoadingButton
                    type="submit"
                    loading={loading}
                    variant="primary"
                    className="w-full py-3 bg-red-600 hover:bg-red-700 shadow-md shadow-red-600/30 text-xs font-extrabold rounded-2xl cursor-pointer"
                  >
                    <ShieldCheck className="h-4 w-4" />
                    <span>Login to Admin Dashboard</span>
                  </LoadingButton>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-center">
                    <p className="text-[11px] font-bold text-slate-600">
                      Default Admin Credentials: <span className="text-red-600 font-extrabold font-mono">admin@movieticket.com</span> / <span className="text-slate-900 font-extrabold font-mono">admin123</span>
                    </p>
                  </div>
                </form>
              ) : step === "mobile" ? (
                /* USER LOGIN (MOBILE / GOOGLE) */
                <div className="space-y-4">
                  <button
                    type="button"
                    onClick={handleGoogleLogin}
                    className="w-full flex items-center justify-center gap-3 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200/90 py-3 text-xs font-extrabold text-slate-700 shadow-2xs hover:shadow-xs transition cursor-pointer"
                  >
                    <svg className="h-4.5 w-4.5 shrink-0" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                    </svg>
                    <span>Continue with Google</span>
                  </button>

                  <div className="relative text-center">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-slate-200/80" />
                    </div>
                    <span className="relative bg-white px-3 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
                      OR MOBILE NUMBER
                    </span>
                  </div>

                  <form onSubmit={handleSendOtp} className="space-y-4">
                    <MobileInput
                      countryCode={countryCode}
                      onCountryCodeChange={setCountryCode}
                      mobile={mobile}
                      onMobileChange={(val) => { setMobile(val); setError(""); }}
                      error={error}
                      disabled={loading}
                    />

                    <LoadingButton
                      type="submit"
                      loading={loading}
                      variant="primary"
                      className="w-full py-3 shadow-md shadow-red-500/20 text-xs font-extrabold rounded-2xl cursor-pointer"
                    >
                      <span>Continue with OTP</span>
                      <ArrowRight className="h-4 w-4" />
                    </LoadingButton>
                  </form>
                </div>
              ) : step === "otp" ? (
                <form onSubmit={handleVerifyOtp} className="space-y-5">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center gap-1.5">
                      {otpDigits.map((digit, idx) => (
                        <input
                          key={idx}
                          ref={inputRefs[idx]}
                          type="text"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleOtpChange(idx, e.target.value)}
                          onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                          className="h-11 w-11 text-center text-lg font-black text-slate-900 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#FF1744] focus:ring-2 focus:ring-red-500/20 outline-none transition shadow-2xs"
                        />
                      ))}
                    </div>
                    {error && <p className="text-xs font-bold text-red-500 text-center">{error}</p>}
                  </div>

                  <div className="flex items-center justify-between text-xs font-bold">
                    <button type="button" onClick={() => setStep("mobile")} className="text-[#FF1744] hover:underline cursor-pointer">
                      Edit Phone Number
                    </button>
                    <button type="button" onClick={handleSendOtp} className="text-slate-500 hover:text-slate-800 cursor-pointer">
                      Resend OTP
                    </button>
                  </div>

                  <LoadingButton type="submit" loading={loading} variant="primary" className="w-full py-3 shadow-md shadow-red-500/20 text-xs font-extrabold rounded-2xl cursor-pointer">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Verify & Continue</span>
                  </LoadingButton>
                </form>
              ) : (
                <form onSubmit={handleSaveDetails} className="space-y-3.5">
                  <div className="space-y-3">
                    <div>
                      <label className="block text-[11px] font-extrabold text-slate-700 uppercase tracking-wider mb-1">Full Name *</label>
                      <div className="relative">
                        <User className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                        <input type="text" required value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="e.g. Aarav Sharma" className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-xs font-bold text-slate-900 focus:bg-white focus:border-[#FF1744] outline-none transition" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[11px] font-extrabold text-slate-700 uppercase tracking-wider mb-1">Email Address *</label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                        <input type="email" required value={userEmail} onChange={(e) => setUserEmail(e.target.value)} placeholder="aarav@example.com" className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-xs font-bold text-slate-900 focus:bg-white focus:border-[#FF1744] outline-none transition" />
                      </div>
                    </div>
                    {error && <p className="text-xs font-bold text-red-500 text-center">{error}</p>}
                  </div>
                  <LoadingButton type="submit" loading={loading} variant="primary" className="w-full py-3 shadow-md shadow-red-500/20 text-xs font-extrabold rounded-2xl cursor-pointer">
                    <UserCheck className="h-4 w-4" />
                    <span>Save Profile & Complete</span>
                  </LoadingButton>
                </form>
              )}
            </div>

            <div className="pt-4 text-center border-t border-slate-100">
              <p className="text-[10px] text-slate-400 font-medium leading-normal">
                By continuing, you agree to BookMySeat's{" "}
                <span className="text-slate-600 font-bold hover:underline cursor-pointer">Terms of Service</span> &{" "}
                <span className="text-slate-600 font-bold hover:underline cursor-pointer">Privacy Policy</span>.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
