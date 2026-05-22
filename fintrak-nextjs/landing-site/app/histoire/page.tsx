import SvgViewer from '@/components/SvgViewer';

export default function Histoire() {
  const hotspots = [
    {
      x: 70, 
      y: 0,  
      width: 15, 
      height: 2, 
      href: "/histoire",
      label: "Histoire"
    },
    {
      x: 5,  
      y: 0,
      width: 15,
      height: 2,
      href: "/",
      label: "Accueil"
    }
  ];

  return (
    <main className="w-full bg-[#f8f9fa] min-h-screen">
      <SvgViewer 
        src="/histoire.svg" 
        alt="Histoire ICPP" 
        hotspots={hotspots} 
      />
    </main>
  );
}
