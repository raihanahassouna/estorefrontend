// AdminDashboard.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProducts } from '../contexts/ProductsContext';
import AdminSidebar from '../components/AdminSidebar';
import StatCard from '../components/StatCard';
import ProductCardAdmin from '../components/ProductCardAdmin';
import ProductModal from '../components/ProductModal';
import OrdersList from '../components/OrdersList';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { products, addProduct, editProduct, deleteProduct, stats, orders, updateOrderStatus, validateOrder, lowStockProducts } = useProducts();
  const [showAdd, setShowAdd] = useState(false);
  const [editing, setEditing] = useState(null);

  const handleAdminLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/');
  };

  // Styles globaux améliorés (inline)
  const globalStyles = `
    .admin-scrollbar::-webkit-scrollbar {
      width: 8px;
    }
    .admin-scrollbar::-webkit-scrollbar-track {
      background: #EDF2F7;
      border-radius: 10px;
    }
    .admin-scrollbar::-webkit-scrollbar-thumb {
      background: #CBD5E0;
      border-radius: 10px;
    }
    .admin-scrollbar::-webkit-scrollbar-thumb:hover {
      background: #A0AEC0;
    }
    .stat-card {
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }
    .stat-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 20px -10px rgba(0,0,0,0.1);
    }
    .product-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 24px;
    }
    @media (max-width: 768px) {
      .product-grid {
        gap: 16px;
      }
    }
  `;

  return (
    <>
      <style>{globalStyles}</style>
      <div style={{ display: 'flex', gap: 30, padding: 30, background: 'linear-gradient(135deg, #F7FAFC 0%, #EDF2F7 100%)', minHeight: '100vh' }}>
        <AdminSidebar />

        <div style={{ flex: 1, maxWidth: 'calc(100% - 260px)' }}>
          {/* En-tête avec déconnexion */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 32,
            flexWrap: 'wrap',
            gap: 16
          }}>
            <div>
              <h1 style={{
                margin: 0,
                fontSize: '1.8rem',
                fontWeight: 800,
                background: 'linear-gradient(135deg, #1A2B3C, #2D4A6E)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent'
              }}>
                Tableau de bord
              </h1>
              <p style={{ margin: '4px 0 0', color: '#4A5568' }}>Gérez votre boutique en toute simplicité</p>
            </div>
            <button
              onClick={handleAdminLogout}
              style={{
                background: 'linear-gradient(135deg, #E53E3E, #C53030)',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: 40,
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                fontSize: '0.85rem',
                transition: 'all 0.2s',
                boxShadow: '0 2px 5px rgba(229,62,62,0.3)'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <i className="fas fa-sign-out-alt"></i>
              Quitter l'admin
            </button>
          </div>

          {/* Cartes statistiques */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 24,
            marginBottom: 32
          }}>
            <StatCard title="Produits" value={stats.totalProducts} icon="fas fa-box" />
            <StatCard title="Commandes" value={stats.totalOrders} icon="fas fa-shopping-basket" />
            <StatCard title="Revenu" value={`${stats.totalRevenue.toFixed(2)} DH`} icon="fas fa-coins" />
            <StatCard title="Utilisateurs" value={stats.totalUsers} icon="fas fa-users" />
          </div>

          {/* Section produits */}
          <div style={{
            background: 'white',
            borderRadius: 24,
            padding: 24,
            boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05), 0 8px 10px -6px rgba(0,0,0,0.02)',
            marginBottom: 32,
            transition: 'box-shadow 0.3s'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
              <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700, color: '#1A2B3C' }}>
                <i className="fas fa-boxes" style={{ marginRight: 10, color: '#3182CE' }}></i>
                Catalogue produits
              </h2>
              <button
                onClick={() => { setEditing(null); setShowAdd(true); }}
                style={{
                  background: 'linear-gradient(135deg, #3182CE, #2C5282)',
                  color: 'white',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: 40,
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  transition: 'all 0.2s',
                  boxShadow: '0 2px 5px rgba(49,130,206,0.3)'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                <i className="fas fa-plus"></i>
                Ajouter un produit
              </button>
            </div>

            <div className="product-grid">
              {products.map(p => (
                <ProductCardAdmin
                  key={p.id}
                  product={p}
                  onEdit={() => { setEditing(p); setShowAdd(true); }}
                  onDelete={() => deleteProduct(p.id)}
                />
              ))}
              {products.length === 0 && (
                <div style={{
                  gridColumn: '1 / -1',
                  textAlign: 'center',
                  padding: 48,
                  color: '#A0AEC0',
                  background: '#F7FAFC',
                  borderRadius: 16
                }}>
                  <i className="fas fa-box-open" style={{ fontSize: 48, marginBottom: 16, opacity: 0.5 }}></i>
                  <p>Aucun produit disponible. Cliquez sur "Ajouter" pour commencer.</p>
                </div>
              )}
            </div>
          </div>

          {/* Deux colonnes : commandes & alertes */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '2fr 1fr',
            gap: 24,
            alignItems: 'start'
          }}>
            {/* Commandes */}
            <div style={{
              background: 'white',
              borderRadius: 24,
              padding: 24,
              boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)'
            }}>
              <h2 style={{ marginTop: 0, marginBottom: 20, fontSize: '1.3rem', fontWeight: 700, color: '#1A2B3C' }}>
                <i className="fas fa-truck" style={{ marginRight: 10, color: '#3182CE' }}></i>
                Commandes récentes
              </h2>
              <div className="admin-scrollbar" style={{ maxHeight: '500px', overflowY: 'auto', paddingRight: 8 }}>
                <OrdersList orders={orders} onUpdateStatus={updateOrderStatus} onValidate={validateOrder} />
              </div>
            </div>

            {/* Alertes inventaire */}
            <div style={{
              background: 'white',
              borderRadius: 24,
              padding: 24,
              boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)'
            }}>
              <h3 style={{ marginTop: 0, marginBottom: 20, fontSize: '1.2rem', fontWeight: 700, color: '#1A2B3C' }}>
                <i className="fas fa-exclamation-triangle" style={{ marginRight: 10, color: '#E53E3E' }}></i>
                Alertes stock
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {lowStockProducts().length === 0 ? (
                  <div style={{
                    textAlign: 'center',
                    padding: 32,
                    color: '#68D391',
                    background: '#F0FFF4',
                    borderRadius: 16
                  }}>
                    <i className="fas fa-check-circle" style={{ fontSize: 32, marginBottom: 8 }}></i>
                    <p style={{ margin: 0 }}>Stock suffisant pour tous les produits</p>
                  </div>
                ) : (
                  lowStockProducts().map(p => {
                    const stock = Number(p.stock ?? p.quantity ?? 0);
                    const isOut = stock <= 0;
                    return (
                      <div key={p.id} style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                        padding: 12,
                        background: isOut ? '#FFF5F5' : '#FFFAF0',
                        borderRadius: 16,
                        transition: 'transform 0.2s',
                        cursor: 'pointer'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.transform = 'translateX(4px)'}
                      onMouseLeave={(e) => e.currentTarget.style.transform = 'translateX(0)'}
                      >
                        <img
                          src={p.imageUrl}
                          alt={p.name}
                          style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 12 }}
                          onError={(e) => e.target.src = 'https://via.placeholder.com/48'}
                        />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 800, color: '#1A2B3C' }}>{p.name}</div>
                          <div style={{ fontSize: 12, color: '#4A5568' }}>
                            {p.price?.toFixed ? `${p.price.toFixed(2)} DH` : p.price}
                          </div>
                        </div>
                        <div style={{
                          fontWeight: 900,
                          color: isOut ? '#E53E3E' : '#DD6B20',
                          background: isOut ? '#FED7D7' : '#FEEBC8',
                          padding: '4px 10px',
                          borderRadius: 40,
                          fontSize: '0.8rem'
                        }}>
                          {stock} {stock <= 1 ? 'unité' : 'unités'}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Modal d'ajout/édition produit */}
        {showAdd && (
          <ProductModal
            product={editing}
            onClose={() => setShowAdd(false)}
            onSave={(values) => {
              if (editing) editProduct(editing.id, values);
              else addProduct(values);
              setShowAdd(false);
            }}
          />
        )}
      </div>
    </>
  );
};

export default AdminDashboard;