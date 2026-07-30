import { Link, useSearchParams } from 'react-router-dom';
import { products } from '../data/products.js';
import ProductCard from '../components/ProductCard.jsx';

export default function Products() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const filtered = query
    ? products.filter((product) => product.name.toLowerCase().includes(query.toLowerCase()))
    : products;

  return (
    <div className="products-page">
      <h1>Ürünler</h1>
      <p>Özenle seçilmiş ürünleri keşfedin.</p>
      {query && (
        <p className="search-result-info">
          "{query}" için {filtered.length} sonuç bulundu. <Link to="/urunler">Aramayı temizle</Link>
        </p>
      )}
      {filtered.length === 0 ? (
        <p className="no-results">Aramanızla eşleşen ürün bulunamadı.</p>
      ) : (
        <div className="product-grid">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
