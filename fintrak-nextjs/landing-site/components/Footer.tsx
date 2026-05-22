'use client';

const links = {
  'Produit': ['Fonctionnalités', 'Tarifs', 'Changelog', 'Roadmap', 'API'],
  'Ressources': ['Documentation', 'Blog', 'Webinaires', 'Cas clients', 'Tutoriels'],
  'Entreprise': ['À propos', 'Carrières', 'Partenaires', 'Presse', 'Contact'],
  'Légal': ['CGU', 'Politique de confidentialité', 'Cookies', 'RGPD', 'Sécurité'],
};

export default function Footer() {
  return (
    <footer style={{ background: '#36B2FF', color: 'white' }}>
      {/* Main footer */}
      <div style={{ background: '#001947', padding: '80px 0 60px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 80px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr 1fr', gap: 40, marginBottom: 60 }}>
            {/* Brand */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <div style={{
                  width: 36, height: 36,
                  background: 'linear-gradient(135deg, #1456FF, #00C8FF)',
                  borderRadius: 10,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M4 10L8 6L12 10L16 6" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M4 14L8 10L12 14L16 10" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" opacity="0.6"/>
                  </svg>
                </div>
                <span style={{ fontWeight: 700, fontSize: 18, letterSpacing: '-0.3px' }}>Fintrak</span>
              </div>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', lineHeight: 1.7, marginBottom: 24 }}>
                L&apos;intelligence financière augmentée par IA pour les équipes finance modernes.
              </p>
              <div style={{ display: 'flex', gap: 10 }}>
                {['LinkedIn', 'Twitter', 'YouTube'].map(social => (
                  <a key={social} href="#" style={{
                    width: 36, height: 36, borderRadius: 10,
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 11, color: 'rgba(255,255,255,0.5)',
                    textDecoration: 'none', fontWeight: 600,
                  }}>
                    {social[0]}
                  </a>
                ))}
              </div>
            </div>

            {/* Links */}
            {Object.entries(links).map(([section, items]) => (
              <div key={section}>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,0.9)', marginBottom: 16, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                  {section}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {items.map(item => (
                    <a key={item} href="#" style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', textDecoration: 'none', transition: 'color 0.2s' }}>
                      {item}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div style={{
            borderTop: '1px solid rgba(255,255,255,0.07)',
            paddingTop: 24,
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)' }}>
              © 2025 Fintrak. Tous droits réservés. Fait avec ♥ à Paris.
            </span>
            <div style={{ display: 'flex', gap: 20 }}>
              {['🇫🇷 Français', '🇬🇧 English'].map(lang => (
                <a key={lang} href="#" style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)', textDecoration: 'none' }}>
                  {lang}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ background: '#36B2FF', padding: '16px 80px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 14, fontWeight: 600, color: 'rgba(0,25,71,0.8)' }}>
            🔒 Données hébergées en France · ISO 27001 · SOC 2 Type II · RGPD Conforme
          </span>
        </div>
      </div>
    </footer>
  );
}
