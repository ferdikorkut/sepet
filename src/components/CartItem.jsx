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
