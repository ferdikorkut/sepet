# Sepet Redesign Phase 2 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Close the gap between the shipped redesign (2026-07-29) and the Stitch design reference: rework the Home hero into a two-column layout, and restore four previously-scoped-out features (real client-side search, static product ratings, a decorative newsletter box, a mobile bottom nav) — all without touching `CartContext`, routing, or adding new dependencies.

**Architecture:** Same Vite + React + React Router + CartContext app. Adds two new small components (`Newsletter.jsx`, `MobileNav.jsx`), extends `icons.jsx` with four more inline SVGs, extends `products.js` with `rating`/`reviewCount`, adds a `useSearchParams`-driven filter to the Products page, and restructures `Header.jsx` and `Home.jsx`. All search/filter state lives in the URL (via React Router) or local component state — no new state management library, no backend.

**Tech Stack:** No new dependencies. Uses `react-router-dom`'s existing `useNavigate`, `useLocation`, `useSearchParams`.

**Spec:** `docs/superpowers/specs/2026-07-30-sepet-redesign-phase2-design.md`

## Global Constraints

- No automated test suite — every task is verified manually / via live-browser Playwright checks, consistent with every prior task in this project.
- No new npm dependencies.
- `CartContext.jsx`'s reducer, action shapes, and the `sepet-cart` Local Storage key are unchanged — this plan is presentation/interaction-layer only, same rule as Phase 1.
- Routes are unchanged: `/`, `/urunler`, `/sepet`, `/siparis-tamamlandi`, `*` → 404. (Query strings on `/urunler`, e.g. `/urunler?q=...`, are the same route — React Router treats query params separately from the route path.)
- The newsletter subscription is **intentionally fake** — no network request, no persistence, resets on reload. Do not "fix" this into a real integration.
- The order number on `/siparis-tamamlandi` (from Phase 1) is unrelated to this plan and must not be touched.
- No category filter, price range, or pagination — only name-based search is in scope (spec: "Kapsam Dışı").

---

### Task 1: Extend Icon Components

**Files:**
- Modify: `src/components/icons.jsx`

**Interfaces:**
- Produces four new named exports, added alongside the existing `CartIcon`/`CheckIcon`/`BasketIcon`: `SearchIcon(props)`, `StarIcon(props)`, `HomeIcon(props)`, `GridIcon(props)`.

- [ ] **Step 1: Append the four new icon components**

Append to the end of `src/components/icons.jsx` (do not modify the existing three functions):
```jsx

export function SearchIcon(props) {
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
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

export function StarIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" stroke="none" {...props}>
      <path d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.1 6.6L12 17.6l-5.8 3 1.1-6.6L2.5 9.4l6.6-.9L12 2.5Z" />
    </svg>
  );
}

export function HomeIcon(props) {
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
      <path d="M3 10.5 12 3l9 7.5" />
      <path d="M5 9.5V21h14V9.5" />
    </svg>
  );
}

export function GridIcon(props) {
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
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  );
}
```

- [ ] **Step 2: Manual verification**

Run `npm run build` — must succeed. Temporarily render `<StarIcon />` and `<SearchIcon />` in `App.jsx`'s placeholder to confirm no syntax errors, then remove.

- [ ] **Step 3: Commit**

```bash
git add src/components/icons.jsx
git commit -m "feat: add search, star, home, and grid icon components"
```

---

### Task 2: Stylesheet Additions

**Files:**
- Modify: `src/index.css`

**Interfaces:**
- Produces every new CSS class this plan's later tasks consume: `.header-right`, `.search-form`, `.search-icon`, `.search-input`, `.hero-content`, `.hero-actions`, `.hero-visual`, `.hero-visual-accent`, `.hero-visual-accent-1`, `.hero-visual-accent-2`, `.featured-header`, `.see-all-link`, `.product-rating`, `.star-icon`, `.search-result-info`, `.no-results`, `.newsletter`, `.newsletter-text`, `.newsletter-form`, `.newsletter-success`, `.mobile-nav`, `.mobile-nav-link`, `.mobile-nav-icon`.
- Modifies existing `.hero`, `.hero-tag`, `.hero h1`, `.hero p` rules (restructures from single-column centered to two-column) and the `@media (max-width: 640px)` block under `.site-header` (adds hiding rules for `nav`/`.search-form`, adds `.page-content` bottom padding).

