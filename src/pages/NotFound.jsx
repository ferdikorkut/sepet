import { Link } from 'react-router-dom';
import { BasketIcon } from '../components/icons.jsx';

export default function NotFound() {
  return (
    <div className="not-found-page">
      <BasketIcon className="not-found-icon" />
      <h1>404</h1>
      <p>Aradığınız sayfa bulunamadı.</p>
      <Link to="/" className="btn btn-primary">Ana Sayfaya Dön</Link>
    </div>
  );
}
