import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  Search,
  HelpCircle,
  ChevronDown,
  MessageCircle,
  Ticket,
  CreditCard,
  UtensilsCrossed,
  ShieldCheck,
  Send,
  X,
  Bot,
  User,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import Button from "../components/ui/Button.jsx";
import Card from "../components/ui/Card.jsx";
import Badge from "../components/ui/Badge.jsx";
import Input from "../components/ui/Input.jsx";
import Modal from "../components/ui/Modal.jsx";
import PageHeader from "../components/common/PageHeader.jsx";

const quickCards = [
  {
    title: "Tickets & Cancellations",
    desc: "Manage bookings, cancellation policies, and seat changes.",
    icon: Ticket,
    color: "bg-red-50 text-red-600",
    category: "Booking & Tickets",
  },
  {
    title: "Payments & Refunds",
    desc: "UPI payments, GST invoice requests, and refund timelines.",
    icon: CreditCard,
    color: "bg-cyan-50 text-cyan-600",
    category: "Payments & Refunds",
  },
  {
    title: "Snacks & Concessions",
    desc: "Pre-order popcorn combos and counter pickup guidance.",
    icon: UtensilsCrossed,
    color: "bg-amber-50 text-amber-600",
    category: "Snacks & F&B",
  },
  {
    title: "Account & QR Passes",
    desc: "Digital QR pass retrieval and VIP member benefits.",
    icon: ShieldCheck,
    color: "bg-emerald-50 text-emerald-600",
    category: "Account & Digital Pass",
  },
];

const faqs = [
  {
    category: "Booking & Tickets",
    q: "How do I cancel or modify my movie booking?",
    a: "Bookings can be managed or cancelled up to 2 hours before the showtime from your Profile dashboard under History. Cancellation policies depend on cinema partner rules.",
  },
  {
    category: "Booking & Tickets",
    q: "Can I transfer my movie ticket to another person?",
    a: "Yes! Simply share the digital QR pass from the Confirmation screen or Profile section with your friend. The cinema entrance scanner validates the QR code regardless of name.",
  },
  {
    category: "Payments & Refunds",
    q: "Where do I find my booking ticket QR code?",
    a: "Your digital ticket pass and 64-bit QR code are displayed immediately on the Confirmation page after payment and stored permanently in your Profile under History.",
  },
  {
    category: "Payments & Refunds",
    q: "How do discount coupons work?",
    a: "Enter valid coupon codes like NOIR10 or BMSLIKE on the Payment checkout screen to claim instant discounts up to 10% off your total.",
  },
  {
    category: "Payments & Refunds",
    q: "How long does a cancelled ticket refund take?",
    a: "Automated refunds are initiated instantly and credited to your original payment method (UPI / Bank Account) within 2 to 4 business days.",
  },
  {
    category: "Snacks & F&B",
    q: "Can I pre-order popcorn and snacks with my ticket?",
    a: "Yes! The booking funnel includes a dedicated Food & Beverage screen where you can pre-order popcorn combos and add them directly to your checkout total.",
  },
  {
    category: "Snacks & F&B",
    q: "How do I collect pre-ordered snacks at the cinema?",
    a: "Present your digital ticket QR pass at the express F&B counter at the multiplex. The concession team will scan your QR code and serve your order.",
  },
  {
    category: "Account & Digital Pass",
    q: "What should I do if my payment succeeded but tickets were not generated?",
    a: "Our automated reconciliation system checks pending transactions every 15 minutes. If tickets aren't generated, use our Live Chat or Contact page with your UPI reference number.",
  },
];

