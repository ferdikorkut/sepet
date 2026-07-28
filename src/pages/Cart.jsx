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
