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
    navbar_name: string;
    hero_name: string;
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
        
        {/* Portfolio */}
        <MasonryGrid photos={photos} />

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
