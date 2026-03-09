'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import SafeImage from '@/components/ui/SafeImage';

interface NavbarProps {
  config?: {
    name: string;
    navbar_name?: string;
    logo: string;
  };
  onOpenClientArea?: () => void;
}

export default function Navbar({ config, onOpenClientArea }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionName: string) => {
    setIsMobileMenuOpen(false);
    const targetId = sectionName.toLowerCase() === 'portfólio' ? 'portfolio' 
                   : sectionName.toLowerCase() === 'sobre mim' ? 'about' 
                   : 'contact';
    
    document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isMobileMenuOpen ? 'bg-zinc-950 py-4' : isScrolled ? 'glass py-4' : 'bg-transparent py-6'
      }`}
    >
      <div className="container mx-auto px-6 max-w-7xl flex items-center justify-between">
        {/* Logo/Brand */}
        <Link 
          href="/" 
          className="flex items-center gap-3 relative z-50"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <div className="relative w-9 h-9 rounded-full overflow-hidden border border-white/10 flex-shrink-0 bg-zinc-900">
            <SafeImage 
              src={config?.logo} 
              alt={config?.name || 'Logótipo'} 
              fill
              className="object-cover"
              fallbackIconSize={14}
            />
          </div>
          <span className="font-display sm:hidden md:block tracking-[0.2em] text-sm font-light text-zinc-50 uppercase">
            {config?.navbar_name || config?.name}
          </span>
        </Link>
        
        <nav className="hidden md:flex items-center gap-10 text-[13px]">
          {['Portfólio', 'Sobre Mim', 'Contactos'].map((item: string) => (
            <button 
              key={item}
              onClick={() => scrollToSection(item)}
              className="text-zinc-400 hover:text-zinc-50 transition-colors duration-500 tracking-[0.15em] uppercase font-light"
            >
              {item}
            </button>
          ))}
          <button 
            onClick={onOpenClientArea}
            className="text-zinc-400 hover:text-zinc-950 transition-all duration-500 tracking-[0.15em] uppercase font-light border border-white/10 px-5 py-2 hover:border-white hover:bg-white"
          >
            Área de Cliente
          </button>
        </nav>

        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden text-zinc-400 p-2"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <div className={`
        fixed inset-0 bg-zinc-950/98 backdrop-blur-2xl z-40 transition-all duration-500 md:hidden flex flex-col items-center justify-center gap-10
        ${isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
      `}>
        {['Portfólio', 'Sobre Mim', 'Contactos'].map((item: string) => (
          <button 
            key={item}
            onClick={() => scrollToSection(item)}
            className="text-2xl font-display tracking-[0.2em] text-zinc-400 hover:text-zinc-50 transition-colors duration-500 uppercase font-extralight"
          >
            {item}
          </button>
        ))}
        <button 
          onClick={() => {
            setIsMobileMenuOpen(false);
            if (onOpenClientArea) onOpenClientArea();
          }}
          className="text-sm mt-4 px-8 py-3 border border-white/10 text-zinc-400 hover:text-zinc-950 hover:border-white hover:bg-white transition-all duration-500 tracking-[0.15em] uppercase font-light"
        >
          Área de Cliente
        </button>
      </div>
    </header>
  );
}
