import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CartPage = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  // Configurable WhatsApp settings
  const WHATSAPP_NUMBER = '+212699425135';
  const WHATSAPP_CURRENCY = 'DH';

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('cart') || '[]');
    setCart(saved);
  }, []);

  const saveCart = (next) => {
    localStorage.setItem('cart', JSON.stringify(next));
    // Trigger header update (the app listens to 'storage')
    try { window.dispatchEvent(new Event('storage')); } catch(e){}
    setCart(next);
  };

  const handleWhatsAppOrder = () => {
    if (!cart || cart.length === 0) return;

    const getName = (item) => item.name || item.title || item.productName || 'Produit';
    const getPrice = (item) => Number(item.price ?? item.unitPrice ?? 0);
    const getQty = (item) => Number(item.quantity ?? 1);

    const lines = cart.map(it => {
      const name = getName(it);
      const qty = getQty(it);
      const price = getPrice(it);
      const subtotal = price * qty;
      // Use integer if whole number, otherwise 2 decimals
      const fmt = (v) => Number.isInteger(v) ? `${v}` : v.toFixed(2);
      return `- ${name} x${qty} = ${fmt(subtotal)} ${WHATSAPP_CURRENCY}`;
    });

    const total = cart.reduce((s, it) => s + (getPrice(it) * getQty(it)), 0);
    const fmtTotal = Number.isInteger(total) ? `${total}` : total.toFixed(2);

    const message = `Bonjour, je souhaite commander :\n\n${lines.join('\n')}\n\nTotal : ${fmtTotal} ${WHATSAPP_CURRENCY}`;
    const url = `https://wa.me/${WHATSAPP_NUMBER.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const increment = (id) => {
    const next = cart.map(item => item.id === id ? { ...item, quantity: (item.quantity || 1) + 1 } : item);
    saveCart(next);
  };

  const decrement = (id) => {
    const next = cart.map(item => {
      if (item.id !== id) return item;
      const q = (item.quantity || 1) - 1;
      return { ...item, quantity: q };
    }).filter(i => (i.quantity || 1) > 0);
    saveCart(next);
  };

  const removeItem = (id) => {
    const next = cart.filter(i => i.id !== id);
    saveCart(next);
  };

  const totalItems = cart.reduce((s, it) => s + (it.quantity || 1), 0);
  const totalPrice = cart.reduce((s, it) => s + ((it.price || 0) * (it.quantity || 1)), 0);

  const formatPrice = (v) => `${v?.toFixed(2).replace('.', ',')} DH`;

  const styles = `
    @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css');
    :root{ --bleu:#3182CE; --bg:#F7FAFC; --muted:#4A5568 }
    .cart-page{ padding:40px; min-height:70vh; background:var(--bg) }
    .cart-wrap{ max-width:1200px; margin:0 auto }
    .cart-hero{ display:flex; justify-content:space-between; align-items:center; margin-bottom:20px }
    .cart-card{ background:white; border-radius:16px; padding:18px; box-shadow:0 8px 30px rgba(0,0,0,0.05); }
    .cart-list{ display:flex; flex-direction:column; gap:12px }
    .cart-item{ display:flex; gap:16px; align-items:center; padding:12px; border-radius:12px; transition:all 0.25s }
    .cart-item:hover{ transform:translateY(-4px); box-shadow:0 15px 30px rgba(49,130,206,0.06) }
    .cart-thumb{ width:110px; height:90px; background:#F7FAFC; border-radius:10px; display:flex; align-items:center; justify-content:center; overflow:hidden }
    .cart-thumb img{ max-width:100%; max-height:100%; object-fit:contain }
    .cart-info{ flex:1; min-width:0 }
    .cart-name{ font-weight:800; color:#1A2B3C; margin-bottom:6px }
    .cart-price{ color:var(--bleu); font-weight:900 }
    .cart-controls{ display:flex; gap:8px; align-items:center }
    .qty-btn{ background:white; border:1px solid #E2E8F0; padding:6px 10px; border-radius:8px; cursor:pointer }
    .qty-display{ min-width:36px; text-align:center; font-weight:800 }
    .remove-btn{ background:transparent; border:none; color:#FF4444; cursor:pointer }
    .summary{ display:flex; flex-direction:column; gap:12px }
    .summary-row{ display:flex; justify-content:space-between; align-items:center }
    .btn-primary{ background:var(--bleu); color:white; padding:12px 18px; border-radius:12px; border:none; cursor:pointer; font-weight:800 }
    .btn-secondary{ background:transparent; border:2px solid var(--bleu); color:var(--bleu); padding:10px 16px; border-radius:12px; cursor:pointer; font-weight:800 }
    .whatsapp-btn{ background:#25D366; color:white; padding:10px 14px; border-radius:12px; border:none; cursor:pointer; font-weight:800; display:flex; align-items:center; gap:8px }
    .whatsapp-btn:hover{ filter:brightness(0.95); transform:translateY(-2px) }
    .whatsapp-btn:disabled{ opacity:0.5; cursor:not-allowed }
    .empty{ text-align:center; padding:50px; color:var(--muted) }

    @media (max-width:900px){ .cart-hero{ flex-direction:column; align-items:flex-start; gap:12px } .cart-thumb{ width:84px; height:72px } }
    @media (max-width:640px){ .cart-item{ flex-direction:column; align-items:flex-start } .cart-controls{ width:100%; justify-content:space-between } .summary{ width:100% } }
  `;

  return (
    <>
      <style>{styles}</style>
      <div className="cart-page">
        <div className="cart-wrap">
          <div className="cart-hero">
            <div>
              <h1 style={{ margin: 0, fontSize: '26px', fontWeight: 900, color: '#1A2B3C' }}>Votre panier</h1>
              <div style={{ color: '#4A5568', marginTop: 6 }}>{totalItems} article(s)</div>
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <button className="btn-secondary" onClick={() => navigate('/catalog')}>Continuer les achats</button>
              <button className="btn-primary" onClick={() => navigate('/orders')}>Passer la commande</button>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 20 }}>
            <div className="cart-card">
              {cart.length === 0 ? (
                <div className="empty">
                  <i className="fas fa-shopping-basket" style={{ fontSize: 48, marginBottom: 12 }} />
                  <h3 style={{ marginBottom: 8 }}>Votre panier est vide</h3>
                  <p>Parcourez notre catalogue et ajoutez des produits à votre panier.</p>
                  <div style={{ marginTop: 16 }}>
                    <button className="btn-primary" onClick={() => navigate('/catalog')}>Voir les produits</button>
                  </div>
                </div>
              ) : (
                <div className="cart-list">
                  {cart.map(item => (
                    <div key={item.id} className="cart-item">
                      <div className="cart-thumb">
                        <img src={item.imageUrl || item.image || 'https://via.placeholder.com/150'} alt={item.name} />
                      </div>
                      <div className="cart-info">
                        <div className="cart-name">{item.name}</div>
                        <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginTop: 6 }}>
                          <div className="cart-price">{formatPrice(item.price || 0)}</div>
                          <div style={{ color: '#A0AEC0' }}>Sous-total: <strong style={{ color: '#1A2B3C' }}>{formatPrice((item.price || 0) * (item.quantity || 1))}</strong></div>
                        </div>
                      </div>

                      <div className="cart-controls">
                        <button className="qty-btn" onClick={() => decrement(item.id)}>-</button>
                        <div className="qty-display">{item.quantity || 1}</div>
                        <button className="qty-btn" onClick={() => increment(item.id)}>+</button>
                        <button className="remove-btn" onClick={() => removeItem(item.id)} title="Supprimer">
                          <i className="fas fa-trash" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <aside className="cart-card summary">
              <h3 style={{ margin: 0, fontSize: 18, fontWeight: 900, color: '#1A2B3C' }}>Récapitulatif</h3>
              <div className="summary-row">
                <div style={{ color: '#4A5568' }}>Articles ({totalItems})</div>
                <div style={{ fontWeight: 900, color: '#1A2B3C' }}>{formatPrice(totalPrice)}</div>
              </div>
              <div style={{ height: 1, background: '#E2E8F0', margin: '6px 0 12px 0', borderRadius: 2 }} />
              <div style={{ color: '#4A5568', fontSize: 13 }}>Livraison estimée au moment du paiement</div>
              <div style={{ marginTop: 'auto', display: 'flex', gap: 10, flexDirection: 'column' }}>
                <button className="btn-primary" style={{ width: '100%' }} onClick={() => navigate('/orders')}>Passer la commande</button>
                <button
                  className="whatsapp-btn"
                  style={{ width: '100%' }}
                  onClick={handleWhatsAppOrder}
                  disabled={cart.length === 0}
                  title={cart.length === 0 ? 'Panier vide' : 'Passer la commande via WhatsApp'}
                >
                  <i className="fab fa-whatsapp" style={{ fontSize: 18 }} />
                  Passer la commande sur WhatsApp
                </button>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </>
  );
};

export default CartPage;