- [ ] **Step 1: Replace the existing hero rules**

In `src/index.css`, find this block (from Phase 1):
```css
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
```

Replace it with:
```css
html {
  scroll-behavior: smooth;
}

.hero {
  display: grid;
  grid-template-columns: 1.1fr 1fr;
  gap: 48px;
  align-items: center;
  padding: 64px 0;
  text-align: left;
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
}

.hero-actions {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.hero-visual {
  position: relative;
  aspect-ratio: 1;
  border-radius: 24px;
  background: linear-gradient(135deg, rgba(255, 107, 53, 0.12), rgba(107, 70, 193, 0.08));
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 96px;
}

.hero-visual-accent {
  position: absolute;
  font-size: 40px;
  background: var(--color-surface);
  border-radius: 999px;
  padding: 12px;
  box-shadow: 0 8px 24px rgba(18, 28, 44, 0.12);
}

.hero-visual-accent-1 {
  top: 16px;
  right: -16px;
}

.hero-visual-accent-2 {
  bottom: 16px;
  left: -16px;
}

@media (max-width: 768px) {
  .hero {
    grid-template-columns: 1fr;
    text-align: center;
    padding: 40px 0;
  }

  .hero-actions {
    justify-content: center;
  }

  .hero-visual {
    max-width: 280px;
    margin: 0 auto;
  }
}
```

- [ ] **Step 2: Add featured-products header + see-all link rules**

Find:
```css
.featured-products {
  margin-top: 8px;
}

.featured-products h2 {
  font-size: 26px;
  margin-bottom: 8px;
}
```

Replace with:
```css
.featured-products {
  margin-top: 8px;
}

.featured-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 8px;
  gap: 16px;
  flex-wrap: wrap;
}

.featured-header h2 {
  font-size: 26px;
}

.see-all-link {
  color: var(--color-primary);
  font-weight: 700;
  text-decoration: none;
  font-size: 14px;
  white-space: nowrap;
}

.see-all-link:hover {
  text-decoration: underline;
}
```

- [ ] **Step 3: Add search form, product rating, and search-result CSS**

Append to `src/index.css`:
```css
/* Header search */

.header-right {
  display: flex;
  align-items: center;
  gap: 24px;
}

.search-form {
  display: flex;
  align-items: center;
  gap: 8px;
  background: var(--color-surface-alt);
  border: 1px solid var(--color-border);
  border-radius: 999px;
  padding: 8px 16px;
}

.search-icon {
  width: 18px;
  height: 18px;
  color: var(--color-on-surface-variant);
  flex-shrink: 0;
}

.search-input {
  border: none;
  background: transparent;
  outline: none;
  font-size: 14px;
  width: 160px;
  color: var(--color-on-surface);
  font-family: inherit;
}

/* Product rating */

.product-rating {
  display: flex;
  align-items: center;
  gap: 4px;
  color: var(--color-on-surface-variant);
  font-size: 13px;
  margin-bottom: 8px;
  justify-content: center;
}

.star-icon {
  width: 14px;
  height: 14px;
  color: #f5a623;
}

/* Search results (Products page) */

.search-result-info {
  color: var(--color-on-surface-variant);
  margin-bottom: 16px;
}

.search-result-info a {
  color: var(--color-primary);
  font-weight: 600;
}

.no-results {
  color: var(--color-on-surface-variant);
  padding: 48px 0;
  text-align: center;
}
```

- [ ] **Step 4: Add newsletter CSS**

Append to `src/index.css`:
```css
/* Newsletter */

.newsletter {
  margin-top: 48px;
  background: var(--color-on-surface);
  border-radius: 24px;
  padding: 40px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
}

.newsletter-text h2 {
  color: var(--color-background);
  font-size: 24px;
  margin-bottom: 8px;
}

.newsletter-text p {
  color: rgba(249, 249, 255, 0.7);
  max-width: 320px;
}

.newsletter-form {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.newsletter-form input {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  padding: 12px 20px;
  color: #ffffff;
  min-width: 240px;
  font-family: inherit;
  font-size: 14px;
}

.newsletter-form input::placeholder {
  color: rgba(255, 255, 255, 0.6);
}

.newsletter-success {
  font-weight: 600;
  color: var(--color-primary-container);
}
```

