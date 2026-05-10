import React from 'react';

const ProductCardAdmin = ({ product, onEdit, onDelete }) => {
  return (
    <div style={{ background:'#F7FAFC', borderRadius:12, padding:12, display:'flex', flexDirection:'column', gap:8 }}>
      <div style={{ height:140, background:'white', borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center', overflow:'hidden' }}>
        <img src={product.imageUrl} alt={product.name} style={{ maxWidth:'100%', maxHeight:'100%', objectFit:'contain' }} onError={(e) => e.target.src='https://via.placeholder.com/150'} />
      </div>
      <div style={{ fontWeight:800, color:'#1A2B3C' }}>{product.name}</div>
      <div style={{ color:'#4A5568', fontSize:13, minHeight:40, overflow:'hidden' }}>{product.description}</div>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:6 }}>
        <div style={{ fontWeight:900, color:'#3182CE' }}>{product.price?.toFixed ? `${product.price.toFixed(2)} DH` : product.price}</div>
        <div style={{ display:'flex', gap:8 }}>
          <button onClick={onEdit} style={{ background:'#F6AD55', border:'none', padding:'8px 10px', borderRadius:8, cursor:'pointer' }}>Modifier</button>
          <button onClick={onDelete} style={{ background:'#E53E3E', color:'white', border:'none', padding:'8px 10px', borderRadius:8, cursor:'pointer' }}>Supprimer</button>
        </div>
      </div>
    </div>
  );
};

export default ProductCardAdmin;
