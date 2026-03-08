import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Camera, Calendar, KeyRound } from 'lucide-react';
import AlbumPhotoManager from './AlbumPhotoManager';
import AlbumHeaderActions from './AlbumHeaderActions';

export const dynamic = 'force-dynamic';

export default async function AlbumDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: album, error } = await supabase
    .from('albums')
    .select('*, album_categories(*)')
    .eq('id', id)
    .single();

  if (error || !album) {
    notFound();
  }

  // Get actual photo count
  const { count: photoCount } = await supabase
    .from('photos')
    .select('*', { count: 'exact', head: true })
    .eq('album_id', id);

  // Generate public link based on code
  const publicLink = `/album/${album.code}`;

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <Link href="/admin/albums" className="p-2 bg-surface hover:bg-surface-light border border-border rounded-lg text-foreground/70 transition-colors">
            <ArrowLeft size={18} />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-display text-white">{album.name}</h2>
              <span className={`px-2 py-0.5 text-xs rounded border ${
                album.status === 'active' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 
                album.status === 'archived' ? 'bg-orange-500/10 text-orange-500 border-orange-500/20' : 
                'bg-red-500/10 text-red-500 border-red-500/20'
              }`}>
                {album.status === 'active' ? 'Ativo' : album.status === 'expired' ? 'Expirado' : 'Arquivado'}
              </span>
            </div>
            <p className="text-foreground/60 text-sm mt-1">
              {album.client_name ? `Cliente: ${album.client_name}` : 'Sem cliente atribuído'}
            </p>
          </div>
        </div>

        <AlbumHeaderActions publicLink={publicLink} album={album} />
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-surface border border-border p-5 rounded-xl">
          <h3 className="text-foreground/60 text-xs font-medium uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <KeyRound size={12} /> Acesso do Cliente
          </h3>
          <div className="flex items-end gap-3 mt-2">
            <span className="font-mono text-xl tracking-widest text-white">{album.code}</span>
          </div>
        </div>
        
        <div className="bg-surface border border-border p-5 rounded-xl">
          <h3 className="text-foreground/60 text-xs font-medium uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <Camera size={12} /> Total de Fotos
          </h3>
          <p className="text-xl text-white mt-2 font-medium">
            {photoCount ?? 0}
          </p>
        </div>

        <div className="bg-surface border border-border p-5 rounded-xl">
          <h3 className="text-foreground/60 text-xs font-medium uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <Calendar size={12} /> Validade
          </h3>
          <p className="text-lg text-white mt-2">
            Expira a {new Date(album.expires_at).toLocaleDateString('pt-PT')}
          </p>
        </div>
      </div>

      <div className="border-t border-border/50 pt-8 mt-8">
        {/* Photo Manager Client Component */}
        <AlbumPhotoManager album={album} categories={album.album_categories} />
      </div>
    </div>
  );
}
