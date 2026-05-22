'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

interface Hotspot {
  x: number; // percentage (0-100)
  y: number; // percentage (0-100)
  width: number; // percentage (0-100)
  height: number; // percentage (0-100)
  href: string;
  label: string;
}

interface SvgViewerProps {
  src: string;
  alt: string;
  hotspots: Hotspot[];
}

export default function SvgViewer({ src, alt, hotspots }: SvgViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Pour le mode développement : afficher les coordonnées au clic
  const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const xPercent = (x / rect.width) * 100;
    const yPercent = (y / rect.height) * 100;
    
    console.log(`Clic aux coordonnées : X=${xPercent.toFixed(2)}%, Y=${yPercent.toFixed(2)}%`);
  };

  return (
    <div 
      ref={containerRef}
      className="relative w-full min-h-screen bg-white"
      onClick={handleContainerClick}
    >
      <img 
        src={src} 
        alt={alt} 
        className="w-full h-auto block" 
      />
      
      {hotspots.map((hotspot, index) => (
        <Link 
          key={index}
          href={hotspot.href}
          className="absolute z-10 cursor-pointer hover:bg-black/5 transition-colors duration-300 rounded"
          style={{
            left: `${hotspot.x}%`,
            top: `${hotspot.y}%`,
            width: `${hotspot.width}%`,
            height: `${hotspot.height}%`,
          }}
          title={`Aller vers ${hotspot.label}`}
          aria-label={hotspot.label}
        />
      ))}
    </div>
  );
}
