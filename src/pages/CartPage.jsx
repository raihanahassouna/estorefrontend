import React from 'react';

const CartPage = () => {
  return (
    <div style={{ padding: '50px', textAlign: 'center', backgroundColor: '#e2e2de', minHeight: '100vh' }}>
      <div style={{ backgroundColor: '#fff', padding: '40px', borderRadius: '20px', maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ fontWeight: '900', fontSize: '32px' }}>MON_PANIER</h1>
        <hr style={{ margin: '20px 0', border: '0.5px solid #eee' }} />
        <p style={{ color: '#888' }}>Votre panier est actuellement vide.</p>
        <br />
        <a href="/catalog" style={{ 
          textDecoration: 'none', 
          background: '#000', 
          color: '#fff', 
          padding: '10px 20px', 
          borderRadius: '10px',
          fontWeight: '700' 
        }}>
          RETOURNER AU CATALOGUE
        </a>
      </div>
    </div>
  );
};

export default CartPage;