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

  // Cycle through photos every 6 seconds
  useEffect(() => {
    if (photos.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % photos.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [photos.length]);

  // Trigger initial fade-in
  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Preload images with high quality
  const handleImageLoad = useCallback((index: number) => {
    setImagesReady(prev => new Set(prev).add(index));
  }, []);

  const scrollToPortfolio = () => {
    document.getElementById('portfolio')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative h-screen flex flex-col items-center justify-center text-center px-6 overflow-hidden">
      
      {/* Background Slideshow - only render current + next for performance */}
      {photos.length > 0 && (
        <div className="absolute inset-0 -z-20">
          {photos.map((photo, index) => {
            // Only render current, previous, and next slides for performance
            const diff = Math.abs(index - currentIndex);
            const shouldRender = diff <= 1 || diff === photos.length - 1;
            if (!shouldRender) return null;

            return (
              <div
                key={photo.id}
                className="absolute inset-0 transition-opacity duration-[2500ms] ease-in-out"
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

      {/* Refined overlay: less aggressive, more cinematic */}
      <div className="absolute inset-0 -z-10 bg-black/55" />

      {/* Vignette: strong at edges for cinematic look */}
      <div className="absolute inset-0 -z-10" style={{
        background: 'radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.5) 100%)'
      }} />

      {/* Top/bottom gradients for seamless blending */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-background/70 via-transparent to-background" />

      {/* Content */}
      <div className={`max-w-5xl mx-auto space-y-6 transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        {/* Subtle top border */}
        <div className="h-px w-24 bg-accent/40 mx-auto mb-10" />
        
        <h1 className="font-display text-5xl md:text-7xl lg:text-8xl tracking-widest text-white mb-6 leading-tight font-light uppercase" style={{
          textShadow: '0 2px 20px rgba(0,0,0,0.6), 0 4px 40px rgba(0,0,0,0.4)'
        }}>
          {config.name}
        </h1>
        
        <p className="text-xl md:text-2xl text-white/70 max-w-2xl mx-auto font-light tracking-wider" style={{
          textShadow: '0 1px 10px rgba(0,0,0,0.5)'
        }}>
          {config.tagline}
        </p>

        <div className="h-px w-24 bg-accent/40 mx-auto mt-10" />
      </div>

      <button 
        onClick={scrollToPortfolio}
        className={`absolute bottom-12 left-1/2 -translate-x-1/2 text-white/40 hover:text-accent transition-all duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
        aria-label="Scroll to portfolio"
      >
        <ChevronDown size={32} className="animate-bounce" />
      </button>
    </section>
  );
}
