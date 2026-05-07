import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { productService } from '../services/productService';

const HomePage = () => {
  const navigate = useNavigate();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [clickedProduct, setClickedProduct] = useState(null);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [showNewsletter, setShowNewsletter] = useState(false);
  const [email, setEmail] = useState('');
  

  useEffect(() => {
    productService.getAll().then(data => {
      setFeaturedProducts(data.slice(0, 3));
    });
    
    const timer = setTimeout(() => setShowNewsletter(true), 5000);
    return () => clearTimeout(timer);
  }, []);

  const handleAddToCart = (product, e) => {
    e.stopPropagation();
    const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingProductIndex = existingCart.findIndex(item => item.id === product.id);
    
    if (existingProductIndex !== -1) {
      existingCart[existingProductIndex].quantity = (existingCart[existingProductIndex].quantity || 1) + 1;
    } else {
      existingCart.push({ ...product, quantity: 1 });
    }
    
    localStorage.setItem('cart', JSON.stringify(existingCart));
    setClickedProduct({ id: product.id, type: 'cart' });
    setTimeout(() => {
      navigate('/cart');
    }, 300);
  };

  const handleAddToFavorites = (product, e) => {
    e.stopPropagation();
    const existingFavorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    const exists = existingFavorites.some(item => item.id === product.id);
    
    if (!exists) {
      existingFavorites.push(product);
      localStorage.setItem('favorites', JSON.stringify(existingFavorites));
    }
    
    setClickedProduct({ id: product.id, type: 'favorite' });
    setTimeout(() => {
      navigate('/favorites');
    }, 300);
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      alert(`Merci pour votre inscription ! ${email}`);
      setEmail('');
      setShowNewsletter(false);
    }
  };

  const styles = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
    @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css');

    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: 'Inter', sans-serif;
      background: #F7FAFC;
      overflow-x: hidden;
    }

    :root {
      --bleu-marine: #1A2B3C;
      --gris-ardoise: #4A5568;
      --blanc-casse: #F7FAFC;
      --bleu-electrique: #3182CE;
      --gris-clair: #E2E8F0;
    }

    /* Animations */
    @keyframes fadeInLeft {
      from { opacity: 0; transform: translateX(-60px); }
      to { opacity: 1; transform: translateX(0); }
    }

    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(40px); }
      to { opacity: 1; transform: translateY(0); }
    }

    @keyframes float1 {
      0%, 100% { transform: translateY(0px) rotate(-8deg); }
      50% { transform: translateY(-12px) rotate(-6deg); }
    }

    @keyframes float2 {
      0%, 100% { transform: translateY(0px) rotate(-2deg); }
      50% { transform: translateY(-8px) rotate(0deg); }
    }

    @keyframes float3 {
      0%, 100% { transform: translateY(0px) rotate(5deg); }
      50% { transform: translateY(-15px) rotate(7deg); }
    }

    @keyframes scaleIn {
      from { opacity: 0; transform: scale(0.9); }
      to { opacity: 1; transform: scale(1); }
    }

    @keyframes pulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.05); }
    }

    /* Hero Section */
    .hero-section {
      position: relative;
      overflow: hidden;
      background: linear-gradient(135deg, #F7FAFC 0%, #EDF2F7 100%);
    }

    .hero-text {
      animation: fadeInLeft 0.8s ease-out;
    }

    .hero-title {
      animation: fadeInUp 0.6s ease-out 0.2s both;
    }

    .hero-subtitle {
      animation: fadeInUp 0.6s ease-out 0.4s both;
    }

    .hero-stats {
      animation: fadeInUp 0.6s ease-out 0.6s both;
    }

    .hero-button {
      animation: fadeInUp 0.6s ease-out 0.8s both;
    }

    /* Floating Cards */
    .floating-card {
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      background: white;
      border-radius: 24px;
      box-shadow: 0 25px 50px rgba(0,0,0,0.12);
      border: 1px solid rgba(0,0,0,0.05);
    }

    .floating-card-1 {
      animation: float1 6s ease-in-out infinite;
    }

    .floating-card-2 {
      animation: float2 7s ease-in-out infinite;
    }

    .floating-card-3 {
      animation: float3 8s ease-in-out infinite;
    }

    /* Features Section */
    .features-section {
      background: white;
      position: relative;
    }

    .feature-card {
      background: white;
      border-radius: 20px;
      padding: 35px 25px;
      text-align: center;
      transition: all 0.4s ease;
      cursor: pointer;
      border: 1px solid #E2E8F0;
    }

    .feature-card:hover {
      transform: translateY(-10px);
      box-shadow: 0 20px 40px rgba(49,130,206,0.1);
      border-color: #3182CE;
    }

    .feature-icon {
      font-size: 48px;
      margin-bottom: 20px;
      display: inline-block;
      transition: transform 0.3s ease;
      color: #3182CE;
    }

    .feature-card:hover .feature-icon {
      transform: scale(1.1);
    }

    /* Banner Section */
    .banner-section {
      background: linear-gradient(135deg, #1A2B3C 0%, #0F4C5C 100%);
      position: relative;
      overflow: hidden;
    }

    .countdown-item {
      background: rgba(255,255,255,0.1);
      backdrop-filter: blur(10px);
      border-radius: 15px;
      padding: 15px;
      text-align: center;
      transition: all 0.3s ease;
      border: 1px solid rgba(49,130,206,0.3);
    }

    .countdown-item:hover {
      transform: scale(1.05);
      background: rgba(49,130,206,0.2);
      border-color: #3182CE;
    }

    /* Testimonials Section */
    .testimonials-section {
      background: #F7FAFC;
      position: relative;
    }

    .testimonial-card {
      background: white;
      border-radius: 20px;
      padding: 30px;
      transition: all 0.4s ease;
      border: 1px solid #E2E8F0;
    }

    .testimonial-card:hover {
      transform: translateY(-10px);
      box-shadow: 0 20px 40px rgba(49,130,206,0.1);
      border-color: #3182CE;
    }

    .testimonial-avatar {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: linear-gradient(135deg, #3182CE, #1A2B3C);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 24px;
      font-weight: bold;
      transition: transform 0.3s ease;
    }

    .testimonial-card:hover .testimonial-avatar {
      transform: scale(1.1);
    }

    /* Product Cards */
    .product-card {
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      animation: scaleIn 0.6s ease-out backwards;
      background: white;
      border: 1px solid #E2E8F0;
    }

    .product-card:hover {
      transform: translateY(-10px);
      box-shadow: 0 20px 40px rgba(49,130,206,0.15);
      border-color: #3182CE;
    }

    .product-badge {
      position: absolute;
      top: 20px;
      left: 20px;
      background: #3182CE;
      color: white;
      padding: 5px 15px;
      border-radius: 25px;
      font-size: 11px;
      font-weight: 800;
      text-transform: uppercase;
      z-index: 2;
    }

    .product-badge-hot {
      background: #1A2B3C;
      animation: pulse 2s infinite;
    }

    /* Buttons */
    .btn-system {
      display: inline-block;
      padding: 14px 32px;
      background: #3182CE;
      color: white;
      border-radius: 12px;
      text-decoration: none;
      font-weight: 700;
      font-size: 14px;
      letter-spacing: 1px;
      transition: all 0.3s ease;
      border: 2px solid #3182CE;
      cursor: pointer;
      text-transform: uppercase;
    }

    .btn-system:hover {
      background: transparent;
      color: #3182CE;
      transform: translateY(-2px);
      box-shadow: 0 10px 20px rgba(49,130,206,0.2);
    }

    .btn-outline {
      background: transparent;
      color: #3182CE;
    }

    .btn-outline:hover {
      background: #3182CE;
      color: white;
    }

    .btn-cart {
      flex: 1;
      padding: 12px 20px;
      background: #3182CE;
      color: white;
      border: none;
      border-radius: 12px;
      font-weight: 700;
      font-size: 13px;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }

    .btn-cart:hover {
      background: #1A2B3C;
    }

    .btn-favorites {
      padding: 12px 20px;
      background: white;
      color: #4A5568;
      border: 2px solid #E2E8F0;
      border-radius: 12px;
      font-weight: 700;
      font-size: 18px;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      min-width: 55px;
    }

    .btn-favorites:hover {
      transform: translateY(-2px);
      border-color: #3182CE;
      color: #3182CE;
    }

    .btn-favorites-active {
      background: #3182CE;
      border-color: #3182CE;
      color: white;
    }

    /* Newsletter Modal */
    .newsletter-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(26,43,60,0.95);
      backdrop-filter: blur(10px);
      z-index: 1000;
      display: flex;
      align-items: center;
      justify-content: center;
      animation: fadeInUp 0.3s ease;
    }

    .newsletter-modal {
      background: white;
      border-radius: 30px;
      padding: 50px;
      max-width: 500px;
      width: 90%;
      text-align: center;
      position: relative;
      animation: scaleIn 0.3s ease;
      border: 2px solid #3182CE;
    }

    .close-newsletter {
      position: absolute;
      top: 20px;
      right: 20px;
      background: none;
      border: none;
      font-size: 24px;
      cursor: pointer;
      color: #4A5568;
      transition: color 0.3s;
    }

    .close-newsletter:hover {
      color: #3182CE;
    }

    .newsletter-input {
      padding: 15px 20px;
      border: 2px solid #E2E8F0;
      border-radius: 12px;
      font-size: 16px;
      transition: all 0.3s ease;
      flex: 1;
    }

    .newsletter-input:focus {
      outline: none;
      border-color: #3182CE;
      box-shadow: 0 0 0 3px rgba(49,130,206,0.1);
    }

    /* CTA Section */
    .cta-section {
      background: linear-gradient(135deg, #1A2B3C 0%, #0F4C5C 100%);
      position: relative;
      overflow: hidden;
    }

    /* Responsive */
    @media (max-width: 1024px) {
      .hero-section { flex-direction: column; text-align: center; padding: 50px 30px !important; }
      .hero-text { margin-bottom: 50px; text-align: center; }
      .hero-subtitle { margin-left: auto; margin-right: auto; }
      .hero-stats { justify-content: center; }
    }

    @media (max-width: 768px) {
      .hero-section { padding: 40px 20px !important; }
      .hero-title { font-size: 32px !important; }
      .floating-card { width: 200px !important; height: 280px !important; }
      .features-grid, .testimonials-grid { grid-template-columns: 1fr !important; }
      .product-grid { grid-template-columns: 1fr !important; }
    }

    @media (max-width: 640px) {
      .floating-card { width: 180px !important; height: 260px !important; }
      .floating-card img { max-height: 120px !important; }
    }

    @media (max-width: 550px) {
      .floating-card { display: none; }
    }
  `;

  return (
    <>
      <style>{styles}</style>
      
      <main>
        {/* NEWSLETTER MODAL */}
        {showNewsletter && (
          <div className="newsletter-overlay" onClick={() => setShowNewsletter(false)}>
            <div className="newsletter-modal" onClick={(e) => e.stopPropagation()}>
              <button className="close-newsletter" onClick={() => setShowNewsletter(false)}>×</button>
              <i className="fas fa-envelope-open-text" style={{ fontSize: '48px', color: '#3182CE', marginBottom: '20px' }}></i>
              <h2 style={{ marginBottom: '15px', fontSize: '28px', color: '#1A2B3C' }}>Offre Exclusive !</h2>
              <p style={{ color: '#4A5568', marginBottom: '25px' }}>
                Inscrivez-vous et recevez <strong style={{ color: '#3182CE' }}>-10%</strong> sur votre première commande
              </p>
              <form onSubmit={handleSubscribe} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <input
                  type="email"
                  className="newsletter-input"
                  placeholder="Votre email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <button type="submit" className="btn-system" style={{ padding: '15px 25px' }}>
                  S'INSCRIRE
                </button>
              </form>
            </div>
          </div>
        )}

        {/* HERO SECTION - 3 IMAGES STYLE EMPILÉ DÉCALÉ */}
        <section className="hero-section" style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '60px 50px',
          minHeight: '80vh',
          gap: '40px'
        }}>
          {/* Texte à gauche */}
          <div className="hero-text" style={{ flex: 1, maxWidth: '550px' }}>
            <span style={{
              display: 'inline-block',
              background: '#3182CE',
              color: 'white',
              padding: '5px 15px',
              borderRadius: '25px',
              fontSize: '12px',
              fontWeight: '700',
              marginBottom: '20px'
            }}>
              LIVRAISON GRATUITE
            </span>
            <h1 className="hero-title" style={{
              fontSize: 'clamp(36px, 5vw, 56px)',
              fontWeight: '900',
              lineHeight: '1.1',
              marginBottom: '20px',
              color: '#1A2B3C'
            }}>
              Achetez Mieux,<br />
              <span style={{ color: '#3182CE' }}>Vivez Bien.</span>
            </h1>
            <p className="hero-subtitle" style={{
              fontSize: '16px',
              color: '#4A5568',
              marginBottom: '30px',
              lineHeight: '1.6'
            }}>
              Découvrez notre sélection premium de produits d'exception, 
              soigneusement choisis pour améliorer votre quotidien.
            </p>
            
            <div className="hero-stats" style={{
              display: 'flex',
              gap: '40px',
              marginBottom: '30px',
              flexWrap: 'wrap'
            }}>
              <div>
                <div style={{ fontSize: '28px', fontWeight: '900', color: '#3182CE' }}>10K+</div>
                <div style={{ fontSize: '12px', color: '#4A5568' }}>Clients satisfaits</div>
              </div>
              <div>
                <div style={{ fontSize: '28px', fontWeight: '900', color: '#3182CE' }}>500+</div>
                <div style={{ fontSize: '12px', color: '#4A5568' }}>Produits premium</div>
              </div>
              <div>
                <div style={{ fontSize: '28px', fontWeight: '900', color: '#3182CE' }}>24/7</div>
                <div style={{ fontSize: '12px', color: '#4A5568' }}>Support client</div>
              </div>
            </div>
            
            <Link to="/catalog" className="btn-system hero-button">
              EXPLORER LE CATALOGUE <i className="fas fa-arrow-right" style={{ marginLeft: '8px' }}></i>
            </Link>
          </div>
          
          {/* 3 IMAGES - STYLE EMPILÉ DÉCALÉ (chaque carte est visible) */}
          <div style={{
            flex: 1,
            position: 'relative',
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            minHeight: '500px'
          }}>
            {featuredProducts.slice(0, 3).map((p, index) => {
              // Positionnement décalé vers la droite
              const positions = [
                { right: '140px', top: '0px', rotate: '-8deg', zIndex: 3, className: 'floating-card-1' },   // Carte arrière gauche
                { right: '70px', top: '35px', rotate: '-2deg', zIndex: 2, className: 'floating-card-2' },    // Carte milieu
                { right: '0px', top: '70px', rotate: '5deg', zIndex: 1, className: 'floating-card-3' }       // Carte avant droite
              ];
              const pos = positions[index];
              
              return (
                <div
                  key={p.id}
                  className={`floating-card ${pos.className}`}
                  style={{
                    width: '260px',
                    height: '340px',
                    padding: '20px',
                    position: 'absolute',
                    right: pos.right,
                    top: pos.top,
                    transform: `rotate(${pos.rotate})`,
                    zIndex: pos.zIndex,
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                  onClick={() => navigate(`/product/${p.id}`)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = `rotate(0deg) scale(1.05)`;
                    e.currentTarget.style.zIndex = '10';
                    e.currentTarget.style.boxShadow = '0 30px 60px rgba(49,130,206,0.25)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = `rotate(${pos.rotate})`;
                    e.currentTarget.style.zIndex = pos.zIndex;
                    e.currentTarget.style.boxShadow = '0 25px 50px rgba(0,0,0,0.12)';
                  }}
                >
                  {/* Badge -20% */}
                  <div style={{
                    position: 'absolute',
                    top: '15px',
                    right: '15px',
                    background: '#3182CE',
                    color: 'white',
                    padding: '5px 12px',
                    borderRadius: '20px',
                    fontSize: '11px',
                    fontWeight: '800',
                    zIndex: 2
                  }}>
                    -20%
                  </div>
                  
                  {/* Image */}
                  <div style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginTop: '20px'
                  }}>
                    <img
                      src={p.imageUrl}
                      alt={p.name}
                      style={{
                        width: '85%',
                        maxHeight: '170px',
                        objectFit: 'contain',
                        transition: 'transform 0.3s'
                      }}
                    />
                  </div>
                  
                  {/* Prix et infos */}
                  <div style={{ marginTop: 'auto' }}>
                    <div style={{ fontWeight: '800', fontSize: '24px', color: '#1A2B3C' }}>
                      ${p.price?.toFixed(2)}
                    </div>
                    <div style={{ fontSize: '13px', color: '#A0AEC0', textDecoration: 'line-through' }}>
                      ${(p.price * 1.25).toFixed(2)}
                    </div>
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '8px', 
                      marginTop: '10px',
                      fontSize: '12px',
                      color: '#3182CE'
                    }}>
                      <i className="fas fa-star" style={{ color: '#FBBF24' }}></i>
                      <span>4.8/5</span>
                      <span style={{ color: '#A0AEC0' }}>(128 avis)</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* FEATURES SECTION */}
        <section className="features-section" style={{ padding: '80px 50px' }}>
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 36px)', fontWeight: '900', marginBottom: '15px', color: '#1A2B3C' }}>
              Pourquoi nous choisir ?
            </h2>
            <p style={{ color: '#4A5568', fontSize: '18px' }}>
              Une expérience d'achat unique et des avantages exclusifs
            </p>
          </div>
          
          <div className="features-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '30px',
            maxWidth: '1200px',
            margin: '0 auto'
          }}>
            {[
              { icon: 'fa-truck-fast', title: 'Livraison Express', desc: 'Livraison gratuite en 24-48h' },
              { icon: 'fa-shield-alt', title: 'Paiement Sécurisé', desc: 'Transactions 100% protégées' },
              { icon: 'fa-headset', title: 'Support 24/7', desc: 'Service client dédié' },
              { icon: 'fa-arrows-rotate', title: 'Retour Facile', desc: '30 jours pour changer d\'avis' }
            ].map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon">
                  <i className={`fas ${feature.icon}`}></i>
                </div>
                <h3 style={{ fontSize: '20px', marginBottom: '10px', fontWeight: '700', color: '#1A2B3C' }}>{feature.title}</h3>
                <p style={{ color: '#4A5568', lineHeight: '1.5' }}>{feature.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* BANNER PROMO */}
        <section className="banner-section" style={{ padding: '80px 50px', color: 'white' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
            <h2 style={{ fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: '900', marginBottom: '20px' }}>
              PROMO EXCEPTIONNELLE
            </h2>
            <p style={{ fontSize: '18px', marginBottom: '30px', opacity: 0.9 }}>
              Jusqu'à <strong style={{ fontSize: '24px', color: '#3182CE' }}>-50%</strong> sur une sélection de produits
            </p>
            
            <div className="countdown-container" style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '20px',
              marginBottom: '40px',
              flexWrap: 'wrap'
            }}>
              {[
                { label: 'Jours', value: '05' },
                { label: 'Heures', value: '12' },
                { label: 'Minutes', value: '45' },
                { label: 'Secondes', value: '30' }
              ].map((item, index) => (
                <div key={index} className="countdown-item">
                  <div style={{ fontSize: '36px', fontWeight: '900' }}>{item.value}</div>
                  <div style={{ fontSize: '12px', textTransform: 'uppercase' }}>{item.label}</div>
                </div>
              ))}
            </div>
            
            <Link to="/catalog" className="btn-system" style={{ background: 'white', color: '#1A2B3C', borderColor: 'white' }}>
              PROFITER DE L'OFFRE
            </Link>
          </div>
        </section>

        {/* PRODUCTS SECTION */}
        <section style={{
          padding: '80px 50px',
          background: '#F7FAFC'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            flexWrap: 'wrap',
            gap: '20px',
            marginBottom: '50px',
            maxWidth: '1200px',
            margin: '0 auto 50px auto'
          }}>
            <div>
              <h2 style={{ fontWeight: '900', fontSize: 'clamp(28px, 4vw, 36px)', margin: 0, color: '#1A2B3C' }}>
                Produits Vedettes
              </h2>
              <p style={{ color: '#4A5568', marginTop: '10px', fontSize: '16px' }}>
                Les coups de cœur de la semaine
              </p>
            </div>
            <Link to="/catalog" className="btn-system btn-outline" style={{ padding: '12px 24px' }}>
              Voir tout le catalogue <i className="fas fa-arrow-right"></i>
            </Link>
          </div>

          <div className="product-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '30px',
            maxWidth: '1200px',
            margin: '0 auto'
          }}>
            {featuredProducts.map((product, idx) => (
              <div
                key={product.id}
                className="product-card"
                style={{
                  backgroundColor: 'white',
                  borderRadius: '20px',
                  padding: '25px',
                  display: 'flex',
                  flexDirection: 'column',
                  boxShadow: '0 5px 15px rgba(0,0,0,0.05)',
                  position: 'relative',
                  cursor: 'pointer',
                  animationDelay: `${idx * 0.1}s`
                }}
                onClick={() => navigate(`/product/${product.id}`)}
                onMouseEnter={() => setHoveredCard(product.id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div className={`product-badge ${hoveredCard === product.id ? 'product-badge-hot' : ''}`}>
                  {hoveredCard === product.id ? '⭐ BEST SELLER' : 'VEDETTE'}
                </div>
                
                <div style={{
                  width: '100%',
                  height: '220px',
                  borderRadius: '15px',
                  overflow: 'hidden',
                  backgroundColor: '#F7FAFC',
                  marginBottom: '15px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    style={{
                      width: '90%',
                      height: '90%',
                      objectFit: 'contain',
                      transition: 'transform 0.4s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                  />
                </div>
                
                <span style={{
                  fontSize: '10px',
                  color: '#4A5568',
                  fontWeight: '800',
                  letterSpacing: '1px'
                }}>
                  PRIX UNITAIRE
                </span>
                
                <div style={{
                  fontSize: '26px',
                  fontWeight: '900',
                  margin: '5px 0',
                  color: '#3182CE'
                }}>
                  ${product.price?.toFixed(2)}
                </div>
                
                <h3 style={{
                  fontSize: '16px',
                  fontWeight: '700',
                  height: '45px',
                  overflow: 'hidden',
                  marginTop: '5px',
                  lineHeight: '1.3',
                  color: '#1A2B3C'
                }}>
                  {product.name}
                </h3>

                <div style={{
                  display: 'flex',
                  gap: '12px',
                  marginTop: '20px'
                }}>
                  <button
                    className="btn-cart"
                    onClick={(e) => handleAddToCart(product, e)}
                  >
                    {clickedProduct?.id === product.id && clickedProduct?.type === 'cart' ? (
                      <>⏳ AJOUT...</>
                    ) : (
                      <>🛒 AJOUTER</>
                    )}
                  </button>
                  
                  <button
                    className={`btn-favorites ${clickedProduct?.id === product.id && clickedProduct?.type === 'favorite' ? 'btn-favorites-active' : ''}`}
                    onClick={(e) => handleAddToFavorites(product, e)}
                  >
                    <i className="fas fa-heart"></i>
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <Link to="/catalog" className="btn-system btn-outline" style={{ padding: '15px 35px' }}>
              AFFICHER TOUS LES PRODUITS
            </Link>
          </div>
        </section>

        {/* TESTIMONIALS SECTION */}
        <section className="testimonials-section" style={{ padding: '80px 50px' }}>
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 36px)', fontWeight: '900', marginBottom: '15px', color: '#1A2B3C' }}>
              Ce que nos clients disent
            </h2>
            <p style={{ color: '#4A5568', fontSize: '18px' }}>
              Plus de 10,000 clients satisfaits à travers le monde
            </p>
          </div>
          
          <div className="testimonials-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '30px',
            maxWidth: '1200px',
            margin: '0 auto'
          }}>
            {[
              { name: 'Sophie Martin', role: 'Cliente fidèle', text: 'Excellente qualité de produits, livraison rapide et service client réactif. Je recommande vivement !' },
              { name: 'Thomas Dubois', role: 'Designer', text: 'Des produits uniques qu\'on ne trouve nulle part ailleurs. La qualité est au rendez-vous à chaque commande.' },
              { name: 'Marie Lambert', role: 'Influenceuse', text: 'Mon site préféré pour dénicher des pépites. Le rapport qualité-prix est imbattable !' }
            ].map((testimonial, index) => (
              <div key={index} className="testimonial-card">
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
                  <div className="testimonial-avatar">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <h4 style={{ fontWeight: '700', marginBottom: '5px', color: '#1A2B3C' }}>{testimonial.name}</h4>
                    <p style={{ color: '#4A5568', fontSize: '12px' }}>{testimonial.role}</p>
                  </div>
                </div>
                <div style={{ marginBottom: '15px' }}>
                  {[...Array(5)].map((_, i) => (
                    <i key={i} className="fas fa-star" style={{ color: '#FBBF24', marginRight: '3px' }}></i>
                  ))}
                </div>
                <p style={{ color: '#4A5568', lineHeight: '1.6', fontStyle: 'italic' }}>
                  "{testimonial.text}"
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA SECTION */}
        <section className="cta-section" style={{ padding: '80px 50px', textAlign: 'center' }}>
          <div style={{ maxWidth: '800px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
            <h2 style={{ fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: '900', color: 'white', marginBottom: '20px' }}>
              Prêt à transformer votre quotidien ?
            </h2>
            <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.8)', marginBottom: '30px' }}>
              Rejoignez notre communauté et bénéficiez d'offres exclusives
            </p>
            <Link to="/catalog" className="btn-system" style={{ background: 'white', color: '#1A2B3C', borderColor: 'white' }}>
              COMMENCER MAINTENANT <i className="fas fa-arrow-right"></i>
            </Link>
          </div>
        </section>
      </main>
    </>
  );
};

export default HomePage;