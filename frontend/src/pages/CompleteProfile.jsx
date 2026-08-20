import { useState, useCallback, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { User, Mail, Calendar, UserCheck, Sparkles } from "lucide-react";
import AuthLayout from "../components/auth/AuthLayout.jsx";
import AuthCard from "../components/auth/AuthCard.jsx";
import LoadingButton from "../components/auth/LoadingButton.jsx";
import SuccessAnimation from "../components/auth/SuccessAnimation.jsx";
import { useAuth } from "../state/authContext.jsx";
import Input from "../components/ui/Input.jsx";
import { calculateAgeFromDob } from "../utils/formatters.js";

export default function CompleteProfile() {
  const navigate = useNavigate();
  const location = useLocation();
  const { completeProfile } = useAuth();

  const { countryCode, mobile } = location.state || {};

  useEffect(() => {
    if (!mobile) {
      navigate("/login", { replace: true });
    }
  }, [mobile, navigate]);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [dob, setDob] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("Male");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [touched, setTouched] = useState(false);

  // Auto-calculate age when DOB changes
  const handleDobChange = (dateVal) => {
    setDob(dateVal);
    if (dateVal) {
      const calculatedAge = calculateAgeFromDob(dateVal);
      if (calculatedAge !== "" && calculatedAge >= 0 && calculatedAge < 120) {
        setAge(String(calculatedAge));
      }
    }
  };

  const validate = useCallback(() => {
    const newErrors = {};

    if (!fullName.trim()) {
      newErrors.fullName = "Full name is required";
    } else if (fullName.trim().length < 2) {
      newErrors.fullName = "Name must be at least 2 characters";
    }

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!age || isNaN(age) || Number(age) < 1 || Number(age) > 120) {
      newErrors.age = "Please enter a valid age (1-120)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [fullName, email, age]);

  const handleSubmit = async () => {
    setTouched(true);
    if (!validate()) return;

    setLoading(true);

    try {
      await completeProfile({
        mobile,
        countryCode,
        name: fullName.trim(),
        email: email.trim(),
        dob: dob || null,
        age: age ? Number(age) : null,
        gender: gender || "Prefer not to say",
      });
      setCompleted(true);

      setTimeout(() => {
        navigate("/", { replace: true });
      }, 1500);
    } catch {
      setErrors({
        general: "Profile update failed. Please try again.",
      });
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
        {completed ? (
          <SuccessAnimation message="Account created successfully!" />
        ) : (
          <div className="space-y-6">
            {/* Header */}
            <div className="text-center space-y-1">
              <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-600 shadow-xs">
                <Sparkles className="h-6 w-6" />
              </div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                Complete Profile
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Enter your details to finalize your BookMySeat account.
              </p>
            </div>

            {/* Form */}
            <div className="space-y-4">
              {/* Mobile (read-only) */}
              <div className="rounded-2xl bg-slate-100 px-4 py-3 text-xs">
                <span className="text-slate-400 font-semibold block">Mobile Number</span>
                <span className="font-bold text-slate-900">
                  {countryCode} {mobile}
                </span>
              </div>

              {/* Full Name */}
              <Input
                label="Full Name"
                icon={User}
                value={fullName}
                onChange={(e) => {
                  setFullName(e.target.value);
                  if (touched && errors.fullName) {
                    setErrors((prev) => ({ ...prev, fullName: "" }));
                  }
                }}
                disabled={loading}
                placeholder="Aarav Sharma"
                error={touched ? errors.fullName : ""}
              />

              {/* Email */}
              <Input
                label="Email Address"
                icon={Mail}
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (touched && errors.email) {
                    setErrors((prev) => ({ ...prev, email: "" }));
                  }
                }}
                disabled={loading}
                placeholder="aarav@example.com"
                error={touched ? errors.email : ""}
              />

              {/* DOB & Age Row */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Date of Birth
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      value={dob}
                      onChange={(e) => handleDobChange(e.target.value)}
                      disabled={loading}
                      className="w-full rounded-2xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-medium text-slate-900 focus:border-red-600 focus:outline-none focus:ring-1 focus:ring-red-600 disabled:bg-slate-50"
                    />
                  </div>
                </div>

                <div>
                  <Input
                    label="Age"
                    icon={Calendar}
                    type="number"
                    value={age}
                    onChange={(e) => {
                      setAge(e.target.value);
                      if (touched && errors.age) {
                        setErrors((prev) => ({ ...prev, age: "" }));
                      }
                    }}
                    disabled={loading}
                    placeholder="25"
                    error={touched ? errors.age : ""}
                  />
                </div>
              </div>

              {/* Gender Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <UserCheck className="h-3.5 w-3.5 text-slate-500" />
                  <span>Gender</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {["Male", "Female", "Other"].map((g) => {
                    const active = gender === g;
                    return (
                      <button
                        key={g}
                        type="button"
                        onClick={() => setGender(g)}
                        className={`rounded-xl border py-2 text-xs font-bold transition ${
                          active
                            ? "border-red-600 bg-red-50 text-red-600 font-extrabold shadow-2xs"
                            : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                        }`}
                      >
                        {g}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* General error */}
              {touched && errors.general && (
                <p className="text-xs font-semibold text-red-500 text-center">
                  {errors.general}
                </p>
              )}

              {/* Continue Button */}
              <LoadingButton
                type="button"
                loading={loading}
                onClick={handleSubmit}
                variant="primary"
                className="w-full shadow-md shadow-red-600/20"
              >
                Complete Registration
              </LoadingButton>
            </div>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={handleChangeMobile}
                disabled={loading}
                className="text-xs font-bold text-slate-500 hover:text-slate-800 transition"
              >
                Use a different mobile number
              </button>
            </div>
          </div>
        )}
      </AuthCard>
    </AuthLayout>
  );
}
