'use client';

const testimonials = [
  {
    name: 'Marie Dupont',
    role: 'DAF, Groupe Altis',
    avatar: 'MD',
    color: '#1456FF',
    text: 'Fintrak a divisé notre temps de clôture mensuelle par 3. L\'automatisation des rapports et la détection des anomalies nous ont déjà évité deux fraudes significatives.',
    metric: '−67% temps de clôture',
  },
  {
    name: 'Thomas Bernard',
    role: 'CFO, TechVision SAS',
    avatar: 'TB',
    color: '#00C8FF',
    text: 'La qualité des prévisions de trésorerie est bluffante. On a passé de 65% à 94% de précision sur nos forecasts à 3 mois. Impossible à faire manuellement.',
    metric: '+44% précision forecast',
  },
  {
    name: 'Sophie Martin',
    role: 'Contrôleuse de gestion, Nexara',
    avatar: 'SM',
    color: '#0BE365',
    text: 'L\'assistant IA répond à mes questions en langage naturel. Je n\'ai plus besoin de sortir Excel pour une analyse rapide. C\'est un gain de temps colossal.',
    metric: '3h économisées/jour',
  },
];

const logos = ['Altis Group', 'TechVision', 'Nexara', 'Compta+', 'FinServe', 'GlobalTrade'];

export default function TestimonialsSection() {
  return (
    <section style={{ background: '#F9FCFE', padding: '120px 0' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 80px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <span className="tag-badge" style={{ marginBottom: 20 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#1456FF', display: 'inline-block' }} />
            Témoignages clients
          </span>
          <h2 style={{ fontSize: 52, fontWeight: 800, color: '#001947', letterSpacing: '-1.5px', lineHeight: 1.1, margin: '16px 0 0' }}>
            Ils ont transformé<br />
            <span style={{ color: '#1456FF' }}>leur finance avec Fintrak</span>
          </h2>
        </div>

        {/* Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24, marginBottom: 80 }}>
          {testimonials.map((t) => (
            <div key={t.name} className="testimonial-card">
              {/* Stars */}
              <div style={{ display: 'flex', gap: 3, marginBottom: 16 }}>
                {Array(5).fill(0).map((_, i) => (
                  <span key={i} style={{ color: '#FFB800', fontSize: 14 }}>★</span>
                ))}
              </div>

              <p style={{ fontSize: 15, color: 'rgba(0,25,71,0.7)', lineHeight: 1.7, marginBottom: 24 }}>
                &ldquo;{t.text}&rdquo;
              </p>

              {/* Metric badge */}
              <div style={{
                background: '#F0F4F6', borderRadius: 10,
                padding: '8px 14px', display: 'inline-block',
                marginBottom: 20,
              }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#1456FF' }}>{t.metric}</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 42, height: 42, borderRadius: '50%',
                  background: `linear-gradient(135deg, ${t.color}, ${t.color}99)`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'white', fontSize: 13, fontWeight: 700,
                }}>
                  {t.avatar}
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#001947' }}>{t.name}</div>
                  <div style={{ fontSize: 13, color: 'rgba(0,25,71,0.45)' }}>{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Logo strip */}
        <div style={{
          borderTop: '1px solid rgba(0,25,71,0.08)',
          borderBottom: '1px solid rgba(0,25,71,0.08)',
          padding: '32px 0',
        }}>
          <p style={{ textAlign: 'center', fontSize: 13, color: 'rgba(0,25,71,0.4)', marginBottom: 24, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            Ils nous font confiance
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 60, alignItems: 'center' }}>
            {logos.map(logo => (
              <span key={logo} style={{
                fontSize: 16, fontWeight: 700,
                color: 'rgba(0,25,71,0.25)',
                letterSpacing: '-0.3px',
              }}>
                {logo}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
