# Sepet Cart App Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build "Sepet", an educational shopping-cart web app with 5 pages (Home, Products, Cart, Order Complete, 404) that teaches modern Context API + `useReducer` state management with Local Storage persistence.

**Architecture:** Vite + React (JS/JSX) single-page app with React Router for client-side routing. A single `CartContext` (backed by `useReducer`) holds cart state, exposed through a `useCart` hook; the cart is synced to `localStorage` on every change and reloaded on mount. Static mock product data lives in `src/data/products.js`. Plain global CSS, no CSS-in-JS or utility framework.

**Tech Stack:** Vite, React 18, react-router-dom, @fontsource/inter. No backend, no automated test framework (see Global Constraints).

**Spec:** `docs/superpowers/specs/2026-07-28-sepet-cart-app-design.md`

## Global Constraints

- No external font CDN requests — Inter is self-hosted via the `@fontsource/inter` npm package (spec: "Fontlar (Self-Hosted)").
- No automated test suite — this is an educational project; every task is verified manually by running `npm run dev` and checking behavior in the browser (spec: "Kapsam Dışı").
- No backend, no payment integration, no user accounts (spec: "Kapsam Dışı").
- No product detail page, no category filter/search (spec: "Kapsam Dışı").
- No general React Error Boundary — only the `*` 404 route (spec: "Kapsam Dışı").
- Cart Local Storage key is exactly `sepet-cart` (spec: "CartContext Tasarımı").
- Routes are exactly: `/`, `/urunler`, `/sepet`, `/siparis-tamamlandi`, and `*` → 404 (spec: "Sayfalar & Routing").

---

### Task 1: Proje İskeleti (Vite + React Scaffold)

**Files:**
- Create: `package.json`, `vite.config.js`, `index.html`
- Create: `src/main.jsx`
- Create: `src/App.jsx` (placeholder)

**Interfaces:**
- Produces: a running Vite dev server on `npm run dev`; `App` component default-exported from `src/App.jsx` for later tasks to build on.

- [ ] **Step 1: Write package.json**

The project directory already contains `docs/`, `.git/`, and `.gitignore`, so the interactive `npm create vite@latest` scaffolder would prompt about a non-empty directory. Write the config files directly instead.

`package.json`:
```json
{
  "name": "sepet",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.26.0",
    "@fontsource/inter": "^5.0.20"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.3.1",
    "vite": "^5.4.1"
  }
}
```

- [ ] **Step 2: Write vite.config.js**

`vite.config.js`:
```js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
});
```

- [ ] **Step 3: Write index.html**

`index.html`:
```html
<!doctype html>
<html lang="tr">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Sepet</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

- [ ] **Step 4: Write src/main.jsx**

`src/main.jsx`:
```jsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

- [ ] **Step 5: Write a placeholder App.jsx**

`src/App.jsx`:
```jsx
export default function App() {
  return <div>Sepet — yapım aşamasında</div>;
}
```

- [ ] **Step 6: Install dependencies**

Run:
```bash
npm install
```
Expected: `node_modules/` is created, `package-lock.json` is generated, no errors.

- [ ] **Step 7: Manual verification**

Run: `npm run dev`
Expected: terminal prints a local URL (e.g. `http://localhost:5173`); opening it in a browser shows "Sepet — yapım aşamasında" with no console errors.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "chore: scaffold Vite + React project"
```

---

### Task 2: Self-Hosted Font (Inter via @fontsource)

**Files:**
- Create: `src/index.css`
- Modify: `src/main.jsx` (add the stylesheet import)

**Interfaces:**
- Consumes: nothing from prior tasks.
- Produces: global `body` styling with `font-family: 'Inter', system-ui, sans-serif;` available to every later page/component.

- [ ] **Step 1: Import the self-hosted Inter font weights and write base styles**

`src/index.css`:
```css
@import '@fontsource/inter/400.css';
@import '@fontsource/inter/600.css';
@import '@fontsource/inter/700.css';

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  background-color: #f7f7f8;
  color: #1a1a1a;
}

a {
  color: inherit;
}

button {
  font-family: inherit;
  cursor: pointer;
}
```

- [ ] **Step 2: Import the stylesheet in main.jsx**

`src/main.jsx`:
```jsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

