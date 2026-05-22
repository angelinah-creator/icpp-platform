'use client';

export default function DemoSection() {
  return (
    <section style={{ background: '#F9FCFE', padding: '120px 0' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 80px' }}>
        
        {/* Top: 2-col layout */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center', marginBottom: 120 }}>
          {/* Left text */}
          <div>
            <span className="tag-badge" style={{ marginBottom: 20 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#1456FF', display: 'inline-block' }} />
              Analyse intelligente
            </span>
            <h2 style={{ fontSize: 48, fontWeight: 800, color: '#001947', letterSpacing: '-1.5px', lineHeight: 1.1, margin: '16px 0 20px' }}>
              Demandez, recevez,<br />
              <span style={{ color: '#1456FF' }}>décidez.</span>
            </h2>
            <p style={{ fontSize: 17, color: 'rgba(0,25,71,0.6)', lineHeight: 1.7, marginBottom: 32 }}>
              Posez vos questions financières en langage naturel. Notre IA analyse 
              instantanément vos données et vous fournit des réponses précises avec 
              les visualisations adaptées.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[
                'Analyse de variance budget vs réel',
                'Prévision de trésorerie à 12 mois',
                'Identification des centres de coûts anormaux',
                'Consolidation multi-devises automatique',
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{
                    width: 22, height: 22, borderRadius: '50%',
                    background: 'linear-gradient(135deg, #1456FF, #00C8FF)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path d="M2 5L4 7L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <span style={{ fontSize: 15, color: '#001947', fontWeight: 500 }}>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Chat interface */}
          <div style={{
            background: '#F0F4F6',
            borderRadius: 22,
            padding: 4,
            boxShadow: '0 30px 80px rgba(0,25,71,0.1)',
          }}>
            <div style={{ background: 'white', borderRadius: 18, overflow: 'hidden' }}>
              {/* Chat header */}
              <div style={{ padding: '16px 20px', borderBottom: '1px solid #F0F4F6', display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                  width: 32, height: 32, borderRadius: 10,
                  background: 'linear-gradient(135deg, #1456FF, #00C8FF)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <span style={{ fontSize: 14 }}>✦</span>
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#001947' }}>Assistant Fintrak</div>
                  <div style={{ fontSize: 11, color: '#0BE365', fontWeight: 500 }}>● En ligne</div>
                </div>
              </div>

              {/* Messages */}
              <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: 16, minHeight: 280 }}>
                {/* User message */}
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <div style={{
                    background: 'linear-gradient(135deg, #1456FF, #00AEF7)',
                    borderRadius: '18px 18px 4px 18px',
                    padding: '10px 16px', maxWidth: '75%',
                  }}>
                    <p style={{ margin: 0, fontSize: 14, color: 'white' }}>
                      Quel est mon DSO ce trimestre vs l&apos;an dernier ?
                    </p>
                  </div>
                </div>

                {/* AI response */}
                <div style={{ display: 'flex', gap: 10 }}>
                  <div style={{
                    width: 30, height: 30, borderRadius: 8, flexShrink: 0,
                    background: 'linear-gradient(135deg, #1456FF, #00C8FF)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 12,
                  }}>✦</div>
                  <div style={{ flex: 1 }}>
                    <div style={{
                      background: '#F9FCFE', border: '1px solid #EEF2F8',
                      borderRadius: '4px 18px 18px 18px',
                      padding: '12px 16px',
                    }}>
                      <p style={{ margin: '0 0 10px', fontSize: 14, color: '#001947', lineHeight: 1.5 }}>
                        Votre DSO actuel est de <strong>42 jours</strong>, contre 
                        <strong> 58 jours</strong> l&apos;an dernier. C&apos;est une amélioration 
                        de <strong style={{ color: '#0BE365' }}>27.6%</strong> 🎉
                      </p>
                      {/* Mini stat bars */}
                      <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end', height: 40 }}>
                        <div style={{ flex: 1, textAlign: 'center' }}>
                          <div style={{ height: 28, background: 'rgba(20,86,255,0.15)', borderRadius: '4px 4px 0 0', position: 'relative' }}>
                            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '72%', background: '#1456FF', borderRadius: '4px 4px 0 0' }} />
                          </div>
                          <div style={{ fontSize: 10, color: 'rgba(0,25,71,0.4)', marginTop: 2 }}>N-1: 58j</div>
                        </div>
                        <div style={{ flex: 1, textAlign: 'center' }}>
                          <div style={{ height: 28, background: 'rgba(20,86,255,0.15)', borderRadius: '4px 4px 0 0', position: 'relative' }}>
                            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '52%', background: '#0BE365', borderRadius: '4px 4px 0 0' }} />
                          </div>
                          <div style={{ fontSize: 10, color: 'rgba(0,25,71,0.4)', marginTop: 2 }}>N: 42j</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Second user message */}
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <div style={{
                    background: 'linear-gradient(135deg, #1456FF, #00AEF7)',
                    borderRadius: '18px 18px 4px 18px',
                    padding: '10px 16px', maxWidth: '75%',
                  }}>
                    <p style={{ margin: 0, fontSize: 14, color: 'white' }}>
                      Quels clients ont le DSO le plus élevé ?
                    </p>
                  </div>
                </div>

                {/* Typing indicator */}
                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  <div style={{
                    width: 30, height: 30, borderRadius: 8, flexShrink: 0,
                    background: 'linear-gradient(135deg, #1456FF, #00C8FF)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 12,
                  }}>✦</div>
                  <div style={{
                    background: '#F9FCFE', border: '1px solid #EEF2F8',
                    borderRadius: '4px 18px 18px 18px',
                    padding: '12px 16px',
                    display: 'flex', gap: 4, alignItems: 'center'
                  }}>
                    {[0, 0.2, 0.4].map((delay, i) => (
                      <div key={i} style={{
                        width: 6, height: 6, borderRadius: '50%', background: '#1456FF',
                        opacity: 0.6,
                        animation: `bounce 1s ease-in-out ${delay}s infinite`,
                      }} />
                    ))}
                  </div>
                </div>
              </div>

              {/* Input */}
              <div style={{
                padding: '12px 16px',
                borderTop: '1px solid #F0F4F6',
                display: 'flex', gap: 10, alignItems: 'center',
              }}>
                <input placeholder="Posez votre question financière..." style={{
                  flex: 1, border: 'none', outline: 'none',
                  fontSize: 14, color: '#001947',
                  background: 'transparent',
                }} />
                <button style={{
                  background: 'linear-gradient(135deg, #1456FF, #00C8FF)',
                  border: 'none', borderRadius: 10,
                  width: 36, height: 36, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M1 7H13M8 2L13 7L8 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom: Feature pills row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
          {[
            { icon: '📈', title: 'Analyse de tendances', color: '#EEF4FF' },
            { icon: '🎯', title: 'KPIs personnalisés', color: '#E5F9FF' },
            { icon: '⚠️', title: 'Alertes intelligentes', color: '#FFF8E5' },
            { icon: '📋', title: 'Export multi-formats', color: '#E5FFE5' },
          ].map((item, i) => (
            <div key={i} style={{
              background: item.color,
              borderRadius: 16, padding: '20px',
              display: 'flex', flexDirection: 'column', gap: 10,
            }}>
              <span style={{ fontSize: 24 }}>{item.icon}</span>
              <span style={{ fontSize: 14, fontWeight: 600, color: '#001947' }}>{item.title}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