- [ ] **Step 5: Add mobile nav CSS and update the mobile media query**

Append to `src/index.css`:
```css
/* Mobile bottom nav */

.mobile-nav {
  display: none;
}

.mobile-nav-link {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  font-size: 11px;
  font-weight: 600;
  color: var(--color-on-surface-variant);
  text-decoration: none;
}

.mobile-nav-link.active {
  color: var(--color-primary);
}

.mobile-nav-icon {
  width: 22px;
  height: 22px;
}

@media (max-width: 640px) {
  .mobile-nav {
    display: flex;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: var(--color-surface);
    border-top: 1px solid var(--color-border);
    justify-content: space-around;
    padding: 8px 0;
    z-index: 40;
  }
}
```

Then find the EXISTING `@media (max-width: 640px)` block under the Header section (from Phase 1):
```css
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
```

Replace it with:
```css
@media (max-width: 640px) {
  .site-header nav,
  .search-form {
    display: none;
  }

  .site-header {
    justify-content: center;
    padding: 12px 16px;
  }

  .page-content {
    padding-bottom: 88px;
  }
}
```

(This is a separate, distinct `@media (max-width: 640px)` block from the one added in Step 5 for `.mobile-nav` — having two separate `@media` blocks at the same breakpoint in one stylesheet is valid CSS and fine here; do not try to merge them.)

- [ ] **Step 6: Manual verification**

Run `npm run build` — must succeed. Run `npm run dev`; the app will look partially incomplete until later tasks add the JSX that consumes these classes — that's expected.

- [ ] **Step 7: Commit**

```bash
git add src/index.css
git commit -m "feat: add stylesheet rules for search, ratings, hero rework, newsletter, and mobile nav"
```

---

### Task 3: Product Ratings (Data + ProductCard)

**Files:**
- Modify: `src/data/products.js`
- Modify: `src/components/ProductCard.jsx`

**Interfaces:**
- Produces: every `products` entry now has `rating: number` and `reviewCount: number`. `ProductCard` renders a rating row using `StarIcon` from `src/components/icons.jsx`.

- [ ] **Step 1: Add rating and reviewCount to every product**

Replace `src/data/products.js` entirely with:
```js
export const products = [
  { id: 1, name: 'Kablosuz Kulaklık', price: 899.90, image: '🎧', category: 'Elektronik', badge: 'Yeni', rating: 4.9, reviewCount: 124 },
  { id: 2, name: 'Akıllı Saat', price: 1499.50, image: '⌚', category: 'Elektronik', badge: 'Yeni', rating: 4.7, reviewCount: 210 },
  { id: 3, name: 'Sırt Çantası', price: 649.00, image: '🎒', category: 'Aksesuar', rating: 4.6, reviewCount: 58 },
  { id: 4, name: 'Termos', price: 249.90, image: '🧊', category: 'Ev', rating: 4.5, reviewCount: 32 },
  { id: 5, name: 'Masaüstü Lamba', price: 349.00, image: '💡', category: 'Ev', rating: 4.9, reviewCount: 45 },
  { id: 6, name: 'Bluetooth Hoparlör', price: 799.90, image: '🔊', category: 'Elektronik', badge: 'İndirim', rating: 4.4, reviewCount: 76 },
  { id: 7, name: 'Güneş Gözlüğü', price: 459.00, image: '🕶️', category: 'Aksesuar', rating: 4.8, reviewCount: 89 },
  { id: 8, name: 'Kahve Makinesi', price: 1899.00, image: '☕', category: 'Ev', rating: 4.6, reviewCount: 61 },
];
```

- [ ] **Step 2: Render the rating in ProductCard**