- [ ] **Step 3: Manual verification**

Run: `npm run dev`, open the browser, open DevTools → Elements → select the `<body>` → check the Computed tab for `font-family`.
Expected: computed font-family resolves to "Inter". Open DevTools → Network tab, reload the page, filter by "font": no requests to `fonts.googleapis.com` or `fonts.gstatic.com` appear — only local `/node_modules/.vite/...` or bundled asset requests.

- [ ] **Step 4: Commit**

```bash
git add src/index.css src/main.jsx
git commit -m "feat: self-host Inter font via @fontsource"
```

---

### Task 3: Ürün Verisi (products.js)

**Files:**
- Create: `src/data/products.js`

**Interfaces:**
- Produces: `products` — an array of `{ id: number, name: string, price: number, image: string, category: string }`, exported as a named export. `image` holds a single emoji character used as a lightweight visual placeholder (no external image requests).

- [ ] **Step 1: Write the static product list**

`src/data/products.js`:
```js
export const products = [
  { id: 1, name: 'Kablosuz Kulaklık', price: 899.90, image: '🎧', category: 'Elektronik' },
  { id: 2, name: 'Akıllı Saat', price: 1499.50, image: '⌚', category: 'Elektronik' },
  { id: 3, name: 'Sırt Çantası', price: 649.00, image: '🎒', category: 'Aksesuar' },
  { id: 4, name: 'Termos', price: 249.90, image: '🧊', category: 'Ev' },
  { id: 5, name: 'Masaüstü Lamba', price: 349.00, image: '💡', category: 'Ev' },
  { id: 6, name: 'Bluetooth Hoparlör', price: 799.90, image: '🔊', category: 'Elektronik' },
  { id: 7, name: 'Güneş Gözlüğü', price: 459.00, image: '🕶️', category: 'Aksesuar' },
  { id: 8, name: 'Kahve Makinesi', price: 1899.00, image: '☕', category: 'Ev' },
];
```

- [ ] **Step 2: Manual verification**

Temporarily add `import { products } from './data/products.js'; console.log(products);` to the top of `src/App.jsx`. Run `npm run dev` and open the browser console.
Expected: array of 8 product objects logged, each with `id`, `name`, `price`, `image`, `category`. Afterward, remove the temporary import and `console.log` line so `App.jsx` returns to its Task 1 placeholder content.

- [ ] **Step 3: Commit**

```bash
git add src/data/products.js
git commit -m "feat: add static product data"
```

---

### Task 4: CartContext + useCart Hook

**Files:**
- Create: `src/context/CartContext.jsx`
- Create: `src/hooks/useCart.js`

**Interfaces:**
- Consumes: nothing from prior tasks (products are passed in by callers, not imported here).
- Produces:
  - `CartProvider` (named export from `src/context/CartContext.jsx`) — wraps children, must be mounted above anything using `useCart`.
  - `useCart()` (named export from `src/hooks/useCart.js`) — returns `{ cart, dispatch, totalItems, totalPrice }`.
    - `cart`: `Array<{ id, name, price, image, quantity }>`
    - `dispatch`: reducer dispatch accepting actions:
      - `{ type: 'ADD_ITEM', product: { id, name, price, image } }`
      - `{ type: 'REMOVE_ITEM', id }`
      - `{ type: 'INCREASE_QUANTITY', id }`
      - `{ type: 'DECREASE_QUANTITY', id }`
      - `{ type: 'CLEAR_CART' }`
    - `totalItems`: number (sum of all quantities)
    - `totalPrice`: number (sum of `price * quantity`)

- [ ] **Step 1: Write the reducer and provider**

