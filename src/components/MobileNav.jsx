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
