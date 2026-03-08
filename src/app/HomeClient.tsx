'use client';

import { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Hero from '@/components/home/Hero';
import MasonryGrid from '@/components/gallery/MasonryGrid';
import AboutSection from '@/components/home/AboutSection';
import ContactSection from '@/components/home/ContactSection';
import Footer from '@/components/layout/Footer';
import ClientAccessModal from '@/components/home/ClientAccessModal';

interface HomeClientProps {
  config: {
    name: string;
    tagline: string;
    bio: string;
    logo: string;
    profile_image: string;
    social_links: {
      instagram?: string;
      facebook?: string;
      email?: string;
    } | any;
  };
  photos: {
    id: string | number;
    src: string;
    title: string;
    category: string;
    width: number;
    height: number;
  }[];
}

export default function HomeClient({ config, photos }: HomeClientProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen relative">
      <Navbar config={config} onOpenClientArea={() => setIsModalOpen(true)} />
      
      <main className="flex-1 w-full relative">
        <Hero config={config} photos={photos} />
        
        {/* Portfolio Section */}
        <section id="portfolio" className="py-24 md:py-32 w-full px-6 md:px-12 lg:px-24">
          <div className="max-w-screen-2xl mx-auto">
            <header className="mb-16 text-center animate-fade-in-up">
              <h2 className="font-display text-4xl md:text-5xl font-medium tracking-wide text-white mb-4">Portfólio</h2>
              <p className="text-foreground/60 max-w-2xl mx-auto">
                Uma seleção dos meus trabalhos favoritos.
              </p>
            </header>
            
            <MasonryGrid photos={photos} />
          </div>
        </section>

        <AboutSection config={config} />
        <ContactSection config={config} />
      </main>

      <Footer config={config} />

      <ClientAccessModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
