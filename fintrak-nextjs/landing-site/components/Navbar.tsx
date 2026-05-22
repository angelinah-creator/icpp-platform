'use client';

export default function Navbar() {
  return (
    <nav style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 100,
      padding: '0 80px',
      height: '72px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      background: 'rgba(0, 25, 71, 0.88)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(255,255,255,0.06)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{
          width: 36, height: 36,
          background: 'linear-gradient(135deg, #1456FF, #00C8FF)',
          borderRadius: 10,
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M4 10L8 6L12 10L16 6" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M4 14L8 10L12 14L16 10" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" opacity="0.6"/>
          </svg>
        </div>
        <span style={{ color: 'white', fontWeight: 700, fontSize: '18px', letterSpacing: '-0.3px' }}>Fintrak</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
        {['Produit', 'Fonctionnalités', 'Tarifs', 'Ressources', 'À propos'].map(link => (
          <a key={link} href="#" style={{ color: 'rgba(255,255,255,0.8)', fontSize: '15px', textDecoration: 'none', fontWeight: 400, transition: 'color 0.2s' }}>
            {link}
          </a>
        ))}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <a href="#" style={{ color: 'rgba(255,255,255,0.8)', fontSize: '15px', textDecoration: 'none' }}>
          Connexion
        </a>
        <button className="btn-primary" style={{ padding: '10px 24px', fontSize: '14px', border: 'none' }}>
          Commencer gratuitement
        </button>
      </div>
    </nav>
  );
}
