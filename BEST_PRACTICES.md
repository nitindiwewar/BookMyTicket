# Code Standards & Best Practices Guide

## 📋 Overview
This guide ensures consistency and quality across the Movie Ticket Booking application.

---

## 1. **File Organization**

### ✅ File Structure Rules

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Basic UI components (Button, Input, Card)
│   └── [Name].jsx      # Feature components
├── pages/              # Page-level components (route handlers)
├── state/              # Context & state management
├── utils/              # Utility functions (classNames, validators, formatters)
├── constants/          # Application constants
└── data/               # Static data (movies, theaters, snacks)
```

### ✅ Naming Conventions

| Type | Convention | Example |
|------|-----------|---------|
| Components | PascalCase | `MovieCard.jsx`, `Navbar.jsx` |
| Utilities | camelCase | `classNames.js`, `formatters.js` |
| Constants | UPPER_SNAKE_CASE | `SEAT_TIERS`, `BOOKING_FEE_PERCENTAGE` |
| Folders | kebab-case | `ui/`, `state/` |

---

## 2. **Imports Organization**

### ✅ Import Order

```jsx
// 1. React/Core libraries
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// 2. Third-party libraries
// (Add here if needed)

// 3. Local components (relative imports)
import Button from "../components/ui/Button.jsx";
import { classNames } from "../utils/classNames.js";

// 4. Constants & utilities
import { SEAT_TIERS } from "../constants/index.js";
```

---

## 3. **Constants Usage**

### ✅ When to Use Constants

```jsx
// ❌ AVOID: Magic numbers/strings
const fees = Math.round(total * 0.06);
if (password.length < 6) { ... }
localStorage.setItem("mt.booking.v1", data);

// ✅ USE: Constants
import { BOOKING_FEE_PERCENTAGE, VALIDATION, STORAGE_KEYS } from '../constants/index.js'

const fees = Math.round(total * BOOKING_FEE_PERCENTAGE);
if (password.length < VALIDATION.PASSWORD_MIN_LENGTH) { ... }
localStorage.setItem(STORAGE_KEYS.BOOKING, data);
```

### ✅ Adding New Constants

1. Identify repeated values in code
2. Add to `src/constants/index.js`
3. Update imports in affected files
4. Update documentation

---

## 4. **Component Standards**

### ✅ Component Template

```jsx
import { useState, useMemo } from 'react'
import Button from './Button.jsx'
import { classNames } from '../utils/classNames.js'
import { CONSTANT_NAME } from '../constants/index.js'

/**
 * Brief component description
 * @component
 * @param {Object} props
 * @param {string} props.propName - Description
 * @param {Function} props.onAction - Callback description
 * @returns {JSX.Element}
 * @example
 * return <ComponentName propName="value" />
 */
export default function ComponentName({ propName, onAction, className, ...props }) {
  const [state, setState] = useState(initialValue)
  
  const memoizedValue = useMemo(() => {
    // expensive computation
    return result
  }, [dependency])

  const handleAction = () => {
    // logic here
  }

  return (
    <div className={classNames('base-classes', className)}>
      <Button onClick={handleAction}>
        Action
      </Button>
    </div>
  )
}
```

### ✅ Component Guidelines

- Use JSDoc comments for all components
- Document props with types and descriptions
- Use `useMemo` for expensive calculations
- Export default for page components
- Export named for UI components

---

## 5. **Utility Function Standards**

### ✅ Utility Function Template

```jsx
/**
 * Clear description of what function does
 * @param {type} paramName - Description
 * @param {type} [optionalParam] - Optional description
 * @returns {returnType} What is returned
 * @example
 * getExample('input') // returns 'output'
 */
export function getFunctionName(paramName, optionalParam = defaultValue) {
  // implementation
  return result
}
```

### ✅ Utility Categories

| File | Purpose | Examples |
|------|---------|----------|
| `classNames.js` | CSS class combining | `classNames()` |
| `validators.js` | Input validation | `isEmail()`, `isValidPassword()` |
| `formatters.js` | Data formatting | `formatRating()`, `formatCurrency()` |
| (future) `api.js` | API calls | `fetchMovies()` |
| (future) `logger.js` | Error logging | `log()`, `error()` |

---

## 6. **State Management**

### ✅ Context Best Practices

```jsx
import { createContext, useContext, useMemo } from 'react'

