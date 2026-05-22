'use client';

const features = [
  {
    icon: '⚡',
    title: 'Analyse en temps réel',
    desc: 'Traitez des millions de transactions en quelques secondes avec notre moteur IA ultra-performant.',
    color: '#00C8FF',
  },
  {
    icon: '🔍',
    title: 'Détection d\'anomalies',
    desc: 'Identifiez automatiquement les irrégularités et les fraudes avant qu\'elles impactent vos finances.',
    color: '#1456FF',
  },
  {
    icon: '📊',
    title: 'Reporting automatisé',
    desc: 'Générez vos rapports réglementaires et de gestion en un clic, avec une précision de 99.9%.',
    color: '#0BE365',
  },
  {
    icon: '🔮',
    title: 'Prévisions prédictives',
    desc: 'Anticipez les tendances de trésorerie et les risques financiers grâce aux modèles ML avancés.',
    color: '#00C8FF',
  },
  {
    icon: '🔗',
    title: 'Intégration universelle',
    desc: 'Connectez votre ERP, CRM et outils comptables en quelques minutes via nos 200+ connecteurs.',
    color: '#1456FF',
  },
  {
    icon: '🛡️',
    title: 'Sécurité enterprise',
    desc: 'Chiffrement AES-256, SOC 2 Type II, ISO 27001. Vos données financières sont protégées.',
    color: '#0BE365',
  },
];

export default function FeaturesSection() {
  return (
    <section style={{ background: '#001947', padding: '100px 0', position: 'relative', overflow: 'hidden' }}>
      {/* Blobs */}
      <div style={{
        position: 'absolute', width: 500, height: 500,
        background: 'rgba(20,86,255,0.12)',
        borderRadius: '50%', filter: 'blur(80px)',
        top: -100, right: -100, pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 80px' }}>
        {/* Section header */}
        <div style={{ marginBottom: 64 }}>
          <span className="tag-badge-dark" style={{ marginBottom: 20 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#00C8FF', display: 'inline-block' }} />
            Fonctionnalités clés
          </span>
          <h2 style={{
            fontSize: 52,
            fontWeight: 800,
            color: 'white',
            letterSpacing: '-1.5px',
            lineHeight: 1.1,
            margin: '16px 0 20px',
          }}>
            Tout ce dont vous avez besoin<br />
            <span className="gradient-text">pour piloter vos finances</span>
          </h2>
          <p style={{
            fontSize: 18,
            color: 'rgba(255,255,255,0.55)',
            maxWidth: 580,
            lineHeight: 1.6,
          }}>
            Une plateforme complète qui transforme vos données financières brutes 
            en insights actionnables, en temps réel.
          </p>
        </div>

        {/* Feature grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
          {features.map((f, i) => (
            <div key={i} className="card-glass feature-card" style={{ cursor: 'default' }}>
              <div style={{
                width: 48, height: 48,
                borderRadius: 14,
                background: `${f.color}18`,
                border: `1px solid ${f.color}30`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 22, marginBottom: 18,
              }}>
                {f.icon}
              </div>
              <h3 style={{ color: 'white', fontSize: 18, fontWeight: 700, margin: '0 0 10px', letterSpacing: '-0.3px' }}>
                {f.title}
              </h3>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14, lineHeight: 1.65, margin: 0 }}>
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
