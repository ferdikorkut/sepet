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
      <div className="header-inner">
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
      </div>
    </header>
  );
}
