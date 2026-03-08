'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import SafeImage from '@/components/ui/SafeImage';

interface NavbarProps {
  config?: {
    name: string;
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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'glass py-4' : 'bg-transparent py-6'
      }`}
    >
      <div className="container mx-auto px-6 max-w-7xl flex items-center justify-between">
        {/* Logo/Brand */}
        <Link 
          href="/" 
          className="flex items-center gap-3 relative z-50"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <div className="relative w-10 h-10 rounded-full overflow-hidden border border-white/20 flex-shrink-0 bg-surface">
            <SafeImage 
              src={config?.logo} 
              alt={config?.name || 'Logótipo'} 
              fill
              className="object-cover"
              fallbackIconSize={16}
            />
          </div>
          <span className="font-display sm:hidden md:block tracking-widest text-lg font-medium text-white">
            {config?.name}
          </span>
        </Link>
        
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          {['Portfólio', 'Sobre Mim', 'Contactos'].map((item: string) => (
            <button 
              key={item}
              onClick={() => scrollToSection(item)}
              className="text-white/80 hover:text-accent transition-colors tracking-wide uppercase"
            >
              {item}
            </button>
          ))}
          <button 
            onClick={onOpenClientArea}
            className="btn-outline text-xs px-6 py-2.5 backdrop-blur-md"
          >
            Área de Cliente
          </button>
        </nav>

        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden text-white p-2"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <div className={`
        fixed inset-0 bg-background/95 backdrop-blur-xl z-40 transition-all duration-300 md:hidden flex flex-col items-center justify-center gap-8
        ${isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
      `}>
        {['Portfólio', 'Sobre Mim', 'Contactos'].map((item: string) => (
          <button 
            key={item}
            onClick={() => scrollToSection(item)}
            className="text-2xl font-display tracking-widest text-white/80 hover:text-accent transition-colors uppercase"
          >
            {item}
          </button>
        ))}
        <button 
          onClick={() => {
            setIsMobileMenuOpen(false);
            if (onOpenClientArea) onOpenClientArea();
          }}
          className="btn-outline text-sm mt-4 px-8 py-3"
        >
          Área de Cliente
        </button>
      </div>
    </header>
  );
}