const MyContext = createContext(null)

export function MyProvider({ children }) {
  const [state, setState] = useState(initialState)
  
  const value = useMemo(() => ({
    // Only include public API
    state,
    setState,
    // Derived values
    isDone: state.status === 'done'
  }), [state])

  return (
    <MyContext.Provider value={value}>
      {children}
    </MyContext.Provider>
  )
}

export function useMyContext() {
  const context = useContext(MyContext)
  if (!context) {
    throw new Error('useMyContext must be used within MyProvider')
  }
  return context
}
```

---

## 7. **Form & Validation**

### ✅ Form Validation Pattern

```jsx
import { useMemo, useState } from 'react'
import { isEmail, isValidPassword } from '../utils/validators.js'
import { VALIDATION } from '../constants/index.js'

export function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [touched, setTouched] = useState(false)

  // Validate only when touched
  const errors = useMemo(() => {
    if (!touched) return {}
    const e = {}
    if (!email.trim()) e.email = 'Email is required'
    else if (!isEmail(email)) e.email = 'Invalid email'
    if (!password) e.password = 'Password is required'
    else if (!isValidPassword(password, VALIDATION.PASSWORD_MIN_LENGTH)) {
      e.password = `Minimum ${VALIDATION.PASSWORD_MIN_LENGTH} characters`
    }
    return e
  }, [email, password, touched])

  const handleSubmit = (e) => {
    e.preventDefault()
    setTouched(true)
    if (Object.keys(errors).length) return
    // Submit form
  }

  return (
    <form onSubmit={handleSubmit}>
      <Input 
        value={email} 
        onChange={e => setEmail(e.target.value)}
        error={errors.email}
      />
      <Input 
        value={password} 
        onChange={e => setPassword(e.target.value)}
        error={errors.password}
      />
    </form>
  )
}
```

---

## 8. **Performance Best Practices**

### ✅ Optimization Checklist

```jsx
// ✅ Memoize expensive computations
const items = useMemo(() => {
  return data.filter(...).map(...).sort(...)
}, [data, sortKey])

// ✅ Use useCallback for stable function references
const handleClick = useCallback(() => {
  doSomething()
}, [dependency])

// ✅ Separate UI from logic
// Put filtering/sorting in useMemo, not in render

// ✅ Lazy load heavy components
const HeavyComponent = lazy(() => import('./HeavyComponent.jsx'))
<Suspense fallback={<Loading />}>
  <HeavyComponent />
</Suspense>

// ✅ Use key prop correctly in lists
{items.map(item => <Item key={item.id} item={item} />)}
```

---

## 9. **Error Handling**

### ✅ Error Boundaries

```jsx
// Wrap routes with ErrorBoundary
<ErrorBoundary>
  <Routes>
    <Route path="/path" element={<Page />} />
  </Routes>
</ErrorBoundary>

// For async errors, handle in component
const [error, setError] = useState(null)

try {
  const data = await fetchData()
  setState(data)
} catch (err) {
  setError(err.message)
  console.error('Error:', err)
}
```

---

## 10. **Testing Standards**

### ✅ What to Test

```jsx
// Test utilities
describe('isEmail', () => {
  it('validates correct email', () => {
    expect(isEmail('test@example.com')).toBe(true)
  })
  it('rejects invalid email', () => {
    expect(isEmail('invalid')).toBe(false)
  })
})

