import Image from "next/image";
import Link from "next/link";
import { ChevronRight, ShieldCheck, FileText, CheckCircle } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="relative min-h-screen bg-[#05132A] text-white selection:bg-[#5CE1E6]/30 overflow-x-hidden font-sans">
      
      {/* SECTION 1 - Hero & Intro */}
      <section className="relative w-full min-h-screen flex flex-col pb-12">
        {/* Background 1 */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <Image 
            src="/landing/fond-template1.svg" 
            alt="Background Section 1" 
            fill 
            className="object-cover object-top" 
            priority 
          />
        </div>

        {/* Navbar */}
        <nav className="relative z-50 flex items-center justify-between px-6 md:px-12 py-6 max-w-[1440px] mx-auto w-full">
          <div className="flex items-center">
            <Image src="/landing/logo.svg" alt="ICPP Conformité" width={160} height={50} className="h-10 w-auto" />
          </div>
          <div className="hidden lg:flex items-center gap-10 text-sm font-medium text-slate-300">
            <Link href="#promesse" className="hover:text-white transition-colors">Promesse</Link>
            <Link href="#secteurs" className="hover:text-white transition-colors">Secteurs</Link>
            <Link href="#loi" className="hover:text-white transition-colors">Loi</Link>
            <Link href="#plateforme" className="hover:text-white transition-colors">Plateforme</Link>
            <Link href="#tarifs" className="hover:text-white transition-colors">Tarifs</Link>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium text-slate-300 hover:text-white transition-colors hidden md:block">
              Connexion
            </Link>
            <Link href="/register" className="bg-[#5CE1E6] hover:bg-[#4bc8cd] text-[#0A2540] font-bold px-6 py-2.5 rounded-full transition-transform hover:scale-105 shadow-[0_0_15px_rgba(92,225,230,0.3)]">
              Audit gratuit
            </Link>
          </div>
        </nav>

        {/* Hero Content */}
        <main className="relative z-10 flex-1 max-w-[1440px] w-full mx-auto px-6 md:px-12 pt-12 lg:pt-20 flex flex-col justify-center">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Column : Content */}
            <div className="lg:col-span-6 xl:col-span-5 flex flex-col items-start text-left">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/20 bg-[#ffffff08] mb-8 shadow-sm">
                <div className="w-2 h-2 rounded-full bg-[#5CE1E6]" />
                <span className="text-sm font-medium text-slate-200">Institut de Conformité — France entière</span>
              </div>
              
              <h1 className="text-5xl lg:text-6xl font-extrabold leading-[1.15] tracking-tight mb-6 text-white">
                Dirigeant(e) de TPE, vos<br/>
                obligations légales,<br/>
                gérées <span className="text-[#5CE1E6]">par des experts.</span>
              </h1>
              
              <p className="text-lg md:text-xl text-slate-300 mb-10 leading-relaxed max-w-lg">
                DUERP, plan d'action PAPRIPACT, formations, veille 24/7 — nos experts s'occupent de tout. Si malgré tout vous êtes contrôlé, c'est nous qui payons l'amende.
              </p>

              {/* CTA Card */}
              <div className="p-8 rounded-[2rem] border border-white/10 bg-gradient-to-b from-[#ffffff10] to-transparent backdrop-blur-md relative overflow-hidden mb-6 w-full max-w-md shadow-2xl">
                <div className="inline-flex items-center gap-2 text-xs font-bold text-[#5CE1E6] mb-4">
                  <ShieldCheck className="w-4 h-4" />
                  Commencez ici • 2 minutes
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Mini-audit conformité gratuit</h3>
                <p className="text-slate-300 mb-8 text-sm leading-relaxed">
                  5 questions pour estimer votre niveau de risque et recevoir un diagnostic personnalisé.
                </p>
                
                <Link href="/register" className="flex items-center justify-between w-full p-4 rounded-xl bg-gradient-to-r from-[#5CE1E6] to-[#0097B2] text-[#0A2540] font-bold group transition-all hover:shadow-[0_0_20px_rgba(92,225,230,0.4)]">
                  <span className="text-base">Démarrer le mini-audit</span>
                  <div className="w-8 h-8 rounded-full bg-[#0A2540]/20 flex items-center justify-center group-hover:bg-[#0A2540]/30 transition-colors">
                    <ChevronRight className="w-5 h-5 text-[#0A2540]" />
                  </div>
                </Link>
                <div className="mt-5 text-xs text-slate-400 font-medium">
                  Sans engagement • Résultat immédiat
                </div>
              </div>

              <div className="flex flex-wrap gap-3 text-sm text-slate-300 font-medium">
                <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5">
                  <CheckCircle className="w-4 h-4 text-[#5CE1E6]" />
                  Garantie amende — unique en France
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5">
                  Visio (Hexagone) • Sur site (La Réunion)
                </div>
              </div>
            </div>

            {/* Right Column : Illustration template1.png as Dashboard Reference */}
            <div className="lg:col-span-6 xl:col-span-7 relative flex items-center justify-center lg:justify-end">
              <Image 
                src="/landing/template1.png" 
                alt="Illustration Accueil" 
                width={800} 
                height={800} 
                className="w-full h-auto max-w-[800px] object-contain drop-shadow-2xl"
              />
            </div>
          </div>
          
          {/* Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-24 border-t border-white/10 pt-16 relative z-10">
            <div className="text-center md:text-left">
              <div className="text-5xl lg:text-6xl font-bold text-white mb-3">80%</div>
              <div className="text-base text-slate-300">des TPE non<br/>conformes</div>
            </div>
            <div className="text-center md:text-left">
              <div className="text-5xl lg:text-6xl font-bold text-white mb-3">1 500 €</div>
              <div className="text-base text-slate-300">amende vs<br/>39€/mois</div>
            </div>
            <div className="text-center md:text-left">
              <div className="text-5xl lg:text-6xl font-bold text-white mb-3">40 ans</div>
              <div className="text-base text-slate-300">conservation<br/>obligatoire</div>
            </div>
            <div className="text-center md:text-left">
              <div className="text-5xl lg:text-6xl font-bold text-white mb-3">24/7</div>
              <div className="text-base text-slate-300">veille & suivi<br/>experts</div>
            </div>
          </div>
        </main>
      </section>

      {/* Scrolling Ticker (Defile) */}
      <div className="relative z-20 w-full bg-[#1A41D6] py-3 overflow-hidden flex items-center justify-center border-y border-blue-500/30">
         <Image src="/landing/defile.svg" alt="Défilement Infos" width={1920} height={40} className="w-full h-auto min-w-[1000px] object-cover opacity-90" />
      </div>

      {/* SECTION 2 - Secteurs */}
      <section id="secteurs" className="relative w-full py-24 md:py-32 flex flex-col items-center justify-center">
        {/* Background 2 */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <Image 
            src="/landing/fond-template2.svg" 
            alt="Background Section 2" 
            fill 
            className="object-cover" 
          />
        </div>

        <div className="relative z-10 w-full max-w-[1440px] mx-auto px-6 flex flex-col items-center gap-16">
          {/* Content 2 (Text in SVG) */}
          <div className="w-full flex justify-center">
            <Image 
              src="/landing/content-template2.svg" 
              alt="Contenu Secteurs" 
              width={1039} 
              height={238} 
              className="w-full max-w-[1039px] h-auto drop-shadow-xl" 
            />
          </div>

          {/* Cards 2 (SVG) */}
          <div className="flex flex-col md:flex-row justify-center items-center gap-8 w-full max-w-5xl">
             <div className="w-full md:w-1/2 flex justify-center md:justify-end hover:-translate-y-2 transition-transform duration-500 cursor-pointer">
               <Image src="/landing/card1-template2.svg" alt="Card 1" width={600} height={400} className="w-full h-auto max-w-[500px] drop-shadow-2xl" />
             </div>
             <div className="w-full md:w-1/2 flex justify-center md:justify-start hover:-translate-y-2 transition-transform duration-500 cursor-pointer">
               <Image src="/landing/card2-template2.svg" alt="Card 2" width={450} height={400} className="w-full h-auto max-w-[400px] drop-shadow-2xl" />
             </div>
          </div>
        </div>
      </section>

      {/* SECTION 3 - Plateforme */}
      <section id="plateforme" className="relative w-full py-24 md:py-32 flex justify-center items-center">
        <div className="relative z-10 w-full max-w-[1440px] mx-auto px-6 flex justify-center">
           {/* Content 3 (Large illustration in SVG) */}
           <Image 
             src="/landing/content-template3.svg" 
             alt="Interface ICPP Plateforme" 
             width={1440} 
             height={1000} 
             className="w-full h-auto max-w-[1440px] drop-shadow-2xl" 
           />
        </div>
      </section>

      {/* SECTION 4 - Lois */}
      <section id="loi" className="relative w-full py-24 md:py-32 flex justify-center items-center border-t border-white/5">
        {/* Background 4 */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <Image 
            src="/landing/fond-template4.svg" 
            alt="Background Section 4" 
            fill 
            className="object-cover object-bottom" 
          />
        </div>

        <div className="relative z-10 w-full max-w-[1440px] mx-auto px-6 flex justify-center">
          {/* Content 4 (Text/Cards in SVG) */}
          <Image 
            src="/landing/content-template4.svg" 
            alt="Contenu Lois" 
            width={1268} 
            height={815} 
            className="w-full max-w-[1268px] h-auto drop-shadow-2xl" 
          />
        </div>
      </section>
      
      {/* Footer Minimaliste */}
      <footer className="relative z-10 w-full border-t border-white/10 bg-[#020B18] py-12">
        <div className="container mx-auto px-6 max-w-[1440px] flex flex-col md:flex-row justify-between items-center gap-6">
          <Image
            src="/landing/logo.svg"
            alt="ICPP Logo"
            width={120}
            height={40}
            className="h-8 w-auto opacity-70 hover:opacity-100 transition-opacity"
          />
          <p className="text-sm text-slate-500">
            &copy; {new Date().getFullYear()} ICPP Conformité. Tous droits réservés.
          </p>
          <div className="flex gap-6 text-sm text-slate-400">
            <Link href="#" className="hover:text-[#5CE1E6] transition-colors">Mentions légales</Link>
            <Link href="#" className="hover:text-[#5CE1E6] transition-colors">CGV</Link>
            <Link href="#" className="hover:text-[#5CE1E6] transition-colors">Confidentialité</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

