'use client';

import { useState, useMemo } from 'react';
import SafeImage from '@/components/ui/SafeImage';
import Lightbox from './Lightbox';

interface MasonryGridProps {
  photos: {
    id: string | number;
    src: string;
    title: string;
    category: string;
    width: number;
    height: number;
  }[];
}

export default function MasonryGrid({ photos }: MasonryGridProps) {
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Derive categories dynamically from the loaded photos, plus 'Todos'
  const categories = useMemo(() => {
    const uniqueCategories = Array.from(new Set(photos.map(p => p.category)));
    return ['Todos', ...uniqueCategories].filter(Boolean);
  }, [photos]);

  const filteredPhotos = activeCategory === 'Todos' 
    ? photos 
    : photos.filter(p => p.category === activeCategory);

  return (
    <section id="portfolio" className="py-32">
      <div className="container mx-auto px-4 md:px-6">
        
        {/* Header & Filters */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
          <div>
            <div className="section-divider mb-8" />
            <h2 className="font-display text-4xl md:text-5xl font-extralight tracking-[0.15em] text-zinc-50 uppercase">
              Portfólio
            </h2>
          </div>
          
          {/* Clean text-only filters */}
          <div className="flex flex-wrap gap-6 md:gap-8">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`text-sm tracking-[0.1em] uppercase transition-colors duration-500 font-light capitalize ${
                  activeCategory === category 
                    ? 'text-zinc-50' 
                    : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Masonry Layout */}
        <div className="masonry-grid transition-all duration-700">
          {filteredPhotos.map((photo, index) => (
            <div 
              key={photo.id} 
              className="masonry-item animate-fade-in-up" 
              style={{ animationDelay: `${(index % 8) * 120}ms` }}
            >
              <div 
                className="photo-card relative group cursor-pointer bg-zinc-900 rounded overflow-hidden"
                onClick={() => setLightboxIndex(index)}
              >
                <SafeImage
                  src={photo.src}
                  alt={photo.category || 'Portfolio Image'}
                  width={photo.width}
                  height={photo.height}
                  className="w-full h-auto object-cover transition-transform duration-[1000ms] ease-out group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  fallbackIconSize={32}
                />
                
                {/* Hover Overlay — minimal, just category */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-5 opacity-0 group-hover:opacity-100 transition-opacity duration-600">
                  <span className="text-zinc-300 text-xs font-light uppercase tracking-[0.2em]">
                    {photo.category}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Empty State */}
        {filteredPhotos.length === 0 && (
          <div className="text-center py-32 text-zinc-500 font-light tracking-wider">
            Nenhuma fotografia encontrada para esta categoria.
          </div>
        )}

      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <Lightbox
          photos={filteredPhotos.map(p => ({ id: p.id, src: p.src, category: p.category }))}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </section>
  );
}