`src/context/CartContext.jsx`:
```jsx
import { createContext, useEffect, useReducer } from 'react';

const STORAGE_KEY = 'sepet-cart';

export const CartContext = createContext(null);

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existing = state.find((item) => item.id === action.product.id);
      if (existing) {
        return state.map((item) =>
          item.id === action.product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...state, { ...action.product, quantity: 1 }];
    }
    case 'REMOVE_ITEM':
      return state.filter((item) => item.id !== action.id);
    case 'INCREASE_QUANTITY':
      return state.map((item) =>
        item.id === action.id ? { ...item, quantity: item.quantity + 1 } : item
      );
    case 'DECREASE_QUANTITY':
      return state
        .map((item) =>
          item.id === action.id ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0);
    case 'CLEAR_CART':
      return [];
    case 'LOAD_CART':
      return action.cart;
    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [cart, dispatch] = useReducer(cartReducer, []);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      dispatch({ type: 'LOAD_CART', cart: JSON.parse(stored) });
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
  }, [cart]);

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.quantity * item.price, 0);

  return (
    <CartContext.Provider value={{ cart, dispatch, totalItems, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
}
```

- [ ] **Step 2: Write the useCart hook**

`src/hooks/useCart.js`:
```js
import { useContext } from 'react';
import { CartContext } from '../context/CartContext.jsx';

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
```

- [ ] **Step 3: Wrap App in CartProvider and add a temporary manual test button**

`src/App.jsx` (temporary — the real UI replaces this in Task 5):
```jsx
import { CartProvider } from './context/CartContext.jsx';
import { useCart } from './hooks/useCart.js';

function DebugCart() {
  const { cart, dispatch, totalItems, totalPrice } = useCart();
  return (
    <div>
      <p>Total items: {totalItems} — Total price: {totalPrice}</p>
      <button
        onClick={() =>
          dispatch({
            type: 'ADD_ITEM',
            product: { id: 1, name: 'Test Ürün', price: 10, image: '🧪' },
          })
        }
      >
        Add test item
      </button>
      <pre>{JSON.stringify(cart, null, 2)}</pre>
    </div>
  );
}

export default function App() {
  return (
    <CartProvider>
      <DebugCart />
    </CartProvider>
  );
}
```

- [ ] **Step 4: Manual verification**

Run: `npm run dev`, open the browser.
Expected: clicking "Add test item" repeatedly increases `quantity` on the same cart entry and updates `Total items`/`Total price`. Open DevTools → Application → Local Storage → confirm a `sepet-cart` key holds the matching JSON array. Reload the page: the cart contents persist (loaded from Local Storage).

- [ ] **Step 5: Commit**

```bash
git add src/context/CartContext.jsx src/hooks/useCart.js src/App.jsx
git commit -m "feat: add CartContext with useReducer and localStorage sync"
```

---

### Task 5: Routing, Layout, Header, Footer

**Files:**
- Create: `src/components/Layout.jsx`
- Create: `src/components/Header.jsx`
- Create: `src/components/Footer.jsx`
- Create: `src/pages/Home.jsx` (placeholder, filled in Task 7)
- Create: `src/pages/Products.jsx` (placeholder, filled in Task 6)
- Create: `src/pages/Cart.jsx` (placeholder, filled in Task 8)
- Create: `src/pages/OrderComplete.jsx` (placeholder, filled in Task 9)
- Create: `src/pages/NotFound.jsx` (placeholder, filled in Task 10)
- Modify: `src/App.jsx` (replace debug content with the router)

**Interfaces:**
- Consumes: `useCart` from Task 4 (Header reads `totalItems`).
- Produces: the 5 routes listed in Global Constraints, each rendering inside `Layout`'s `<Outlet />`.

- [ ] **Step 1: Write placeholder page components**

`src/pages/Home.jsx`:
```jsx
export default function Home() {
  return <h1>Ana Sayfa</h1>;
}
```

`src/pages/Products.jsx`:
```jsx
export default function Products() {
  return <h1>Ürünler</h1>;
}
```

`src/pages/Cart.jsx`:
```jsx
export default function Cart() {
  return <h1>Sepet</h1>;
}
```

`src/pages/OrderComplete.jsx`:
```jsx
export default function OrderComplete() {
  return <h1>Sipariş Tamamlandı</h1>;
}
```

`src/pages/NotFound.jsx`:
```jsx
export default function NotFound() {
  return <h1>404 - Sayfa Bulunamadı</h1>;
}
```

- [ ] **Step 2: Write the Header**

