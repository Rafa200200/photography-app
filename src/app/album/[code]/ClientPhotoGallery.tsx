'use client';

import { useState, useMemo } from 'react';
import { Heart, Download, Loader2, Archive, Maximize2 } from 'lucide-react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import AlbumLightbox from '@/components/gallery/AlbumLightbox';

interface ClientPhoto {
  id: string;
  storage_path: string;
  original_filename: string;
  width?: number;
  height?: number;
  isFavorite: boolean;
}

interface ClientPhotoGalleryProps {
  albumId: string;
  initialPhotos: ClientPhoto[];
}

export default function ClientPhotoGallery({ albumId, initialPhotos }: ClientPhotoGalleryProps) {
  const [photos, setPhotos] = useState(initialPhotos);
  const [filter, setFilter] = useState<'all' | 'favorites'>('all');
  const [loadingFavs, setLoadingFavs] = useState<Record<string, boolean>>({});
  
  // ZIP Download State
  const [isZipping, setIsZipping] = useState(false);
  const [zipProgress, setZipProgress] = useState({ current: 0, total: 0 });

  // Lightbox State
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const displayedPhotos = useMemo(() => {
    if (filter === 'favorites') {
      return photos.filter(p => p.isFavorite);
    }
    return photos;
  }, [photos, filter]);

  const favCount = useMemo(() => photos.filter(p => p.isFavorite).length, [photos]);

  const handleFavoriteClick = async (photoId: string, currentlyFav: boolean) => {
    const newFavState = !currentlyFav;

    // Optimistic UI update
    setPhotos(prev => prev.map(p => 
      p.id === photoId ? { ...p, isFavorite: newFavState } : p
    ));
    setLoadingFavs(prev => ({ ...prev, [photoId]: true }));

    try {
      const res = await fetch('/api/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          photo_id: photoId,
          album_id: albumId,
          is_favorite: newFavState
        })
      });

      if (!res.ok) {
        // Revert on failure
        setPhotos(prev => prev.map(p => 
          p.id === photoId ? { ...p, isFavorite: currentlyFav } : p
        ));
        const data = await res.json();
        console.error('Erro ao guardar favorito:', data.error);
      }
    } catch (error) {
      // Revert on network error
      setPhotos(prev => prev.map(p => 
        p.id === photoId ? { ...p, isFavorite: currentlyFav } : p
      ));
      console.error('Erro de rede ao guardar favorito:', error);
    } finally {
      setLoadingFavs(prev => ({ ...prev, [photoId]: false }));
    }
  };

  const handleDownload = async (photo: ClientPhoto) => {
    try {
      const response = await fetch(photo.storage_path);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = photo.original_filename || `photo-${photo.id}.jpg`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Erro ao transferir:', error);
      alert('Não foi possível transferir a fotografia.');
    }
  };

  const handleDownloadZip = async () => {
    const targetPhotos = filter === 'favorites' ? displayedPhotos : photos;
    
    if (targetPhotos.length === 0) {
      alert('Não há fotografias para transferir.');
      return;
    }

    setIsZipping(true);
    setZipProgress({ current: 0, total: targetPhotos.length });
    
    try {
      const zip = new JSZip();
      
      // Fetch all photos and add to zip
      for (let i = 0; i < targetPhotos.length; i++) {
        const photo = targetPhotos[i];
        try {
          const response = await fetch(photo.storage_path);
          if (!response.ok) throw new Error(`Failed to fetch ${photo.original_filename}`);
          const blob = await response.blob();
          
          // Use original filename or generate one
          const filename = photo.original_filename || `photo-${i + 1}.jpg`;
          zip.file(filename, blob);
          
          setZipProgress(prev => ({ ...prev, current: i + 1 }));
        } catch (err) {
          console.error(`Failed to download photo ${photo.id}:`, err);
          // Keep going with remaining photos
        }
      }

      // Generate the zip file
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      
      // Save it
      const zipName = `Album-${albumId}-${filter === 'favorites' ? 'Favoritas' : 'Completo'}.zip`;
      saveAs(zipBlob, zipName);
      
    } catch (error) {
      console.error('Erro a criar ZIP:', error);
      alert('Ocorreu um erro ao preparar a transferência. Tente novamente mais tarde.');
    } finally {
      setIsZipping(false);
      // Reset progress slightly after completion for nicer UI
      setTimeout(() => setZipProgress({ current: 0, total: 0 }), 1500);
    }
  };

  return (
    <div className="space-y-8">
      {/* Actions and Filters Bar */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-surface p-4 rounded-xl border border-border/50">
        
        {/* Filters */}
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${
              filter === 'all' 
                ? 'bg-foreground text-background' 
                : 'hover:bg-surface-light text-foreground/70'
            }`}
          >
            Todas ({photos.length})
          </button>
          <button
            onClick={() => setFilter('favorites')}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-2 ${
              filter === 'favorites' 
                ? 'bg-accent text-white' 
                : 'hover:bg-surface-light text-foreground/70'
            }`}
          >
            <Heart size={16} fill={filter === 'favorites' ? "currentColor" : "none"} />
            Favoritas ({favCount})
          </button>
        </div>

        {/* Download Action */}
        <div className="flex items-center gap-3">
          {isZipping && (
            <span className="text-xs text-foreground/60">
              A preparar {zipProgress.current} de {zipProgress.total}...
            </span>
          )}
          <button
            onClick={handleDownloadZip}
            disabled={isZipping || (filter === 'favorites' ? favCount === 0 : photos.length === 0)}
            className="px-5 py-2 bg-surface-light hover:bg-white/10 text-white rounded-full text-sm font-medium transition-colors flex items-center gap-2 disabled:opacity-50 border border-border/50"
          >
            {isZipping ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Archive size={16} />
            )}
            Download ZIP
          </button>
        </div>
      </div>

      {/* Masonry Grid */}
      {displayedPhotos.length === 0 ? (
        <div className="text-center py-24 bg-surface rounded-xl border border-border/50">
          <Heart className="w-12 h-12 text-foreground/20 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">
            {filter === 'favorites' ? 'Ainda não tens fotos favoritas' : 'Álbum vazio'}
          </h3>
          <p className="text-foreground/60">
            {filter === 'favorites' 
              ? 'Clica no coração de uma fotografia para adicioná-la aos favoritos.' 
              : 'Este álbum ainda não contém fotografias.'}
          </p>
        </div>
      ) : (
        <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
          {displayedPhotos.map((photo, index) => {
            const isFav = photo.isFavorite;
            const isLoading = loadingFavs[photo.id];

            return (
              <div 
                key={photo.id} 
                className="group relative break-inside-avoid bg-surface rounded-lg overflow-hidden border border-border/50 cursor-zoom-in"
                onClick={() => setLightboxIndex(index)}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photo.storage_path}
                  alt={photo.original_filename || 'Album photo'}
                  className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />

                {/* Overlay Action Buttons */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4">
                  <div className="flex justify-end">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleFavoriteClick(photo.id, isFav);
                      }}
                      disabled={isLoading}
                      className={`p-3 rounded-full backdrop-blur-md transition-all transform hover:scale-110 ${
                        isFav 
                          ? 'bg-accent/90 text-white' 
                          : 'bg-black/50 text-white hover:bg-accent/80'
                      }`}
                    >
                      <Heart 
                        size={20} 
                        className={isLoading ? "animate-pulse" : ""}
                        fill={isFav ? "currentColor" : "none"} 
                      />
                    </button>
                  </div>
                  
                  <div className="flex justify-between items-end">
                    <p className="text-xs text-white/80 truncate pr-4 drop-shadow-md">
                      {photo.original_filename}
                    </p>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDownload(photo);
                      }}
                      className="p-2 bg-black/50 hover:bg-white/20 text-white rounded-full backdrop-blur-md transition-colors"
                      title="Transferir fotografia"
                    >
                      <Download size={16} />
                    </button>
                  </div>
                </div>
                
                {/* Mobile persistent favorite indicator */}
                {isFav && (
                  <div className="md:hidden absolute top-4 right-4 text-accent drop-shadow-lg pointer-events-none">
                    <Heart size={24} fill="currentColor" />
                  </div>
                )}
                
                {/* Expand Indicator (Desktop Hover) */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none scale-0 group-hover:scale-100 transform origin-center delay-100">
                  <Maximize2 size={32} className="drop-shadow-lg" />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <AlbumLightbox
          photos={displayedPhotos.map(p => ({
            id: p.id,
            src: p.storage_path,
            filename: p.original_filename,
            isFavorite: p.isFavorite
          }))}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onDownload={(p) => handleDownload(displayedPhotos.find(dp => dp.id === p.id) as ClientPhoto)}
          onToggleFavorite={handleFavoriteClick}
          isTogglingFavorite={loadingFavs}
          showFavoriteButton={true}
        />
      )}
    </div>
  );
}
