import { useState } from 'react';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  function handleSubmit(event) {
    event.preventDefault();
    setSubscribed(true);
  }

  return (
    <section className="newsletter">
      <div className="newsletter-text">
        <h2>Fırsatları Kaçırmayın!</h2>
        <p>Haftalık indirimler ve yeni ürünlerden ilk siz haberdar olun.</p>
      </div>
      {subscribed ? (
        <p className="newsletter-success">Teşekkürler! Fırsatlardan haberdar olacaksınız.</p>
      ) : (
        <form className="newsletter-form" onSubmit={handleSubmit}>
          <input
            type="email"
            required
            placeholder="E-posta adresiniz"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
          <button type="submit" className="btn btn-primary">Abone Ol</button>
        </form>
      )}
    </section>
  );
}
