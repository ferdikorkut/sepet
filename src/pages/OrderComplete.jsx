import { Link } from 'react-router-dom';

export default function OrderComplete() {
  return (
    <div className="order-complete-page">
      <h1>Siparişiniz Alındı!</h1>
      <p>Teşekkür ederiz, siparişiniz başarıyla oluşturuldu.</p>
      <div className="order-complete-actions">
        <Link to="/" className="cta-button">Ana Sayfaya Dön</Link>
        <Link to="/urunler">Alışverişe Devam Et</Link>
      </div>
    </div>
  );
}
