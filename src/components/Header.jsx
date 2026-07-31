import { NavLink } from 'react-router-dom';
import { useCart } from '../hooks/useCart.js';
import { CartIcon } from './icons.jsx';

export default function Header() {
  const { totalItems } = useCart();

  return (
    <header className="site-header">
      <div className="header-inner">
        <div className="logo">Sepet</div>
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
      </div>
    </header>
  );
}
