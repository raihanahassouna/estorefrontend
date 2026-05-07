import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const FavoritePage = () => {
  const [favorites, setFavorites] = useState([]);
  const [addedToCart, setAddedToCart] = useState({});
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  const navigate = useNavigate();

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = () => {
    const savedFavorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    setFavorites(savedFavorites);
  };

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: '' });
    }, 2000);
  };

  const handleRemoveFromFavorites = (product, e) => {
    e.stopPropagation();
    const favs = JSON.parse(localStorage.getItem('favorites') || '[]');
    const newFavs = favs.filter(item => item.id !== product.id);
    localStorage.setItem('favorites', JSON.stringify(newFavs));
    setFavorites(newFavs);
    showToast(`${product.name} retiré des favoris ❌`, 'info');
  };

  const handleAddToCart = (product, e) => {
    e.stopPropagation();
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
      existing.quantity = (existing.quantity || 1) + 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    setAddedToCart({ [product.id]: true });
    showToast(`${product.name} ajouté au panier !`, 'success');
    setTimeout(() => setAddedToCart({}), 1500);
  };

  const handleViewDetails = (id, e) => {
    e.stopPropagation();
    navigate(`/product/${id}`);
  };

  const clearAllFavorites = () => {
    if (window.confirm('Voulez-vous vraiment supprimer tous vos favoris ?')) {
      localStorage.setItem('favorites', '[]');
      setFavorites([]);
      showToast('Tous les favoris ont été supprimés', 'info');
    }
  };

  const renderStars = (rate = 0) =>
    [1, 2, 3, 4, 5].map(i => (
      <i
        key={i}
        className="fas fa-star"
        style={{ color: i <= Math.round(rate) ? '#FFB800' : '#E2E8F0', fontSize: '11px' }}
      />
    ));

  const styles = `
    @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css');

    :root {
      --bleu-marine: #1A2B3C;
      --gris-ardoise: #4A5568;
      --blanc-casse: #F7FAFC;
      --bleu-electrique: #3182CE;
      --gris-clair: #E2E8F0;
    }

    @keyframes fadeIn { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
    @keyframes toastSlideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
    @keyframes pulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.05)} }

    .favorite-card {
      animation: fadeIn 0.4s ease-out backwards;
      transition: all 0.3s cubic-bezier(0.4,0,0.2,1);
      cursor: pointer;
    }
    .favorite-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 15px 30px rgba(49,130,206,0.15);
    }
    .action-btn {
      padding: 8px 16px;
      border-radius: 10px;
      font-weight: 600;
      font-size: 12px;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      border: none;
    }
    .action-btn:hover { transform: translateY(-2px); }
    .toast-notification {
      position: fixed;
      bottom: 30px;
      right: 30px;
      background: rgba(26,43,60,0.95);
      backdrop-filter: blur(8px);
      color: white;
      padding: 14px 24px;
      border-radius: 12px;
      box-shadow: 0 10px 25px rgba(0,0,0,0.2);
      z-index: 1000;
      animation: toastSlideIn 0.3s ease-out;
      font-weight: 600;
      font-size: 14px;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .toast-notification.success { border-left: 4px solid #27ae60; }
    .toast-notification.info { border-left: 4px solid #3182CE; }
    .empty-state {
      text-align: center;
      padding: 60px 20px;
      animation: fadeIn 0.5s ease-out;
    }
  `;

  return (
    <>
      <style>{styles}</style>
      
      {/* Toast Notification */}
      {toast.show && (
        <div className={`toast-notification ${toast.type}`}>
          <i className={`fas ${toast.type === 'success' ? 'fa-heart' : 'fa-trash-alt'}`}></i>
          {toast.message}
        </div>
      )}

      <div style={{ padding: '40px', backgroundColor: '#F7FAFC', minHeight: '80vh' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          
          {/* Header */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '30px',
            flexWrap: 'wrap',
            gap: '15px'
          }}>
            <div>
              <h1 style={{ 
                fontSize: '32px', 
                fontWeight: '900', 
                color: '#1A2B3C',
                marginBottom: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <i className="fas fa-heart" style={{ color: '#FF4444' }}></i>
                Mes Favoris
              </h1>
              <p style={{ color: '#4A5568', fontSize: '14px' }}>
                <i className="fas fa-box-heart"></i> {favorites.length} produit(s) dans votre wishlist
              </p>
            </div>
            
            {favorites.length > 0 && (
              <button
                onClick={clearAllFavorites}
                style={{
                  padding: '10px 20px',
                  backgroundColor: 'white',
                  color: '#e74c3c',
                  border: '2px solid #e74c3c',
                  borderRadius: '12px',
                  fontWeight: '700',
                  fontSize: '13px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
                onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#e74c3c'; e.currentTarget.style.color = 'white'; }}
                onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'white'; e.currentTarget.style.color = '#e74c3c'; }}
              >
                <i className="fas fa-trash-alt"></i> Tout supprimer
              </button>
            )}
          </div>

          {/* Favorite Products Grid */}
          {favorites.length > 0 ? (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '25px'
            }}>
              {favorites.map((product, index) => (
                <div
                  key={product.id}
                  className="favorite-card"
                  style={{
                    backgroundColor: 'white',
                    borderRadius: '20px',
                    overflow: 'hidden',
                    position: 'relative',
                    animationDelay: `${index * 0.05}s`,
                    boxShadow: '0 5px 15px rgba(0,0,0,0.05)'
                  }}
                  onClick={(e) => handleViewDetails(product.id, e)}
                >
                  {/* Remove favorite button */}
                  <button
                    onClick={(e) => handleRemoveFromFavorites(product, e)}
                    style={{
                      position: 'absolute',
                      top: '15px',
                      right: '15px',
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      backgroundColor: 'white',
                      color: '#FF4444',
                      border: 'none',
                      cursor: 'pointer',
                      zIndex: 10,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '18px',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#FF4444'; e.currentTarget.style.color = 'white'; }}
                    onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'white'; e.currentTarget.style.color = '#FF4444'; }}
                  >
                    <i className="fas fa-times"></i>
                  </button>

                  {/* Product Image */}
                  <div style={{
                    height: '220px',
                    padding: '25px',
                    backgroundColor: '#F7FAFC',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden'
                  }}>
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain',
                        transition: 'transform 0.4s ease'
                      }}
                      onError={e => { e.target.src = 'https://via.placeholder.com/200x200?text=Image'; }}
                    />
                  </div>

                  {/* Product Info */}
                  <div style={{ padding: '20px' }}>
                    <span style={{
                      fontSize: '10px',
                      color: '#3182CE',
                      fontWeight: '800',
                      textTransform: 'uppercase',
                      letterSpacing: '1px'
                    }}>
                      {product.categoryName || 'PRODUIT'}
                    </span>
                    
                    <h3 style={{
                      fontSize: '16px',
                      fontWeight: '700',
                      margin: '10px 0',
                      height: '44px',
                      overflow: 'hidden',
                      color: '#1A2B3C',
                      lineHeight: '1.4'
                    }}>
                      {product.name}
                    </h3>
                    
                    <div style={{
                      fontSize: '26px',
                      fontWeight: '900',
                      color: '#3182CE',
                      marginBottom: '12px'
                    }}>
                      {product.price?.toFixed(2)} DH
                    </div>

                    {/* Rating */}
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '8px', 
                      marginBottom: '16px' 
                    }}>
                      <div style={{ display: 'flex', gap: '3px' }}>
                        {renderStars(product.ratingRate)}
                      </div>
                      <span style={{ fontSize: '12px', color: '#4A5568' }}>
                        ({product.ratingCount ?? 0} avis)
                      </span>
                    </div>

                    {/* Action Buttons */}
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button
                        className="action-btn"
                        onClick={(e) => handleAddToCart(product, e)}
                        style={{
                          flex: 1,
                          backgroundColor: addedToCart[product.id] ? '#27ae60' : '#3182CE',
                          color: 'white'
                        }}
                      >
                        {addedToCart[product.id] ? (
                          <><i className="fas fa-check"></i> AJOUTÉ</>
                        ) : (
                          <><i className="fas fa-shopping-cart"></i> PANIER</>
                        )}
                      </button>
                      
                      <button
                        className="action-btn"
                        onClick={(e) => handleViewDetails(product.id, e)}
                        style={{
                          backgroundColor: 'transparent',
                          color: '#3182CE',
                          border: '2px solid #3182CE'
                        }}
                      >
                        <i className="fas fa-eye"></i> DÉTAILS
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="empty-state" style={{
              backgroundColor: 'white',
              borderRadius: '20px',
              padding: '80px 40px',
              textAlign: 'center'
            }}>
              <i className="fas fa-heart-broken" style={{ 
                fontSize: '80px', 
                color: '#E2E8F0',
                marginBottom: '20px'
              }}></i>
              <h2 style={{ 
                fontSize: '28px', 
                color: '#1A2B3C', 
                marginBottom: '12px',
                fontWeight: '800'
              }}>
                Votre liste de favoris est vide
              </h2>
              <p style={{ 
                color: '#4A5568', 
                fontSize: '16px',
                marginBottom: '30px',
                maxWidth: '450px',
                margin: '0 auto 30px'
              }}>
                Explorez notre catalogue et ajoutez vos produits préférés en cliquant sur le ❤️
              </p>
              <button
                onClick={() => navigate('/catalog')}
                style={{
                  padding: '14px 32px',
                  backgroundColor: '#3182CE',
                  color: 'white',
                  border: 'none',
                  borderRadius: '50px',
                  fontWeight: '700',
                  fontSize: '15px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '10px'
                }}
                onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#1A2B3C'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#3182CE'; e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                <i className="fas fa-shopping-bag"></i> Découvrir les produits
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default FavoritePage;