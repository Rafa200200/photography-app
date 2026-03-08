import { createClient } from '@/lib/supabase/server';
import { FolderOpen, Download, Image } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  // Get the logged-in photographer
  const { data: { user } } = await supabase.auth.getUser();

  let activeAlbums = 0;
  let portfolioPhotos = 0;
  let totalPhotos = 0;

  if (user) {
    const { data: profile } = await supabase
      .from('photographers')
      .select('id')
      .eq('auth_id', user.id)
      .single();

    if (profile) {
      // Count active albums
      const { count: albumCount } = await supabase
        .from('albums')
        .select('*', { count: 'exact', head: true })
        .eq('photographer_id', profile.id)
        .eq('status', 'active');
      activeAlbums = albumCount ?? 0;

      // Count portfolio photos
      const { count: portCount } = await supabase
        .from('portfolio_photos')
        .select('*', { count: 'exact', head: true })
        .eq('photographer_id', profile.id);
      portfolioPhotos = portCount ?? 0;

      // Count total photos across all albums
      const { data: albumIds } = await supabase
        .from('albums')
        .select('id')
        .eq('photographer_id', profile.id);

      if (albumIds && albumIds.length > 0) {
        const { count: photoCount } = await supabase
          .from('photos')
          .select('*', { count: 'exact', head: true })
          .in('album_id', albumIds.map(a => a.id));
        totalPhotos = photoCount ?? 0;
      }
    }
  }

  return (
    <div className="space-y-8 animate-fade-in-up">
      <header className="mb-10">
        <h1 className="font-display text-4xl text-white mb-2">Painel de Controlo</h1>
        <p className="text-foreground/60 text-lg">Bem-vindo Hugo, aqui tens o resumo do teu negócio.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-surface/50 border border-border rounded-xl p-6 shadow-sm">
          <h3 className="text-foreground/70 text-sm font-medium uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <FolderOpen size={14} /> Álbuns Ativos
          </h3>
          <p className="text-4xl font-light text-white">{activeAlbums}</p>
        </div>
        <div className="bg-surface/50 border border-border rounded-xl p-6 shadow-sm">
          <h3 className="text-foreground/70 text-sm font-medium uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Image size={14} /> Total Fotos em Álbuns
          </h3>
          <p className="text-4xl font-light text-white">{totalPhotos}</p>
        </div>
        <div className="bg-surface/50 border border-border rounded-xl p-6 shadow-sm">
          <h3 className="text-foreground/70 text-sm font-medium uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Image size={14} /> Fotos no Portfólio
          </h3>
          <p className="text-4xl font-light text-white">{portfolioPhotos}</p>
        </div>
      </div>
    </div>
  );
}