export default function Support() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [openIndex, setOpenIndex] = useState(0);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { sender: "bot", text: "Hello! Welcome to BookMySeat Assistant. How can I help you with your booking today?" },
  ]);
  const [chatInput, setChatInput] = useState("");

  const categories = ["All", "Booking & Tickets", "Payments & Refunds", "Snacks & F&B", "Account & Digital Pass"];

  const filteredFaqs = useMemo(() => {
    return faqs.filter((faq) => {
      const matchesCategory = activeCategory === "All" || faq.category === activeCategory;
      const needle = query.trim().toLowerCase();
      const matchesQuery = !needle || faq.q.toLowerCase().includes(needle) || faq.a.toLowerCase().includes(needle);
      return matchesCategory && matchesQuery;
    });
  }, [activeCategory, query]);

  const handleSendChatMessage = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userText = chatInput.trim();
    setChatMessages((prev) => [...prev, { sender: "user", text: userText }]);
    setChatInput("");

    // Simulated Bot Response
    setTimeout(() => {
      let botReply = "Thank you for reaching out! Our team is available 24/7. You can also view your tickets under your Profile page.";
      if (userText.toLowerCase().includes("refund") || userText.toLowerCase().includes("cancel")) {
        botReply = "Cancellations are permitted up to 2 hours prior to showtime from your Profile dashboard under History.";
      } else if (userText.toLowerCase().includes("qr") || userText.toLowerCase().includes("ticket")) {
        botReply = "Your digital ticket pass and QR code are available on the Confirmation screen and saved in your Profile.";
      } else if (userText.toLowerCase().includes("food") || userText.toLowerCase().includes("snack")) {
        botReply = "You can pre-order food & concessions during ticket selection or present your QR pass at the theater F&B counter.";
      }
      setChatMessages((prev) => [...prev, { sender: "bot", text: botReply }]);
    }, 800);
  };

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8 space-y-10">
      <PageHeader
        title="Help & Support Center"
        subtitle="Search instant answers, browse topic guides, or connect with our customer support team."
      >
        <Button variant="primary" size="sm" onClick={() => setChatOpen(true)}>
          <MessageCircle className="h-4 w-4" />
          <span>Live Assistant Chat</span>
        </Button>
      </PageHeader>

      {/* Search Hero Input Card */}
      <Card className="p-6 sm:p-8 bg-gradient-to-r from-slate-900 to-slate-950 text-white shadow-xl space-y-4">
        <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-red-500">
          <Sparkles className="h-4 w-4" />
          <span>24/7 Knowledge Base</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          How can we help you today?
        </h2>

        <div className="relative max-w-2xl pt-2">
          <Search className="absolute left-4 top-5 h-5 w-5 text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search FAQs by keyword (e.g., refund, QR code, snacks, cancellation)..."
            className="w-full rounded-2xl bg-white/10 py-3.5 pl-12 pr-4 text-sm text-white placeholder:text-slate-400 outline-none backdrop-blur-md transition focus:bg-white/15 focus:ring-2 focus:ring-red-500/30"
          />
        </div>
      </Card>

      {/* Quick Help Topic Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {quickCards.map((card) => {
          const Icon = card.icon;
          return (
            <Card
              key={card.title}
              hover
              onClick={() => setActiveCategory(card.category)}
              className="p-5 cursor-pointer space-y-3 bg-white shadow-xs"
            >
              <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${card.color}`}>
                <Icon className="h-6 w-6" />
              </div>
              <div>
                <h4 className="text-sm font-extrabold text-slate-900">{card.title}</h4>
                <p className="text-xs text-slate-500 font-medium mt-1 leading-relaxed">{card.desc}</p>
              </div>
            </Card>
          );
        })}
      </div>

      {/* FAQ Category Accordion Section */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h3 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-red-600" />
            <span>Frequently Asked Questions</span>
          </h3>

          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`rounded-2xl px-3.5 py-1.5 text-xs font-bold transition ${
                  activeCategory === cat
                    ? "bg-red-600 text-white shadow-xs"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200/80"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* FAQs List */}
        <Card className="p-6 bg-white shadow-xs">
          {filteredFaqs.length ? (
            <div className="space-y-3">
              {filteredFaqs.map((faq, i) => {
                const isOpen = openIndex === i;
                return (
                  <div
                    key={i}
                    className="rounded-2xl bg-slate-50 border border-slate-100 overflow-hidden transition"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenIndex(isOpen ? -1 : i)}
                      className="flex w-full items-center justify-between p-4 text-left font-bold text-xs sm:text-sm text-slate-900"
                    >
                      <span>{faq.q}</span>
                      <ChevronDown className={`h-4 w-4 shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`} />
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
          ) : (
            <div className="p-8 text-center text-xs text-slate-500 font-semibold">
              No matching FAQs found. Try searching a different keyword or contact our support team.
            </div>
          )}
        </Card>
      </section>

      {/* Still Need Help CTA Card */}
      <Card className="p-8 bg-gradient-to-r from-red-600 to-rose-500 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-1 text-center sm:text-left">
          <Badge variant="subtle" className="bg-white/20 text-white border-none py-1 px-3">
            STILL HAVE QUESTIONS?
          </Badge>
          <h3 className="text-2xl font-black text-white">Our Support Team is Ready to Help</h3>
          <p className="text-xs sm:text-sm text-red-100 font-medium">
            Contact us directly or launch our interactive live chat assistant.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="md"
            className="bg-white text-slate-900 border-none font-extrabold hover:bg-slate-100"
            as={Link}
            to="/contact"
          >
            Contact Page
            <ArrowRight className="h-4 w-4" />
          </Button>

          <Button
            variant="secondary"
            size="md"
            onClick={() => setChatOpen(true)}
            className="bg-slate-900 text-white hover:bg-slate-800 font-extrabold"
          >
            <MessageCircle className="h-4 w-4" />
            Live Chat
          </Button>
        </div>
      </Card>

      {/* Live Support Assistant Modal */}
      <Modal isOpen={chatOpen} onClose={() => setChatOpen(false)} title="Live Support Assistant">
        <div className="space-y-4">
          <div className="flex items-center gap-3 rounded-2xl bg-red-50 p-3 text-xs text-red-700 font-semibold">
            <Bot className="h-5 w-5 text-red-600 shrink-0" />
            <span>AI Customer Support Agent (Online 24/7)</span>
          </div>

          {/* Chat Messages Container */}
          <div className="max-h-64 overflow-y-auto space-y-3 p-2 bg-slate-50 rounded-2xl border border-slate-100">
            {chatMessages.map((msg, i) => (
              <div
                key={i}
                className={`flex gap-2 text-xs ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {msg.sender === "bot" && (
                  <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-red-600 text-white shrink-0 mt-0.5">
                    <Bot className="h-4 w-4" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-2xl p-3 font-medium ${
                    msg.sender === "user"
                      ? "bg-red-600 text-white rounded-br-none"
                      : "bg-white text-slate-800 shadow-xs rounded-bl-none border border-slate-100"
                  }`}
                >
                  {msg.text}
                </div>
                {msg.sender === "user" && (
                  <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-slate-800 text-white shrink-0 mt-0.5">
                    <User className="h-4 w-4" />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Chat Input Form */}
          <form onSubmit={handleSendChatMessage} className="flex items-center gap-2 pt-2">
            <input
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Ask a question about your booking..."
              className="w-full rounded-2xl bg-slate-100 px-4 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 outline-none focus:bg-slate-200/80"
            />
            <Button type="submit" size="sm" variant="primary">
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </Modal>
    </div>
  );
}
