'use client';

const integrations = [
  { name: 'SAP', color: '#0070B8' },
  { name: 'Oracle', color: '#C74634' },
  { name: 'Sage', color: '#00DC96' },
  { name: 'Cegid', color: '#E4002B' },
  { name: 'Salesforce', color: '#00A1E0' },
  { name: 'HubSpot', color: '#FF7A59' },
  { name: 'Stripe', color: '#635BFF' },
  { name: 'QuickBooks', color: '#2CA01C' },
  { name: 'Xero', color: '#13B5EA' },
  { name: 'NetSuite', color: '#005DA1' },
  { name: 'Microsoft', color: '#00A4EF' },
  { name: 'Google', color: '#4285F4' },
];

export default function IntegrationsSection() {
  return (
    <section style={{ background: '#F9FCFE', padding: '120px 0' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 80px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }}>
          {/* Left */}
          <div>
            <span className="tag-badge" style={{ marginBottom: 20 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#1456FF', display: 'inline-block' }} />
              Intégrations
            </span>
            <h2 style={{ fontSize: 48, fontWeight: 800, color: '#001947', letterSpacing: '-1.5px', lineHeight: 1.1, margin: '16px 0 20px' }}>
              Connectez tous<br />
              vos outils en <span style={{ color: '#1456FF' }}>un clic</span>
            </h2>
            <p style={{ fontSize: 17, color: 'rgba(0,25,71,0.6)', lineHeight: 1.7, marginBottom: 32 }}>
              Fintrak s&apos;intègre avec vos outils existants sans 
              perturbation. Importez vos données financières depuis 
              n&apos;importe quelle source en quelques minutes.
            </p>
            <div style={{ display: 'flex', gap: 16 }}>
              <button className="btn-primary" style={{ padding: '12px 28px', fontSize: 14, border: 'none' }}>
                Voir toutes les intégrations
              </button>
            </div>
          </div>

          {/* Right: Integration grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
            {integrations.map((int) => (
              <div key={int.name} style={{
                background: 'white',
                border: '1px solid rgba(0,25,71,0.07)',
                borderRadius: 14,
                padding: '16px',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
                boxShadow: '0 2px 12px rgba(0,25,71,0.04)',
                transition: 'transform 0.2s, box-shadow 0.2s',
                cursor: 'default',
              }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 10,
                  background: `${int.color}15`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <span style={{ fontSize: 11, fontWeight: 800, color: int.color }}>{int.name[0]}</span>
                </div>
                <span style={{ fontSize: 11, fontWeight: 600, color: 'rgba(0,25,71,0.5)', textAlign: 'center' }}>{int.name}</span>
              </div>
            ))}
            
            {/* +188 more */}
            <div style={{
              background: 'linear-gradient(135deg, #1456FF, #00C8FF)',
              borderRadius: 14, padding: '16px',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              gap: 4, cursor: 'pointer',
            }}>
              <span style={{ fontSize: 16, fontWeight: 800, color: 'white' }}>+188</span>
              <span style={{ fontSize: 10, fontWeight: 600, color: 'rgba(255,255,255,0.7)', textAlign: 'center' }}>connecteurs</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
