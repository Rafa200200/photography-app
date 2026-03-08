import { createClient } from './server';
import { SITE_CONFIG } from '@/lib/constants'; // Fix path for constants
import { Photographer, PortfolioPhoto } from '@/types';

export async function getGlobalConfig(): Promise<Photographer | null> {
  const supabase = await createClient();
  
  try {
    const { data } = await supabase
      .from('photographers')
      .select('*')
      .limit(1)
      .single();
      
    return data as Photographer;
  } catch (e) {
    console.error('Error fetching global config:', e);
    return null;
  }
}

export async function getPortfolioPhotos(): Promise<PortfolioPhoto[]> {
  const supabase = await createClient();
  
  try {
    const { data } = await supabase
      .from('portfolio_photos')
      .select('*')
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false });
      
    return (data as PortfolioPhoto[]) || [];
  } catch (e) {
    console.error('Error fetching portfolio photos:', e);
    return [];
  }
}
