import { Link } from 'react-router-dom';
import { products } from '../data/products.js';
import ProductCard from '../components/ProductCard.jsx';

const featured = products.slice(0, 4);

export default function Home() {
  return (
    <div className="home-page">
      <section className="hero">
        <div className="hero-content">
          <span className="hero-tag">Yeni Ürünler Geldi</span>
          <h1>Sepet'e Hoş Geldiniz</h1>
          <p>İhtiyacınız olan ürünleri kolayca keşfedin ve sepete ekleyin.</p>
          <div className="hero-actions">
            <Link to="/urunler" className="btn btn-primary">Ürünleri Gör</Link>
            <a href="#one-cikan-urunler" className="btn btn-secondary">Daha Fazla Bilgi</a>
          </div>
        </div>
        <div className="hero-visual" aria-hidden="true">
          🛍️
          <span className="hero-visual-accent hero-visual-accent-1">🎧</span>
          <span className="hero-visual-accent hero-visual-accent-2">⌚</span>
        </div>
      </section>
      <section className="featured-products" id="one-cikan-urunler">
        <div className="featured-header">
          <div>
            <h2>Öne Çıkan Ürünler</h2>
            <div className="section-underline" />
          </div>
          <Link to="/urunler" className="see-all-link">Tümünü Gör →</Link>
        </div>
        <div className="product-grid">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}
