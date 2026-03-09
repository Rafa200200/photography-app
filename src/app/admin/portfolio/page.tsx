'use client';

import { useState, useEffect, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import { PortfolioPhoto } from '@/types';
import SafeImage from '@/components/ui/SafeImage';
import { Loader2, Upload, Trash2, Edit2, Plus, X, Save, Image as ImageIcon } from 'lucide-react';
import { useMemo } from 'react';

export default function PortfolioAdminPage() {
  const [photos, setPhotos] = useState<PortfolioPhoto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [uploadCategory, setUploadCategory] = useState('Casamentos');
  
  // Edit State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ category: '' });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  // Derive all unique categories currently in use
  const existingCategories = useMemo(() => {
    const cats = new Set(photos.map(p => p.category).filter(Boolean));
    const defaultCats = ['Casamentos', 'Sessões de Casal', 'Batizados', 'Editorial', 'Retratos'];
    defaultCats.forEach(c => cats.add(c));
    return Array.from(cats);
  }, [photos]);

  useEffect(() => {
    loadPhotos();
  }, []);

  async function loadPhotos() {
    try {
      const { data, error } = await supabase
        .from('portfolio_photos')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPhotos(data || []);
    } catch (error) {
      console.error('Error loading portfolio photos:', error);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleFilesUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setUploadError('');

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Necessário obter o photographer_id
      const { data: photoProfile } = await supabase
        .from('photographers')
        .select('id')
        .eq('auth_id', user.id)
        .single();
        
      const photographerId = photoProfile?.id;
      if (!photographerId) throw new Error('Photographer profile not found');

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Basic validation
        if (!file.type.startsWith('image/')) continue;
        if (file.size > 10 * 1024 * 1024) {
          setUploadError('Tamanho máximo é 10MB por foto.');
          continue;
        }

        const fileExt = file.name.split('.').pop();
        const fileName = `portfolio-${Date.now()}-${i}.${fileExt}`;
        const filePath = `gallery/${fileName}`;

        // 1. Upload to Storage (portfolio bucket)
        const { error: uploadError } = await supabase.storage
          .from('portfolio')
          .upload(filePath, file, { cacheControl: '3600', upsert: false });

        if (uploadError) throw uploadError;

        // 2. Get Public URL
        const { data: { publicUrl } } = supabase.storage
          .from('portfolio')
          .getPublicUrl(filePath);

        // 3. Create DB Record
        const { error: dbError } = await supabase
          .from('portfolio_photos')
          .insert({
            photographer_id: photographerId,
            storage_path: publicUrl,
            title: '',
            category: uploadCategory,
            sort_order: 0
          });

        if (dbError) throw dbError;
      }
      
      // Reload photos after upload
      await loadPhotos();
      if (fileInputRef.current) fileInputRef.current.value = '';

    } catch (error) {
      console.error('Upload error:', error);
      setUploadError('Erro ao fazer upload. Verifique as permissões.');
    } finally {
      setIsUploading(false);
    }
  }

  async function handleDelete(id: string, storagePath: string) {
    if (!confirm('Tem a certeza que quer apagar esta fotografia do portfólio?')) return;

    try {
      // Delete from DB (Storage file can be kept or deleted depending on strategy. Let's try deleting it too)
      // Extrair o filePath do URL público (storage_path)
      const urlParts = storagePath.split('/portfolio/');
      if (urlParts.length > 1) {
         const pathToDelete = urlParts[1];
         await supabase.storage.from('portfolio').remove([pathToDelete]);
      }

      const { error } = await supabase
        .from('portfolio_photos')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setPhotos(photos.filter(p => p.id !== id));
    } catch (error) {
      console.error('Error deleting photo:', error);
      alert('Erro ao apagar fotografia.');
    }
  }

  function startEditing(photo: PortfolioPhoto) {
    setEditingId(photo.id);
    setEditForm({ 
      category: photo.category || 'Casamentos' 
    });
  }

  async function saveEdit(id: string) {
    try {
      const { error } = await supabase
        .from('portfolio_photos')
        .update({
          category: editForm.category
        })
        .eq('id', id);

      if (error) throw error;
      
      setPhotos(photos.map(p => p.id === id ? { ...p, category: editForm.category } : p));
      setEditingId(null);
    } catch (error) {
      console.error('Error updating photo:', error);
      alert('Erro ao atualizar informações da foto.');
    }
  }

  if (isLoading) {
    return <div className="flex h-64 items-center justify-center"><Loader2 className="animate-spin text-accent" /></div>;
  }

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-display text-white">Portfólio na Página Inicial</h2>
          <p className="text-foreground/60 text-sm mt-1">
            Gere as fotografias que aparecem na grelha "Best Of" da página principal.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 items-center">
          <div className="flex items-center gap-2">
            <span className="text-sm text-foreground/60 w-max hidden lg:inline-block">Categoria:</span>
            <input 
              type="text"
              list="upload-category-list"
              value={uploadCategory}
              onChange={(e) => setUploadCategory(e.target.value)}
              className="bg-background border border-border rounded px-3 py-2 text-sm focus:border-accent outline-none text-white w-[140px] md:w-[160px]"
              placeholder="Categoria"
              disabled={isUploading}
            />
            <datalist id="upload-category-list">
              {existingCategories.map(c => <option key={c} value={c} />)}
            </datalist>
          </div>
          <input 
            type="file" 
            ref={fileInputRef}
            onChange={handleFilesUpload}
            accept="image/jpeg,image/png,image/webp"
            multiple
            className="hidden" 
          />
          <button 
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading || !uploadCategory.trim()}
            className="bg-accent text-white px-6 py-2 rounded-lg font-medium hover:bg-accent/90 transition-colors flex items-center gap-2 disabled:opacity-50 whitespace-nowrap"
          >
            {isUploading ? <Loader2 size={18} className="animate-spin" /> : <Upload size={18} />}
            {isUploading ? 'A carregar...' : 'Adicionar Fotos'}
          </button>
        </div>
      </div>

      {uploadError && (
        <div className="bg-red-500/10 text-red-500 p-4 rounded-lg border border-red-500/20 text-sm">
          {uploadError}
        </div>
      )}

      {photos.length === 0 ? (
        <div className="bg-surface border border-border/50 border-dashed rounded-xl p-12 text-center">
          <ImageIcon className="w-12 h-12 text-foreground/20 mx-auto mb-4" />
          <h3 className="text-white font-medium mb-2">Sem Fotografias</h3>
          <p className="text-foreground/60 text-sm mb-6 max-w-sm mx-auto">
            Ainda não adicionaste nenhuma fotografia ao portfólio. Clica no botão acima para começar.
          </p>
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="btn-outline text-sm px-6 py-2 inline-flex items-center gap-2"
          >
            <Plus size={16} /> Adicionar Primeira Foto
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {photos.map(photo => (
            <div key={photo.id} className="bg-surface rounded-xl overflow-hidden border border-border flex flex-col group">
              {/* Image Preview */}
              <div className="relative aspect-[4/3] w-full bg-background border-b border-border">
                <SafeImage 
                  src={photo.storage_path} 
                  alt={photo.title || 'Portfolio Image'} 
                  fill 
                  className="object-cover"
                />
                
                {/* Overlay Actions */}
                <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => handleDelete(photo.id, photo.storage_path)}
                    className="p-2 bg-red-500/80 hover:bg-red-500 text-white rounded-md backdrop-blur-sm transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              {/* Data Form / Display */}
              <div className="p-4 flex-1 flex flex-col">
                {editingId === photo.id ? (
                  <div className="space-y-4 flex-1">
                    <div>
                      <label className="text-xs text-foreground/60 mb-1 block">Categoria</label>
                      <input 
                        type="text"
                        list={`categories-${photo.id}`}
                        value={editForm.category}
                        onChange={e => setEditForm({...editForm, category: e.target.value})}
                        className="w-full bg-background border border-border rounded px-3 py-1.5 text-sm focus:border-accent outline-none"
                        placeholder="Ex: Casamentos"
                      />
                      <datalist id={`categories-${photo.id}`}>
                        {existingCategories.map(c => <option key={c} value={c} />)}
                      </datalist>
                    </div>
                    <div className="pt-2 flex gap-2 justify-end mt-auto">
                      <button 
                        onClick={() => setEditingId(null)}
                        className="p-1.5 text-foreground/60 hover:text-white transition-colors"
                      >
                        <X size={16} />
                      </button>
                      <button 
                        onClick={() => saveEdit(photo.id)}
                        className="p-1.5 text-emerald-500 hover:text-emerald-400 bg-emerald-500/10 rounded transition-colors"
                      >
                        <Save size={16} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="text-sm text-accent font-medium">{photo.category || 'Sem Categoria'}</p>
                      </div>
                      <button 
                        onClick={() => startEditing(photo)}
                        className="p-1.5 text-foreground/40 hover:text-white transition-colors"
                      >
                        <Edit2 size={14} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
