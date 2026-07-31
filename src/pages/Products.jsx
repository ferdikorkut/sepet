import { Link, useSearchParams } from 'react-router-dom';
import { products } from '../data/products.js';
import ProductCard from '../components/ProductCard.jsx';
import { SearchIcon } from '../components/icons.jsx';

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const filtered = query
    ? products.filter((product) => product.name.toLowerCase().includes(query.toLowerCase()))
    : products;

  function handleSearchChange(event) {
    const value = event.target.value;
    setSearchParams(value ? { q: value } : {});
  }

  return (
    <div className="products-page">
      <div className="products-header">
        <h1>Ürünler</h1>
        <form className="search-form" onSubmit={(event) => event.preventDefault()}>
          <SearchIcon className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Ürün ara..."
            value={query}
            onChange={handleSearchChange}
          />
        </form>
      </div>
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
