# 🎬 CineVerse — Premium Movie Ticket Booking System

A modern, responsive, and premium **Movie Ticket Booking** web app with a dark,
cinema-inspired theme (black, deep purple, and red accents), glassmorphism UI,
smooth Framer Motion animations, and a complete end-to-end booking flow.

> All data is **mocked** and payments are **simulated** — no backend or API keys
> are required to run the app.

## ✨ Features

- **Landing page** — auto-rotating hero banner, global search, trending carousel,
  upcoming movies, popular theaters, stats, and CTA.
- **Movies** — filter by genre / language / city / format, live search, and sorting.
- **Movie details** — banner, trailer modal, synopsis, cast & crew, reviews, and
  per-theater showtimes.
- **Seat selection** — interactive, zoomable seat map with regular / premium / VIP
  / booked / selected states, legend, and live ticket summary.
- **Checkout** — food & beverage add-ons, promo codes (`CINE20`, `FIRST5`,
  `WEEKEND10`), payment methods, price breakdown, and simulated payment.
- **Confirmation** — digital e-ticket with QR-style code, booking ID, download
  (print to PDF), and share.
- **User dashboard** — profile, booking history, favorites, saved cards,
  notifications, and reward points.
- **Admin dashboard** — KPIs, revenue & ticket charts (Recharts), genre split,
  and movie / theater / show / seat / user management with reports.
- Fully **responsive** (desktop / tablet / mobile), skeleton loaders, accessible
  contrast, and keyboard-focus styles.

## 🛠 Tech Stack

- **React 18** + **Vite**
- **Tailwind CSS** (custom cinema theme + glassmorphism utilities)
- **Framer Motion** (animations & micro-interactions)
- **Lucide React** (icons)
- **Recharts** (admin analytics)
- **React Router** (routing)

## 🚀 Getting Started

```bash
npm install
npm run dev      # start dev server (http://localhost:5173)
npm run build    # production build
npm run preview  # preview the production build
npm run lint     # run ESLint
```

## 📁 Structure

```
src/
├── components/        # Navbar, Footer, Hero, Carousel, cards, UI primitives
│   └── ui/            # Poster, RatingStars, Skeleton, QRCode, SectionHeader
├── context/           # AppContext (booking flow + favorites)
├── data/              # mock movies, theaters, seats, food, offers, users, admin
├── hooks/             # useFakeLoading (skeleton demo)
├── lib/               # formatting helpers
└── pages/             # Landing, Movies, MovieDetails, SeatSelection,
                       # Checkout, Confirmation, Dashboard, Admin,
                       # Theaters, Offers, Login, NotFound
```

## 🎨 Notes

- Movie posters are rendered locally as themed gradient art (`<Poster />`) so the
  app is fully self-contained with no external image dependencies.
- The QR code on the e-ticket is a decorative, deterministic matrix (not scannable).
- To connect a real backend (Firebase / Spring Boot) and payments (Stripe /
  Razorpay), replace the mock data in `src/data/` and the simulated payment in
  `src/pages/Checkout.jsx`.
