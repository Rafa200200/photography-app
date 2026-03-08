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
    <section id="portfolio" className="py-24">
      <div className="container mx-auto px-4 md:px-6">
        
        {/* Header & Filters */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div>
            <div className="section-divider mb-6" />
            <h2 className="font-display text-4xl md:text-5xl font-bold">Portfólio</h2>
          </div>
          
          <div className="flex flex-wrap gap-2 md:gap-4">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 capitalize ${
                  activeCategory === category 
                    ? 'bg-foreground text-background' 
                    : 'bg-surface hover:bg-surface-light text-foreground/70 hover:text-foreground'
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
              style={{ animationDelay: `${(index % 8) * 150}ms` }}
            >
              <div 
                className="photo-card relative group cursor-pointer bg-surface rounded-lg overflow-hidden border border-white/[0.02]"
                onClick={() => setLightboxIndex(index)}
              >
                <SafeImage
                  src={photo.src}
                  alt={photo.category || 'Portfolio Image'}
                  width={photo.width}
                  height={photo.height}
                  className="w-full h-auto object-cover transition-transform duration-1000 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  fallbackIconSize={32}
                />
                
                {/* Hover Details Overlay */}
                <div className="photo-overlay absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <span className="text-accent text-sm font-semibold uppercase tracking-[0.2em] block">
                    {photo.category}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Empty State */}
        {filteredPhotos.length === 0 && (
          <div className="text-center py-24 text-foreground/50">
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
