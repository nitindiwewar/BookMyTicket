import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Film,
  Armchair,
  Popcorn,
  CreditCard,
  Ticket,
  ChevronRight,
} from "lucide-react";
import Button from "../components/ui/Button.jsx";
import Card from "../components/ui/Card.jsx";

const steps = [
  {
    icon: Film,
    label: "Browse Movies",
    desc: "Find the latest releases and upcoming hits",
  },
  {
    icon: Ticket,
    label: "Pick Showtime",
    desc: "Choose your preferred theater and time",
  },
  {
    icon: Armchair,
    label: "Select Seats",
    desc: "Pick the best seats in the house",
  },
  {
    icon: Popcorn,
    label: "Add Snacks",
    desc: "Grab your favorite food and drinks",
  },
  {
    icon: CreditCard,
    label: "Pay & Go",
    desc: "Complete your booking securely",
  },
];

export default function Booking() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Card className="p-8">
          <h1 className="text-2xl font-semibold text-white sm:text-3xl">
            How Booking Works
          </h1>
          <p className="mt-2 text-sm text-white/60">
            Book your movie tickets in just a few simple steps.
          </p>

          <div className="mt-8 grid gap-4">
            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <div key={step.label} className="flex items-start gap-4">
                  <div className="flex flex-col items-center">
                    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl border border-white/10 bg-white/5">
                      <Icon className="h-5 w-5 text-white/70" />
                    </div>
                    {i < steps.length - 1 && (
                      <div className="mt-2 h-8 w-px bg-white/10" />
                    )}
                  </div>
                  <div className="pb-4">
                    <div className="text-sm font-semibold text-white">
                      Step {i + 1}: {step.label}
                    </div>
                    <div className="mt-0.5 text-sm text-white/60">
                      {step.desc}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <Button as={Link} to="/movies" className="mt-6">
            <span className="inline-flex items-center gap-2">
              Start Booking
              <ChevronRight className="h-4 w-4" />
            </span>
          </Button>
        </Card>
      </motion.div>
    </div>
  );
}
