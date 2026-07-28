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
