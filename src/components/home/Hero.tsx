'use client';

import { useState, useEffect, useCallback } from 'react';
import { ChevronDown } from 'lucide-react';

interface HeroProps {
  config: {
    name: string;
    tagline: string;
  };
  photos?: {
    id: string | number;
    src: string;
    title: string;
    category: string;
    width: number;
    height: number;
  }[];
}

export default function Hero({ config, photos = [] }: HeroProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [imagesReady, setImagesReady] = useState<Set<number>>(new Set());

  // Cycle through photos every 7 seconds for a slower, more cinematic feel
  useEffect(() => {
    if (photos.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % photos.length);
    }, 7000);

    return () => clearInterval(interval);
  }, [photos.length]);

  // Trigger initial fade-in
  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 200);
    return () => clearTimeout(timer);
  }, []);

  const handleImageLoad = useCallback((index: number) => {
    setImagesReady(prev => new Set(prev).add(index));
  }, []);

  const scrollToPortfolio = () => {
    document.getElementById('portfolio')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-[100svh] flex flex-col items-center justify-center text-center px-6 overflow-hidden">
      
      {/* Background Slideshow */}
      {photos.length > 0 && (
        <div className="absolute inset-0 -z-20">
          {photos.map((photo, index) => {
            const diff = Math.abs(index - currentIndex);
            const shouldRender = diff <= 1 || diff === photos.length - 1;
            if (!shouldRender) return null;

            return (
              <div
                key={photo.id}
                className="absolute inset-0 transition-opacity duration-[3000ms] ease-in-out"
                style={{ opacity: index === currentIndex ? 1 : 0 }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photo.src}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover"
                  style={{ imageRendering: 'auto' }}
                  loading="eager"
                  decoding="async"
                  onLoad={() => handleImageLoad(index)}
                />
              </div>
            );
          })}
        </div>
      )}

      {/* Cinematic gradient overlay — darker at top and bottom, lighter in center */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black/50 via-black/20 to-black/80" />

      {/* Radial vignette for depth */}
      <div className="absolute inset-0 -z-10" style={{
        background: 'radial-gradient(ellipse at center, transparent 20%, rgba(9,9,11,0.6) 100%)'
      }} />

      {/* Content */}
      <div className={`max-w-5xl mx-auto transition-all duration-[1500ms] ease-out ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
        {/* Thin gold accent line */}
        <div className="w-12 h-px bg-accent/30 mx-auto mb-12" />
        
        <h1 className="font-display text-3xl sm:text-5xl md:text-7xl lg:text-8xl tracking-[0.08em] sm:tracking-[0.12em] md:tracking-[0.2em] text-zinc-50 mb-6 md:mb-8 leading-tight font-extralight uppercase" style={{
          textShadow: '0 2px 40px rgba(0,0,0,0.5)'
        }}>
          {config.name}
        </h1>
        
        <p className="text-base md:text-xl text-zinc-400 max-w-xl mx-auto font-light tracking-wider leading-relaxed px-4" style={{
          textShadow: '0 1px 20px rgba(0,0,0,0.4)'
        }}>
          {config.tagline}
        </p>

        <div className="w-12 h-px bg-accent/30 mx-auto mt-12" />
      </div>

      <button 
        onClick={scrollToPortfolio}
        className={`absolute bottom-16 left-1/2 -translate-x-1/2 text-zinc-500 hover:text-zinc-300 transition-all duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
        aria-label="Scroll to portfolio"
      >
        <ChevronDown size={28} className="animate-bounce" />
      </button>
    </section>
  );
}
