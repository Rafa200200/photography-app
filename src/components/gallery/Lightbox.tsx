'use client';

import { useState, useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface LightboxProps {
  photos: {
    id: string | number;
    src: string;
    category: string;
  }[];
  initialIndex: number;
  onClose: () => void;
}

export default function Lightbox({ photos, initialIndex, onClose }: LightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  const goNext = useCallback(() => {
    setCurrentIndex(prev => (prev + 1) % photos.length);
  }, [photos.length]);

  const goPrev = useCallback(() => {
    setCurrentIndex(prev => (prev - 1 + photos.length) % photos.length);
  }, [photos.length]);

  // Keyboard navigation
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowLeft') goPrev();
    }
    window.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    
    return () => {
      window.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [onClose, goNext, goPrev]);

  const photo = photos[currentIndex];
  if (!photo) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/95 backdrop-blur-sm cursor-pointer"
        onClick={onClose}
      />

      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 z-10 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors backdrop-blur-sm"
        aria-label="Close"
      >
        <X size={24} />
      </button>

      {/* Counter */}
      <div className="absolute top-6 left-6 z-10 text-white/50 text-sm font-mono">
        {currentIndex + 1} / {photos.length}
      </div>

      {/* Previous Button */}
      {photos.length > 1 && (
        <button
          onClick={goPrev}
          className="absolute left-4 md:left-8 z-10 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors backdrop-blur-sm"
          aria-label="Previous"
        >
          <ChevronLeft size={28} />
        </button>
      )}

      {/* Next Button */}
      {photos.length > 1 && (
        <button
          onClick={goNext}
          className="absolute right-4 md:right-8 z-10 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors backdrop-blur-sm"
          aria-label="Next"
        >
          <ChevronRight size={28} />
        </button>
      )}

      {/* Main Image */}
      <div className="relative z-[1] max-w-[90vw] max-h-[90vh] flex items-center justify-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={photo.src}
          alt={photo.category || 'Photo'}
          className="max-w-full max-h-[90vh] object-contain select-none rounded-sm shadow-2xl"
          draggable={false}
        />

        {/* Category Label */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-sm px-4 py-1.5 rounded-full">
          <span className="text-accent text-xs font-semibold uppercase tracking-[0.2em]">
            {photo.category}
          </span>
        </div>
      </div>
    </div>
  );
}
