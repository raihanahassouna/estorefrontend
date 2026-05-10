import React, { useState } from 'react';

const AdminLoginModal = ({ onClose, onSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    // Identifiants administrateur (dans une vraie app, vérification via API)
    if (email === 'admin@estore.com' && password === 'admin123') {
      localStorage.setItem('adminToken', 'fake-admin-jwt-token');
      onSuccess();
    } else {
      setError('Email ou mot de passe incorrect');
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1300,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: 'white',
          borderRadius: 20,
          padding: 30,
          width: 400,
          maxWidth: '90%',
          boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 style={{ marginTop: 0, color: '#1A2B3C' }}>
          <i className="fas fa-lock" style={{ marginRight: 10, color: '#3182CE' }}></i>
          Accès Administrateur
        </h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 15 }}>
            <label style={{ display: 'block', marginBottom: 6, fontWeight: 600 }}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: '100%',
                padding: 12,
                borderRadius: 12,
                border: '1px solid #CBD5E0',
                fontSize: 14,
              }}
              placeholder="admin@estore.com"
            />
          </div>
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', marginBottom: 6, fontWeight: 600 }}>Mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: '100%',
                padding: 12,
                borderRadius: 12,
                border: '1px solid #CBD5E0',
                fontSize: 14,
              }}
              placeholder="••••••"
            />
          </div>
          {error && (
            <div style={{ color: '#E53E3E', marginBottom: 15, fontSize: 14 }}>{error}</div>
          )}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '10px 18px',
                borderRadius: 10,
                background: '#EDF2F7',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              Annuler
            </button>
            <button
              type="submit"
              style={{
                padding: '10px 18px',
                borderRadius: 10,
                background: '#3182CE',
                color: 'white',
                border: 'none',
                fontWeight: 'bold',
                cursor: 'pointer',
              }}
            >
              Se connecter
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminLoginModal;