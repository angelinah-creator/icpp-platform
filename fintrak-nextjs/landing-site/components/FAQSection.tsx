'use client';
import { useState } from 'react';

const faqs = [
  {
    q: 'Comment fonctionne l\'intégration avec mon ERP ?',
    a: 'Fintrak propose plus de 200 connecteurs natifs pour les principaux ERP du marché (SAP, Oracle, Sage, Cegid, Microsoft Dynamics...). La connexion se fait en quelques minutes via notre interface no-code. Pour les systèmes propriétaires, notre API REST permet une intégration sur mesure.',
  },
  {
    q: 'Mes données financières sont-elles en sécurité ?',
    a: 'La sécurité est notre priorité absolue. Toutes les données sont chiffrées en AES-256 au repos et en transit. Nous sommes certifiés SOC 2 Type II et ISO 27001. Vos données ne quittent jamais l\'UE et ne sont jamais utilisées pour entraîner nos modèles sans votre consentement explicite.',
  },
  {
    q: 'Quelle est la précision des prévisions IA ?',
    a: 'Nos modèles atteignent en moyenne 94% de précision sur les prévisions à 3 mois, et 87% sur 12 mois. Cette précision s\'améliore avec le temps grâce à l\'apprentissage continu sur vos données historiques. Nous fournissons des intervalles de confiance pour chaque prévision.',
  },
  {
    q: 'Puis-je essayer Fintrak gratuitement ?',
    a: 'Oui ! Tous nos plans incluent un essai gratuit de 14 jours sans carte bancaire. Vous avez accès à toutes les fonctionnalités du plan Growth. À la fin de l\'essai, vous choisissez le plan qui vous convient ou vous partez sans frais.',
  },
  {
    q: 'Combien de temps pour être opérationnel ?',
    a: 'La majorité de nos clients sont opérationnels en moins de 48h. Notre équipe d\'onboarding vous accompagne pour la connexion des sources de données, la configuration des dashboards et la formation des utilisateurs. Pour les configurations enterprise complexes, comptez 2 à 4 semaines.',
  },
  {
    q: 'Proposez-vous un accompagnement et du support ?',
    a: 'Oui. Le plan Starter inclut le support email (réponse < 24h). Le plan Growth offre un support prioritaire 24/7 par chat et téléphone. Le plan Enterprise inclut un Customer Success Manager dédié, des sessions de formation et des revues trimestrielles.',
  },
];

export default function FAQSection() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section style={{ background: '#001947', padding: '120px 0', position: 'relative', overflow: 'hidden' }}>
      <div style={{
        position: 'absolute', width: 400, height: 400,
        background: 'rgba(20,86,255,0.1)',
        borderRadius: '50%', filter: 'blur(80px)',
        bottom: 0, left: 0, pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: 860, margin: '0 auto', padding: '0 80px', position: 'relative' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 60 }}>
          <span className="tag-badge-dark" style={{ marginBottom: 20 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#00C8FF', display: 'inline-block' }} />
            Questions fréquentes
          </span>
          <h2 style={{ fontSize: 52, fontWeight: 800, color: 'white', letterSpacing: '-1.5px', margin: '16px 0 0' }}>
            On répond à tout,<br />
            <span className="gradient-text">sans détour</span>
          </h2>
        </div>

        {/* FAQ items */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {faqs.map((faq, i) => (
            <div key={i} style={{
              background: open === i ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.03)',
              border: `1px solid ${open === i ? 'rgba(0,200,255,0.2)' : 'rgba(255,255,255,0.06)'}`,
              borderRadius: 16,
              overflow: 'hidden',
              transition: 'all 0.2s ease',
            }}>
              <button
                onClick={() => setOpen(open === i ? null : i)}
                style={{
                  width: '100%', textAlign: 'left',
                  padding: '20px 24px',
                  background: 'transparent', border: 'none',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  cursor: 'pointer', gap: 16,
                }}
              >
                <span style={{ fontSize: 16, fontWeight: 600, color: 'white', lineHeight: 1.4 }}>
                  {faq.q}
                </span>
                <div style={{
                  width: 28, height: 28, borderRadius: '50%',
                  background: open === i ? 'rgba(0,200,255,0.2)' : 'rgba(255,255,255,0.1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0, transition: 'all 0.2s',
                }}>
                  <span style={{ color: 'white', fontSize: 16, lineHeight: 1, transform: open === i ? 'rotate(45deg)' : 'none', display: 'block', transition: 'transform 0.2s' }}>+</span>
                </div>
              </button>
              {open === i && (
                <div style={{ padding: '0 24px 20px' }}>
                  <p style={{ margin: 0, fontSize: 15, color: 'rgba(255,255,255,0.55)', lineHeight: 1.7 }}>
                    {faq.a}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
