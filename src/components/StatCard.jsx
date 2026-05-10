import React from 'react';

const StatCard = ({ title, value, icon }) => {
  return (
    <div style={{ background:'white', padding:16, borderRadius:12, minWidth:180, display:'flex', alignItems:'center', gap:12, boxShadow:'0 8px 25px rgba(49,130,206,0.06)' }}>
      <div style={{ width:56, height:56, borderRadius:12, background:'linear-gradient(135deg, rgba(49,130,206,0.12), rgba(49,130,206,0.04))', display:'flex', alignItems:'center', justifyContent:'center', color:'#3182CE', fontSize:20 }}>
        <i className={icon} />
      </div>
      <div>
        <div style={{ fontSize:12, color:'#4A5568', fontWeight:700, textTransform:'uppercase' }}>{title}</div>
        <div style={{ fontSize:20, fontWeight:900, color:'#1A2B3C' }}>{value}</div>
      </div>
    </div>
  );
};

export default StatCard;