`src/components/Header.jsx`:
```jsx
import { NavLink } from 'react-router-dom';
import { useCart } from '../hooks/useCart.js';

export default function Header() {
  const { totalItems } = useCart();

  return (
    <header className="site-header">
      <div className="logo">Sepet</div>
      <nav>
        <NavLink to="/" end>Ana Sayfa</NavLink>
        <NavLink to="/urunler">Ürünler</NavLink>
        <NavLink to="/sepet" className="cart-link">
          Sepet
          {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
        </NavLink>
      </nav>
    </header>
  );
}
```

- [ ] **Step 3: Write the Footer**

`src/components/Footer.jsx`:
```jsx
export default function Footer() {
  return (
    <footer className="site-footer">
      <p>&copy; {new Date().getFullYear()} Sepet. Tüm hakları saklıdır.</p>
    </footer>
  );
}
```

- [ ] **Step 4: Write the Layout**

`src/components/Layout.jsx`:
```jsx
import { Outlet } from 'react-router-dom';
import Header from './Header.jsx';
import Footer from './Footer.jsx';

export default function Layout() {
  return (
    <>
      <Header />
      <main className="page-content">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
```

- [ ] **Step 5: Wire up the router in App.jsx**

`src/App.jsx`:
```jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext.jsx';
import Layout from './components/Layout.jsx';
import Home from './pages/Home.jsx';
import Products from './pages/Products.jsx';
import Cart from './pages/Cart.jsx';
import OrderComplete from './pages/OrderComplete.jsx';
import NotFound from './pages/NotFound.jsx';

export default function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/urunler" element={<Products />} />
            <Route path="/sepet" element={<Cart />} />
            <Route path="/siparis-tamamlandi" element={<OrderComplete />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </CartProvider>
  );
}
```

- [ ] **Step 6: Add layout CSS**

Append to `src/index.css`:
```css
.site-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 32px;
  background: #ffffff;
  border-bottom: 1px solid #e5e5e5;
}

.site-header .logo {
  font-weight: 700;
  font-size: 20px;
}

.site-header nav {
  display: flex;
  gap: 20px;
  align-items: center;
}

.site-header nav a {
  text-decoration: none;
  font-weight: 600;
  color: #1a1a1a;
}

.site-header nav a.active {
  color: #2563eb;
}

.cart-link {
  position: relative;
}

.cart-badge {
  background: #ef4444;
  color: white;
  border-radius: 999px;
  font-size: 12px;
  padding: 2px 7px;
  margin-left: 6px;
}

.page-content {
  min-height: 70vh;
  padding: 32px;
  max-width: 1100px;
  margin: 0 auto;
}

.site-footer {
  text-align: center;
  padding: 20px;
  color: #6b7280;
  font-size: 14px;
  border-top: 1px solid #e5e5e5;
}
```

- [ ] **Step 7: Manual verification**

Run: `npm run dev`, open the browser at `/`.
Expected: Header (with "Ana Sayfa" highlighted as active) and Footer appear on every route. Click each nav link — URL changes to `/urunler` and `/sepet`, corresponding placeholder heading shows, Header/Footer stay in place. Manually navigate to `/does-not-exist` — the 404 placeholder renders.

- [ ] **Step 8: Commit**

```bash
git add src/App.jsx src/components src/pages src/index.css
git commit -m "feat: add routing, layout, header, and footer"
```

---

### Task 6: ProductCard + Products Page

**Files:**
- Create: `src/components/ProductCard.jsx`
- Modify: `src/pages/Products.jsx`
- Modify: `src/index.css`

**Interfaces:**
- Consumes: `products` from Task 3 (`src/data/products.js`), `useCart` from Task 4.
- Produces: `ProductCard` (default export, prop `product: { id, name, price, image, category }`) reused by Task 7's Home page.

- [ ] **Step 1: Write ProductCard**

`src/components/ProductCard.jsx`:
```jsx
import { useCart } from '../hooks/useCart.js';

export default function ProductCard({ product }) {
  const { dispatch } = useCart();

  return (
    <div className="product-card">
      <div className="product-image" aria-hidden="true">{product.image}</div>
      <h3>{product.name}</h3>
      <p className="product-price">{product.price.toFixed(2)} TL</p>
      <button onClick={() => dispatch({ type: 'ADD_ITEM', product })}>
        Sepete Ekle
      </button>
    </div>
  );
}
```

