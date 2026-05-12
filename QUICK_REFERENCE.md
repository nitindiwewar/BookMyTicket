# 🚀 Quick Reference Guide

## Import Snippets

### Utilities
```jsx
// Class names
import { classNames } from '../utils/classNames.js'

// Validation
import { isEmail, isValidPassword, isValidSeatId, isValidCoupon } from '../utils/validators.js'

// Formatting
import { formatRating, getSeatId, parseNumber, formatCurrency, getUnique } from '../utils/formatters.js'
```

### Constants
```jsx
import {
  SEAT_TIERS,
  DEFAULT_SEAT_TIER,
  BOOKING_FEE_PERCENTAGE,
  PAYMENT_METHODS,
  COUPONS,
  MOVIE_FORMATS,
  VALIDATION,
  STORAGE_KEYS,
  CITY_OPTIONS,
  SEAT_GRID,
  MAX_SEATS_PER_BOOKING,
  BOOKING_STEPS,
  THEMES,
} from '../constants/index.js'
```

---

## Common Patterns

### Form Validation
```jsx
const [email, setEmail] = useState('')
const [touched, setTouched] = useState(false)

const errors = useMemo(() => {
  if (!touched) return {}
  const e = {}
  if (!email.trim()) e.email = 'Required'
  else if (!isEmail(email)) e.email = 'Invalid email'
  return e
}, [email, touched])

return (
  <form onSubmit={(e) => {
    e.preventDefault()
    setTouched(true)
    if (Object.keys(errors).length) return
    // Submit
  }}>
    <Input value={email} error={errors.email} />
  </form>
)
```

### Using Constants
```jsx
// Render list of options
{PAYMENT_METHODS.map(m => (
  <button key={m.id}>{m.label}</button>
))}

// Check value
if (method === PAYMENT_METHODS[0].id) { ... }

// Calculate with constants
const fees = Math.round(total * BOOKING_FEE_PERCENTAGE)
```

### Error Handling
```jsx
// Wrap routes
<ErrorBoundary>
  <Routes>
    <Route path="/" element={<Home />} />
  </Routes>
</ErrorBoundary>

// Handle async errors
const [error, setError] = useState(null)
try {
  const data = await fetchData()
} catch (err) {
  setError(err.message)
}
```

---

## Frequently Used Constants

### Pricing
```jsx
SEAT_TIERS           // [{id: 'VIP', price: 520}, ...]
BOOKING_FEE_PERCENTAGE  // 0.06 (6%)
COUPONS              // {NOIR10: {...}, BMSLIKE: {...}}
```

### Validation
```jsx
VALIDATION.PASSWORD_MIN_LENGTH  // 6
VALIDATION.EMAIL_REGEX          // /^[^\s@]+@[^\s@]+\.[^\s@]+$/
VALIDATION.COUPON_REGEX         // /^[A-Z0-9]{3,20}$/
VALIDATION.SEAT_ID_REGEX        // /^[A-Z]\d+$/
```

### Storage
```jsx
STORAGE_KEYS.BOOKING    // "mt.booking.v1"
STORAGE_KEYS.LOCATION   // "mt.location.v1"
STORAGE_KEYS.THEME      // "mt.theme.v1"
```

---

## Common Functions

### Validators
```jsx
isEmail('test@example.com')              // true/false
isValidPassword('pass123', 6)            // true/false
isValidSeatId('A5')                      // true/false
isValidCoupon('NOIR10')                  // true/false
```

### Formatters
```jsx
formatRating(4.5)                        // "4.5"
formatCurrency(520)                      // "₹520.00"
getSeatId(0, 5)                          // "A6"
parseNumber('123')                       // 123
getUnique([1, 1, 2, 2, 3])              // [1, 2, 3]
```

---

## Component Templates

### Functional Component
```jsx
import { useState, useMemo } from 'react'
import { classNames } from '../utils/classNames.js'
import { CONSTANT_NAME } from '../constants/index.js'

/**
 * Component description
 * @component
 * @param {Object} props
 * @param {string} props.name - Description
 * @returns {JSX.Element}
 */
export default function ComponentName({ name, ...props }) {
  const [state, setState] = useState(initial)
  
  const memoized = useMemo(() => {
    return computation
  }, [dependency])

  return (
    <div className={classNames('base', 'classes')}>
      {/* JSX here */}
    </div>
  )
}
```

### With Error Handling
```jsx
export default function PageComponent() {
  const [error, setError] = useState(null)
  
  if (error) {
    return <ErrorMessage>{error}</ErrorMessage>
  }

  return <PageContent />
}
```

---

## Keyboard Shortcuts (Development)

| Action | Command |
|--------|---------|
| Format Code | Shift+Alt+F |
| Open Command Palette | Ctrl+Shift+P |
| Go to File | Ctrl+P |
| Search Symbol | Ctrl+Shift+O |
| Find & Replace | Ctrl+H |

---

## Debugging Tips

### Check Constants
```jsx
// Log all available tiers
console.log(SEAT_TIERS)

// Check current city options
console.log(CITY_OPTIONS)
```

### Validate Form Input
```jsx
console.log('Email valid?', isEmail(email))
console.log('Password valid?', isValidPassword(password))
console.log('Coupon valid?', isValidCoupon(coupon))
```

### Format Data
```jsx
console.log('Formatted rating:', formatRating(4.5))
console.log('Formatted price:', formatCurrency(520))
```

---

## File Locations

| Component | Path |
|-----------|------|
| Button | `src/components/ui/Button.jsx` |
| Input | `src/components/ui/Input.jsx` |
| Card | `src/components/ui/Card.jsx` |
| Navbar | `src/components/Navbar.jsx` |
| ErrorBoundary | `src/components/ErrorBoundary.jsx` |
| PageLayout | `src/components/PageLayout.jsx` |
| Constants | `src/constants/index.js` |
| Validators | `src/utils/validators.js` |
| Formatters | `src/utils/formatters.js` |
| ClassNames | `src/utils/classNames.js` |

---

## Common Errors & Solutions

### ❌ Error: "Cannot find module"
```jsx
// Check import path
// ❌ Wrong: import { isEmail } from '../validators'
// ✅ Right: import { isEmail } from '../utils/validators.js'
```

### ❌ Error: "Undefined constant"
```jsx
// Check if imported
// ❌ Wrong: SEAT_TIERS.map(...)  // without import
// ✅ Right: import { SEAT_TIERS } from '../constants/index.js'
```

### ❌ Error: "classNames is not a function"
```jsx
// Check import
// ❌ Wrong: import classNames from '../utils/classNames.js'
// ✅ Right: import { classNames } from '../utils/classNames.js'
```

---

## Best Practices Checklist

When adding features:
- [ ] Use constants instead of magic numbers
- [ ] Use utilities instead of inline functions
- [ ] Add JSDoc comments
- [ ] Organize imports correctly
- [ ] Handle errors
- [ ] Test locally
- [ ] No console.log in production

---

## Useful Commands

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Preview build
npm run preview

# Run linter
npm run lint

# Format code (if configured)
npx prettier --write .
```

---

## External Resources

- [React Docs](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [React Router](https://reactrouter.com)
- [Vite Docs](https://vitejs.dev)
- [MDN Web Docs](https://developer.mozilla.org)

---

## Contact & Support

- 📖 Read BEST_PRACTICES.md for detailed standards
- 📚 Check IMPROVEMENTS.md for what was changed
- 🎯 See README.md for project overview
- 💡 Review component JSDoc comments in code

---

**Last Updated**: 2026-05-07
**Version**: 1.0
