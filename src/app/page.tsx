import { getGlobalConfig, getPortfolioPhotos } from '@/lib/supabase/queries';
import { SITE_CONFIG, PORTFOLIO_PLACEHOLDER } from '@/lib/constants';
import HomeClient from './HomeClient';

export default async function Home() {
  const dbConfig = await getGlobalConfig();
  const dbPhotos = await getPortfolioPhotos();

  // Merge DB data with constants fallback
  const config = {
    name: dbConfig?.name || SITE_CONFIG.name,
    tagline: SITE_CONFIG.tagline,
    bio: dbConfig?.bio || SITE_CONFIG.photographer.bio,
    logo: dbConfig?.logo_url || SITE_CONFIG.logo,
    profile_image: dbConfig?.profile_image_url || SITE_CONFIG.photographer.avatar,
    social_links: dbConfig?.social_links || SITE_CONFIG.social
  };

  // Convert DB photos to the expected format, or fallback to placeholder
  const mappedPhotos = dbPhotos && dbPhotos.length > 0
    ? dbPhotos.map(p => ({
        id: p.id,
        src: p.storage_path,
        title: p.title || 'Sem Título',
        category: p.category || 'Sem Categoria',
        width: p.width || 800,
        height: p.height || 1200
      }))
    : PORTFOLIO_PLACEHOLDER;

  return (
    <HomeClient config={config} photos={mappedPhotos} />
  );
}
