import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import { headers } from 'next/headers';
import ClientPhotoGallery from './ClientPhotoGallery';

export const dynamic = 'force-dynamic';

function getClientIdentifier(requestHeaders: Headers) {
  const ip = requestHeaders.get('x-forwarded-for') || 'anonymous';
  const userAgent = requestHeaders.get('user-agent') || 'unknown';
  return Buffer.from(`${ip}-${userAgent}`).toString('base64').substring(0, 32);
}

export default async function AlbumClientGalleryPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const supabase = await createClient();
  const requestHeaders = await headers();

  const { data: album, error } = await supabase
    .from('albums')
    .select(`
      *,
      photographers (name),
      photos (*)
    `)
    .eq('code', code)
    .single();

  if (error) {
    console.error('Erro a carregar album:', error);
    notFound();
  }
  
  if (!album) {
    notFound();
  }

  // Check if album is expired
  const isExpired = album.status === 'expired' || new Date(album.expires_at) < new Date();

  if (isExpired) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center space-y-6 bg-surface p-8 rounded-2xl border border-border/50">
          <div className="w-16 h-16 bg-surface-light rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-foreground/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-display text-white">Álbum Expirado</h1>
          <p className="text-foreground/70">
            Este álbum expirou após o período de 3 meses. Por favor, contacte o fotógrafo se precisar de aceder às fotografias novamente.
          </p>
        </div>
      </div>
    );
  }

  // Get current user's favorites for this album
  const clientIdentifier = getClientIdentifier(requestHeaders);
  const { data: favorites } = await supabase
    .from('favorites')
    .select('photo_id')
    .eq('album_id', album.id)
    .eq('client_identifier', clientIdentifier);

  const favoritePhotoIds = new Set(favorites?.map(f => f.photo_id) || []);

  const photosWithFavStatus = (album.photos || []).map((p: any) => ({
    ...p,
    isFavorite: favoritePhotoIds.has(p.id)
  }));

  return (
    <div className="min-h-screen bg-background text-foreground animate-fade-in">
      <header className="p-6 border-b border-border/50 sticky top-0 z-50 bg-background/80 backdrop-blur-md flex justify-between items-center">
        <div>
          <h1 className="text-xl font-display text-white">{album.name}</h1>
          <p className="text-sm text-foreground/60">Por {album.photographers?.name}</p>
        </div>
        <div className="text-sm border border-border px-3 py-1 rounded-full bg-surface">
          {album.photos?.length || 0} Fotos
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        <ClientPhotoGallery 
          albumId={album.id} 
          initialPhotos={photosWithFavStatus} 
        />
      </main>
    </div>
  );
}
