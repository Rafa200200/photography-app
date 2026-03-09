'use client';

import { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { X, ChevronLeft, ChevronRight, Download, Heart } from 'lucide-react';

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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const goNext = useCallback(() => {
    setCurrentIndex(prev => (prev + 1) % photos.length);
  }, [photos.length]);

  const goPrev = useCallback(() => {
    setCurrentIndex(prev => (prev - 1 + photos.length) % photos.length);
  }, [photos.length]);

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
  if (!photo || !mounted) return null;

  const isFav = photo.isFavorite || false;
  const isLoadingFav = isTogglingFavorite[photo.id] || false;

  const lightboxContent = (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.97)',
      }}
    >
      {/* Backdrop click to close */}
      <div 
        style={{ position: 'absolute', inset: 0, cursor: 'pointer' }}
        onClick={onClose}
      />

      {/* Top Bar */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          padding: '16px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          zIndex: 10,
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.7), transparent)',
        }}
      >
        {/* Counter */}
        <div style={{
          color: 'rgba(255,255,255,0.7)',
          fontSize: '14px',
          fontFamily: 'monospace',
          background: 'rgba(0,0,0,0.5)',
          padding: '6px 14px',
          borderRadius: '20px',
          backdropFilter: 'blur(8px)',
        }}>
          {currentIndex + 1} / {photos.length}
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {showFavoriteButton && onToggleFavorite && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite(photo.id, isFav);
              }}
              disabled={isLoadingFav}
              style={{
                padding: '10px',
                borderRadius: '50%',
                border: 'none',
                cursor: 'pointer',
                backdropFilter: 'blur(8px)',
                transition: 'all 0.2s',
                background: isFav ? 'rgba(196, 155, 105, 0.9)' : 'rgba(255,255,255,0.1)',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
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
              style={{
                padding: '10px',
                borderRadius: '50%',
                border: 'none',
                cursor: 'pointer',
                background: 'rgba(255,255,255,0.1)',
                color: 'white',
                backdropFilter: 'blur(4px)',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              title="Transferir fotografia"
            >
              <Download size={22} />
            </button>
          )}

          <div style={{ width: '1px', height: '24px', background: 'rgba(255,255,255,0.2)', margin: '0 4px' }} />

          <button
            onClick={onClose}
            style={{
              padding: '10px',
              borderRadius: '50%',
              border: 'none',
              cursor: 'pointer',
              background: 'rgba(255,255,255,0.1)',
              color: 'white',
              backdropFilter: 'blur(4px)',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
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
          style={{
            position: 'absolute',
            left: '16px',
            zIndex: 10,
            padding: '12px',
            borderRadius: '50%',
            border: 'none',
            cursor: 'pointer',
            background: 'rgba(255,255,255,0.05)',
            color: 'white',
            backdropFilter: 'blur(4px)',
            transition: 'all 0.2s',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
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
          style={{
            position: 'absolute',
            right: '16px',
            zIndex: 10,
            padding: '12px',
            borderRadius: '50%',
            border: 'none',
            cursor: 'pointer',
            background: 'rgba(255,255,255,0.05)',
            color: 'white',
            backdropFilter: 'blur(4px)',
            transition: 'all 0.2s',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          aria-label="Next"
        >
          <ChevronRight size={32} />
        </button>
      )}

      {/* Main Image - centered */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={photo.src}
        alt={photo.filename || 'Photo'}
        onClick={(e) => e.stopPropagation()}
        draggable={false}
        style={{
          position: 'relative',
          zIndex: 1,
          maxWidth: 'calc(100vw - 120px)',
          maxHeight: 'calc(100vh - 140px)',
          objectFit: 'contain',
          userSelect: 'none',
          borderRadius: '4px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        }}
      />

      {/* Bottom label */}
      <div
        style={{
          position: 'absolute',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          zIndex: 10,
        }}
      >
        {showFavoriteButton && isFav && (
          <div style={{
            background: 'rgba(196, 155, 105, 0.9)',
            backdropFilter: 'blur(4px)',
            padding: '6px 14px',
            borderRadius: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
          }}>
            <Heart size={14} fill="currentColor" style={{ color: 'white' }} />
            <span style={{ color: 'white', fontSize: '12px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              Favorita
            </span>
          </div>
        )}
        <div style={{
          background: 'rgba(0,0,0,0.8)',
          backdropFilter: 'blur(4px)',
          padding: '6px 16px',
          borderRadius: '20px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
          border: '1px solid rgba(255,255,255,0.1)',
        }}>
          <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: '12px', letterSpacing: '0.05em' }}>
            {photo.filename}
          </span>
        </div>
      </div>
    </div>
  );

  return createPortal(lightboxContent, document.body);
}