`src/components/ProductCard.jsx`:
```jsx
import { useCart } from '../hooks/useCart.js';
import { StarIcon } from './icons.jsx';

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
      <div className="product-rating">
        <StarIcon className="star-icon" />
        <span>{product.rating} ({product.reviewCount})</span>
      </div>
      <p className="product-price">{product.price.toFixed(2)} TL</p>
      <button className="btn btn-primary" onClick={() => dispatch({ type: 'ADD_ITEM', product })}>
        Sepete Ekle
      </button>
    </div>
  );
}
```

- [ ] **Step 3: Manual verification**

Run `npm run dev`, go to `/urunler`. Confirm every product card shows a small orange star icon followed by "rating (reviewCount)" (e.g. "4.9 (124)") between the product name and the price. Confirm "Sepete Ekle" still dispatches correctly.

- [ ] **Step 4: Commit**

```bash
git add src/data/products.js src/components/ProductCard.jsx
git commit -m "feat: add static product ratings"
```

---

### Task 4: Header Search Form

**Files:**
- Modify: `src/components/Header.jsx`

**Interfaces:**
- Consumes: `SearchIcon` from `src/components/icons.jsx` (Task 1). CSS classes `.header-right`, `.search-form`, `.search-icon`, `.search-input` (Task 2). `useNavigate`, `useLocation` from `react-router-dom`.
- Produces: navigating to `/urunler?q=<value>` on search submit — Task 5 (Products page) is the consumer of this query param.

- [ ] **Step 1: Restructure Header with a search form**

`src/components/Header.jsx`:
```jsx
import { useEffect, useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart.js';
import { CartIcon, SearchIcon } from './icons.jsx';

export default function Header() {
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (location.pathname === '/urunler') {
      const params = new URLSearchParams(location.search);
      setQuery(params.get('q') || '');
    } else {
      setQuery('');
    }
  }, [location.pathname, location.search]);

  function handleSearchSubmit(event) {
    event.preventDefault();
    const trimmed = query.trim();
    navigate(trimmed ? `/urunler?q=${encodeURIComponent(trimmed)}` : '/urunler');
  }

  return (
    <header className="site-header">
      <div className="logo">Sepet</div>
      <div className="header-right">
        <nav>
          <NavLink to="/" end>Ana Sayfa</NavLink>
          <NavLink to="/urunler">Ürünler</NavLink>
          <NavLink to="/sepet">
            <span className="cart-icon-wrap">
              <CartIcon className="cart-icon" />
              {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
            </span>
            Sepet
          </NavLink>
        </nav>
        <form className="search-form" onSubmit={handleSearchSubmit}>
          <SearchIcon className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Ürün ara..."
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </form>
      </div>
    </header>
  );
}
```

- [ ] **Step 2: Manual verification**

Run `npm run dev`. Confirm the search box appears to the right of the nav links, before the cart icon. Type a product name fragment (e.g. "kulak") and press Enter — confirm the URL becomes `/urunler?q=kulak` (Task 5 makes the filtering itself visible; for now just confirm navigation happens and no console errors appear). Navigate to `/` — confirm the search box is empty. Navigate back to `/urunler?q=kulak` directly (paste the URL) — confirm the search box shows "kulak".

- [ ] **Step 3: Commit**

```bash
git add src/components/Header.jsx
git commit -m "feat: add functional search form to Header"
```

---

### Task 5: Products Page Search Filtering

**Files:**
- Modify: `src/pages/Products.jsx`

**Interfaces:**
- Consumes: `useSearchParams`, `Link` from `react-router-dom`. CSS classes `.search-result-info`, `.no-results` (Task 2).
- Produces: nothing consumed by later tasks.

- [ ] **Step 1: Filter products by the `q` search param**

