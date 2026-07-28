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
