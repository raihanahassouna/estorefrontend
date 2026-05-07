import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { productService } from '../services/productService';
import { categoryService } from '../services/categoryService';

const CatalogPage = () => {
  const [products, setProducts]               = useState([]);
  const [categories, setCategories]           = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm]           = useState('');
  const [sortBy, setSortBy]                   = useState('default');
  const [isLoading, setIsLoading]             = useState(true);
  const [viewMode, setViewMode]               = useState('grid');
  const [hoveredProduct, setHoveredProduct]   = useState(null);
  const [addedToCart, setAddedToCart]         = useState({});
  const [addedToFavorites, setAddedToFavorites] = useState({});
  const [favorites, setFavorites]             = useState([]);
  
  // État pour la notification toast
  const [toast, setToast] = useState({ show: false, message: '', type: '' });

  const navigate = useNavigate();
  const location = useLocation();

  // Fonction pour afficher une notification temporaire
  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: '' });
    }, 2000);
  };

  useEffect(() => {
    Promise.all([
      productService.getAll(),
      categoryService.getAll()
    ])
      .then(([productsData, categoriesData]) => {
        const prods = productsData || [];
        setProducts(prods);
        if (categoriesData && categoriesData.length > 0) {
          setCategories(categoriesData);
        } else {
          const unique = [...new Set(prods.map(p => p.categoryName).filter(Boolean))];
          setCategories(unique.map(name => ({ name })));
        }
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Erreur chargement catalogue:', err);
        setIsLoading(false);
      });

    const savedFavorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    setFavorites(savedFavorites);

    const params = new URLSearchParams(location.search);
    const categoryParam = params.get('category');
    if (categoryParam) setSelectedCategory(categoryParam);
  }, [location]);

  const getCategoryName = (p) =>
    p.categoryName || p.category?.name || p.category || '';

  const filteredProducts = products.filter(p => {
    if (selectedCategory !== 'All') {
      const cat = getCategoryName(p);
      if (cat.trim().toLowerCase() !== selectedCategory.trim().toLowerCase()) return false;
    }
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      return (
        p.name?.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-asc':  return a.price - b.price;
      case 'price-desc': return b.price - a.price;
      case 'name-asc':   return a.name?.localeCompare(b.name);
      case 'name-desc':  return b.name?.localeCompare(a.name);
      default:           return 0;
    }
  });

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

  const handleAddToFavorites = (product, e) => {
    e.stopPropagation();
    const favs = JSON.parse(localStorage.getItem('favorites') || '[]');
    const exists = favs.some(item => item.id === product.id);
    let newFavs;
    let message;
    
    if (exists) {
      newFavs = favs.filter(item => item.id !== product.id);
      message = `${product.name} retiré des favoris ❌`;
      showToast(message, 'info');
    } else {
      newFavs = [...favs, product];
      message = `${product.name} ajouté aux favoris ❤️`;
      showToast(message, 'success');
    }
    
    localStorage.setItem('favorites', JSON.stringify(newFavs));
    setFavorites(newFavs);
    setAddedToFavorites({ [product.id]: !exists });
    setTimeout(() => setAddedToFavorites({}), 1000);
  };

  const isFavorite = (id) => favorites.some(item => item.id === id);

  const handleViewDetails = (id, e) => {
    e.stopPropagation();
    navigate(`/product/${id}`);
  };

  const countByCategory = (catName) =>
    products.filter(p => getCategoryName(p).toLowerCase() === catName.toLowerCase()).length;

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
      --gris-fonce: #2D3748;
    }

    @keyframes fadeIn  { from{opacity:0;transform:translateY(20px)}  to{opacity:1;transform:translateY(0)} }
    @keyframes shimmer { 0%{background-position:-1000px 0} 100%{background-position:1000px 0} }
    @keyframes slideIn { from{opacity:0;transform:translateX(-20px)} to{opacity:1;transform:translateX(0)} }
    @keyframes heartBeat{ 0%,100%{transform:scale(1)} 50%{transform:scale(1.3)} }
    @keyframes pulse   { 0%,100%{transform:scale(1)} 50%{transform:scale(1.1)} }
    @keyframes toastSlideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }

    .product-card {
      animation: fadeIn 0.5s ease-out backwards;
      transition: all 0.3s cubic-bezier(0.4,0,0.2,1);
      cursor: pointer;
    }
    .product-card:hover {
      transform: translateY(-8px);
      box-shadow: 0 20px 40px rgba(49,130,206,0.15);
    }
    .product-card-list {
      animation: slideIn 0.5s ease-out backwards;
      transition: all 0.3s ease;
      cursor: pointer;
    }
    .product-card-list:hover {
      transform: translateX(8px);
      box-shadow: 0 10px 30px rgba(49,130,206,0.1);
    }
    .category-item { transition:all 0.3s ease; cursor:pointer; }
    .category-item:hover { transform:translateX(5px); color:#3182CE; }

    .btn-catalog {
      transition:all 0.3s ease; position:relative; overflow:hidden;
    }
    .btn-catalog::before {
      content:''; position:absolute; top:50%; left:50%;
      width:0; height:0; border-radius:50%;
      background:rgba(49,130,206,0.2);
      transform:translate(-50%,-50%);
      transition:width 0.6s, height 0.6s;
    }
    .btn-catalog:hover::before { width:300px; height:300px; }

    .loading-skeleton {
      background:linear-gradient(90deg,#F7FAFC 25%,#E2E8F0 50%,#F7FAFC 75%);
      background-size:1000px 100%;
      animation:shimmer 1.5s infinite;
    }

    .search-input:focus {
      outline:none; border-color:#3182CE;
      box-shadow:0 0 0 3px rgba(49,130,206,0.1);
    }
    select:focus { outline:none; border-color:#3182CE; }

    .cart-added,.favorite-added { animation:pulse 0.3s ease; }
    .favorite-heart { transition:all 0.3s ease; }
    .favorite-heart:hover { transform:scale(1.1); }
    .heart-beat { animation:heartBeat 0.5s ease; }

    .scrollbar-custom::-webkit-scrollbar { width:4px; }
    .scrollbar-custom::-webkit-scrollbar-track { background:#E2E8F0; border-radius:10px; }
    .scrollbar-custom::-webkit-scrollbar-thumb { background:#3182CE; border-radius:10px; }

    .btn-details { transition:all 0.3s ease; }
    .btn-details:hover { background:#1A2B3C !important; transform:translateY(-2px); }

    .action-buttons { display:flex; gap:10px; margin-top:15px; }
    .action-btn {
      flex:1; padding:10px; border-radius:10px;
      font-weight:700; font-size:12px; cursor:pointer;
      transition:all 0.3s ease;
      display:flex; align-items:center; justify-content:center; gap:6px; border:none;
    }

    .product-img {
      width:100%; height:100%; object-fit:contain;
      transition:transform 0.4s ease;
    }
    .product-card:hover .product-img { transform:scale(1.06); }

    .toast-notification {
      position: fixed;
      bottom: 30px;
      right: 30px;
      background: #1A2B3C;
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
      backdrop-filter: blur(8px);
      background: rgba(26,43,60,0.95);
      border-left: 4px solid #3182CE;
    }
    
    .toast-notification.success { border-left-color: #27ae60; }
    .toast-notification.info { border-left-color: #3182CE; }
    .toast-notification.error { border-left-color: #e74c3c; }
  `;

  if (isLoading) {
    return (
      <>
        <style>{styles}</style>
        <div style={{ padding:'40px', backgroundColor:'#F7FAFC', minHeight:'80vh' }}>
          <div style={{ maxWidth:'1400px', margin:'0 auto' }}>
            <div className="loading-skeleton" style={{ height:'40px', width:'200px', borderRadius:'8px', marginBottom:'30px' }} />
            <div style={{ display:'flex', gap:'30px', flexWrap:'wrap' }}>
              <div className="loading-skeleton" style={{ width:'250px', height:'400px', borderRadius:'20px' }} />
              <div style={{ flex:1 }}>
                <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))', gap:'25px' }}>
                  {[1,2,3,4,5,6].map(i => (
                    <div key={i} className="loading-skeleton" style={{ height:'380px', borderRadius:'20px' }} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{styles}</style>

      {/* Toast Notification */}
      {toast.show && (
        <div className={`toast-notification ${toast.type}`}>
          <i className={`fas ${toast.type === 'success' ? 'fa-heart' : toast.type === 'info' ? 'fa-trash-alt' : 'fa-exclamation-circle'}`}></i>
          {toast.message}
        </div>
      )}

      <div style={{ display:'flex', gap:'30px', padding:'40px', backgroundColor:'#F7FAFC', minHeight:'80vh' }}>
        {/* Sidebar - same as before */}
        <aside
          className="scrollbar-custom"
          style={{
            width:'280px', flexShrink:0,
            position:'sticky', top:'100px',
            height:'fit-content', maxHeight:'calc(100vh - 120px)', overflowY:'auto',
            backgroundColor:'white', borderRadius:'20px', padding:'25px',
            boxShadow:'0 5px 15px rgba(0,0,0,0.05)'
          }}
        >
          <h2 style={{ fontWeight:'900', fontSize:'20px', marginBottom:'25px', color:'#1A2B3C', display:'flex', alignItems:'center', gap:'10px' }}>
            <i className="fas fa-filter" style={{ color:'#3182CE' }} /> FILTRES
          </h2>

          <div style={{ marginBottom:'25px' }}>
            <h3 style={{ fontSize:'12px', fontWeight:'800', textTransform:'uppercase', color:'#3182CE', marginBottom:'15px', letterSpacing:'1px' }}>
              <i className="fas fa-tag" style={{ marginRight:'8px' }} /> CATÉGORIES
            </h3>

            <div
              onClick={() => setSelectedCategory('All')}
              className="category-item"
              style={{
                padding:'10px 12px', marginBottom:'5px', borderRadius:'10px',
                fontWeight: selectedCategory === 'All' ? '800' : '500',
                backgroundColor: selectedCategory === 'All' ? '#3182CE' : 'transparent',
                color: selectedCategory === 'All' ? 'white' : '#4A5568',
                transition:'all 0.3s'
              }}
            >
              <i className="fas fa-th-large" style={{ marginRight:'10px', width:'20px' }} />
              Tous les produits
              <span style={{ float:'right', fontSize:'12px', opacity:0.7 }}>{products.length}</span>
            </div>

            {categories.map(cat => (
              <div
                key={cat.id || cat.name}
                onClick={() => setSelectedCategory(cat.name)}
                className="category-item"
                style={{
                  padding:'10px 12px', marginBottom:'5px', borderRadius:'10px',
                  fontWeight: selectedCategory === cat.name ? '800' : '500',
                  backgroundColor: selectedCategory === cat.name ? '#3182CE' : 'transparent',
                  color: selectedCategory === cat.name ? 'white' : '#4A5568',
                  transition:'all 0.3s'
                }}
              >
                <i className="fas fa-folder" style={{ marginRight:'10px', width:'20px' }} />
                {cat.name}
                <span style={{ float:'right', fontSize:'12px', opacity:0.7 }}>
                  {countByCategory(cat.name)}
                </span>
              </div>
            ))}
          </div>

          <div style={{ paddingTop:'20px', borderTop:'1px solid #E2E8F0' }}>
            <h3 style={{ fontSize:'12px', fontWeight:'800', textTransform:'uppercase', color:'#3182CE', marginBottom:'15px', letterSpacing:'1px' }}>
              <i className="fas fa-chart-line" style={{ marginRight:'8px' }} /> INFORMATIONS
            </h3>
            <div style={{ color:'#4A5568', fontSize:'13px', lineHeight:'1.8' }}>
              <div><i className="fas fa-cube"  style={{ width:'25px', color:'#3182CE' }} /> Produits : {filteredProducts.length}</div>
              <div><i className="fas fa-tags"  style={{ width:'25px', color:'#3182CE' }} /> Catégories : {categories.length}</div>
              <div><i className="fas fa-heart" style={{ width:'25px', color:'#3182CE' }} /> Favoris : {favorites.length}</div>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <div style={{ flex:1 }}>
          {/* Search/sort bar */}
          <div style={{ backgroundColor:'white', borderRadius:'20px', padding:'20px 25px', marginBottom:'30px', boxShadow:'0 5px 15px rgba(0,0,0,0.05)' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:'15px' }}>
              <div>
                <h1 style={{ fontSize:'28px', fontWeight:'900', color:'#1A2B3C', marginBottom:'5px' }}>
                  {selectedCategory === 'All' ? 'Catalogue Complet' : selectedCategory}
                </h1>
                <p style={{ color:'#4A5568', fontSize:'14px' }}>
                  <i className="fas fa-boxes" /> {filteredProducts.length} produit(s) trouvé(s)
                </p>
              </div>

              <div style={{ display:'flex', gap:'12px', alignItems:'center', flexWrap:'wrap' }}>
                <div style={{ position:'relative' }}>
                  <i className="fas fa-search" style={{ position:'absolute', left:'15px', top:'50%', transform:'translateY(-50%)', color:'#4A5568' }} />
                  <input
                    type="text"
                    className="search-input"
                    placeholder="Rechercher un produit..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    style={{ padding:'12px 15px 12px 45px', border:'2px solid #E2E8F0', borderRadius:'12px', fontSize:'14px', width:'250px', transition:'all 0.3s' }}
                  />
                </div>

                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                  style={{ padding:'12px 15px', border:'2px solid #E2E8F0', borderRadius:'12px', fontSize:'13px', fontWeight:'500', backgroundColor:'white', cursor:'pointer' }}
                >
                  <option value="default">Trier par</option>
                  <option value="price-asc">Prix croissant ↑</option>
                  <option value="price-desc">Prix décroissant ↓</option>
                  <option value="name-asc">Nom A → Z</option>
                  <option value="name-desc">Nom Z → A</option>
                </select>

                <div style={{ display:'flex', border:'2px solid #E2E8F0', borderRadius:'12px', overflow:'hidden' }}>
                  {['grid','list'].map(mode => (
                    <button
                      key={mode}
                      onClick={() => setViewMode(mode)}
                      style={{ padding:'10px 15px', backgroundColor: viewMode === mode ? '#3182CE' : 'white', color: viewMode === mode ? 'white' : '#4A5568', border:'none', cursor:'pointer', transition:'all 0.3s' }}
                    >
                      <i className={`fas fa-${mode === 'grid' ? 'th' : 'list'}`} />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Products display (same logic, but we keep as before) */}
          {sortedProducts.length > 0 ? (
            viewMode === 'grid' ? (
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:'25px' }}>
                {sortedProducts.map((p, index) => (
                  <div
                    key={p.id}
                    className="product-card"
                    style={{ backgroundColor:'white', borderRadius:'20px', overflow:'hidden', position:'relative', animationDelay:`${index * 0.05}s` }}
                    onMouseEnter={() => setHoveredProduct(p.id)}
                    onMouseLeave={() => setHoveredProduct(null)}
                    onClick={(e) => handleViewDetails(p.id, e)}
                  >
                    <button
                      className={`favorite-heart ${addedToFavorites[p.id] !== undefined ? 'heart-beat' : ''}`}
                      onClick={(e) => handleAddToFavorites(p, e)}
                      style={{ position:'absolute', top:'15px', right:'15px', width:'40px', height:'40px', borderRadius:'50%', backgroundColor: isFavorite(p.id) ? '#FF4444' : 'white', color: isFavorite(p.id) ? 'white' : '#4A5568', border:'none', cursor:'pointer', zIndex:10, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'18px', boxShadow:'0 2px 10px rgba(0,0,0,0.1)', transition:'all 0.3s ease' }}
                    >
                      <i className="fas fa-heart" />
                    </button>

                    {p.stock != null && p.stock < 10 && (
                      <div style={{ position:'absolute', top:'15px', left:'15px', background:'#FF4444', color:'white', padding:'4px 12px', borderRadius:'20px', fontSize:'10px', fontWeight:'800', zIndex:2 }}>
                        DERNIÈRES PIÈCES
                      </div>
                    )}

                    <div style={{ height:'220px', padding:'25px', backgroundColor:'#F7FAFC', display:'flex', alignItems:'center', justifyContent:'center', overflow:'hidden' }}>
                      <img
                        src={p.imageUrl}
                        alt={p.name}
                        className="product-img"
                        onError={e => { e.target.src = 'https://via.placeholder.com/200x200?text=Image'; }}
                      />
                    </div>

                    <div style={{ padding:'20px' }}>
                      <span style={{ fontSize:'10px', color:'#3182CE', fontWeight:'800', textTransform:'uppercase', letterSpacing:'1px' }}>
                        {getCategoryName(p) || 'PRODUIT'}
                      </span>
                      <h3 style={{ fontSize:'15px', fontWeight:'700', margin:'8px 0', height:'42px', overflow:'hidden', color:'#1A2B3C', lineHeight:'1.4' }}>
                        {p.name}
                      </h3>
                      <div style={{ fontSize:'24px', fontWeight:'900', color:'#3182CE', marginBottom:'8px' }}>
                        {p.price?.toFixed(2)} DH
                      </div>

                      <div style={{ display:'flex', alignItems:'center', gap:'6px', marginBottom:'14px' }}>
                        <div style={{ display:'flex', gap:'2px' }}>
                          {renderStars(p.ratingRate)}
                        </div>
                        <span style={{ fontSize:'11px', color:'#4A5568' }}>
                          ({p.ratingCount ?? 0} avis)
                        </span>
                      </div>

                      <div className="action-buttons">
                        <button
                          className="action-btn btn-catalog"
                          onClick={e => handleAddToCart(p, e)}
                          style={{ backgroundColor: addedToCart[p.id] ? '#27ae60' : '#3182CE', color:'white' }}
                        >
                          {addedToCart[p.id]
                            ? <><i className="fas fa-check" /> AJOUTÉ</>
                            : <><i className="fas fa-shopping-cart" /> PANIER</>}
                        </button>
                        <button
                          className="action-btn btn-details"
                          onClick={e => handleViewDetails(p.id, e)}
                          style={{ backgroundColor:'transparent', color:'#3182CE', border:'2px solid #3182CE' }}
                        >
                          <i className="fas fa-eye" /> DÉTAILS
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ display:'flex', flexDirection:'column', gap:'15px' }}>
                {sortedProducts.map((p, index) => (
                  <div
                    key={p.id}
                    className="product-card-list"
                    style={{ backgroundColor:'white', borderRadius:'15px', padding:'20px', display:'flex', gap:'20px', alignItems:'center', animationDelay:`${index * 0.05}s`, position:'relative' }}
                    onClick={e => handleViewDetails(p.id, e)}
                  >
                    <button
                      onClick={e => handleAddToFavorites(p, e)}
                      style={{ position:'absolute', top:'15px', right:'15px', background:'none', border:'none', fontSize:'22px', cursor:'pointer', color: isFavorite(p.id) ? '#FF4444' : '#ccc', transition:'all 0.3s' }}
                    >
                      <i className="fas fa-heart" />
                    </button>

                    <div style={{ width:'100px', height:'100px', backgroundColor:'#F7FAFC', borderRadius:'12px', display:'flex', alignItems:'center', justifyContent:'center', padding:'10px', flexShrink:0 }}>
                      <img
                        src={p.imageUrl}
                        alt={p.name}
                        style={{ maxWidth:'100%', maxHeight:'100%', objectFit:'contain' }}
                        onError={e => { e.target.src = 'https://via.placeholder.com/100?text=IMG'; }}
                      />
                    </div>

                    <div style={{ flex:1, minWidth:0 }}>
                      <span style={{ fontSize:'11px', color:'#3182CE', fontWeight:'700' }}>
                        {getCategoryName(p) || 'PRODUIT'}
                      </span>
                      <h3 style={{ fontSize:'16px', fontWeight:'700', margin:'5px 0', color:'#1A2B3C' }}>{p.name}</h3>
                      <p style={{ fontSize:'13px', color:'#4A5568', marginBottom:'8px', overflow:'hidden', whiteSpace:'nowrap', textOverflow:'ellipsis' }}>
                        {p.description?.substring(0, 120)}…
                      </p>
                      <div style={{ display:'flex', gap:'15px', alignItems:'center', flexWrap:'wrap' }}>
                        <div style={{ fontSize:'20px', fontWeight:'900', color:'#3182CE' }}>{p.price?.toFixed(2)} DH</div>
                        <div style={{ display:'flex', gap:'2px' }}>{renderStars(p.ratingRate)}</div>
                        <span style={{ fontSize:'11px', color:'#4A5568' }}>({p.ratingCount ?? 0})</span>
                      </div>
                    </div>

                    <div className="action-buttons" style={{ flexDirection:'column', minWidth:'120px' }}>
                      <button
                        className="action-btn"
                        onClick={e => handleAddToCart(p, e)}
                        style={{ backgroundColor: addedToCart[p.id] ? '#27ae60' : '#3182CE', color:'white', padding:'10px' }}
                      >
                        {addedToCart[p.id] ? 'AJOUTÉ ✓' : 'AJOUTER'}
                      </button>
                      <button
                        className="action-btn"
                        onClick={e => handleViewDetails(p.id, e)}
                        style={{ backgroundColor:'transparent', color:'#3182CE', border:'2px solid #3182CE', padding:'10px' }}
                      >
                        DÉTAILS
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : (
            <div style={{ textAlign:'center', padding:'80px', backgroundColor:'white', borderRadius:'20px' }}>
              <i className="fas fa-box-open" style={{ fontSize:'64px', color:'#4A5568', marginBottom:'20px' }} />
              <h3 style={{ fontSize:'24px', color:'#1A2B3C', marginBottom:'10px' }}>Aucun produit trouvé</h3>
              <p style={{ color:'#4A5568' }}>
                {searchTerm
                  ? `Aucun résultat pour « ${searchTerm} ».`
                  : selectedCategory !== 'All'
                    ? `Aucun produit dans la catégorie « ${selectedCategory} ».`
                    : 'Aucun produit disponible pour le moment.'}
              </p>
              <button
                onClick={() => { setSelectedCategory('All'); setSearchTerm(''); }}
                style={{ marginTop:'20px', padding:'12px 24px', backgroundColor:'#3182CE', color:'white', border:'none', borderRadius:'10px', fontWeight:'700', cursor:'pointer' }}
              >
                Voir tous les produits
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CatalogPage;