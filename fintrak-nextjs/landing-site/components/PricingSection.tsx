'use client';
import { useState } from 'react';

const plans = [
  {
    name: 'Starter',
    price: { monthly: 49, annual: 39 },
    desc: 'Idéal pour les PME et startups',
    color: '#F0F4F6',
    features: [
      'Jusqu\'à 5 utilisateurs',
      '10 000 transactions/mois',
      'Dashboard temps réel',
      'Alertes automatiques',
      'Export PDF & Excel',
      'Support email',
    ],
    cta: 'Commencer',
    highlight: false,
  },
  {
    name: 'Growth',
    price: { monthly: 149, annual: 119 },
    desc: 'Pour les équipes finance en croissance',
    color: '#001947',
    features: [
      'Jusqu\'à 25 utilisateurs',
      '500 000 transactions/mois',
      'IA conversationnelle',
      'Détection d\'anomalies',
      'Intégrations ERP',
      'Rapports personnalisés',
      'Support prioritaire 24/7',
      'Audit trail complet',
    ],
    cta: 'Démarrer l\'essai gratuit',
    highlight: true,
  },
  {
    name: 'Enterprise',
    price: { monthly: null, annual: null },
    desc: 'Pour les grands groupes & ETI',
    color: '#F0F4F6',
    features: [
      'Utilisateurs illimités',
      'Transactions illimitées',
      'IA dédiée & fine-tuning',
      'Conformité IFRS/GAAP',
      'SSO & SCIM',
      'API complète',
      'CSM dédié',
      'SLA 99.99%',
      'On-premise disponible',
    ],
    cta: 'Contacter l\'équipe commerciale',
    highlight: false,
  },
];

export default function PricingSection() {
  const [annual, setAnnual] = useState(true);

  return (
    <section style={{ background: '#001947', padding: '120px 0', position: 'relative', overflow: 'hidden' }}>
      <div style={{
        position: 'absolute', width: 600, height: 600,
        background: 'rgba(0,200,255,0.08)',
        borderRadius: '50%', filter: 'blur(100px)',
        top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 80px', position: 'relative' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 60 }}>
          <span className="tag-badge-dark" style={{ marginBottom: 20 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#00C8FF', display: 'inline-block' }} />
            Tarifs transparents
          </span>
          <h2 style={{
            fontSize: 52, fontWeight: 800, color: 'white',
            letterSpacing: '-1.5px', lineHeight: 1.1,
            margin: '16px 0 16px',
          }}>
            Simple, prévisible,<br />
            <span className="gradient-text">sans surprise</span>
          </h2>
          <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.55)', marginBottom: 32 }}>
            Commencez gratuitement. Évoluez selon vos besoins.
          </p>

          {/* Toggle */}
          <div style={{
            display: 'inline-flex', background: 'rgba(255,255,255,0.08)',
            borderRadius: 30, padding: 4, gap: 4,
          }}>
            {['Mensuel', 'Annuel (-20%)'].map((label, i) => (
              <button key={label} onClick={() => setAnnual(i === 1)} style={{
                padding: '8px 20px', borderRadius: 26, border: 'none',
                fontSize: 14, fontWeight: 500, cursor: 'pointer',
                background: (i === 1) === annual ? 'white' : 'transparent',
                color: (i === 1) === annual ? '#001947' : 'rgba(255,255,255,0.6)',
                transition: 'all 0.2s',
              }}>
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Plans */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
          {plans.map((plan) => (
            <div key={plan.name} className="pricing-card" style={{
              background: plan.highlight ? 'linear-gradient(160deg, #1456FF 0%, #001947 100%)' : 'rgba(255,255,255,0.04)',
              border: plan.highlight ? '1px solid rgba(0,200,255,0.3)' : '1px solid rgba(255,255,255,0.08)',
              padding: '32px',
            }}>
              {plan.highlight && (
                <div style={{
                  background: 'linear-gradient(90deg, #00C8FF, #0BE365)',
                  borderRadius: 20, padding: '4px 14px',
                  fontSize: 12, fontWeight: 700, color: '#001947',
                  display: 'inline-block', marginBottom: 16,
                }}>
                  ✦ Recommandé
                </div>
              )}
              <div style={{ fontSize: 22, fontWeight: 700, color: 'white', marginBottom: 6 }}>{plan.name}</div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', marginBottom: 24 }}>{plan.desc}</div>

              <div style={{ marginBottom: 28 }}>
                {plan.price.monthly ? (
                  <>
                    <span style={{ fontSize: 52, fontWeight: 800, color: 'white', letterSpacing: '-2px' }}>
                      €{annual ? plan.price.annual : plan.price.monthly}
                    </span>
                    <span style={{ fontSize: 15, color: 'rgba(255,255,255,0.45)', marginLeft: 4 }}>/mois</span>
                  </>
                ) : (
                  <span style={{ fontSize: 36, fontWeight: 800, color: 'white' }}>Sur devis</span>
                )}
              </div>

              <button style={{
                width: '100%',
                padding: '14px',
                borderRadius: 30,
                border: plan.highlight ? 'none' : '1px solid rgba(255,255,255,0.2)',
                background: plan.highlight
                  ? 'linear-gradient(135deg, #00C8FF, #1456FF)'
                  : 'rgba(255,255,255,0.06)',
                color: 'white',
                fontSize: 15,
                fontWeight: 600,
                cursor: 'pointer',
                marginBottom: 28,
                transition: 'all 0.2s',
              }}>
                {plan.cta}
              </button>

              <div style={{ height: 1, background: 'rgba(255,255,255,0.08)', marginBottom: 24 }} />

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {plan.features.map((feat) => (
                  <div key={feat} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                      width: 18, height: 18, borderRadius: '50%',
                      background: plan.highlight ? 'rgba(11,227,101,0.2)' : 'rgba(255,255,255,0.1)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0,
                    }}>
                      <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                        <path d="M1.5 4L3 5.5L6.5 2" stroke={plan.highlight ? '#0BE365' : 'rgba(255,255,255,0.5)'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <span style={{ fontSize: 14, color: plan.highlight ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.55)' }}>
                      {feat}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom note */}
        <p style={{ textAlign: 'center', marginTop: 32, fontSize: 14, color: 'rgba(255,255,255,0.35)' }}>
          Tous les plans incluent un essai gratuit de 14 jours. Aucune carte bancaire requise.
        </p>
      </div>
    </section>
  );
}
