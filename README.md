# 🎬 Movie Ticket Booking Application

A modern, responsive React application for booking movie tickets with seat selection, snack ordering, and payment integration.

## ✨ Features

- 🎭 **Movie Browse** - Discover movies by genre, language, and format
- 📍 **Location Selection** - Choose from multiple cities
- 🎯 **Smart Seat Selection** - Visual seat map with real-time availability
- 🍿 **Snack Ordering** - Add snacks to your booking
- 💳 **Multiple Payment Methods** - UPI, Cards, Wallets, Net Banking
- 🎟️ **Booking Management** - Track your bookings and confirmations
- 🌓 **Theme Toggle** - Dark/Light mode support
- 🎨 **Modern UI** - Monochrome design with glassmorphism effects

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

```bash
# Clone the repository
cd MovieTicket

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Basic UI components (Button, Input, Card)
│   ├── ErrorBoundary.jsx  # Error handling boundary
│   ├── PageLayout.jsx     # Page layout wrapper
│   └── ...
├── pages/              # Page-level components (routes)
│   ├── Home.jsx
│   ├── Movies.jsx
│   ├── Seats.jsx
│   ├── Payment.jsx
│   └── ...
├── state/              # Context & state management
│   ├── bookingContext.jsx
│   ├── locationContext.jsx
│   └── themeContext.jsx
├── utils/              # Utility functions
│   ├── classNames.js
│   ├── validators.js
│   └── formatters.js
├── constants/          # Application constants
│   └── index.js
├── data/               # Static data
│   ├── movies.js
│   ├── theaters.js
│   └── snacks.js
└── App.jsx
```

## 🔧 Technology Stack

- **React 19** - UI framework
- **React Router 7** - Client-side routing
- **Tailwind CSS 4** - Utility-first styling
- **Vite 8** - Build tool
- **JavaScript ES6+** - Modern JavaScript

## 📚 Documentation

### Code Quality & Improvements
- [**IMPROVEMENTS.md**](./IMPROVEMENTS.md) - Detailed list of all improvements made
- [**BEST_PRACTICES.md**](./BEST_PRACTICES.md) - Code standards and best practices guide

### Key Improvements Made:
✅ **Eliminated magic numbers** - All constants centralized  
✅ **Removed duplicate code** - Utilities consolidated  
✅ **Added error handling** - Error Boundary component  
✅ **Improved organization** - Clear folder structure  
✅ **Enhanced documentation** - JSDoc comments  
✅ **Consistent patterns** - Validators and formatters  

## 🎯 Booking Flow

1. **Home** - Browse and search movies
2. **Movie Details** - View movie information and select theaters
3. **Seat Selection** - Choose seats and seat tier (VIP/Premium/Regular)
4. **Snacks** - Add snacks to your order (optional)
5. **Payment** - Select payment method and apply coupons
6. **Confirmation** - Download or save ticket

## 🛠️ Development

### Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

### Code Organization

#### Constants
```jsx
import { SEAT_TIERS, PAYMENT_METHODS } from '../constants/index.js'
```

#### Validators
```jsx
import { isEmail, isValidPassword } from '../utils/validators.js'
```

#### Formatters
```jsx
import { formatRating, formatCurrency } from '../utils/formatters.js'
```

#### UI Utilities
```jsx
import { classNames } from '../utils/classNames.js'
```

## 📱 Responsive Design

- ✅ Mobile-first approach
- ✅ Tablet optimized
- ✅ Desktop ready
- ✅ Touch-friendly interactions

## 🎨 Styling

- **Tailwind CSS** for utility-first styling
- **PostCSS** for CSS processing
- **Autoprefixer** for browser compatibility
- Dark theme by default with light mode toggle

## 🔐 Data Management

### State Management
- **BookingContext** - Manage booking state across pages
- **LocationContext** - Handle location selection
- **ThemeContext** - Toggle light/dark mode

### Local Storage
- Persists booking data
- Persists location preference
- Persists theme preference

## 🐛 Error Handling

The application includes:
- **Error Boundary** - Catches component errors
- **Form Validation** - Client-side input validation
- **Graceful Fallbacks** - Error pages for invalid routes
- **Loading States** - User feedback during async operations

## 📈 Performance Optimizations

- ✅ Memoized computations with `useMemo`
- ✅ Optimized callbacks with `useCallback`
- ✅ Lazy image loading
- ✅ Code splitting ready
- ✅ Minimal re-renders

## 🎓 Learning Resources

- [React Documentation](https://react.dev)
- [Vite Guide](https://vitejs.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [React Router](https://reactrouter.com)

## 📝 Demo Credentials

**For Testing:**
- Email: any valid email format (e.g., test@example.com)
- Password: Any string with 6+ characters
- Available Coupons: `NOIR10`, `BMSLIKE`

## 🤝 Contributing

When contributing:
1. Follow the [BEST_PRACTICES.md](./BEST_PRACTICES.md) guide
2. Use constants from `constants/index.js`
3. Add JSDoc comments to new functions
4. Test before committing
5. Use meaningful commit messages

## 📄 Project Information

- **Version**: 1.0.0
- **Status**: Active Development
- **Last Updated**: 2026-05-07
- **Framework**: React 19 + Vite

## 📞 Support

For issues or questions:
1. Check [BEST_PRACTICES.md](./BEST_PRACTICES.md)
2. Review [IMPROVEMENTS.md](./IMPROVEMENTS.md)
3. Check component documentation
4. Review error boundary messages

## 📜 License

This project is for educational purposes.

---

**Built with ❤️ using React + Vite**
