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

export const metadata: Metadata = {
  title: `${SITE_CONFIG.name} — ${SITE_CONFIG.tagline}`,
  description: SITE_CONFIG.description,
};

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
