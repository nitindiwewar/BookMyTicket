import { useMemo, useState } from "react";
import Button from "../components/ui/Button.jsx";
import Card from "../components/ui/Card.jsx";
import Input from "../components/ui/Input.jsx";

function isEmail(v) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v || "").trim());
}

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [touched, setTouched] = useState(false);
  const [sent, setSent] = useState(false);

  const errors = useMemo(() => {
    if (!touched) return {};
    const e = {};
    if (!name.trim()) e.name = "Name is required.";
    if (!email.trim()) e.email = "Email is required.";
    else if (!isEmail(email)) e.email = "Enter a valid email.";
    if (!message.trim()) e.message = "Message is required.";
    else if (message.trim().length < 10)
      e.message = "Please write at least 10 characters.";
    return e;
  }, [email, message, name, touched]);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white sm:text-3xl">
            Contact
          </h1>
          <p className="mt-1 text-sm text-white/60">
            We're here to help with your booking needs.
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_360px]">
        <Card className="p-6">
          <div className="text-sm font-semibold text-white">Send a message</div>
          <div className="mt-1 text-sm text-white/60">
            We typically respond within 24 hours.
          </div>

          {sent ? (
            <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/70">
              Message sent. We’ll get back to you soon.
            </div>
          ) : null}

          <form
            className="mt-6 grid gap-4"
            onSubmit={async (e) => {
              e.preventDefault();
              setTouched(true);
              if (Object.keys(errors).length) return;
              await new Promise((r) => setTimeout(r, 400));
              setSent(true);
            }}
          >
            <Input
              label="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              error={errors.name}
              autoComplete="name"
            />
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              error={errors.email}
              autoComplete="email"
            />
            <label className="block">
              <div className="text-xs font-semibold text-white/70">Message</div>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={5}
                placeholder="Tell us what you need help with…"
                className={[
                  "mt-2 w-full resize-none rounded-2xl border bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/40 outline-none transition",
                  errors.message
                    ? "border-white/25 focus:border-white/30"
                    : "border-white/10 focus:border-white/20 focus:bg-white/10",
                ].join(" ")}
              />
              {errors.message ? (
                <div className="mt-2 text-xs font-medium text-white/70">
                  {errors.message}
                </div>
              ) : null}
            </label>

            <Button type="submit" className="w-full">
              Send
            </Button>
          </form>
        </Card>

        <Card className="p-6">
          <div className="text-sm font-semibold text-white">Social</div>
          <div className="mt-3 flex flex-wrap gap-2">
            {[
              { label: "X", href: "https://x.com" },
              { label: "Instagram", href: "https://instagram.com" },
              { label: "YouTube", href: "https://youtube.com" },
            ].map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/80 transition hover:bg-white/10 hover:text-white"
              >
                {s.label}
              </a>
            ))}
          </div>

          <div className="mt-6 text-sm font-semibold text-white">Help</div>
          <div className="mt-2 grid gap-2 text-sm text-white/70">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
              Email: <span className="text-white">support@bookmyseat.demo</span>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
              Hours: <span className="text-white">10:00 AM – 8:00 PM</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
