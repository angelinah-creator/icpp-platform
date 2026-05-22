'use client';

export default function CTASection() {
  return (
    <section style={{ background: '#F9FCFE', padding: '120px 0' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 80px' }}>
        <div style={{
          background: 'linear-gradient(135deg, #001947 0%, #001030 100%)',
          borderRadius: 32,
          padding: '80px',
          position: 'relative',
          overflow: 'hidden',
          textAlign: 'center',
        }}>
          {/* Blobs */}
          <div style={{
            position: 'absolute', width: 400, height: 400,
            background: 'rgba(0,200,255,0.12)',
            borderRadius: '50%', filter: 'blur(80px)',
            top: -100, left: -100, pointerEvents: 'none',
          }} />
          <div style={{
            position: 'absolute', width: 400, height: 400,
            background: 'rgba(20,86,255,0.12)',
            borderRadius: '50%', filter: 'blur(80px)',
            bottom: -100, right: -100, pointerEvents: 'none',
          }} />

          <div style={{ position: 'relative' }}>
            <h2 style={{
              fontSize: 58, fontWeight: 800, color: 'white',
              letterSpacing: '-2px', lineHeight: 1.08,
              margin: '0 0 20px',
            }}>
              Prêt à transformer<br />
              <span className="gradient-text">votre finance ?</span>
            </h2>
            <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.55)', marginBottom: 40, maxWidth: 500, margin: '0 auto 40px' }}>
              Rejoignez 2 800+ équipes finance qui pilotent leur activité 
              avec l&apos;intelligence artificielle.
            </p>

            <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
              <button className="btn-primary" style={{ padding: '16px 36px', fontSize: 16, border: 'none' }}>
                Démarrer gratuitement — 14 jours
              </button>
              <button className="btn-ghost" style={{ padding: '16px 36px', fontSize: 16 }}>
                Voir une démo live
              </button>
            </div>

            <p style={{ marginTop: 20, fontSize: 13, color: 'rgba(255,255,255,0.3)' }}>
              Aucune carte bancaire · Pas d&apos;engagement · Annulation instantanée
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
