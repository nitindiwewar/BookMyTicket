import { Link } from "react-router-dom";
import Card from "../components/ui/Card.jsx";
import Button from "../components/ui/Button.jsx";

const faqs = [
  {
    q: "How do I book tickets?",
    a: "Go to Movies → open a movie → Book Tickets → pick theater/showtime → select seats → pay.",
  },
  {
    q: "Can I apply coupons?",
    a: "Yes. On the payment page, apply coupon codes like NOIR10 or BMSLIKE.",
  },
  {
    q: "Is this connected to real payments?",
    a: "All transactions are securely processed. No real charges are applied in this demo.",
  },
];

export default function Support() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white sm:text-3xl">
            Support
          </h1>
          <p className="mt-1 text-sm text-white/60">
            Find quick answers and get in touch.
          </p>
        </div>
        <Button as={Link} to="/contact" variant="subtle">
          Contact us
        </Button>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <Card className="p-6">
          <div className="text-sm font-semibold text-white">FAQ</div>
          <div className="mt-4 grid gap-3">
            {faqs.map((f) => (
              <details
                key={f.q}
                className="group rounded-2xl border border-white/10 bg-white/5 p-4 open:bg-white/10"
              >
                <summary className="cursor-pointer list-none text-sm font-semibold text-white">
                  <span className="inline-flex items-center justify-between w-full gap-3">
                    {f.q}
                    <span className="text-white/50 group-open:rotate-180 transition">
                      ⌄
                    </span>
                  </span>
                </summary>
                <p className="mt-2 text-sm text-white/60">{f.a}</p>
              </details>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <div className="text-sm font-semibold text-white">Quick actions</div>
          <div className="mt-4 grid gap-2">
            <Button as={Link} to="/movies">
              Browse movies
            </Button>
            <Button as={Link} to="/booking" variant="subtle">
              Start booking
            </Button>
            <Button as={Link} to="/login" variant="subtle">
              Login
            </Button>
          </div>
          <div className="mt-4 text-xs text-white/50">
            Need more help? Use the contact form.
          </div>
        </Card>
      </div>
    </div>
  );
}
