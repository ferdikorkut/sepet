# Sepet Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Re-skin the existing Sepet app (5 pages, already built and working) with the visual design captured in `docs/superpowers/specs/2026-07-29-sepet-redesign-design.md` — new color/typography/shape tokens derived from a Stitch-generated design reference — without changing any application logic (routing, CartContext/reducer, Local Storage behavior).

**Architecture:** Same Vite + React + React Router + CartContext app. This plan only touches `src/index.css` (full rewrite), adds one new small components file for inline SVG icons, adds a `badge` field to the product data, and makes small, scoped JSX edits to each page/component to consume the new CSS classes and the three approved cosmetic additions (product badges, hero announcement tag, cosmetic order number).

**Tech Stack:** Adds `@fontsource/plus-jakarta-sans` (self-hosted, same pattern as the existing `@fontsource/inter`). No other new dependencies.

**Spec:** `docs/superpowers/specs/2026-07-29-sepet-redesign-design.md`

## Global Constraints

- No external font CDN requests — `Plus Jakarta Sans` is self-hosted via `@fontsource/plus-jakarta-sans`, exactly like the existing `@fontsource/inter` (spec: "Tipografi").
- No external icon font (Material Symbols or otherwise) — icons are hand-written inline SVG components in `src/components/icons.jsx` (spec: "İkonlar").
- No automated test suite — every task is verified manually by running `npm run dev` and checking behavior in the browser (carried over from the original project's Global Constraints).
- No new backend-requiring features: no search, category filters, price range, pagination, ratings/reviews, coupon codes, shipping cost/estimate, real order tracking, newsletter subscription, or mobile bottom nav (spec: "Kapsam Dışı (Redesign için)").
- `CartContext`'s reducer, action shapes, and the `sepet-cart` Local Storage key are unchanged — this plan is presentation-layer only.
- Routes are unchanged: `/`, `/urunler`, `/sepet`, `/siparis-tamamlandi`, `*` → 404.
- Exact color tokens, type choices, and radii are as specified in the spec's "Tasarım Token'ları" section — use the values below verbatim (they are transcribed from that section).

---

### Task 1: Design Tokens & Global Stylesheet Rewrite

**Files:**
- Modify: `package.json` (add `@fontsource/plus-jakarta-sans` dependency)
- Modify: `src/index.css` (full rewrite)

**Interfaces:**
- Consumes: nothing from prior work (this is the foundation the rest of the plan builds on).
- Produces: every CSS class name later tasks will use. Full list, so later tasks don't need to invent or guess names:
  - Buttons: `.btn`, `.btn-primary`, `.btn-secondary` (replaces the old `.cta-button` — every later task that used `.cta-button` switches to `className="btn btn-primary"` or `"btn btn-secondary"`)
  - Layout: `.page-content` (unchanged), `.site-header`, `.site-footer`
  - Header: `.logo`, `.cart-link`, `.cart-icon-wrap`, `.cart-icon`, `.cart-badge`
  - Hero: `.hero`, `.hero-tag`, `.featured-products`, `.section-underline`
  - Products page: `.products-page`
  - Product card: `.product-grid`, `.product-card`, `.product-image` (unchanged), `.product-price`, `.product-badge`, `.badge-new`, `.badge-discount`
  - Cart page: `.cart-page`, `.cart-empty`, `.cart-layout`, `.cart-list`, `.cart-item`, `.cart-item-info`, `.cart-item-quantity`, `.cart-item-total`, `.remove-button`, `.cart-summary`, `.cart-summary-row`, `.cart-summary-total`, `.cart-actions`
  - Order complete: `.order-complete-page`, `.order-complete-icon`, `.order-number-box`, `.order-number-label`, `.order-number-value`, `.order-complete-actions`
  - 404: `.not-found-page`, `.not-found-icon`

- [ ] **Step 1: Add the Plus Jakarta Sans dependency**

Modify `package.json` — add this line to `"dependencies"` (keep everything else in the file unchanged, alphabetical position doesn't matter):
```json
    "@fontsource/plus-jakarta-sans": "^5.0.20",
```

Run:
```bash
npm install
```
Expected: `node_modules/@fontsource/plus-jakarta-sans` exists, `package-lock.json` updates, no errors.

- [ ] **Step 2: Replace src/index.css entirely with the new stylesheet**

`src/index.css` (this replaces the ENTIRE current file content):
```css
@import '@fontsource/inter/400.css';
@import '@fontsource/inter/600.css';
@import '@fontsource/inter/700.css';
@import '@fontsource/plus-jakarta-sans/700.css';
@import '@fontsource/plus-jakarta-sans/800.css';

:root {
  --color-primary: #ab3500;
  --color-primary-container: #ff6b35;
  --color-on-primary: #ffffff;
  --color-secondary: #6b46c1;
  --color-on-secondary: #ffffff;
  --color-background: #f9f9ff;
  --color-surface: #ffffff;
  --color-surface-alt: #eef1fc;
  --color-on-surface: #121c2c;
  --color-on-surface-variant: #5b5f6b;
  --color-border: #e3e6f0;
  --color-error: #ba1a1a;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  background-color: var(--color-background);
  color: var(--color-on-surface);
}

h1,
h2,
h3 {
  font-family: 'Plus Jakarta Sans', 'Inter', system-ui, sans-serif;
  margin: 0;
}

a {
  color: inherit;
}

button {
  font-family: inherit;
  cursor: pointer;
}

/* Buttons */

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 24px;
  border-radius: 10px;
  font-weight: 700;
  font-size: 15px;
  text-decoration: none;
  border: none;
  transition: transform 0.15s ease, box-shadow 0.15s ease, background-color 0.15s ease;
}

.btn:active {
  transform: scale(0.97);
}

.btn-primary {
  background: var(--color-primary-container);
  color: var(--color-on-primary);
}

.btn-primary:hover {
  box-shadow: 0 8px 20px rgba(255, 107, 53, 0.3);
}

.btn-secondary {
  background: var(--color-surface);
  color: var(--color-on-surface);
  border: 1px solid var(--color-border);
}

.btn-secondary:hover {
  background: var(--color-surface-alt);
}

/* Layout */

.page-content {
  min-height: 70vh;
  padding: 32px;
  max-width: 1100px;
  margin: 0 auto;
}

/* Header */

.site-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 32px;
  background: var(--color-surface);
  border-bottom: 1px solid var(--color-border);
}

.site-header .logo {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-weight: 800;
  font-size: 22px;
  color: var(--color-primary);
}

.site-header nav {
  display: flex;
  gap: 24px;
  align-items: center;
}

.site-header nav a {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  text-decoration: none;
  font-weight: 600;
  font-size: 15px;
  color: var(--color-on-surface);
  padding-bottom: 4px;
  border-bottom: 2px solid transparent;
  transition: color 0.15s ease, border-color 0.15s ease;
}

.site-header nav a:hover {
  color: var(--color-primary);
}

.site-header nav a.active {
  color: var(--color-primary);
  border-bottom-color: var(--color-primary);
}

.cart-icon-wrap {
  position: relative;
  display: inline-flex;
}

.cart-icon {
  width: 20px;
  height: 20px;
}

.cart-badge {
  position: absolute;
  top: -6px;
  right: -8px;
  background: var(--color-primary-container);
  color: var(--color-on-primary);
  border-radius: 999px;
  font-size: 11px;
  font-weight: 700;
  min-width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 4px;
}

@media (max-width: 640px) {
  .site-header {
    padding: 12px 16px;
    flex-wrap: wrap;
    gap: 8px;
  }

  .site-header nav {
    gap: 14px;
  }
}

/* Footer */

.site-footer {
  text-align: center;
  padding: 24px;
  color: var(--color-on-surface-variant);
  font-size: 14px;
  background: var(--color-surface-alt);
  border-top: 1px solid var(--color-border);
}

/* Hero */

.hero {
  text-align: center;
  padding: 56px 0 48px;
}

.hero-tag {
  display: inline-block;
  background: rgba(255, 107, 53, 0.12);
  color: var(--color-primary);
  font-size: 13px;
  font-weight: 700;
  padding: 6px 16px;
  border-radius: 999px;
  margin-bottom: 16px;
}

.hero h1 {
  font-size: 40px;
  font-weight: 800;
  margin-bottom: 16px;
  letter-spacing: -0.02em;
}

.hero p {
  color: var(--color-on-surface-variant);
  font-size: 17px;
  margin-bottom: 28px;
  max-width: 480px;
  margin-left: auto;
  margin-right: auto;
}

.featured-products {
  margin-top: 8px;
}

.featured-products h2 {
  font-size: 26px;
  margin-bottom: 8px;
}

.section-underline {
  width: 64px;
  height: 4px;
  background: var(--color-primary-container);
  border-radius: 999px;
  margin-bottom: 28px;
}

/* Products page */

.products-page h1 {
  font-size: 30px;
  margin-bottom: 8px;
}

.products-page > p {
  color: var(--color-on-surface-variant);
  margin-bottom: 8px;
}

/* Product grid/card */

.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.product-card {
  position: relative;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 14px;
  padding: 20px;
  text-align: center;
  box-shadow: 0 4px 20px rgba(18, 28, 44, 0.06);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.product-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 28px rgba(18, 28, 44, 0.1);
}

.product-card .product-image {
  font-size: 48px;
  margin-bottom: 12px;
}

.product-card h3 {
  font-family: 'Inter', sans-serif;
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 8px;
}

.product-price {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-weight: 800;
  font-size: 20px;
  color: var(--color-primary);
  margin-bottom: 12px;
}

.product-card .btn {
  width: 100%;
  padding: 10px;
}

.product-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  font-size: 11px;
  font-weight: 700;
  color: #fff;
  padding: 4px 10px;
  border-radius: 999px;
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

.product-badge.badge-new {
  background: var(--color-primary-container);
}

.product-badge.badge-discount {
  background: var(--color-secondary);
}

/* Cart page */

.cart-page h1 {
  font-size: 30px;
  margin-bottom: 8px;
}

.cart-empty {
  text-align: center;
  padding: 64px 0;
}

.cart-empty p {
  color: var(--color-on-surface-variant);
  margin-bottom: 24px;
}

.cart-layout {
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: 32px;
  align-items: start;
  margin-top: 24px;
}

.cart-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.cart-item {
  display: grid;
  grid-template-columns: 60px 1fr auto auto auto;
  align-items: center;
  gap: 16px;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 14px;
  padding: 16px;
}

.cart-item .product-image {
  font-size: 32px;
  text-align: center;
}

.cart-item-info h4 {
  margin: 0 0 4px;
  font-family: 'Inter', sans-serif;
  font-size: 15px;
  font-weight: 600;
}

.cart-item-info p {
  margin: 0;
  color: var(--color-on-surface-variant);
  font-size: 14px;
}

.cart-item-quantity {
  display: flex;
  align-items: center;
  gap: 8px;
}

.cart-item-quantity button {
  width: 28px;
  height: 28px;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  background: var(--color-surface-alt);
  font-weight: 700;
}

.cart-item-total {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-weight: 700;
  color: var(--color-on-surface);
}

.remove-button {
  border: none;
  background: none;
  color: var(--color-error);
  font-weight: 600;
  font-size: 14px;
}

.cart-summary {
  background: var(--color-surface-alt);
  border-radius: 14px;
  padding: 24px;
  position: sticky;
  top: 24px;
}

.cart-summary h2 {
  font-size: 20px;
  margin-bottom: 16px;
}

.cart-summary-row {
  display: flex;
  justify-content: space-between;
  font-size: 15px;
  padding: 8px 0;
  color: var(--color-on-surface-variant);
}

.cart-summary-total {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  border-top: 1px solid var(--color-border);
  margin-top: 8px;
  padding-top: 16px;
  margin-bottom: 20px;
}

.cart-summary-total span:first-child {
  font-weight: 600;
  color: var(--color-on-surface);
}

.cart-summary-total span:last-child {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-weight: 800;
  font-size: 22px;
  color: var(--color-primary);
}

.cart-actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.cart-actions .btn {
  width: 100%;
}

@media (max-width: 768px) {
  .cart-layout {
    grid-template-columns: 1fr;
  }

  .cart-item {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
  }

  .cart-item .product-image {
    flex: 0 0 48px;
  }

  .cart-item-info {
    flex: 1 1 160px;
  }

  .cart-item-quantity,
  .cart-item-total,
  .remove-button {
    flex: 0 0 auto;
  }
}

/* Order complete page */

.order-complete-page {
  text-align: center;
  padding: 56px 0;
}

.order-complete-icon {
  width: 96px;
  height: 96px;
  border-radius: 999px;
  background: rgba(255, 107, 53, 0.12);
  color: var(--color-primary-container);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 24px;
}

.order-complete-icon svg {
  width: 48px;
  height: 48px;
}

.order-complete-page h1 {
  font-size: 32px;
  margin-bottom: 12px;
}

.order-complete-page p {
  color: var(--color-on-surface-variant);
  margin-bottom: 24px;
}

.order-number-box {
  display: inline-block;
  background: var(--color-surface-alt);
  border-radius: 14px;
  padding: 16px 28px;
  margin-bottom: 28px;
}

.order-number-label {
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-on-surface-variant);
  margin-bottom: 4px;
}

.order-number-value {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-weight: 800;
  font-size: 20px;
  color: var(--color-on-surface);
}

.order-complete-actions {
  display: flex;
  gap: 16px;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
}

/* 404 page */

.not-found-page {
  text-align: center;
  padding: 72px 0;
}

.not-found-icon {
  width: 64px;
  height: 64px;
  color: var(--color-primary-container);
  margin: 0 auto 16px;
}

.not-found-page h1 {
  font-size: 64px;
  font-weight: 800;
  color: var(--color-primary);
  margin-bottom: 8px;
}

.not-found-page p {
  color: var(--color-on-surface-variant);
  margin-bottom: 24px;
}
```

- [ ] **Step 3: Manual verification**

Run `npm run build` — must succeed (this confirms the `@fontsource/plus-jakarta-sans` import paths resolve). Then run `npm run dev` and open the browser. The page will look visually broken/unstyled in places until later tasks update each page's JSX to use the new class names — that's expected at this stage. Confirm there are no console errors and no 404s for the font CSS imports (check the Network tab, filter "font", confirm requests resolve locally, no `fonts.googleapis.com`/`fonts.gstatic.com`).

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json src/index.css
git commit -m "feat: add redesign color/typography tokens and rewrite global stylesheet"
```

---

### Task 2: Inline SVG Icon Components

**Files:**
- Create: `src/components/icons.jsx`

**Interfaces:**
- Produces: three named exports, each a function component accepting standard SVG props (so callers can pass `className`): `CartIcon(props)`, `CheckIcon(props)`, `BasketIcon(props)`. All render an `<svg>` with `fill="none" stroke="currentColor"` so their color follows CSS `color`/`currentColor` from the parent.

- [ ] **Step 1: Write the icon components**

`src/components/icons.jsx`:
```jsx
export function CartIcon(props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="9" cy="21" r="1" />
      <circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
    </svg>
  );
}

export function CheckIcon(props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

export function BasketIcon(props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M6 9h12l-1.5 9a2 2 0 0 1-2 1.7H9.5a2 2 0 0 1-2-1.7L6 9Z" />
      <path d="M9 9V7a3 3 0 0 1 6 0v2" />
    </svg>
  );
}
```

- [ ] **Step 2: Manual verification**

Temporarily import and render `<CartIcon />` inside `src/App.jsx`'s existing placeholder content (or any page), run `npm run dev`, confirm an outlined cart icon renders with no console errors, then remove the temporary import/render.

- [ ] **Step 3: Commit**

```bash
git add src/components/icons.jsx
git commit -m "feat: add inline SVG icon components"
```

---

### Task 3: Header Restyle

**Files:**
- Modify: `src/components/Header.jsx`

**Interfaces:**
- Consumes: `CartIcon` from `src/components/icons.jsx` (Task 2); CSS classes `.cart-icon-wrap`, `.cart-icon`, `.cart-badge` from Task 1.
- Produces: nothing new consumed by later tasks (Header is a leaf in the component tree).

- [ ] **Step 1: Update Header to render the cart icon**

`src/components/Header.jsx`:
```jsx
import { NavLink } from 'react-router-dom';
import { useCart } from '../hooks/useCart.js';
import { CartIcon } from './icons.jsx';

export default function Header() {
  const { totalItems } = useCart();

  return (
    <header className="site-header">
      <div className="logo">Sepet</div>
      <nav>
        <NavLink to="/" end>Ana Sayfa</NavLink>
        <NavLink to="/urunler">Ürünler</NavLink>
        <NavLink to="/sepet" className="cart-link">
          <span className="cart-icon-wrap">
            <CartIcon className="cart-icon" />
            {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
          </span>
          Sepet
        </NavLink>
      </nav>
    </header>
  );
}
```

- [ ] **Step 2: Manual verification**

Run `npm run dev`. Confirm: logo "Sepet" renders in the coral-brown primary color and bold display font; nav links show a colored underline only on the active route; the cart icon renders next to the "Sepet" label; adding an item to the cart (from `/urunler`, tested after Task 4) shows a small coral badge with the count at the icon's top-right corner.

- [ ] **Step 3: Commit**

```bash
git add src/components/Header.jsx
git commit -m "feat: restyle Header with cart icon and new design tokens"
```

---

### Task 4: Product Badges (Data + ProductCard)

**Files:**
- Modify: `src/data/products.js`
- Modify: `src/components/ProductCard.jsx`

**Interfaces:**
- Produces: `products` entries now optionally include `badge: 'Yeni' | 'İndirim'` (omitted/undefined for products without a badge). `ProductCard` renders this if present. This field flows into cart items too when added (harmless, same as the pre-existing `category` field — not read anywhere else).

- [ ] **Step 1: Add badge field to two products**

`src/data/products.js` (full file — only the `badge` additions on the Kablosuz Kulaklık and Akıllı Saat entries and İndirim on Bluetooth Hoparlör are new; everything else is unchanged):
```js
export const products = [
  { id: 1, name: 'Kablosuz Kulaklık', price: 899.90, image: '🎧', category: 'Elektronik', badge: 'Yeni' },
  { id: 2, name: 'Akıllı Saat', price: 1499.50, image: '⌚', category: 'Elektronik', badge: 'Yeni' },
  { id: 3, name: 'Sırt Çantası', price: 649.00, image: '🎒', category: 'Aksesuar' },
  { id: 4, name: 'Termos', price: 249.90, image: '🧊', category: 'Ev' },
  { id: 5, name: 'Masaüstü Lamba', price: 349.00, image: '💡', category: 'Ev' },
  { id: 6, name: 'Bluetooth Hoparlör', price: 799.90, image: '🔊', category: 'Elektronik', badge: 'İndirim' },
  { id: 7, name: 'Güneş Gözlüğü', price: 459.00, image: '🕶️', category: 'Aksesuar' },
  { id: 8, name: 'Kahve Makinesi', price: 1899.00, image: '☕', category: 'Ev' },
];
```

- [ ] **Step 2: Render the badge in ProductCard**

`src/components/ProductCard.jsx`:
```jsx
import { useCart } from '../hooks/useCart.js';

export default function ProductCard({ product }) {
  const { dispatch } = useCart();

  return (
    <div className="product-card">
      {product.badge && (
        <span
          className={`product-badge ${product.badge === 'Yeni' ? 'badge-new' : 'badge-discount'}`}
        >
          {product.badge}
        </span>
      )}
      <div className="product-image" aria-hidden="true">{product.image}</div>
      <h3>{product.name}</h3>
      <p className="product-price">{product.price.toFixed(2)} TL</p>
      <button className="btn btn-primary" onClick={() => dispatch({ type: 'ADD_ITEM', product })}>
        Sepete Ekle
      </button>
    </div>
  );
}
```

- [ ] **Step 3: Manual verification**

Run `npm run dev`, go to `/urunler`. Confirm: "Kablosuz Kulaklık" and "Akıllı Saat" show a coral "Yeni" pill in the top-right corner; "Bluetooth Hoparlör" shows a purple "İndirim" pill; the other 5 products show no badge. Confirm "Sepete Ekle" is now a filled coral button matching `.btn-primary`. Add an item to the cart and confirm it still works (dispatch unaffected).

- [ ] **Step 4: Commit**

```bash
git add src/data/products.js src/components/ProductCard.jsx
git commit -m "feat: add product badges and restyle ProductCard"
```

---

### Task 5: Home Page Hero Announcement Tag

**Files:**
- Modify: `src/pages/Home.jsx`

**Interfaces:**
- Consumes: `.hero-tag`, `.section-underline`, `.btn .btn-primary` CSS classes from Task 1; `ProductCard` from Task 4 (already updated, no change needed here).
- Produces: nothing consumed by later tasks.

- [ ] **Step 1: Update Home.jsx**

`src/pages/Home.jsx`:
```jsx
import { Link } from 'react-router-dom';
import { products } from '../data/products.js';
import ProductCard from '../components/ProductCard.jsx';

const featured = products.slice(0, 4);

export default function Home() {
  return (
    <div className="home-page">
      <section className="hero">
        <span className="hero-tag">Yeni Ürünler Geldi</span>
        <h1>Sepet'e Hoş Geldiniz</h1>
        <p>İhtiyacınız olan ürünleri kolayca keşfedin ve sepete ekleyin.</p>
        <Link to="/urunler" className="btn btn-primary">Ürünleri Gör</Link>
      </section>
      <section className="featured-products">
        <h2>Öne Çıkan Ürünler</h2>
        <div className="section-underline" />
        <div className="product-grid">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}
```

- [ ] **Step 2: Manual verification**

Run `npm run dev`, go to `/`. Confirm: a small coral pill reading "Yeni Ürünler Geldi" appears above the hero heading; the heading uses the bold display font; "Ürünleri Gör" is a filled coral button; a short coral underline bar appears beneath "Öne Çıkan Ürünler"; the featured grid shows 4 `ProductCard`s with the new styling (including badges on the ones that have them).

- [ ] **Step 3: Commit**

```bash
git add src/pages/Home.jsx
git commit -m "feat: add hero announcement tag and section underline to Home"
```

---

### Task 6: Products Page Intro Copy

**Files:**
- Modify: `src/pages/Products.jsx`

**Interfaces:**
- Consumes: `.products-page` CSS class from Task 1.
- Produces: nothing consumed by later tasks.

- [ ] **Step 1: Add an intro paragraph**

`src/pages/Products.jsx`:
```jsx
import { products } from '../data/products.js';
import ProductCard from '../components/ProductCard.jsx';

export default function Products() {
  return (
    <div className="products-page">
      <h1>Ürünler</h1>
      <p>Özenle seçilmiş ürünleri keşfedin.</p>
      <div className="product-grid">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Manual verification**

Run `npm run dev`, go to `/urunler`. Confirm the page heading is followed by the short muted-gray intro sentence, then the product grid as before.

- [ ] **Step 3: Commit**

```bash
git add src/pages/Products.jsx
git commit -m "feat: add intro copy to Products page"
```

---

### Task 7: Cart Page Two-Column Redesign

**Files:**
- Modify: `src/pages/Cart.jsx`
- Modify: `src/components/CartItem.jsx`

**Interfaces:**
- Consumes: `useCart()` (`cart`, `dispatch`, `totalPrice`) — unchanged shape from `CartContext`. CSS classes `.cart-layout`, `.cart-summary`, `.cart-summary-row`, `.cart-summary-total`, `.cart-actions`, `.btn`/`.btn-primary`/`.btn-secondary` from Task 1.
- Produces: nothing consumed by later tasks.

- [ ] **Step 1: Update CartItem's remove button class (no structural change, already styled by Task 1's `.cart-item` rules)**

`src/components/CartItem.jsx` (unchanged from its current version — included here for completeness so the file is verified, not because anything needs to change):
```jsx
import { useCart } from '../hooks/useCart.js';

export default function CartItem({ item }) {
  const { dispatch } = useCart();
  const lineTotal = item.price * item.quantity;

  return (
    <div className="cart-item">
      <div className="product-image" aria-hidden="true">{item.image}</div>
      <div className="cart-item-info">
        <h4>{item.name}</h4>
        <p>{item.price.toFixed(2)} TL</p>
      </div>
      <div className="cart-item-quantity">
        <button onClick={() => dispatch({ type: 'DECREASE_QUANTITY', id: item.id })}>-</button>
        <span>{item.quantity}</span>
        <button onClick={() => dispatch({ type: 'INCREASE_QUANTITY', id: item.id })}>+</button>
      </div>
      <p className="cart-item-total">{lineTotal.toFixed(2)} TL</p>
      <button
        className="remove-button"
        onClick={() => dispatch({ type: 'REMOVE_ITEM', id: item.id })}
      >
        Sil
      </button>
    </div>
  );
}
```

- [ ] **Step 2: Rebuild the Cart page as a two-column layout**

`src/pages/Cart.jsx`:
```jsx
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart.js';
import CartItem from '../components/CartItem.jsx';

export default function Cart() {
  const { cart, dispatch, totalPrice } = useCart();
  const navigate = useNavigate();

  if (cart.length === 0) {
    return (
      <div className="cart-page cart-empty">
        <h1>Sepetiniz</h1>
        <p>Sepetiniz boş.</p>
        <Link to="/urunler" className="btn btn-primary">Alışverişe Devam Et</Link>
      </div>
    );
  }

  function handleCompleteOrder() {
    dispatch({ type: 'CLEAR_CART' });
    navigate('/siparis-tamamlandi');
  }

  return (
    <div className="cart-page">
      <h1>Sepetiniz</h1>
      <div className="cart-layout">
        <div className="cart-list">
          {cart.map((item) => (
            <CartItem key={item.id} item={item} />
          ))}
        </div>
        <div className="cart-summary">
          <h2>Sipariş Özeti</h2>
          <div className="cart-summary-row">
            <span>Ara Toplam</span>
            <span>{totalPrice.toFixed(2)} TL</span>
          </div>
          <div className="cart-summary-total">
            <span>Genel Toplam</span>
            <span>{totalPrice.toFixed(2)} TL</span>
          </div>
          <div className="cart-actions">
            <button className="btn btn-primary" onClick={handleCompleteOrder}>Siparişi Tamamla</button>
            <Link to="/urunler" className="btn btn-secondary">Alışverişe Devam Et</Link>
            <button className="btn btn-secondary" onClick={() => dispatch({ type: 'CLEAR_CART' })}>Sepeti Temizle</button>
          </div>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Manual verification**

Run `npm run dev`. With an empty cart, go to `/sepet` — confirm the empty state shows with a filled coral "Alışverişe Devam Et" button. Add 2-3 products, go to `/sepet` — confirm a two-column layout: left side has the item rows (new card styling, rounded corners), right side has a "Sipariş Özeti" box showing "Ara Toplam" and "Genel Toplam" with the same value, and three stacked buttons ("Siparişi Tamamla" filled coral, the other two outlined). Confirm `+`/`-`/`Sil`/`Sepeti Temizle`/`Siparişi Tamamla` all still work exactly as before (this task only changes markup/classes, not any dispatch logic). Resize the browser to a narrow width (e.g. 375px) and confirm the two columns stack vertically and the cart item rows wrap without overlapping text.

- [ ] **Step 4: Commit**

```bash
git add src/pages/Cart.jsx src/components/CartItem.jsx
git commit -m "feat: redesign Cart page as a two-column layout with order summary"
```

---

### Task 8: Order Complete Page (Icon + Cosmetic Order Number)

**Files:**
- Modify: `src/pages/OrderComplete.jsx`

**Interfaces:**
- Consumes: `CheckIcon` from `src/components/icons.jsx` (Task 2). CSS classes `.order-complete-icon`, `.order-number-box`, `.order-number-label`, `.order-number-value` from Task 1.
- Produces: nothing consumed by later tasks. The order number is generated client-side with `useState`'s lazy initializer and is purely cosmetic — it is not persisted, not derived from the cart, and does not represent a real order-tracking system (per spec).

- [ ] **Step 1: Update OrderComplete.jsx**

`src/pages/OrderComplete.jsx`:
```jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckIcon } from '../components/icons.jsx';

function generateOrderNumber() {
  const random = Math.floor(100000 + Math.random() * 900000);
  return `#SPT-${random}`;
}

export default function OrderComplete() {
  const [orderNumber] = useState(generateOrderNumber);

  return (
    <div className="order-complete-page">
      <div className="order-complete-icon">
        <CheckIcon />
      </div>
      <h1>Siparişiniz Alındı!</h1>
      <p>Teşekkür ederiz, siparişiniz başarıyla oluşturuldu.</p>
      <div className="order-number-box">
        <div className="order-number-label">Sipariş Numarası</div>
        <div className="order-number-value">{orderNumber}</div>
      </div>
      <div className="order-complete-actions">
        <Link to="/" className="btn btn-primary">Ana Sayfaya Dön</Link>
        <Link to="/urunler" className="btn btn-secondary">Alışverişe Devam Et</Link>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Manual verification**

Run `npm run dev`, complete an order from the cart. Confirm: a circular coral-tinted badge with a checkmark icon appears above the heading; below the message, a box shows "SİPARİŞ NUMARASI" and a value like `#SPT-482913`; reloading the page (or completing another order) shows a different random number each time a fresh `OrderComplete` mounts. Confirm both buttons still navigate correctly (`/` and `/urunler`).

- [ ] **Step 3: Commit**

```bash
git add src/pages/OrderComplete.jsx
git commit -m "feat: add check icon and cosmetic order number to Order Complete page"
```

---

### Task 9: 404 Page (Icon)

**Files:**
- Modify: `src/pages/NotFound.jsx`

**Interfaces:**
- Consumes: `BasketIcon` from `src/components/icons.jsx` (Task 2). CSS class `.not-found-icon` from Task 1.
- Produces: nothing consumed by later tasks.

- [ ] **Step 1: Update NotFound.jsx**

`src/pages/NotFound.jsx`:
```jsx
import { Link } from 'react-router-dom';
import { BasketIcon } from '../components/icons.jsx';

export default function NotFound() {
  return (
    <div className="not-found-page">
      <BasketIcon className="not-found-icon" />
      <h1>404</h1>
      <p>Aradığınız sayfa bulunamadı.</p>
      <Link to="/" className="btn btn-primary">Ana Sayfaya Dön</Link>
    </div>
  );
}
```

- [ ] **Step 2: Manual verification**

Run `npm run dev`, navigate to `/rastgele-bir-yol`. Confirm a coral outlined basket icon appears above the "404" heading (now in the primary coral-brown color and bold display font), and the "Ana Sayfaya Dön" button is a filled coral button that navigates to `/`.

- [ ] **Step 3: Commit**

```bash
git add src/pages/NotFound.jsx
git commit -m "feat: add basket icon to 404 page"
```

---

### Task 10: Full Visual & Functional QA Pass

**Files:** none (verification only).

**Interfaces:** none — this task exercises the full redesigned app built by Tasks 1-9.

- [ ] **Step 1: Clear state and start fresh**

Run `npm run dev`. Clear the `sepet-cart` Local Storage key if present. Reload.

- [ ] **Step 2: Visual pass on all 5 pages**

For each of `/`, `/urunler`, `/sepet` (with 2+ items added), `/siparis-tamamlandi` (reached via completing an order), and an unknown path (404): confirm the new color palette (coral/purple/off-white background), `Plus Jakarta Sans` on headings/prices (inspect computed `font-family` in DevTools on an `<h1>` and a `.product-price` element — should resolve to "Plus Jakarta Sans"), rounded cards/buttons, and that Header + Footer render consistently with the new styling on every page.

- [ ] **Step 3: Functional regression pass (logic must be unchanged)**

Repeat the original project's functional QA checklist to confirm the redesign didn't break anything: add 3 different products (one twice) from `/urunler`, confirm the header badge shows the correct total; go to `/sepet`, confirm quantities/line totals/`Genel Toplam` are correct; use `+`/`-` and confirm live updates; decrease a row to 0 and confirm it's removed; click "Sil" on another row and confirm immediate removal; reload the page and confirm the remaining cart persists (Local Storage `sepet-cart` still works — this exercises the `getInitialCart` lazy initializer, untouched by this plan); click "Siparişi Tamamla" and confirm the cart clears, the badge disappears, and you land on `/siparis-tamamlandi` with a cosmetic order number and working action buttons; visit an unknown path and confirm the 404 page and its "Ana Sayfaya Dön" link work.

- [ ] **Step 4: Font network check**

Open DevTools → Network tab, filter by "font", reload `/`. Confirm requests only for locally-bundled Inter and Plus Jakarta Sans `.woff2` files (served from the app's own origin) — zero requests to `fonts.googleapis.com` or `fonts.gstatic.com`.

- [ ] **Step 5: Fix any discrepancies found**

If any step in Steps 2-4 fails, fix the relevant task's code before proceeding — do not move on with a known-broken flow.

- [ ] **Step 6: Final commit**

```bash
git add -A
git commit -m "chore: final visual and functional QA pass for Sepet redesign" --allow-empty
```
