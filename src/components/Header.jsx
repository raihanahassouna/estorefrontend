import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();
  const [cartCount, setCartCount] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    // Récupérer le nombre d'articles dans le panier
    const updateCartCount = () => {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      const count = cart.reduce((total, item) => total + (item.quantity || 1), 0);
      setCartCount(count);
    };

    updateCartCount();
    window.addEventListener('storage', updateCartCount);
    
    // Vérifier si l'utilisateur est connecté
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);

    // Effet de scroll
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('storage', updateCartCount);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    navigate('/');
  };

  const styles = `
    @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css');
    
    .nav-link {
      position: relative;
      text-decoration: none;
      color: #1A2B3C;
      font-weight: 600;
      font-size: 14px;
      text-transform: uppercase;
      transition: all 0.3s ease;
      letter-spacing: 0.5px;
    }
    
    .nav-link:hover {
      color: #3182CE;
    }
    
    .nav-link::after {
      content: '';
      position: absolute;
      width: 0;
      height: 2px;
      bottom: -5px;
      left: 0;
      background: #3182CE;
      transition: width 0.3s ease;
    }
    
    .nav-link:hover::after {
      width: 100%;
    }
    
    .btn-system {
      background: #3182CE;
      color: white;
      padding: 10px 22px;
      border-radius: 12px;
      font-weight: 700;
      text-transform: uppercase;
      font-size: 12px;
      transition: all 0.3s ease;
      border: none;
      cursor: pointer;
      text-decoration: none;
      letter-spacing: 0.5px;
      box-shadow: 0 2px 5px rgba(49,130,206,0.2);
    }
    
    .btn-system:hover {
      background: #1A2B3C;
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(49,130,206,0.3);
    }
    
    .btn-outline {
      border: 2px solid #3182CE;
      background: transparent;
      padding: 8px 18px;
      border-radius: 12px;
      font-weight: 700;
      font-size: 12px;
      text-transform: uppercase;
      text-decoration: none;
      color: #3182CE;
      transition: all 0.3s ease;
      letter-spacing: 0.5px;
    }
    
    .btn-outline:hover {
      background: #3182CE;
      color: white;
      transform: translateY(-2px);
    }
    
    .cart-badge {
      background: #3182CE;
      color: white;
      padding: 2px 8px;
      border-radius: 50%;
      font-size: 10px;
      font-weight: 800;
      margin-left: 8px;
      transition: all 0.3s ease;
    }
    
    .cart-icon {
      transition: transform 0.3s ease;
    }
    
    .btn-outline:hover .cart-icon {
      transform: scale(1.1);
    }
    
    .logo {
      position: relative;
      transition: all 0.3s ease;
    }
    
    .logo:hover {
      transform: scale(1.02);
    }
    
    .logo-glow {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: radial-gradient(circle, rgba(49,130,206,0.1), transparent);
      opacity: 0;
      transition: opacity 0.3s;
      border-radius: 8px;
    }
    
    .logo:hover .logo-glow {
      opacity: 1;
    }
    
    @keyframes pulse {
      0%, 100% {
        transform: scale(1);
      }
      50% {
        transform: scale(1.2);
      }
    }
    
    .cart-update {
      animation: pulse 0.3s ease;
    }
    
    .header-scrolled {
      box-shadow: 0 5px 20px rgba(0,0,0,0.05);
    }
  `;

  return (
    <>
      <style>{styles}</style>
      
      <header style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: isScrolled ? '15px 40px' : '20px 40px',
        backgroundColor: '#F7FAFC',
        borderBottom: '1px solid #E2E8F0',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        transition: 'all 0.3s ease',
        boxShadow: isScrolled ? '0 5px 20px rgba(0,0,0,0.05)' : 'none'
      }} className={isScrolled ? 'header-scrolled' : ''}>
        
        {/* Logo */}
        <Link to="/" className="logo" style={{
          textDecoration: 'none',
          color: '#1A2B3C',
          fontSize: '24px',
          fontWeight: '900',
          letterSpacing: '-0.5px',
          position: 'relative'
        }}>
          VotrE<span style={{ color: '#3182CE' }}>Boutique</span>™
          <div className="logo-glow"></div>
        </Link>
        
        {/* Navigation */}
        <nav style={{
          display: 'flex',
          gap: '35px',
          alignItems: 'center'
        }}>
          <Link to="/" className="nav-link">
            <i className="fas fa-home" style={{ marginRight: '6px', fontSize: '12px' }}></i>
            ACCUEIL
          </Link>
          <Link to="/catalog" className="nav-link">
            <i className="fas fa-box" style={{ marginRight: '6px', fontSize: '12px' }}></i>
            PRODUITS
          </Link>
          <Link to="/favorites" className="nav-link">
            <i className="fas fa-heart" style={{ marginRight: '6px', fontSize: '12px' }}></i>
            FAVORIS
          </Link>
          <Link to="/about" className="nav-link">
            <i className="fas fa-info-circle" style={{ marginRight: '6px', fontSize: '12px' }}></i>
            À PROPOS
          </Link>
        </nav>

        {/* Actions */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '15px'
        }}>
          <Link
            to="/cart"
            className="btn-outline"
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <i className="fas fa-shopping-cart cart-icon"></i>
            PANIER
            {cartCount > 0 && (
              <span className={`cart-badge ${cartCount > 0 ? 'cart-update' : ''}`}>
                {cartCount}
              </span>
            )}
          </Link>
          
          {isLoggedIn ? (
            <>
              <Link to="/profile" className="nav-link" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <i className="fas fa-user"></i>
                PROFIL
              </Link>
              <button onClick={handleLogout} className="btn-system" style={{ padding: '8px 18px' }}>
                <i className="fas fa-sign-out-alt" style={{ marginRight: '6px' }}></i>
                DÉCONNEXION
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link" style={{ fontSize: '13px' }}>
                <i className="fas fa-key" style={{ marginRight: '6px' }}></i>
                CONNEXION
              </Link>
              <Link to="/register" className="btn-system">
                <i className="fas fa-user-plus" style={{ marginRight: '6px' }}></i>
                INSCRIPTION
              </Link>
            </>
          )}
        </div>
      </header>
    </>
  );
};

export default Header;