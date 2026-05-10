import React from 'react';
import { Link } from 'react-router-dom';

const AdminSidebar = () => {
  return (
    <aside style={{ width:260, background:'white', borderRadius:16, padding:20, boxShadow:'0 5px 20px rgba(0,0,0,0.06)', height:'fit-content' }}>
      <h3 style={{ marginTop:0, color:'#1A2B3C' }}>Admin</h3>
      <nav style={{ display:'flex', flexDirection:'column', gap:10, marginTop:10 }}>
        <Link to="/admin" style={{ color:'#3182CE', fontWeight:700, textDecoration:'none' }}>Dashboard</Link>
        <Link to="/catalog" style={{ color:'#4A5568', textDecoration:'none' }}>Voir le catalogue</Link>
        <Link to="/orders" style={{ color:'#4A5568', textDecoration:'none' }}>Commandes</Link>
      </nav>
    </aside>
  );
};

export default AdminSidebar;
