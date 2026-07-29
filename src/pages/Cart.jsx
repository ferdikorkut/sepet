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
