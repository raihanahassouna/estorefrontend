import React from 'react';

const OrdersList = ({ orders = [], onUpdateStatus }) => {
  const statuses = ['Pending','Shipped','Delivered'];

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
      {orders.length === 0 && <div style={{ color:'#4A5568' }}>Aucune commande pour le moment.</div>}
      {orders.map(o => (
        <div key={o.id} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:12, borderRadius:10, background:'#F7FAFC' }}>
          <div>
            <div style={{ fontWeight:800 }}>{o.customerName || 'Client anonyme'}</div>
            <div style={{ color:'#4A5568', fontSize:13 }}>{o.items?.length || 0} article(s) • {new Date(o.createdAt).toLocaleString()}</div>
          </div>
          <div style={{ display:'flex', gap:8, alignItems:'center' }}>
            <div style={{ padding:'6px 10px', borderRadius:8, background: o.status === 'Delivered' ? '#E6FFFA' : '#FFF5F7', color:'#4A5568', fontWeight:700 }}>{o.status}</div>
            <select value={o.status} onChange={(e) => onUpdateStatus(o.id, e.target.value)} style={{ padding:8, borderRadius:8 }}>
              {statuses.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrdersList;
