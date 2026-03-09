'use client';

import { useState, useRef, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Photo, AlbumCategory, Album } from '@/types';
import { Loader2, UploadCloud, Trash2, Download, Maximize2 } from 'lucide-react';
import AlbumLightbox, { AlbumLightboxPhoto } from '@/components/gallery/AlbumLightbox';

interface AlbumPhotoManagerProps {
  album: Album;
  categories: AlbumCategory[];
}

export default function AlbumPhotoManager({ album, categories }: AlbumPhotoManagerProps) {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({ current: 0, total: 0 });
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  useEffect(() => {
    loadPhotos();
  }, [album.id]);

  async function loadPhotos() {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('photos')
        .select('*')
        .eq('album_id', album.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPhotos(data || []);
    } catch (error) {
      console.error('Error loading photos:', error);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setUploadProgress({ current: 0, total: files.length });

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        if (!file.type.startsWith('image/')) continue;

        const fileExt = file.name.split('.').pop();
        const fileName = `${album.id}-${Date.now()}-${i}.${fileExt}`;
        const filePath = `client-albums/${album.id}/${fileName}`;

        // Upload original file directly
        const { error: uploadError } = await supabase.storage
          .from('albums')
          .upload(filePath, file, { 
            cacheControl: '3600', 
            upsert: false,
            contentType: file.type 
          });

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('albums')
          .getPublicUrl(filePath);

        // Save DB Record via server API (bypasses RLS)
        const apiRes = await fetch('/api/photos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            album_id: album.id,
            category_id: categories[0]?.id || null,
            storage_path: publicUrl,
            original_filename: file.name,
            size_bytes: file.size,
            sort_order: 0
          }),
        });

        if (!apiRes.ok) {
          const errData = await apiRes.json();
          throw new Error(errData.error || 'Erro ao guardar registo da foto');
        }
        
        setUploadProgress(prev => ({ ...prev, current: prev.current + 1 }));
      }
      
      await loadPhotos();
      if (fileInputRef.current) fileInputRef.current.value = '';

    } catch (error: any) {
      console.error('Upload failed:', error);
      alert('Ocorreu um erro durante o upload:\n' + (error.message || 'Erro desconhecido. Verifique as políticas RLS.'));
    } finally {
      setIsUploading(false);
      setUploadProgress({ current: 0, total: 0 });
    }
  }

  async function handleDelete(id: string, storagePath: string) {
    if (!confirm('Eliminar fotografia? Esta acção não pode ser revertida.')) return;

    try {
       const res = await fetch(`/api/photos?id=${id}&storagePath=${encodeURIComponent(storagePath)}`, {
         method: 'DELETE',
       });

       if (!res.ok) {
         const errData = await res.json();
         throw new Error(errData.error || 'Erro ao apagar');
       }

       setPhotos(photos.filter(p => p.id !== id));
    } catch (error: any) {
       console.error('Delete failed:', error);
       alert('Erro ao apagar fotografia: ' + error.message);
    }
  }

  const handleDownload = async (photo: AlbumLightboxPhoto) => {
    try {
      const response = await fetch(photo.src);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = photo.filename || `photo-${photo.id}.jpg`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Erro ao transferir:', error);
      alert('Não foi possível transferir a fotografia.');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Upload Button & Progress */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h3 className="text-lg font-medium text-white">
          Fotografias ({photos.length})
        </h3>

        <div className="flex items-center gap-4 w-full md:w-auto">
          {isUploading && (
            <div className="flex items-center gap-2 text-sm text-accent bg-accent/10 px-3 py-1.5 rounded-lg border border-accent/20">
              <Loader2 size={14} className="animate-spin" />
              <span>{uploadProgress.current} de {uploadProgress.total}</span>
            </div>
          )}
          <input 
            type="file" 
            ref={fileInputRef}
            onChange={handleUpload}
            multiple
            accept="image/jpeg,image/png,image/webp"
            className="hidden" 
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="bg-accent hover:bg-accent/90 disabled:opacity-50 text-white px-6 py-2.5 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 w-full md:w-auto"
          >
            <UploadCloud size={18} />
            Adicionar Fotos (HD)
          </button>
        </div>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="py-24 flex justify-center"><Loader2 className="animate-spin text-accent w-8 h-8" /></div>
      ) : photos.length === 0 ? (
        <div className="bg-surface border border-border/50 border-dashed rounded-xl p-16 text-center">
          <UploadCloud className="w-12 h-12 text-foreground/20 mx-auto mb-4" />
          <h3 className="text-white font-medium text-lg mb-2">Álbum Vazio</h3>
          <p className="text-foreground/60 text-sm max-w-sm mx-auto mb-6">
            Clica no botão acima para selecionares as fotos do cliente.
          </p>
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="btn-outline px-6 py-2 flex items-center gap-2 mx-auto"
          >
            Procurar Ficheiros
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 2xl:grid-cols-6 gap-4">
          {photos.map((photo, index) => (
            <div 
              key={photo.id} 
              className="group relative aspect-[3/4] rounded-lg overflow-hidden bg-surface border border-border cursor-zoom-in"
              onClick={() => setLightboxIndex(index)}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={photo.storage_path} 
                alt={photo.original_filename || 'Album photo'}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
              
              {/* Expand Indicator (Desktop Hover) */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none scale-0 group-hover:scale-100 transform origin-center delay-100 z-10">
                <Maximize2 size={32} className="drop-shadow-lg" />
              </div>
              
              {/* Overlay Actions */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-end">
                  <button 
                    onClick={() => handleDelete(photo.id, photo.storage_path)}
                    className="p-1.5 bg-red-500/80 hover:bg-red-500 text-white rounded transition-colors backdrop-blur-sm"
                    title="Apagar"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
                
                {/* Meta */}
                <div className="text-xs text-white truncate px-1">
                  {photo.original_filename}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <AlbumLightbox
          photos={photos.map(p => ({
            id: p.id,
            src: p.storage_path,
            filename: p.original_filename || 'Foto'
          }))}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onDownload={handleDownload}
          showFavoriteButton={false}
        />
      )}
    </div>
  );
}