// Test components
describe('Button', () => {
  it('renders with correct text', () => {
    const { getByText } = render(<Button>Click me</Button>)
    expect(getByText('Click me')).toBeInTheDocument()
  })
})
```

---

## 11. **Code Review Checklist**

Before submitting code:

- [ ] No console.log left (except in dev mode)
- [ ] All imports organized correctly
- [ ] No magic numbers/strings (use constants)
- [ ] JSDoc comments added to functions
- [ ] Error handling implemented
- [ ] No duplicate code
- [ ] Components are single responsibility
- [ ] Consistent naming conventions
- [ ] No unnecessary rerenders
- [ ] Mobile-responsive CSS

---

## 12. **Common Patterns**

### ✅ Filtering with Constants

```jsx
import { PAYMENT_METHODS } from '../constants/index.js'

// Use constants for lists
const availableMethods = PAYMENT_METHODS.filter(m => m.available)

// Iterate safely
for (const method of PAYMENT_METHODS) {
  // Process
}
```

### ✅ Conditional Rendering

```jsx
// ❌ Avoid
{showLoading && <Spinner />}
{showError && <Error />}
{showContent && <Content />}

// ✅ Use single state
const state = 'loading' // or 'error' or 'content'
{state === 'loading' && <Spinner />}
{state === 'error' && <Error />}
{state === 'content' && <Content />}
```

---

## 13. **Accessibility Standards**

### ✅ A11y Checklist

```jsx
// Add labels to inputs
<label htmlFor="email">Email</label>
<input id="email" type="email" />

// Add aria-labels
<button aria-label="Close menu">×</button>

// Use semantic HTML
<button type="button">Click me</button> // not <div onClick>

// Include alt text
<img src="poster.jpg" alt="Movie title poster" />

// Keyboard support
onKeyDown={(e) => {
  if (e.key === 'Enter') handleAction()
}}
```

---

## 14. **Documentation Examples**

### ✅ Add Comments For:
- Complex logic
- Non-obvious calculations
- Business rules
- API integrations

### ❌ Don't Comment:
- Obvious variable assignments
- Simple loops
- Self-explanatory code

```jsx
// ✅ GOOD
// Calculate discount based on coupon tier
// NOIR10 gives 10%, capped at ₹200
const discount = Math.min(coupon.maxDiscount, amount * coupon.percentage)

// ❌ UNNECESSARY
// Set email to value
setEmail(e.target.value)
```

---

## 15. **Git Commit Messages**

### ✅ Commit Format

```
type(scope): description

feat(payment): add UPI payment method
fix(seats): resolve tier selection bug
refactor(utils): consolidate validators
docs(readme): update setup instructions
test(api): add integration tests
style(button): improve spacing

Types: feat, fix, refactor, docs, test, style, chore
```

---

## 📝 Summary

| Area | Key Points |
|------|-----------|
| **Structure** | Organized folders, clear file purposes |
| **Naming** | Consistent conventions (camelCase, UPPER_SNAKE_CASE) |
| **Imports** | Organized by type (React, local, constants) |
| **Constants** | No magic numbers, centralized values |
| **Components** | JSDoc, single responsibility, documented |
| **Utilities** | Clear purpose, well-documented functions |
| **State** | Use Context properly, memoize when needed |
| **Forms** | Validation with touched state |
| **Performance** | Memoize computations, use callbacks |
| **Errors** | Error boundaries, try-catch for async |
| **Testing** | Test utilities and components |
| **A11y** | Semantic HTML, ARIA labels |
| **Docs** | JSDoc for functions, comments for logic |
| **Commits** | Clear messages with type and scope |

---

## 🚀 Quick Reference

```jsx
// Import utilities
import { classNames } from '../utils/classNames.js'
import { formatRating } from '../utils/formatters.js'
import { isEmail } from '../utils/validators.js'
import { CONSTANT_NAME } from '../constants/index.js'

// Use classNames
className={classNames('base', isActive && 'active', customClass)}

// Use formatters
formatRating(4.5)
formatCurrency(520)
getSeatId(0, 5)

// Use validators
isEmail(email) // true/false
isValidPassword(password, minLength) // true/false

// Use constants
SEAT_TIERS.map(t => <option key={t.id}>{t.id}</option>)
Math.round(total * BOOKING_FEE_PERCENTAGE)
```

---

**Last Updated**: 2026-05-07
**Version**: 1.0