- [ ] **Step 2: Build the Products page**

`src/pages/Products.jsx`:
```jsx
import { products } from '../data/products.js';
import ProductCard from '../components/ProductCard.jsx';

export default function Products() {
  return (
    <div className="products-page">
      <h1>Ürünler</h1>
      <div className="product-grid">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Add product grid/card CSS**

Append to `src/index.css`:
```css
.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.product-card {
  background: #ffffff;
  border: 1px solid #e5e5e5;
  border-radius: 10px;
  padding: 20px;
  text-align: center;
}

.product-card .product-image {
  font-size: 48px;
  margin-bottom: 12px;
}

.product-card h3 {
  margin: 0 0 8px;
  font-size: 16px;
}

.product-price {
  font-weight: 600;
  margin-bottom: 12px;
}

.product-card button {
  width: 100%;
  padding: 10px;
  border: none;
  border-radius: 6px;
  background: #2563eb;
  color: white;
  font-weight: 600;
}
```

- [ ] **Step 4: Manual verification**

Run: `npm run dev`, navigate to `/urunler`.
Expected: 8 product cards render in a grid, each showing emoji, name, price in "X.XX TL" format. Click "Sepete Ekle" on a card — open DevTools → Application → Local Storage → `sepet-cart` shows the item with `quantity: 1`. Click the same card's button twice more — `quantity` becomes 3. Check the Header's cart badge updates to match total item count.

- [ ] **Step 5: Commit**

```bash
git add src/components/ProductCard.jsx src/pages/Products.jsx src/index.css
git commit -m "feat: add ProductCard and build Products page"
```

---

### Task 7: Home Page (Hero + Featured Products)

**Files:**
- Modify: `src/pages/Home.jsx`
- Modify: `src/index.css`

**Interfaces:**
- Consumes: `products` from Task 3, `ProductCard` from Task 6.
- Produces: nothing consumed by later tasks.

- [ ] **Step 1: Build the Home page**

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
        <h1>Sepet'e Hoş Geldiniz</h1>
        <p>İhtiyacınız olan ürünleri kolayca keşfedin ve sepete ekleyin.</p>
        <Link to="/urunler" className="cta-button">Ürünleri Gör</Link>
      </section>
      <section className="featured-products">
        <h2>Öne Çıkan Ürünler</h2>
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

- [ ] **Step 2: Add hero + CTA button CSS**

Append to `src/index.css`:
```css
.hero {
  text-align: center;
  padding: 48px 0;
}

.hero h1 {
  font-size: 32px;
  margin-bottom: 12px;
}

.hero p {
  color: #6b7280;
  margin-bottom: 24px;
}

.cta-button {
  display: inline-block;
  background: #2563eb;
  color: white;
  padding: 12px 24px;
  border-radius: 6px;
  font-weight: 600;
  text-decoration: none;
}

.featured-products h2 {
  margin-bottom: 4px;
}
```

- [ ] **Step 3: Manual verification**

Run: `npm run dev`, navigate to `/`.
Expected: hero section with heading, description, and "Ürünleri Gör" button that navigates to `/urunler`. Below it, exactly 4 featured `ProductCard`s (the first 4 from `products.js`), each with a working "Sepete Ekle" button that updates the cart badge in Header.

- [ ] **Step 4: Commit**

```bash
git add src/pages/Home.jsx src/index.css
git commit -m "feat: build Home page with hero and featured products"
```

---

### Task 8: CartItem + Cart Page

**Files:**
- Create: `src/components/CartItem.jsx`
- Modify: `src/pages/Cart.jsx`
- Modify: `src/index.css`

**Interfaces:**
- Consumes: `useCart` from Task 4 (`cart`, `dispatch`, `totalPrice`).
- Produces: `CartItem` (default export, prop `item: { id, name, price, image, quantity }`), used only by the Cart page.

- [ ] **Step 1: Write CartItem**

`src/components/CartItem.jsx`:
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

- [ ] **Step 2: Build the Cart page**

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
        <Link to="/urunler" className="cta-button">Alışverişe Devam Et</Link>
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
      <div className="cart-list">
        {cart.map((item) => (
          <CartItem key={item.id} item={item} />
        ))}
      </div>
      <div className="cart-summary">
        <p className="cart-total">Genel Toplam: {totalPrice.toFixed(2)} TL</p>
        <div className="cart-actions">
          <button onClick={() => dispatch({ type: 'CLEAR_CART' })}>Sepeti Temizle</button>
          <Link to="/urunler" className="cta-button">Alışverişe Devam Et</Link>
          <button className="primary" onClick={handleCompleteOrder}>Siparişi Tamamla</button>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Add cart page CSS**

Append to `src/index.css`:
```css
.cart-empty {
  text-align: center;
  padding: 48px 0;
}

