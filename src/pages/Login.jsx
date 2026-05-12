import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../state/authContext.jsx";
import Button from "../components/ui/Button.jsx";
import Card from "../components/ui/Card.jsx";
import Input from "../components/ui/Input.jsx";
import { isEmail, isValidPassword } from "../utils/validators.js";
import { VALIDATION } from "../constants/index.js";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [touched, setTouched] = useState(false);

  const errors = useMemo(() => {
    if (!touched) return {};
    const e = {};
    if (!email.trim()) e.email = "Email is required.";
    else if (!isEmail(email)) e.email = "Enter a valid email.";
    if (!password) e.password = "Password is required.";
    else if (!isValidPassword(password, VALIDATION.PASSWORD_MIN_LENGTH)) {
      e.password = `Password must be at least ${VALIDATION.PASSWORD_MIN_LENGTH} characters.`;
    }
    return e;
  }, [email, password, touched]);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
      <div className="mx-auto max-w-md">
        <Card className="p-6">
          <div className="text-sm font-semibold text-white">Login</div>
          <div className="mt-1 text-sm text-white/60">
            Welcome back. Sign in to continue.
          </div>

          <form
            className="mt-6 grid gap-4"
            onSubmit={(e) => {
              e.preventDefault();
              setTouched(true);
              if (!email.trim() || !password) return;

              if (Object.keys(errors).length) return;
              login();
              navigate("/profile");
            }}
          >
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              error={errors.email}
              autoComplete="email"
            />
            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              error={errors.password}
              autoComplete="current-password"
            />

            <div className="flex items-center justify-between">
              <Link
                to="/forgot"
                className="text-sm text-white/70 hover:text-white hover:underline"
              >
                Forgot password?
              </Link>
              <Link
                to="/signup"
                className="text-sm text-white/70 hover:text-white hover:underline"
              >
                Create account
              </Link>
            </div>

            <Button type="submit" className="w-full">
              Sign in
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
