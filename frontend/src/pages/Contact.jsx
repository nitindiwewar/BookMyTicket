import { useMemo, useState } from "react";
import { Mail, Phone, MapPin, Clock, Send, MessageSquare, Sparkles, ChevronDown, CheckCircle2 } from "lucide-react";
import Button from "../components/ui/Button.jsx";
import Card from "../components/ui/Card.jsx";
import Input from "../components/ui/Input.jsx";
import Badge from "../components/ui/Badge.jsx";
import PageHeader from "../components/common/PageHeader.jsx";
import { isEmail } from "../utils/validators.js";
import { useToast } from "../state/toastContext.jsx";

const contactCards = [
  {
    title: "Email Support",
    value: "support@bookmyseat.demo",
    subtext: "24/7 Priority Inbox Response",
    icon: Mail,
    color: "text-red-600 bg-red-50",
  },
  {
    title: "Phone Support",
    value: "+91 1800-266-5732",
    subtext: "Toll-Free Customer Care",
    icon: Phone,
    color: "text-cyan-600 bg-cyan-50",
  },
  {
    title: "Headquarters",
    value: "City Center, 4th Floor",
    subtext: "Mumbai, Maharashtra 400001",
    icon: MapPin,
    color: "text-amber-600 bg-amber-50",
  },
  {
    title: "Working Hours",
    value: "10:00 AM – 8:00 PM IST",
    subtext: "Monday to Sunday",
    icon: Clock,
    color: "text-emerald-600 bg-emerald-50",
  },
];

const contactFaqs = [
  {
    q: "How fast does customer support respond to inquiries?",
    a: "Our dedicated support team responds within 1 to 2 hours for active showtime inquiries, and within 24 hours for general ticket & refund inquiries.",
  },
  {
    q: "What should I do if my payment succeeded but tickets were not generated?",
    a: "Please reach out with your transaction ID via this form or call our toll-free number. Our automated reconciliation system automatically issues tickets or refunds within 15 minutes.",
  },
  {
    q: "How can cinema owners partner with BookMySeat?",
    a: "Select 'Cinema Partnership' in the form subject dropdown below, and our partner onboarding team will contact you with API integration guidelines.",
  },
];