.cart-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 20px;
}

.cart-item {
  display: grid;
  grid-template-columns: 60px 1fr auto auto auto;
  align-items: center;
  gap: 16px;
  background: #ffffff;
  border: 1px solid #e5e5e5;
  border-radius: 10px;
  padding: 12px 16px;
}

.cart-item .product-image {
  font-size: 32px;
  text-align: center;
}

.cart-item-info h4 {
  margin: 0 0 4px;
}

.cart-item-info p {
  margin: 0;
  color: #6b7280;
}

.cart-item-quantity {
  display: flex;
  align-items: center;
  gap: 8px;
}

.cart-item-quantity button {
  width: 28px;
  height: 28px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: #f9fafb;
}

.cart-item-total {
  font-weight: 600;
}

.remove-button {
  border: none;
  background: none;
  color: #ef4444;
  font-weight: 600;
}

.cart-summary {
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid #e5e5e5;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 16px;
}

.cart-total {
  font-size: 20px;
  font-weight: 700;
}

.cart-actions {
  display: flex;
  gap: 12px;
  align-items: center;
}

.cart-actions button {
  padding: 10px 16px;
  border-radius: 6px;
  border: 1px solid #d1d5db;
  background: white;
  font-weight: 600;
}

.cart-actions button.primary {
  background: #2563eb;
  color: white;
  border: none;
}
```

- [ ] **Step 4: Manual verification**

Run: `npm run dev`.
With an empty cart (clear Local Storage first), navigate to `/sepet`.
Expected: "Sepetiniz boş" message with "Alışverişe Devam Et" linking to `/urunler`.
Add 2-3 different products from `/urunler`, then go to `/sepet`.
Expected: one `CartItem` row per distinct product, `+`/`-` buttons change quantity live (and update Local Storage), quantity hitting 0 via `-` removes the row, "Sil" removes a row immediately, "Genel Toplam" matches the sum of all `price * quantity`, "Sepeti Temizle" empties the cart and shows the empty state, and re-adding an item then clicking "Siparişi Tamamla" clears the cart and navigates to `/siparis-tamamlandi` (verified fully in Task 9).

- [ ] **Step 5: Commit**

```bash
git add src/components/CartItem.jsx src/pages/Cart.jsx src/index.css
git commit -m "feat: add CartItem and build Cart page"
```

---

### Task 9: Order Complete Page

**Files:**
- Modify: `src/pages/OrderComplete.jsx`
- Modify: `src/index.css`

**Interfaces:**
- Consumes: nothing directly (the cart is already cleared by `Cart.jsx`'s `handleCompleteOrder` from Task 8 before navigating here).
- Produces: nothing consumed by later tasks.

- [ ] **Step 1: Build the Order Complete page**

`src/pages/OrderComplete.jsx`:
```jsx
import { Link } from 'react-router-dom';

