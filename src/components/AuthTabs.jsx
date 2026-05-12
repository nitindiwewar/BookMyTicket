import { memo } from "react";
import Button from "./ui/Button.jsx";
import Card from "./ui/Card.jsx";
import Input from "./ui/Input.jsx";

function AuthLoginForm({
  onLogin,
  loading,
  errors,
  touched,
  setTouched,
  email,
  setEmail,
  password,
  setPassword,
}) {
  return (
    <form
      className="mt-6 grid gap-4"
      onSubmit={(e) => {
        e.preventDefault();
        setTouched(true);
        onLogin();
      }}
    >
      <Input
        label="Email or mobile"
        type="text"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com or +91 9XXXXXXX"
        error={touched ? errors.email : ""}
        autoComplete="username"
      />
      <Input
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="••••••••"
        error={touched ? errors.password : ""}
        autoComplete="current-password"
      />

      <div className="flex items-center justify-between">
        <a
          href="#"
          className="text-sm text-white/70 hover:text-white hover:underline"
        >
          Forgot password?
        </a>
        <a
          href="#"
          className="text-sm text-white/70 hover:text-white hover:underline"
        >
          Need help?
        </a>
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Signing in…" : "Sign in"}
      </Button>

      <div className="mt-2 text-xs text-white/50">
        Tip: use any valid email + password (min length enforced by validators).
      </div>
    </form>
  );
}

function AuthSignupForm({
  onSignup,
  loading,
  errors,
  touched,
  setTouched,
  name,
  setName,
  email,
  setEmail,
  password,
  setPassword,
  confirm,
  setConfirm,
}) {
  return (
    <form
      className="mt-6 grid gap-4"
      onSubmit={(e) => {
        e.preventDefault();
        setTouched(true);
        onSignup();
      }}
    >
      <Input
        label="Full name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Your name"
        error={touched ? errors.name : ""}
        autoComplete="name"
      />
      <Input
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
        error={touched ? errors.email : ""}
        autoComplete="email"
      />
      <Input
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="••••••••"
        error={touched ? errors.password : ""}
        autoComplete="new-password"
      />
      <Input
        label="Confirm password"
        type="password"
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
        placeholder="••••••••"
        error={touched ? errors.confirm : ""}
        autoComplete="new-password"
      />

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Creating account…" : "Create account"}
      </Button>
    </form>
  );
}

// Tabs UI only; validation remains in the page that uses this component.
function AuthTabs({
  active,
  onChange,
  loginProps,
  signupProps,
  onLogin,
  onSignup,
  loginLoading,
  signupLoading,
}) {
  return (
    <div className="mx-auto max-w-md">
      <Card className="p-6">
        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            className={
              active === "login"
                ? "rounded-2xl border border-white/25 bg-white/10 px-4 py-2.5 text-sm font-bold text-white shadow-sm"
                : "rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white/70 hover:bg-white/10 hover:text-white transition"
            }
            onClick={() => onChange("login")}
          >
            Sign in
          </button>
          <button
            type="button"
            className={
              active === "signup"
                ? "rounded-2xl border border-white/25 bg-white/10 px-4 py-2.5 text-sm font-bold text-white shadow-sm"
                : "rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white/70 hover:bg-white/10 hover:text-white transition"
            }
            onClick={() => onChange("signup")}
          >
            Sign up
          </button>
        </div>

        <div className="mt-5 text-sm text-white/60">
          Premium auth UI — pick your method.
        </div>

        <div className="mt-4">
          {active === "login" ? (
            <AuthLoginForm
              {...loginProps}
              onLogin={onLogin}
              loading={loginLoading}
            />
          ) : (
            <AuthSignupForm
              {...signupProps}
              onSignup={onSignup}
              loading={signupLoading}
            />
          )}
        </div>
      </Card>
    </div>
  );
}

export default memo(AuthTabs);
