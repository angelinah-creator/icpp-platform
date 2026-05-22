'use client';

const ITEMS = [
  'Reporting automatisé', 'Détection d\'anomalies', 'Analyse prédictive', 
  'Consolidation multi-entités', 'Conformité IFRS', 'Cash flow IA',
  'Audit trail complet', 'Dashboard temps réel', 'Intégration ERP',
  'Clôture accélérée', 'Scoring de risque', 'Prévisions budgétaires',
];

export default function TickerBar() {
  return (
    <div style={{
      background: '#2160FF',
      height: 53,
      overflow: 'hidden',
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
    }}>
      <div style={{
        display: 'flex',
        whiteSpace: 'nowrap',
        animation: 'ticker 30s linear infinite',
        gap: 0,
      }}>
        {[...ITEMS, ...ITEMS].map((item, i) => (
          <span key={i} style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 12,
            color: 'white',
            fontSize: 14,
            fontWeight: 500,
            padding: '0 32px',
          }}>
            <span style={{
              width: 5, height: 5, borderRadius: '50%',
              background: 'rgba(255,255,255,0.5)',
              display: 'inline-block', flexShrink: 0
            }} />
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
