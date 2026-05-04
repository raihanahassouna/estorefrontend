import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productService } from '../services/productService';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    productService.getById(id).then(data => {
      setProduct(data);
      setLoading(false);
      
      // Vérifier si le produit est dans les favoris
      const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
      setIsFavorite(favorites.some(fav => fav.id === data.id));
      
      // Charger produits similaires (même catégorie)
      productService.getAll().then(allProducts => {
        const sameCategory = allProducts.filter(p => 
          p.id !== data.id && 
          (p.category?.name === data.category?.name || p.category === data.category)
        ).slice(0, 3);
        setRelatedProducts(sameCategory);
      });
    }).catch(() => setLoading(false));
  }, [id]);

  const handleAddToCart = () => {
    const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingProduct = existingCart.find(item => item.id === product.id);
    
    if (existingProduct) {
      existingProduct.quantity = (existingProduct.quantity || 1) + quantity;
    } else {
      existingCart.push({ ...product, quantity: quantity });
    }
    
    localStorage.setItem('cart', JSON.stringify(existingCart));
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleToggleFavorite = () => {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    let newFavorites;
    
    if (isFavorite) {
      newFavorites = favorites.filter(fav => fav.id !== product.id);
    } else {
      newFavorites = [...favorites, product];
    }
    
    localStorage.setItem('favorites', JSON.stringify(newFavorites));
    setIsFavorite(!isFavorite);
  };

  const handleQuantityChange = (type) => {
    if (type === 'increase') {
      setQuantity(prev => prev + 1);
    } else if (type === 'decrease' && quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const styles = `
    @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css');
    
    :root {
      --bleu-marine: #1A2B3C;
      --gris-ardoise: #4A5568;
      --blanc-casse: #F7FAFC;
      --bleu-electrique: #3182CE;
      --gris-clair: #E2E8F0;
      --gris-fonce: #2D3748;
    }
    
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(30px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    @keyframes slideInLeft {
      from { opacity: 0; transform: translateX(-50px); }
      to { opacity: 1; transform: translateX(0); }
    }
    
    @keyframes slideInRight {
      from { opacity: 0; transform: translateX(50px); }
      to { opacity: 1; transform: translateX(0); }
    }
    
    @keyframes pulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.05); }
    }
    
    @keyframes heartBeat {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.2); }
    }
    
    @keyframes shimmer {
      0% { background-position: -1000px 0; }
      100% { background-position: 1000px 0; }
    }
    
    .product-image {
      transition: all 0.4s ease;
    }
    
    .product-image:hover {
      transform: scale(1.02);
    }
    
    .quantity-btn {
      transition: all 0.3s ease;
    }
    
    .quantity-btn:hover {
      background: #3182CE;
      color: white;
      border-color: #3182CE;
    }
    
    .btn-cart {
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;
    }
    
    .btn-cart::before {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      width: 0;
      height: 0;
      border-radius: 50%;
      background: rgba(255,255,255,0.2);
      transform: translate(-50%, -50%);
      transition: width 0.6s, height 0.6s;
    }
    
    .btn-cart:hover::before {
      width: 300px;
      height: 300px;
    }
    
    .favorite-btn {
      transition: all 0.3s ease;
    }
    
    .favorite-btn:hover {
      transform: scale(1.1);
    }
    
    .favorite-active {
      animation: heartBeat 0.5s ease;
    }
    
    .cart-added {
      animation: pulse 0.3s ease;
    }
    
    .related-card {
      transition: all 0.3s ease;
      cursor: pointer;
    }
    
    .related-card:hover {
      transform: translateY(-8px);
      box-shadow: 0 15px 30px rgba(49,130,206,0.15);
    }
    
    .loading-skeleton {
      background: linear-gradient(90deg, #F7FAFC 25%, #E2E8F0 50%, #F7FAFC 75%);
      background-size: 1000px 100%;
      animation: shimmer 1.5s infinite;
      border-radius: 20px;
    }
    
    .breadcrumb-link {
      transition: all 0.3s ease;
    }
    
    .breadcrumb-link:hover {
      color: #3182CE;
    }
    
    @keyframes slideUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    .animate-up {
      animation: slideUp 0.6s ease-out;
    }
  `;

  if (loading) {
    return (
      <>
        <style>{styles}</style>
        <div style={{
          backgroundColor: '#F7FAFC',
          minHeight: '100vh',
          padding: '60px 20px'
        }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div className="loading-skeleton" style={{ height: '30px', width: '200px', marginBottom: '30px' }}></div>
            <div style={{ display: 'flex', gap: '50px', flexWrap: 'wrap' }}>
              <div className="loading-skeleton" style={{ flex: 1, height: '500px' }}></div>
              <div className="loading-skeleton" style={{ flex: 1, height: '500px' }}></div>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (!product) return (
    <div style={{
      backgroundColor: '#F7FAFC',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      gap: '20px'
    }}>
      <i className="fas fa-exclamation-triangle" style={{ fontSize: '64px', color: '#3182CE' }}></i>
      <h2 style={{ color: '#1A2B3C' }}>Produit non trouvé</h2>
      <button
        onClick={() => navigate('/catalog')}
        style={{
          padding: '12px 24px',
          backgroundColor: '#3182CE',
          color: 'white',
          border: 'none',
          borderRadius: '12px',
          cursor: 'pointer',
          fontWeight: '700'
        }}
      >
        Retour au catalogue
      </button>
    </div>
  );

  return (
    <>
      <style>{styles}</style>
      
      <div style={{
        backgroundColor: '#F7FAFC',
        minHeight: '100vh',
        padding: '60px 20px'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          
          {/* Breadcrumb */}
          <div style={{ marginBottom: '30px' }}>
            <nav style={{ display: 'flex', gap: '10px', fontSize: '14px', color: '#4A5568' }}>
              <Link to="/" className="breadcrumb-link" style={{ textDecoration: 'none', color: '#4A5568' }}>
                <i className="fas fa-home"></i> Accueil
              </Link>
              <span>/</span>
              <Link to="/catalog" className="breadcrumb-link" style={{ textDecoration: 'none', color: '#4A5568' }}>
                Catalogue
              </Link>
              <span>/</span>
              <span style={{ color: '#3182CE', fontWeight: '600' }}>{product.name}</span>
            </nav>
          </div>
          
          {/* Product Main Card */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '30px',
            padding: '40px',
            display: 'flex',
            gap: '50px',
            flexWrap: 'wrap',
            boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
            marginBottom: '60px'
          }}>
            
            {/* Image Section */}
            <div style={{ flex: 1, minWidth: '300px' }}>
              <div style={{
                backgroundColor: '#F7FAFC',
                borderRadius: '20px',
                padding: '30px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '20px',
                minHeight: '400px'
              }} className="product-image">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  style={{
                    maxWidth: '100%',
                    maxHeight: '400px',
                    objectFit: 'contain'
                  }}
                />
              </div>
              
              {/* Thumbnail images (simulées) */}
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                {[0, 1, 2].map((idx) => (
                  <div
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    style={{
                      width: '80px',
                      height: '80px',
                      backgroundColor: '#F7FAFC',
                      borderRadius: '12px',
                      padding: '10px',
                      cursor: 'pointer',
                      border: activeImage === idx ? '2px solid #3182CE' : '1px solid #E2E8F0',
                      transition: 'all 0.3s'
                    }}
                  >
                    <img
                      src={product.imageUrl}
                      alt={`Thumbnail ${idx}`}
                      style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                    />
                  </div>
                ))}
              </div>
            </div>
            
            {/* Info Section */}
            <div style={{ flex: 1, minWidth: '300px' }} className="animate-up">
              <span style={{
                fontSize: '12px',
                color: '#3182CE',
                fontWeight: '800',
                textTransform: 'uppercase',
                letterSpacing: '2px'
              }}>
                {product.category?.name || product.category || 'PRODUIT PREMIUM'}
              </span>
              
              <h1 style={{
                fontSize: 'clamp(28px, 4vw, 42px)',
                fontWeight: '900',
                margin: '15px 0 10px',
                color: '#1A2B3C',
                lineHeight: '1.2'
              }}>
                {product.name}
              </h1>
              
              {/* Rating */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                <div style={{ display: 'flex', gap: '3px' }}>
                  {[...Array(5)].map((_, i) => (
                    <i key={i} className="fas fa-star" style={{ color: '#FFB800', fontSize: '14px' }}></i>
                  ))}
                </div>
                <span style={{ fontSize: '13px', color: '#4A5568' }}>(128 avis clients)</span>
                <span style={{ fontSize: '13px', color: '#27ae60' }}>
                  <i className="fas fa-check-circle"></i> Vérifié
                </span>
              </div>
              
              {/* Stock status */}
              <div style={{ marginBottom: '20px' }}>
                {product.stock && product.stock < 10 ? (
                  <span style={{
                    color: '#FF4444',
                    fontSize: '13px',
                    fontWeight: '700'
                  }}>
                    <i className="fas fa-exclamation-circle"></i> Dernières pièces disponibles !
                  </span>
                ) : (
                  <span style={{
                    color: '#27ae60',
                    fontSize: '13px',
                    fontWeight: '700'
                  }}>
                    <i className="fas fa-check-circle"></i> En stock
                  </span>
                )}
              </div>
              
              {/* Description */}
              <p style={{
                color: '#4A5568',
                lineHeight: '1.7',
                margin: '20px 0',
                fontSize: '15px'
              }}>
                {product.description || "Découvrez ce produit d'exception, conçu avec les meilleurs matériaux pour vous offrir une expérience unique. Qualité premium et finitions soignées garanties."}
              </p>
              
              {/* Features */}
              <div style={{ margin: '20px 0', padding: '15px', backgroundColor: '#F7FAFC', borderRadius: '15px' }}>
                <h4 style={{ fontSize: '14px', fontWeight: '800', marginBottom: '10px', color: '#1A2B3C' }}>
                  <i className="fas fa-check-circle" style={{ color: '#3182CE', marginRight: '8px' }}></i>
                  Caractéristiques
                </h4>
                <ul style={{ margin: 0, paddingLeft: '20px', color: '#4A5568', fontSize: '13px' }}>
                  <li>Livraison gratuite en 24-48h</li>
                  <li>Garantie 2 ans incluse</li>
                  <li>Paiement 100% sécurisé</li>
                  <li>Retour gratuit sous 30 jours</li>
                </ul>
              </div>
              
              {/* Price */}
              <div style={{ margin: '25px 0' }}>
                <span style={{
                  fontSize: '11px',
                  fontWeight: '800',
                  color: '#4A5568',
                  textTransform: 'uppercase',
                  letterSpacing: '1px'
                }}>
                  PRIX UNITAIRE
                </span>
                <div style={{
                  fontSize: '48px',
                  fontWeight: '900',
                  color: '#3182CE'
                }}>
                  ${product.price?.toFixed(2)}
                </div>
                {product.oldPrice && (
                  <span style={{
                    fontSize: '16px',
                    color: '#4A5568',
                    textDecoration: 'line-through',
                    marginLeft: '10px'
                  }}>
                    ${product.oldPrice.toFixed(2)}
                  </span>
                )}
              </div>
              
              {/* Quantity Selector */}
              <div style={{ marginBottom: '25px' }}>
                <label style={{
                  fontSize: '13px',
                  fontWeight: '700',
                  color: '#1A2B3C',
                  display: 'block',
                  marginBottom: '10px'
                }}>
                  Quantité
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <button
                    className="quantity-btn"
                    onClick={() => handleQuantityChange('decrease')}
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '10px',
                      border: '2px solid #E2E8F0',
                      backgroundColor: 'white',
                      cursor: 'pointer',
                      fontSize: '18px',
                      fontWeight: '700'
                    }}
                  >
                    -
                  </button>
                  <span style={{
                    fontSize: '20px',
                    fontWeight: '700',
                    minWidth: '50px',
                    textAlign: 'center',
                    color: '#1A2B3C'
                  }}>
                    {quantity}
                  </span>
                  <button
                    className="quantity-btn"
                    onClick={() => handleQuantityChange('increase')}
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '10px',
                      border: '2px solid #E2E8F0',
                      backgroundColor: 'white',
                      cursor: 'pointer',
                      fontSize: '18px',
                      fontWeight: '700'
                    }}
                  >
                    +
                  </button>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                <button
                  className={`btn-cart ${addedToCart ? 'cart-added' : ''}`}
                  onClick={handleAddToCart}
                  style={{
                    flex: 2,
                    padding: '16px 32px',
                    backgroundColor: addedToCart ? '#27ae60' : '#3182CE',
                    color: 'white',
                    border: 'none',
                    borderRadius: '15px',
                    fontWeight: '800',
                    fontSize: '14px',
                    cursor: 'pointer',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px'
                  }}
                >
                  {addedToCart ? (
                    <>
                      <i className="fas fa-check"></i> AJOUTÉ AU PANIER
                    </>
                  ) : (
                    <>
                      <i className="fas fa-shopping-cart"></i> AJOUTER AU PANIER
                    </>
                  )}
                </button>
                
                <button
                  className={`favorite-btn ${isFavorite ? 'favorite-active' : ''}`}
                  onClick={handleToggleFavorite}
                  style={{
                    width: '60px',
                    padding: '16px 0',
                    backgroundColor: isFavorite ? '#FF4444' : 'white',
                    color: isFavorite ? 'white' : '#4A5568',
                    border: isFavorite ? 'none' : '2px solid #E2E8F0',
                    borderRadius: '15px',
                    cursor: 'pointer',
                    fontSize: '22px',
                    transition: 'all 0.3s'
                  }}
                >
                  <i className={`fas fa-heart ${isFavorite ? 'heart-beat' : ''}`}></i>
                </button>
              </div>
              
              {/* Delivery info */}
              <div style={{
                marginTop: '30px',
                padding: '15px',
                borderTop: '1px solid #E2E8F0',
                display: 'flex',
                gap: '20px',
                flexWrap: 'wrap'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <i className="fas fa-truck" style={{ color: '#3182CE' }}></i>
                  <span style={{ fontSize: '12px', color: '#4A5568' }}>Livraison gratuite</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <i className="fas fa-undo" style={{ color: '#3182CE' }}></i>
                  <span style={{ fontSize: '12px', color: '#4A5568' }}>Retour 30 jours</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <i className="fas fa-shield-alt" style={{ color: '#3182CE' }}></i>
                  <span style={{ fontSize: '12px', color: '#4A5568' }}>Paiement sécurisé</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Related Products Section */}
          {relatedProducts.length > 0 && (
            <div>
              <h2 style={{
                fontSize: '28px',
                fontWeight: '900',
                color: '#1A2B3C',
                marginBottom: '30px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}>
                <i className="fas fa-random" style={{ color: '#3182CE' }}></i>
                Produits similaires
              </h2>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                gap: '25px'
              }}>
                {relatedProducts.map(related => (
                  <div
                    key={related.id}
                    className="related-card"
                    onClick={() => navigate(`/product/${related.id}`)}
                    style={{
                      backgroundColor: 'white',
                      borderRadius: '20px',
                      overflow: 'hidden',
                      cursor: 'pointer',
                      transition: 'all 0.3s'
                    }}
                  >
                    <div style={{
                      height: '180px',
                      backgroundColor: '#F7FAFC',
                      padding: '20px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <img
                        src={related.imageUrl}
                        alt={related.name}
                        style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                      />
                    </div>
                    <div style={{ padding: '15px' }}>
                      <h3 style={{
                        fontSize: '14px',
                        fontWeight: '700',
                        marginBottom: '8px',
                        color: '#1A2B3C'
                      }}>
                        {related.name}
                      </h3>
                      <div style={{
                        fontSize: '18px',
                        fontWeight: '900',
                        color: '#3182CE'
                      }}>
                        ${related.price?.toFixed(2)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

// Importer Link pour le breadcrumb
import { Link } from 'react-router-dom';

export default ProductDetailPage;