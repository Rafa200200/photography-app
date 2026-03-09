'use client';

import { useState, useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight, Download, Heart, Loader2 } from 'lucide-react';

export interface AlbumLightboxPhoto {
  id: string;
  src: string;
  filename: string;
  isFavorite?: boolean;
}

interface AlbumLightboxProps {
  photos: AlbumLightboxPhoto[];
  initialIndex: number;
  onClose: () => void;
  // Optional props for client gallery features
  onDownload?: (photo: AlbumLightboxPhoto) => void;
  onToggleFavorite?: (photoId: string, currentlyFav: boolean) => Promise<void>;
  isTogglingFavorite?: Record<string, boolean>;
  showFavoriteButton?: boolean;
}

export default function AlbumLightbox({ 
  photos, 
  initialIndex, 
  onClose,
  onDownload,
  onToggleFavorite,
  isTogglingFavorite = {},
  showFavoriteButton = false
}: AlbumLightboxProps) {
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

  const isFav = photo.isFavorite || false;
  const isLoadingFav = isTogglingFavorite[photo.id] || false;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/95 backdrop-blur-sm cursor-pointer"
        onClick={onClose}
      />

      {/* Top Bar Navigation */}
      <div className="absolute top-0 left-0 right-0 p-4 md:p-6 flex items-center justify-between z-10 bg-gradient-to-b from-black/60 to-transparent pointer-events-none">
        
        {/* Counter */}
        <div className="text-white/70 text-sm font-mono pointer-events-auto bg-black/40 px-3 py-1.5 rounded-full backdrop-blur-md">
          {currentIndex + 1} <span className="text-white/30">/</span> {photos.length}
        </div>

        {/* Top Right Actions */}
        <div className="flex items-center gap-2 md:gap-4 pointer-events-auto">
          {showFavoriteButton && onToggleFavorite && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite(photo.id, isFav);
              }}
              disabled={isLoadingFav}
              className={`p-2.5 md:p-3 rounded-full backdrop-blur-md transition-all ${
                isFav 
                  ? 'bg-accent/90 text-white hover:bg-accent' 
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
              title={isFav ? "Remover dos favoritos" : "Adicionar aos favoritos"}
            >
              <Heart 
                size={22} 
                className={isLoadingFav ? "animate-pulse" : ""}
                fill={isFav ? "currentColor" : "none"} 
              />
            </button>
          )}

          {onDownload && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDownload(photo);
              }}
              className="p-2.5 md:p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors backdrop-blur-sm"
              title="Transferir fotografia"
            >
              <Download size={22} />
            </button>
          )}

          <div className="w-px h-6 bg-white/20 mx-1 hidden md:block" />

          <button
            onClick={onClose}
            className="p-2.5 md:p-3 bg-white/10 hover:bg-red-500/80 text-white rounded-full transition-colors backdrop-blur-sm"
            title="Fechar (Esc)"
          >
            <X size={22} />
          </button>
        </div>
      </div>

      {/* Previous Button */}
      {photos.length > 1 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            goPrev();
          }}
          className="absolute left-2 md:left-6 z-10 p-3 bg-white/5 hover:bg-white/20 text-white rounded-full transition-colors backdrop-blur-sm"
          aria-label="Previous"
        >
          <ChevronLeft size={32} />
        </button>
      )}

      {/* Next Button */}
      {photos.length > 1 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            goNext();
          }}
          className="absolute right-2 md:right-6 z-10 p-3 bg-white/5 hover:bg-white/20 text-white rounded-full transition-colors backdrop-blur-sm"
          aria-label="Next"
        >
          <ChevronRight size={32} />
        </button>
      )}

      {/* Main Image */}
      <div 
        className="relative z-[1] w-full h-full flex flex-col items-center justify-center p-4 md:p-12"
        onClick={onClose} // Clicking outside the image closes it
      >
        <div className="relative flex flex-col items-center justify-center w-full h-full max-h-full">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={photo.src}
            alt={photo.filename || 'Photo'}
            className="max-w-full max-h-[85vh] object-contain select-none rounded shadow-2xl"
            draggable={false}
            onClick={(e) => e.stopPropagation()} // Prevent close on image click
          />

          {/* Filename Label (Bottom) */}
          <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-4 w-max">
             {showFavoriteButton && isFav && (
              <div className="bg-accent/90 backdrop-blur-sm px-3 py-1.5 flex items-center gap-2 rounded-full shadow-lg border border-accent/20">
                 <Heart size={14} fill="currentColor" className="text-white" />
                 <span className="text-white text-xs font-semibold uppercase tracking-wider">
                   Favorita
                 </span>
              </div>
             )}
             <div className="bg-black/80 backdrop-blur-sm px-4 py-1.5 rounded-full shadow-lg border border-white/10">
               <span className="text-white/90 text-xs tracking-wider">
                 {photo.filename}
               </span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
