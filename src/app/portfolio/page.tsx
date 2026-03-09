import { getGlobalConfig, getPortfolioPhotos } from '@/lib/supabase/queries';
import { SITE_CONFIG, PORTFOLIO_PLACEHOLDER } from '@/lib/constants';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import MasonryGrid from '@/components/gallery/MasonryGrid';

export const metadata = {
  title: 'Portfólio | Fotografia',
  description: 'Portfólio completo de fotografia',
};

export default async function PortfolioPage() {
  const dbConfig = await getGlobalConfig();
  const dbPhotos = await getPortfolioPhotos();

  const config = {
    name: dbConfig?.name || SITE_CONFIG.name,
    navbar_name: dbConfig?.navbar_title || dbConfig?.name || SITE_CONFIG.name,
    hero_name: dbConfig?.hero_title || dbConfig?.name || SITE_CONFIG.name,
    tagline: dbConfig?.tagline || SITE_CONFIG.tagline,
    bio: dbConfig?.bio || SITE_CONFIG.photographer.bio,
    logo: dbConfig?.logo_url || SITE_CONFIG.logo,
    profile_image: dbConfig?.profile_image_url || SITE_CONFIG.photographer.avatar,
    social_links: dbConfig?.social_links || SITE_CONFIG.social
  };

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
    <div className="flex flex-col min-h-screen relative bg-background">
      <Navbar config={config} />
      
      <main className="flex-1 w-full relative pt-20">
        <MasonryGrid photos={mappedPhotos} />
      </main>

      <Footer config={config} />
    </div>
  );
}
