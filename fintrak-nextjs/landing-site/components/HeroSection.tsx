'use client';

export default function HeroSection() {
  return (
    <section className="hero-bg" style={{ minHeight: '100vh', paddingTop: '72px', position: 'relative', overflow: 'hidden' }}>
      {/* Blobs */}
      <div className="blob animate-blob" style={{
        width: 600, height: 600,
        background: 'rgba(0,200,255,0.25)',
        top: -150, right: -100,
        animationDelay: '0s'
      }} />
      <div className="blob animate-blob" style={{
        width: 700, height: 700,
        background: 'rgba(20,86,255,0.2)',
        bottom: -200, left: -150,
        animationDelay: '3s'
      }} />
      <div className="blob animate-blob" style={{
        width: 400, height: 400,
        background: 'rgba(20,86,255,0.18)',
        top: 200, right: 200,
        animationDelay: '5s'
      }} />

      {/* Pattern grid overlay (like the logo repeating pattern in the maquette) */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='78' viewBox='0 0 60 78' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M10 22L22 11L34 22L46 11' stroke='%2300162D' strokeWidth='1.5' strokeLinecap='round'/%3E%3Cpath d='M10 35L22 24L34 35L46 24' stroke='%2300162D' strokeWidth='1.5' strokeLinecap='round' opacity='0.6'/%3E%3C/svg%3E")`,
        backgroundSize: '60px 78px',
        opacity: 0.12,
        pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 80px', position: 'relative', zIndex: 2 }}>
        {/* Top grid layout */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center', paddingTop: 80 }}>
          {/* Left: Hero text */}
          <div>
            {/* Badge */}
            <div style={{ marginBottom: 24 }}>
              <span className="tag-badge-dark">
                <span style={{
                  width: 8, height: 8, borderRadius: '50%',
                  background: '#0BE365',
                  display: 'inline-block',
                  boxShadow: '0 0 8px #0BE365'
                }} />
                Nouveau — IA Financière v2.0
              </span>
            </div>

            <h1 style={{
              fontSize: 60,
              fontWeight: 800,
              lineHeight: 1.08,
              letterSpacing: '-2px',
              color: 'white',
              margin: '0 0 24px',
            }}>
              L&apos;intelligence<br />
              financière<br />
              <span className="gradient-text">augmentée par IA</span>
            </h1>

            <p style={{
              fontSize: 18,
              color: 'rgba(255,255,255,0.65)',
              lineHeight: 1.7,
              maxWidth: 480,
              margin: '0 0 40px',
            }}>
              Automatisez vos reportings, détectez les anomalies et 
              débloquez des insights stratégiques en temps réel avec 
              notre plateforme d&apos;IA financière de nouvelle génération.
            </p>

            {/* Chat bar (like in maquette y=744) */}
            <div className="chat-input-bar" style={{ maxWidth: 580, marginBottom: 24 }}>
              <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 15, flex: 1 }}>
                Demandez une analyse, posez une question...
              </span>
              <button className="btn-primary" style={{
                padding: '12px 28px', fontSize: 14,
                border: 'none', flexShrink: 0
              }}>
                Analyser →
              </button>
            </div>

            {/* Trust badges */}
            <div style={{ display: 'flex', gap: 16 }}>
              {[
                { icon: '🔒', text: 'SOC 2 Type II' },
                { icon: '🇪🇺', text: 'RGPD Conforme' },
              ].map(b => (
                <div key={b.text} style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 20,
                  padding: '6px 14px',
                  fontSize: 13,
                  color: 'rgba(255,255,255,0.6)'
                }}>
                  <span>{b.icon}</span> {b.text}
                </div>
              ))}
            </div>
          </div>

          {/* Right: Dashboard card (like maquette y=259 card) */}
          <div style={{ position: 'relative' }}>
            <div style={{
              background: 'rgba(249,252,254,0.97)',
              borderRadius: 38,
              border: '9px solid rgba(255,255,255,0.08)',
              overflow: 'hidden',
              boxShadow: '0 40px 100px rgba(0,0,0,0.4)',
            }}>
              {/* Card header */}
              <div style={{ padding: '20px 28px', borderBottom: '1px solid #F0F4F6', display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 34, height: 34, borderRadius: 12, background: '#F0F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M2 12L6 8L9 11L14 5" stroke="#1456FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#001947' }}>Analyse financière</div>
                  <div style={{ fontSize: 12, color: 'rgba(0,25,71,0.4)' }}>Mis à jour il y a 2 min</div>
                </div>
                <div style={{ marginLeft: 'auto', background: '#0BE365', borderRadius: 20, padding: '4px 10px', fontSize: 11, fontWeight: 600, color: '#001947' }}>
                  En direct
                </div>
              </div>

              {/* Stats row */}
              <div style={{ padding: '16px 28px', background: 'white', borderRadius: 18, margin: '16px', boxShadow: '0 2px 12px rgba(0,25,71,0.06)' }}>
                <div style={{ fontSize: 12, color: 'rgba(0,25,71,0.4)', marginBottom: 8 }}>Revenus YTD</div>
                <div style={{ fontSize: 32, fontWeight: 800, color: '#001947', letterSpacing: '-1px' }}>€2.847M</div>
                <div style={{ fontSize: 13, color: '#0BE365', fontWeight: 600, marginTop: 4 }}>↑ +23.4% vs période précédente</div>
                
                {/* Mini chart bars */}
                <div style={{ display: 'flex', gap: 4, alignItems: 'flex-end', marginTop: 16, height: 50 }}>
                  {[30, 45, 38, 55, 42, 65, 58, 72, 60, 80, 70, 88].map((h, i) => (
                    <div key={i} style={{
                      flex: 1,
                      height: `${h}%`,
                      background: i === 11 ? 'linear-gradient(180deg, #00C8FF, #1456FF)' : `rgba(20,86,255,${0.15 + i*0.04})`,
                      borderRadius: '3px 3px 0 0',
                    }} />
                  ))}
                </div>
              </div>

              {/* Items list */}
              <div style={{ padding: '0 16px 16px' }}>
                {[
                  { label: 'Chiffre d\'affaires', value: '€847K', change: '+12%', color: '#0BE365' },
                  { label: 'Marge brute', value: '64.2%', change: '+3.1pt', color: '#0BE365' },
                  { label: 'EBITDA', value: '€234K', change: '-2%', color: '#FF5C5C' },
                  { label: 'Cash flow libre', value: '€189K', change: '+8%', color: '#0BE365' },
                ].map((item, i) => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '10px 12px',
                    background: '#F9FCFE',
                    borderRadius: 8,
                    marginBottom: 4,
                  }}>
                    <span style={{ fontSize: 13, color: 'rgba(0,25,71,0.6)' }}>{item.label}</span>
                    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: '#001947' }}>{item.value}</span>
                      <span style={{ fontSize: 11, fontWeight: 600, color: item.color }}>{item.change}</span>
                    </div>
                  </div>
                ))}
                
                {/* CTA button in card */}
                <button style={{
                  width: '100%', marginTop: 12,
                  background: 'linear-gradient(135deg, #1456FF, #00C8FF)',
                  border: 'none', borderRadius: 18,
                  padding: '12px', fontSize: 14, fontWeight: 600, color: 'white',
                  cursor: 'pointer'
                }}>
                  Voir le rapport complet →
                </button>
              </div>
            </div>

            {/* Floating notification */}
            <div style={{
              position: 'absolute',
              top: -20, right: -20,
              background: 'rgba(249,252,254,0.95)',
              borderRadius: 20,
              padding: '12px 16px',
              border: '1px solid rgba(0,200,255,0.2)',
              boxShadow: '0 8px 30px rgba(0,0,0,0.2)',
              backdropFilter: 'blur(20px)',
            }}>
              <div style={{ fontSize: 11, color: 'rgba(0,25,71,0.5)', marginBottom: 2 }}>Anomalie détectée</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#001947' }}>Transaction suspecte</div>
              <div style={{ fontSize: 11, color: '#FF5C5C' }}>↑ +340% vs normal</div>
            </div>
          </div>
        </div>

        {/* Stats bar */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 1,
          marginTop: 80,
          borderTop: '1px solid rgba(255,255,255,0.08)',
          paddingTop: 40,
          paddingBottom: 60,
        }}>
          {[
            { val: '2 800+', label: 'Entreprises clientes' },
            { val: '€48Md', label: 'Transactions analysées' },
            { val: '99.97%', label: 'Disponibilité SLA' },
            { val: '3 sec', label: 'Temps de réponse moyen' },
          ].map(stat => (
            <div key={stat.label} style={{ textAlign: 'center', padding: '0 20px' }}>
              <div style={{ fontSize: 36, fontWeight: 800, color: 'white', letterSpacing: '-1.5px' }}>{stat.val}</div>
              <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', marginTop: 4 }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
