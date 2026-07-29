import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckIcon } from '../components/icons.jsx';

function generateOrderNumber() {
  const random = Math.floor(100000 + Math.random() * 900000);
  return `#SPT-${random}`;
}

export default function OrderComplete() {
  const [orderNumber] = useState(generateOrderNumber);

  return (
    <div className="order-complete-page">
      <div className="order-complete-icon">
        <CheckIcon />
      </div>
      <h1>Siparişiniz Alındı!</h1>
      <p>Teşekkür ederiz, siparişiniz başarıyla oluşturuldu.</p>
      <div className="order-number-box">
        <div className="order-number-label">Sipariş Numarası</div>
        <div className="order-number-value">{orderNumber}</div>
      </div>
      <div className="order-complete-actions">
        <Link to="/" className="btn btn-primary">Ana Sayfaya Dön</Link>
        <Link to="/urunler" className="btn btn-secondary">Alışverişe Devam Et</Link>
      </div>
    </div>
  );
}