export default function Contact() {
  const { showToast } = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("Ticket Inquiry");
  const [message, setMessage] = useState("");
  const [touched, setTouched] = useState(false);
  const [sent, setSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);

  const errors = useMemo(() => {
    if (!touched) return {};
    const e = {};
    if (!name.trim()) e.name = "Full name is required.";
    if (!email.trim()) e.email = "Email address is required.";
    else if (!isEmail(email)) e.email = "Enter a valid email address.";

    if (!message.trim()) e.message = "Message is required.";
    else if (message.trim().length < 10) {
      e.message = "Please write at least 10 characters.";
    }

    return e;
  }, [email, message, name, touched]);

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-12">
      <PageHeader
        title="We'd Love to Hear From You"
        subtitle="Have questions about bookings, payments, or partner integrations? Send us a message or contact our team."
      />

      <div className="grid gap-8 lg:grid-cols-12 items-start">
        {/* Left Side - Info Cards & Hero */}
        <div className="lg:col-span-5 space-y-6">
          <div className="space-y-3">
            <Badge variant="primary" className="flex items-center gap-1.5 py-1 px-3 w-fit">
              <Sparkles className="h-3.5 w-3.5" />
              <span>LIVE CUSTOMER CARE</span>
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Get in Touch with Our Team
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed">
              We are dedicated to giving cinema-goers and theater partners an unforgettable movie ticket experience.
            </p>
          </div>

          {/* Contact Info Cards */}
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            {contactCards.map((card) => {
              const Icon = card.icon;
              return (
                <Card key={card.title} hover className="p-4 flex items-center gap-4 bg-white shadow-xs">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-2xl shrink-0 ${card.color}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-slate-400">{card.title}</div>
                    <div className="text-sm font-extrabold text-slate-900">{card.value}</div>
                    <div className="text-[11px] font-medium text-slate-500">{card.subtext}</div>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Social Follow Links */}
          <Card className="p-5 space-y-3 bg-white shadow-xs">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-900">
              Connect With Us
            </h4>
            <div className="flex flex-wrap gap-2">
              {[
                { label: "X / Twitter", href: "https://x.com" },
                { label: "Instagram", href: "https://instagram.com" },
                { label: "YouTube", href: "https://youtube.com" },
                { label: "LinkedIn", href: "https://linkedin.com" },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-xl bg-slate-100 px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-200/80 transition"
                >
                  {s.label}
                </a>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Side - Form Card */}
        <Card className="lg:col-span-7 p-6 sm:p-8 space-y-6 bg-white shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-lg font-black text-slate-900">Send a Message</h3>
              <p className="text-xs text-slate-500 font-medium">Fill out the form below and we will respond promptly.</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-red-50 text-red-600">
              <MessageSquare className="h-5 w-5" />
            </div>
          </div>

          {sent && (
            <div className="flex items-center gap-3 rounded-2xl bg-emerald-50 p-4 text-xs font-bold text-emerald-700">
              <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
              <span>Thank you! Your message has been submitted successfully. We will reply via email.</span>
            </div>
          )}

          <form
            className="space-y-5"
            onSubmit={async (e) => {
              e.preventDefault();
              setTouched(true);

              if (Object.keys(errors).length) return;

              setIsSubmitting(true);
              await new Promise((r) => setTimeout(r, 600));
              setSent(true);
              setIsSubmitting(false);
              showToast("Message sent successfully!", "success");
              setName("");
              setEmail("");
              setMessage("");
              setTouched(false);
            }}
          >
            <div className="grid sm:grid-cols-2 gap-4">
              <Input
                label="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Aarav Sharma"
                error={errors.name}
                disabled={isSubmitting}
              />

              <Input
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="aarav@example.com"
                error={errors.email}
                disabled={isSubmitting}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold tracking-wide uppercase text-slate-600">
                Subject Category
              </label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                disabled={isSubmitting}
                className="w-full rounded-2xl bg-slate-100 px-4 py-2.5 text-sm font-bold text-slate-900 outline-none transition focus:bg-slate-200/80"
              >
                <option value="Ticket Inquiry">Ticket Booking Inquiry</option>
                <option value="Payment Issue">Payment & Refund Help</option>
                <option value="Cinema Partnership">Cinema Owner Partnership</option>
                <option value="Feedback & Suggestions">Feedback & Suggestions</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold tracking-wide uppercase text-slate-600">
                Message
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={5}
                placeholder="Describe your inquiry in detail..."
                disabled={isSubmitting}
                className="w-full resize-none rounded-2xl bg-slate-100 p-4 text-sm font-medium text-slate-900 placeholder:text-slate-400 outline-none transition focus:bg-slate-200/80"
              />
              {errors.message && (
                <p className="text-xs font-semibold text-red-500">{errors.message}</p>
              )}
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full shadow-md shadow-red-600/20"
              loading={isSubmitting}
            >
              <Send className="h-4 w-4" />
              <span>{isSubmitting ? "Sending Message..." : "Send Message"}</span>
            </Button>
          </form>
        </Card>
      </div>

      {/* Integrated Contact FAQ Section */}
      <section className="pt-6">
        <Card className="p-6 sm:p-8 space-y-6 bg-white shadow-xs">
          <div className="space-y-1">
            <div className="text-xs font-extrabold uppercase tracking-wider text-red-600">
              Need Quick Answers?
            </div>
            <h3 className="text-xl font-black text-slate-900">
              Frequently Asked Contact Questions
            </h3>
          </div>

          <div className="space-y-3">
            {contactFaqs.map((faq, i) => {
              const isOpen = openFaq === i;
              return (
                <div
                  key={i}
                  className="rounded-2xl bg-slate-50 overflow-hidden transition"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? -1 : i)}
                    className="flex w-full items-center justify-between p-4 text-left font-bold text-sm text-slate-900"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 text-xs sm:text-sm text-slate-500 font-medium leading-relaxed border-t border-slate-200/60 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </Card>
      </section>
    </div>
  );
}
