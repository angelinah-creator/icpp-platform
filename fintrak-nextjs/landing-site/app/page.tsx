import SvgViewer from '@/components/SvgViewer';

export default function Home() {
  // Définition des zones cliquables (hotspots)
  // Ces coordonnées sont approximatives (en pourcentages)
  // Vous pourrez les ajuster en cliquant sur l'image en mode dev et en regardant la console
  const hotspots = [
    {
      x: 70, // Position horizontale (70% de la largeur, vers la droite)
      y: 0,  // Tout en haut (header)
      width: 15, // Largeur de la zone
      height: 1, // Hauteur de la zone (1% de l'image totale)
      href: "/histoire",
      label: "Histoire"
    },
    {
      x: 5,  // Logo en haut à gauche
      y: 0,
      width: 15,
      height: 1,
      href: "/",
      label: "Accueil"
    }
  ];

  return (
    <main className="w-full bg-[#f8f9fa] min-h-screen">
      <SvgViewer 
        src="/landing.svg" 
        alt="Landing Page ICPP" 
        hotspots={hotspots} 
      />
    </main>
  );
}
