import React from 'react'
import 'boxicons/css/boxicons.min.css';
const stats = [
  { icon: <i className='bx bx-shopping-bag' ></i>, value: '10k+', label: 'Produits disponibles', highlight: false },
  { icon: <i class="bx bx-star" />, value: '98%', label: 'Clients satisfaits', highlight: false },
  { icon: <i class="bx bx-rocket" />, value: '24/7', label: 'Support disponible', highlight: false },
]

const features = [
  {
    icon: <i className="bx bx-lock-alt" />,
    title: 'Paiement sécurisé',
    desc: 'Transactions 100% protégées'
  },
  {
    icon: <i className="bx bx-package" />,
    title: 'Livraison rapide',
    desc: 'Livré en 24-48h chez vous'
  },
  {
    icon: <i className="bx bx-rotate-left" />,
    title: 'Retours faciles',
    desc: "30 jours pour changer d'avis"
  },
  {
    icon: <i className="bx bx-support" />,
    title: 'Support dédié',
    desc: 'Une équipe à votre écoute'
  },
]

function AboutPage() {
  return (
    <div style={{ padding: '60px 80px', maxWidth: '1200px', margin: '0 auto', fontFamily: "'Segoe UI', sans-serif", color: '#333' }}>

      {/* Hero */}
      <div style={{ textAlign: 'center', marginBottom: '60px' }}>
        <p style={{ fontSize: '13px', fontWeight: 700, letterSpacing: '3px', color: '#1a73e8', textTransform: 'uppercase', marginBottom: '12px' }}>
          À PROPOS DE NOUS
        </p>
        <h1 style={{ fontSize: '40px', fontWeight: 800, color: '#1a1a2e', marginBottom: '20px' }}>
          Votre expérience shopping <span style={{ color: '#1a73e8' }}>réinventée</span>
        </h1>
        <p style={{ fontSize: '16px', color: '#666', maxWidth: '600px', margin: '0 auto', lineHeight: 1.7 }}>
          VotreBoutique allie technologie de pointe et expérience utilisateur premium pour vous offrir une solution de shopping innovante.
        </p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '24px', marginBottom: '60px' }}>
        {stats.map((s, i) => (
          <div key={i} style={{
            background: s.highlight ? 'linear-gradient(135deg, #1a73e8, #0d47a1)' : '#f0f7ff',
            border: s.highlight ? 'none' : '2px solid #e3f0ff',
            borderRadius: '16px', padding: '32px', textAlign: 'center',
            color: s.highlight ? 'white' : 'inherit'
          }}>
            <div style={{ fontSize: '36px', marginBottom: '8px' }}>{s.icon}</div>
            <h3 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '4px', color: s.highlight ? 'white' : '#1a1a2e' }}>{s.value}</h3>
            <p style={{ fontSize: '14px', color: s.highlight ? 'rgba(255,255,255,0.85)' : '#666' }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Mission */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', alignItems: 'center', marginBottom: '60px' }}>
        <div>
          <p style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '3px', color: '#1a73e8', textTransform: 'uppercase', marginBottom: '16px' }}>
            NOTRE MISSION
          </p>
          <h2 style={{ fontSize: '28px', fontWeight: 800, color: '#1a1a2e', marginBottom: '20px', lineHeight: 1.3 }}>
            Qualité, sécurité et rapidité au cœur de chaque transaction
          </h2>
          <p style={{ color: '#666', lineHeight: 1.8, marginBottom: '16px', fontSize: '15px' }}>
            Nous croyons que le shopping en ligne devrait être simple, sécurisé et agréable. C'est pourquoi nous avons construit une plateforme qui place l'utilisateur au centre de chaque décision.
          </p>
          <p style={{ color: '#666', lineHeight: 1.8, fontSize: '15px' }}>
            Depuis notre création, nous nous engageons à fournir les meilleurs produits avec un service client irréprochable et une livraison rapide.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          {features.map((f, i) => (
            <div key={i} style={{ background: '#f8f9fa', borderRadius: '12px', padding: '24px', borderLeft: '4px solid #1a73e8' }}>
              <div style={{ fontSize: '24px', marginBottom: '8px' }}>{f.icon}</div>
              <h4 style={{ fontWeight: 700, color: '#1a1a2e', marginBottom: '6px', fontSize: '14px' }}>{f.title}</h4>
              <p style={{ fontSize: '12px', color: '#888', lineHeight: 1.5 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={{ background: 'linear-gradient(135deg, #1a73e8, #0d47a1)', borderRadius: '20px', padding: '48px', textAlign: 'center', color: 'white' }}>
        <h2 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '12px' }}>Prêt à découvrir nos produits ?</h2>
        <p style={{ opacity: 0.85, marginBottom: '28px', fontSize: '15px' }}>
          Rejoignez des milliers de clients satisfaits et commencez votre expérience shopping dès aujourd'hui.
        </p>
        <button style={{ background: 'white', color: '#1a73e8', border: 'none', padding: '14px 36px', borderRadius: '50px', fontWeight: 700, fontSize: '15px', cursor: 'pointer' }}>
          <i className='bx bx-shopping-bag' style={{ marginRight: '8px' }}>  Découvrir nos produits
</i>
        </button>
      </div>

    </div>
  )
}

export default AboutPage