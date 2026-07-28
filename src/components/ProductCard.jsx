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
