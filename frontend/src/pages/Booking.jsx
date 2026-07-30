import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Film,
  Armchair,
  Popcorn,
  CreditCard,
  Ticket,
  ChevronRight,
  ArrowRight,
} from "lucide-react";
import Button from "../components/ui/Button.jsx";
import Card from "../components/ui/Card.jsx";
import PageHeader from "../components/common/PageHeader.jsx";

const steps = [
  {
    icon: Film,
    label: "Browse Movies",
    desc: "Discover the latest blockbuster releases and trending titles in your city.",
  },
  {
    icon: Ticket,
    label: "Pick Showtime & Theater",
    desc: "Choose from multiple cinemas, IMAX, 4DX, or Dolby showtime slots.",
  },
  {
    icon: Armchair,
    label: "Select Seats",
    desc: "Interactive curved seat map with real-time tier selection (VIP, Premium, Regular).",
  },
  {
    icon: Popcorn,
    label: "Pre-order Snacks",
    desc: "Add your favorite popcorn, beverages, and combos to skip concession lines.",
  },
  {
    icon: CreditCard,
    label: "Pay & Get Instant Ticket",
    desc: "Apply discount coupons, complete secure checkout, and get your digital QR pass.",
  },
];

export default function Booking() {
  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      <PageHeader
        title="How Booking Works"
        subtitle="Experience seamless 5-step movie ticket reservations."
      />

      <Card className="p-6 sm:p-8 space-y-6">
        <div className="space-y-6">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <div key={step.label} className="flex items-start gap-4">
                <div className="flex flex-col items-center">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/10 text-red-500 font-bold">
                    <Icon className="h-6 w-6" />
                  </div>
                  {i < steps.length - 1 && (
                    <div className="mt-2 h-10 w-0.5 bg-slate-200" />
                  )}
                </div>

                <div className="pt-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-red-500">
                    Step {i + 1}
                  </span>
                  <h3 className="text-base font-bold text-slate-900">
                    {step.label}
                  </h3>
                  <p className="mt-1 text-xs sm:text-sm text-slate-500">
                    {step.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="pt-4 border-t border-slate-200 flex justify-end">
          <Button as={Link} to="/movies" size="lg">
            <span>Start Browsing Movies</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </Card>
    </div>
  );
}