`src/pages/Products.jsx`:
```jsx
import { Link, useSearchParams } from 'react-router-dom';
import { products } from '../data/products.js';
import ProductCard from '../components/ProductCard.jsx';

export default function Products() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const filtered = query
    ? products.filter((product) => product.name.toLowerCase().includes(query.toLowerCase()))
    : products;

  return (
    <div className="products-page">
      <h1>Ürünler</h1>
      <p>Özenle seçilmiş ürünleri keşfedin.</p>
      {query && (
        <p className="search-result-info">
          "{query}" için {filtered.length} sonuç bulundu. <Link to="/urunler">Aramayı temizle</Link>
        </p>
      )}
      {filtered.length === 0 ? (
        <p className="no-results">Aramanızla eşleşen ürün bulunamadı.</p>
      ) : (
        <div className="product-grid">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Manual verification**

Run `npm run dev`, go to `/urunler`. Type "kulak" in the header search box and press Enter. Confirm: URL is `/urunler?q=kulak`, only "Kablosuz Kulaklık" shows, a line reads `"kulak" için 1 sonuç bulundu.` with a working "Aramayı temizle" link (clicking it returns to `/urunler` with all 8 products). Search for something with zero matches (e.g. "zzz") — confirm "Aramanızla eşleşen ürün bulunamadı." shows instead of an empty grid. Clear the search (empty query, Enter) — confirm all 8 products show again with no result-info line.

- [ ] **Step 3: Commit**

```bash
git add src/pages/Products.jsx
git commit -m "feat: filter Products page by header search query"
```

---

### Task 6: Home Hero Rework

**Files:**
- Modify: `src/pages/Home.jsx`

**Interfaces:**
- Consumes: CSS classes `.hero-content`, `.hero-actions`, `.hero-visual`, `.hero-visual-accent`, `.hero-visual-accent-1`, `.hero-visual-accent-2`, `.featured-header`, `.see-all-link` (Task 2). `Link` from `react-router-dom`.
- Produces: nothing consumed by later tasks (Task 7 adds a new section to this same file, but as an additive edit — see Task 7).

- [ ] **Step 1: Rebuild the hero as a two-column layout with a functional secondary CTA and a "Tümünü Gör" link**

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
        <div className="hero-content">
          <span className="hero-tag">Yeni Ürünler Geldi</span>
          <h1>Sepet'e Hoş Geldiniz</h1>
          <p>İhtiyacınız olan ürünleri kolayca keşfedin ve sepete ekleyin.</p>
          <div className="hero-actions">
            <Link to="/urunler" className="btn btn-primary">Ürünleri Gör</Link>
            <a href="#one-cikan-urunler" className="btn btn-secondary">Daha Fazla Bilgi</a>
          </div>
        </div>
        <div className="hero-visual" aria-hidden="true">
          🛍️
          <span className="hero-visual-accent hero-visual-accent-1">🎧</span>
          <span className="hero-visual-accent hero-visual-accent-2">⌚</span>
        </div>
      </section>
      <section className="featured-products" id="one-cikan-urunler">
        <div className="featured-header">
          <div>
            <h2>Öne Çıkan Ürünler</h2>
            <div className="section-underline" />
          </div>
          <Link to="/urunler" className="see-all-link">Tümünü Gör →</Link>
        </div>
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

Run `npm run dev`, go to `/`. Confirm: hero shows two columns on a desktop-width window (text left, a rounded gradient box with a large 🛍️ emoji and two small floating 🎧/⌚ badges on the right); "Ürünleri Gör" (filled) and "Daha Fazla Bilgi" (outlined) buttons both appear; clicking "Daha Fazla Bilgi" smoothly scrolls down to the "Öne Çıkan Ürünler" section (no navigation, no page reload, URL gains a `#one-cikan-urunler` hash); "Tümünü Gör →" appears to the right of "Öne Çıkan Ürünler" and navigates to `/urunler` when clicked. Resize to a narrow width (375px) and confirm the hero collapses to a single centered column with the visual below the text.

- [ ] **Step 3: Commit**

```bash
git add src/pages/Home.jsx
git commit -m "feat: rework Home hero into two-column layout with functional secondary CTA"
```

---

### Task 7: Newsletter Section

**Files:**
- Create: `src/components/Newsletter.jsx`
- Modify: `src/pages/Home.jsx`

**Interfaces:**
- Produces: `Newsletter` default export, a self-contained component with its own local `email`/`subscribed` state — takes no props.
- Consumes (in `Home.jsx`): renders `<Newsletter />` as the last section on the page.

- [ ] **Step 1: Write the Newsletter component**

