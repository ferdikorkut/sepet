import { products } from '../data/products.js';
import ProductCard from '../components/ProductCard.jsx';

export default function Products() {
  return (
    <div className="products-page">
      <h1>Ürünler</h1>
      <p>Özenle seçilmiş ürünleri keşfedin.</p>
      <div className="product-grid">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
