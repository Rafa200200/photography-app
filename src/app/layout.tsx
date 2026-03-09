import type { Metadata } from 'next';
import { Inter, Playfair_Display, Great_Vibes } from 'next/font/google';
import './globals.css';
import { SITE_CONFIG } from '@/lib/constants';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
});

const playfair = Playfair_Display({
  variable: '--font-playfair',
  subsets: ['latin'],
  display: 'swap',
});

const script = Great_Vibes({
  variable: '--font-script',
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
});

import { getGlobalConfig } from '@/lib/supabase/queries';

export async function generateMetadata(): Promise<Metadata> {
  const dbConfig = await getGlobalConfig();
  
  const title = dbConfig?.name 
    ? `${dbConfig.name} — ${dbConfig.tagline || SITE_CONFIG.tagline}`
    : `${SITE_CONFIG.name} — ${SITE_CONFIG.tagline}`;
    
  const description = dbConfig?.bio || SITE_CONFIG.description;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      siteName: dbConfig?.name || SITE_CONFIG.name,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    }
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt" className="dark scroll-smooth">
      <body className={`${inter.variable} ${playfair.variable} ${script.variable} antialiased min-h-screen flex flex-col`}>
        {children}
      </body>
    </html>
  );
}