export default function OrderComplete() {
  return (
    <div className="order-complete-page">
      <h1>Siparişiniz Alındı!</h1>
      <p>Teşekkür ederiz, siparişiniz başarıyla oluşturuldu.</p>
      <div className="order-complete-actions">
        <Link to="/" className="cta-button">Ana Sayfaya Dön</Link>
        <Link to="/urunler">Alışverişe Devam Et</Link>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Add order complete CSS**

Append to `src/index.css`:
```css
.order-complete-page {
  text-align: center;
  padding: 48px 0;
}

.order-complete-actions {
  margin-top: 20px;
  display: flex;
  gap: 20px;
  justify-content: center;
  align-items: center;
}
```

- [ ] **Step 3: Manual verification**

Run: `npm run dev`. Add a product to the cart, go to `/sepet`, click "Siparişi Tamamla".
Expected: browser navigates to `/siparis-tamamlandi`, shows the thank-you message, and Header's cart badge disappears (cart is empty). Open DevTools → Application → Local Storage → `sepet-cart` is `[]`. Click "Alışverişe Devam Et" — navigates to `/urunler`.

- [ ] **Step 4: Commit**

```bash
git add src/pages/OrderComplete.jsx src/index.css
git commit -m "feat: build Order Complete page"
```

---

### Task 10: 404 Not Found Page

**Files:**
- Modify: `src/pages/NotFound.jsx`
- Modify: `src/index.css`

**Interfaces:**
- Consumes: nothing.
- Produces: nothing consumed by later tasks.

- [ ] **Step 1: Build the NotFound page**

`src/pages/NotFound.jsx`:
```jsx
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="not-found-page">
      <h1>404</h1>
      <p>Aradığınız sayfa bulunamadı.</p>
      <Link to="/" className="cta-button">Ana Sayfaya Dön</Link>
    </div>
  );
}
```

- [ ] **Step 2: Add 404 page CSS**

Append to `src/index.css`:
```css
.not-found-page {
  text-align: center;
  padding: 64px 0;
}

.not-found-page h1 {
  font-size: 64px;
  margin-bottom: 8px;
}
```

- [ ] **Step 3: Manual verification**

Run: `npm run dev`, manually navigate the browser to `/rastgele-bir-yol`.
Expected: "404" heading, "Aradığınız sayfa bulunamadı." message, "Ana Sayfaya Dön" button navigates back to `/`. Header and Footer still render (NotFound renders inside `Layout`'s `<Outlet />`).

- [ ] **Step 4: Commit**

```bash
git add src/pages/NotFound.jsx src/index.css
git commit -m "feat: build 404 Not Found page"
```

---

### Task 11: Full Manual QA Pass

**Files:** none (verification only).

**Interfaces:** none — this task exercises the full app built by Tasks 1-10.

- [ ] **Step 1: Clear state and start fresh**

Run: `npm run dev`. Open DevTools → Application → Local Storage → delete the `sepet-cart` key if present. Reload.

- [ ] **Step 2: Walk the happy path**

1. On `/`: confirm hero renders, click "Ürünleri Gör" → lands on `/urunler`.
2. On `/urunler`: add 3 different products to the cart (click "Sepete Ekle" once each), then add one of them a second time.
3. Check Header cart badge shows `4` (3 distinct items, one with quantity 2).
4. Navigate to `/sepet`: confirm 3 rows, the double-added product shows quantity 2, "Genel Toplam" equals the correct sum.
5. Use `+`/`-` on one row, confirm the row total and "Genel Toplam" update live, and Local Storage's `sepet-cart` updates to match.
6. Decrease a row to quantity 0 via `-`: confirm the row disappears.
7. Click "Sil" on another row: confirm it's removed immediately.
8. Reload the page: confirm the remaining cart contents persist (loaded from Local Storage).
9. Click "Siparişi Tamamla": confirm navigation to `/siparis-tamamlandi`, cart badge disappears, Local Storage `sepet-cart` is `[]`.
10. Click "Alışverişe Devam Et" on the Order Complete page → lands on `/urunler`.
11. Manually visit `/does-not-exist` → 404 page renders with working "Ana Sayfaya Dön" link.
12. Confirm Header and Footer appear identically on all 5 pages.
13. Open DevTools → Network tab, reload `/`, filter by "font": confirm no requests to `fonts.googleapis.com` or `fonts.gstatic.com`.

- [ ] **Step 3: Fix any discrepancies found**

If any step in Step 2 fails, fix the relevant task's code before proceeding — do not move on with a known-broken flow.

- [ ] **Step 4: Final commit**

```bash
git add -A
git commit -m "chore: final manual QA pass for Sepet cart app" --allow-empty
```
