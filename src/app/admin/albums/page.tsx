'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { Album } from '@/types';
import { Loader2, Plus, Calendar, Image as ImageIcon, Video, MoreVertical, Trash2, ExternalLink, Settings2 } from 'lucide-react';

export default function AlbumsAdminPage() {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    loadAlbums();
  }, []);

  async function loadAlbums() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: photoProfile } = await supabase
        .from('photographers')
        .select('id')
        .eq('auth_id', user.id)
        .single();
        
      if (!photoProfile) return;

      const { data, error } = await supabase
        .from('albums')
        .select('*')
        .eq('photographer_id', photoProfile.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAlbums(data || []);
    } catch (error) {
      console.error('Error loading albums:', error);
    } finally {
      setIsLoading(false);
    }
  }

  async function deleteAlbum(id: string) {
    if (!confirm('Tem a certeza que quer apagar definitivamente este álbum e todas as fotos associadas? Esta acção não pode ser revertida.')) return;

    try {
      const { error } = await supabase
        .from('albums')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setAlbums(albums.filter(a => a.id !== id));
    } catch (error) {
      console.error('Error deleting album:', error);
      alert('Erro ao apagar álbum. Tente novamente mais tarde.');
    }
  }

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'active':
        return { label: 'Ativo', badgeClass: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' };
      case 'expired':
        return { label: 'Expirado', badgeClass: 'bg-red-500/10 text-red-500 border-red-500/20' };
      case 'archived':
        return { label: 'Arquivado', badgeClass: 'bg-orange-500/10 text-orange-500 border-orange-500/20' };
      default:
        return { label: status, badgeClass: 'bg-white/10 text-white border-white/20' };
    }
  };

  if (isLoading) {
    return <div className="flex h-64 items-center justify-center"><Loader2 className="animate-spin text-accent" /></div>;
  }

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-display text-white">Álbuns de Clientes</h2>
          <p className="text-foreground/60 text-sm mt-1">
            Gere os álbuns privados que entregas aos teus clientes.
          </p>
        </div>
        
        <Link 
          href="/admin/albums/new"
          className="bg-accent text-white px-6 py-2 rounded-lg font-medium hover:bg-accent/90 transition-colors flex items-center gap-2 w-full md:w-auto justify-center"
        >
          <Plus size={18} /> Novo Álbum
        </Link>
      </div>

      {albums.length === 0 ? (
        <div className="bg-surface border border-border/50 border-dashed rounded-xl p-12 text-center">
          <ImageIcon className="w-12 h-12 text-foreground/20 mx-auto mb-4" />
          <h3 className="text-white font-medium mb-2">Sem Álbuns</h3>
          <p className="text-foreground/60 text-sm mb-6 max-w-sm mx-auto">
            Ainda não criaste nenhum álbum para os teus clientes. Clica no botão acima para começar.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {albums.map((album) => {
            const statusConfig = getStatusConfig(album.status);
            return (
              <div key={album.id} className="bg-surface rounded-xl border border-border flex flex-col hover:border-accent/30 transition-colors">
                
                {/* Header */}
                <div className="p-5 border-b border-border/50 flex justify-between items-start">
                  <div className="flex-1 pr-4">
                    <h3 className="font-medium text-lg text-white line-clamp-1" title={album.name}>{album.name}</h3>
                    <p className="text-accent text-sm mt-1">{album.client_name || 'Sem cliente atribuído'}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded border ${statusConfig.badgeClass}`}>
                    {statusConfig.label}
                  </span>
                </div>

                {/* Details */}
                <div className="p-5 flex-1 space-y-4">
                  <div className="flex justify-between items-center text-sm text-foreground/70">
                    <span className="flex items-center gap-1.5 font-mono text-xs bg-background py-1 px-2 rounded">
                      PIN: {album.code}
                    </span>
                  </div>

                  <div className="flex flex-col gap-2 text-xs text-foreground/60">
                    <div className="flex items-center gap-2">
                      <Calendar size={14} className="text-accent/70" />
                      <span>
                        Criado a {new Date(album.created_at).toLocaleDateString('pt-PT')}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar size={14} className="text-foreground/40" />
                      <span>
                        Expira a {new Date(album.expires_at).toLocaleDateString('pt-PT')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="p-3 border-t border-border/50 bg-background/30 flex justify-between items-center px-5">
                   <Link 
                     href={`/admin/albums/${album.id}`}
                     className="text-sm font-medium text-white hover:text-accent transition-colors flex items-center gap-2"
                   >
                     Gerir Fotos &rarr;
                   </Link>
                   
                   <div className="flex items-center gap-2">
                     <Link 
                        href={`/album/${album.code}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-foreground/50 hover:text-white transition-colors"
                        title="Ver Site Cliente"
                     >
                        <ExternalLink size={16} />
                     </Link>
                     <Link 
                        href={`/admin/albums/${album.id}/settings`}
                        className="p-2 text-foreground/50 hover:text-white transition-colors"
                        title="Configurações do Álbum"
                     >
                        <Settings2 size={16} />
                     </Link>
                     <button 
                       onClick={() => deleteAlbum(album.id)}
                       className="p-2 text-red-500/50 hover:text-red-500 hover:bg-red-500/10 rounded transition-colors"
                       title="Apagar Álbum"
                     >
                       <Trash2 size={16} />
                     </button>
                   </div>
                </div>

              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
