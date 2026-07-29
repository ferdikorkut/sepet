import { Link } from 'react-router-dom';
import { products } from '../data/products.js';
import ProductCard from '../components/ProductCard.jsx';

const featured = products.slice(0, 4);

export default function Home() {
  return (
    <div className="home-page">
      <section className="hero">
        <span className="hero-tag">Yeni Ürünler Geldi</span>
        <h1>Sepet'e Hoş Geldiniz</h1>
        <p>İhtiyacınız olan ürünleri kolayca keşfedin ve sepete ekleyin.</p>
        <Link to="/urunler" className="btn btn-primary">Ürünleri Gör</Link>
      </section>
      <section className="featured-products">
        <h2>Öne Çıkan Ürünler</h2>
        <div className="section-underline" />
        <div className="product-grid">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}
