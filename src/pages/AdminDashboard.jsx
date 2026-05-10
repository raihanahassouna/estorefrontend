import React, { useState } from 'react';
import { useProducts } from '../contexts/ProductsContext';
import AdminSidebar from '../components/AdminSidebar';
import StatCard from '../components/StatCard';
import ProductCardAdmin from '../components/ProductCardAdmin';
import ProductModal from '../components/ProductModal';
import OrdersList from '../components/OrdersList';

const AdminDashboard = () => {
  const { products, addProduct, editProduct, deleteProduct, stats, orders, updateOrderStatus, validateOrder, lowStockProducts } = useProducts();
  const [showAdd, setShowAdd] = useState(false);
  const [editing, setEditing] = useState(null);

  return (
    <div style={{ display:'flex', gap:30, padding:30, background:'#F7FAFC', minHeight:'80vh' }}>
      <AdminSidebar />

      <div style={{ flex:1 }}>
        <div style={{ display:'flex', gap:20, marginBottom:20, flexWrap:'wrap' }}>
          <StatCard title="Produits" value={stats.totalProducts} icon="fas fa-box" />
          <StatCard title="Commandes" value={stats.totalOrders} icon="fas fa-shopping-basket" />
          <StatCard title="Revenu" value={`${stats.totalRevenue.toFixed(2)} DH`} icon="fas fa-coins" />
          <StatCard title="Utilisateurs" value={stats.totalUsers} icon="fas fa-users" />
        </div>

        <div style={{ background:'white', padding:20, borderRadius:16, boxShadow:'0 5px 15px rgba(0,0,0,0.05)', marginBottom:20 }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <h2 style={{ margin:0 }}>Gestion des produits</h2>
            <div style={{ display:'flex', gap:10 }}>
              <button onClick={() => { setEditing(null); setShowAdd(true); }} style={{ background:'#3182CE', color:'white', border:'none', padding:'10px 16px', borderRadius:12, fontWeight:700 }}>Ajouter un produit</button>
            </div>
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))', gap:16, marginTop:16 }}>
            {products.map(p => (
              <ProductCardAdmin key={p.id} product={p} onEdit={() => { setEditing(p); setShowAdd(true); }} onDelete={() => deleteProduct(p.id)} />
            ))}
            {products.length === 0 && <div style={{ padding:30, color:'#4A5568' }}>Aucun produit disponible.</div>}
          </div>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'1fr 360px', gap:20 }}>
          <div style={{ background:'white', padding:20, borderRadius:16, boxShadow:'0 5px 15px rgba(0,0,0,0.05)' }}>
            <h2 style={{ marginTop:0 }}>Gestion des commandes</h2>
            <OrdersList orders={orders} onUpdateStatus={updateOrderStatus} onValidate={validateOrder} />
          </div>

          <div style={{ background:'white', padding:20, borderRadius:16, boxShadow:'0 5px 15px rgba(0,0,0,0.05)' }}>
            <h3 style={{ marginTop:0 }}>Alertes inventaire</h3>
            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              {lowStockProducts().length === 0 ? (
                <div style={{ color:'#4A5568' }}>Aucun produit en rupture ou faible stock.</div>
              ) : (
                lowStockProducts().map(p => (
                  <div key={p.id} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', gap:8 }}>
                    <div style={{ display:'flex', gap:8, alignItems:'center' }}>
                      <img src={p.imageUrl} alt={p.name} style={{ width:48, height:48, objectFit:'cover', borderRadius:6 }} onError={(e)=>e.target.src='https://via.placeholder.com/48'} />
                      <div>
                        <div style={{ fontWeight:800 }}>{p.name}</div>
                        <div style={{ color:'#4A5568', fontSize:12 }}>{p.price?.toFixed ? `${p.price.toFixed(2)} DH` : p.price}</div>
                      </div>
                    </div>
                    <div style={{ fontWeight:900, color: Number(p.stock ?? p.quantity ?? 0) <= 0 ? '#E53E3E' : '#D97706' }}>{Number(p.stock ?? p.quantity ?? 0)}</div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

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
  );
};

export default AdminDashboard;