`src/components/Newsletter.jsx`:
```jsx
import { useState } from 'react';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  function handleSubmit(event) {
    event.preventDefault();
    setSubscribed(true);
  }

  return (
    <section className="newsletter">
      <div className="newsletter-text">
        <h2>Fırsatları Kaçırmayın!</h2>
        <p>Haftalık indirimler ve yeni ürünlerden ilk siz haberdar olun.</p>
      </div>
      {subscribed ? (
        <p className="newsletter-success">Teşekkürler! Fırsatlardan haberdar olacaksınız.</p>
      ) : (
        <form className="newsletter-form" onSubmit={handleSubmit}>
          <input
            type="email"
            required
            placeholder="E-posta adresiniz"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
          <button type="submit" className="btn btn-primary">Abone Ol</button>
        </form>
      )}
    </section>
  );
}
```

- [ ] **Step 2: Render it on the Home page**

In `src/pages/Home.jsx`, add the import and render `<Newsletter />` as the last element inside `<div className="home-page">`, after the `<section className="featured-products" ...>` block:

```jsx
import { Link } from 'react-router-dom';
import { products } from '../data/products.js';
import ProductCard from '../components/ProductCard.jsx';
import Newsletter from '../components/Newsletter.jsx';

const featured = products.slice(0, 4);

export default function Home() {
  return (
    <div className="home-page">
      <section className="hero">
        <div className="hero-content">
          <span className="hero-tag">Yeni Ürünler Geldi</span>
          <h1>Sepet'e Hoş Geldiniz</h1>
          <p>İhtiyacınız olan ürünleri kolayca keşfedin ve sepete ekleyin.</p>
          <div className="hero-actions">
            <Link to="/urunler" className="btn btn-primary">Ürünleri Gör</Link>
            <a href="#one-cikan-urunler" className="btn btn-secondary">Daha Fazla Bilgi</a>
          </div>
        </div>
        <div className="hero-visual" aria-hidden="true">
          🛍️
          <span className="hero-visual-accent hero-visual-accent-1">🎧</span>
          <span className="hero-visual-accent hero-visual-accent-2">⌚</span>
        </div>
      </section>
      <section className="featured-products" id="one-cikan-urunler">
        <div className="featured-header">
          <div>
            <h2>Öne Çıkan Ürünler</h2>
            <div className="section-underline" />
          </div>
          <Link to="/urunler" className="see-all-link">Tümünü Gör →</Link>
        </div>
        <div className="product-grid">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
      <Newsletter />
    </div>
  );
}
```

(This is the full file — Task 6's version plus the `Newsletter` import and render.)

- [ ] **Step 3: Manual verification**

Run `npm run dev`, go to `/`, scroll to the bottom. Confirm a dark rounded section reads "Fırsatları Kaçırmayın!" with an email input and "Abone Ol" button. Type any text in the email field and submit — confirm the form is replaced by "Teşekkürler! Fırsatlardan haberdar olacaksınız." with no network request (check DevTools Network tab — no new request fires on submit). Reload the page — confirm the form reappears (state was local, not persisted, as intended).

- [ ] **Step 4: Commit**

```bash
git add src/components/Newsletter.jsx src/pages/Home.jsx
git commit -m "feat: add decorative newsletter section to Home page"
```

---

### Task 8: Mobile Bottom Navigation

**Files:**
- Create: `src/components/MobileNav.jsx`
- Modify: `src/components/Layout.jsx`

**Interfaces:**
- Consumes: `HomeIcon`, `GridIcon`, `CartIcon` from `src/components/icons.jsx` (Task 1). `useCart()` for `totalItems`. CSS classes `.mobile-nav`, `.mobile-nav-link`, `.mobile-nav-icon`, `.cart-icon-wrap`, `.cart-badge` (Task 2, and Phase 1's existing cart-icon-wrap/cart-badge).
- Produces: nothing consumed by later tasks.

- [ ] **Step 1: Write the MobileNav component**

`src/components/MobileNav.jsx`:
```jsx
import { NavLink } from 'react-router-dom';
import { useCart } from '../hooks/useCart.js';
import { CartIcon, GridIcon, HomeIcon } from './icons.jsx';

export default function MobileNav() {
  const { totalItems } = useCart();

  return (
    <nav className="mobile-nav">
      <NavLink to="/" end className="mobile-nav-link">
        <HomeIcon className="mobile-nav-icon" />
        <span>Ana Sayfa</span>
      </NavLink>
      <NavLink to="/urunler" className="mobile-nav-link">
        <GridIcon className="mobile-nav-icon" />
        <span>Ürünler</span>
      </NavLink>
      <NavLink to="/sepet" className="mobile-nav-link">
        <span className="cart-icon-wrap">
          <CartIcon className="mobile-nav-icon" />
          {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
        </span>
        <span>Sepet</span>
      </NavLink>
    </nav>
  );
}
```

- [ ] **Step 2: Render it in Layout, below Footer**

`src/components/Layout.jsx`:
```jsx
import { Outlet } from 'react-router-dom';
import Header from './Header.jsx';
import Footer from './Footer.jsx';
import MobileNav from './MobileNav.jsx';

export default function Layout() {
  return (
    <>
      <Header />
      <main className="page-content">
        <Outlet />
      </main>
      <Footer />
      <MobileNav />
    </>
  );
}
```

- [ ] **Step 3: Manual verification**

Run `npm run dev`. At a desktop width (>640px), confirm no bottom bar is visible (only the top header's nav). Resize to ≤640px (e.g. 375px): confirm the top header's nav links and search box disappear (only the logo remains, centered), and a fixed bottom bar appears with "Ana Sayfa" / "Ürünler" / "Sepet" (icon + label), the active route highlighted in the primary color, and the cart badge showing on the Sepet icon when items are in the cart. Confirm page content isn't hidden behind the bottom bar when scrolled to the bottom of a page. Click each mobile-nav link and confirm it navigates correctly.

- [ ] **Step 4: Commit**

```bash
git add src/components/MobileNav.jsx src/components/Layout.jsx
git commit -m "feat: add mobile bottom navigation"
```

---

### Task 9: Full Visual & Functional QA Pass

**Files:** none (verification only).

**Interfaces:** none — this task exercises everything built by Tasks 1-8, plus a regression check against Phase 1 and the original build.

- [ ] **Step 1: Clear state and start fresh**

Run `npm run dev`. Clear the `sepet-cart` Local Storage key if present. Reload.

- [ ] **Step 2: New-feature pass**

1. On `/`: confirm the two-column hero, the 🛍️ visual with 🎧/⌚ accents, both hero buttons, "Daha Fazla Bilgi" smooth-scrolling to the featured section, "Tümünü Gör →" navigating to `/urunler`, and the newsletter section's fake-subscribe flow (submit → success message → reload resets it).
2. On `/urunler`: confirm every product card shows a star rating + review count. Search for a product name fragment via the header search box, confirm filtering, result count, and "Aramanızla eşleşen ürün bulunamadı." for a no-match query; confirm "Aramayı temizle" resets to all 8 products.
3. Resize to 375px: confirm the mobile bottom nav appears, top nav/search disappear, and all three mobile-nav links work, with the cart badge reflecting the current cart.

- [ ] **Step 3: Regression pass (original cart flow + Phase 1 must still work)**

Add 3 different products to the cart (one twice) from `/urunler`, confirm the header badge; go to `/sepet`, confirm the two-column cart layout, quantities/totals, `+`/`-`/Sil/Sepeti Temizle all work, reload persists the cart (still exercises the original `getInitialCart` fix), "Siparişi Tamamla" clears the cart and shows the Phase 1 order-complete page with its icon and cosmetic order number; visit an unknown path and confirm the 404 page (Phase 1 styling + icon) still works; confirm Header/Footer/MobileNav render consistently across all 5 routes.

- [ ] **Step 4: Font and console check**

Open DevTools → Network tab, filter "font", reload `/` — confirm zero requests to `fonts.googleapis.com`/`fonts.gstatic.com`. Check the console across all pages exercised above — zero errors.

- [ ] **Step 5: Fix any discrepancies found**

If any step in Steps 2-4 fails, fix the relevant task's code before proceeding — do not move on with a known-broken flow.

- [ ] **Step 6: Final commit**

```bash
git add -A
git commit -m "chore: final QA pass for Sepet redesign Phase 2" --allow-empty
```
