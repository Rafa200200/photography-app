'use client';

import { Mail, Instagram, Facebook, ArrowRight } from 'lucide-react';

interface ContactSectionProps {
  config: {
    social_links: {
      instagram?: string;
      facebook?: string;
      email?: string;
    };
  };
}

export default function ContactSection({ config }: ContactSectionProps) {
  const socialConfig = config.social_links || {};
  
  return (
    <section id="contact" className="py-32 md:py-40 px-6 md:px-12 lg:px-24 border-t border-white/5">
      <div className="max-w-4xl mx-auto text-center space-y-16">
        
        <div className="space-y-6">
          <div className="section-divider mx-auto mb-8" />
          <h2 className="font-display text-4xl md:text-5xl font-extralight tracking-[0.15em] text-zinc-50 uppercase">
            Contactos
          </h2>
          <p className="text-zinc-500 text-lg max-w-lg mx-auto font-light leading-relaxed tracking-wide">
            Pronto para capturar os seus momentos? Fale comigo.
          </p>
        </div>

        <div className="flex flex-col md:flex-row justify-center items-center gap-6 md:gap-8 pt-4">
          {socialConfig.email && (
             <a 
               href={`mailto:${socialConfig.email}`} 
               className="group flex flex-col items-center gap-5 p-10 bg-zinc-950 border border-white/5 hover:border-white/10 transition-all duration-500 w-full md:w-auto min-w-[220px]"
             >
               <Mail size={28} className="text-zinc-600 group-hover:text-zinc-300 transition-colors duration-500" />
               <div className="text-center">
                 <p className="text-[11px] uppercase tracking-[0.2em] text-zinc-600 mb-2">Email</p>
                 <p className="text-zinc-300 font-light text-sm">{socialConfig.email}</p>
               </div>
             </a>
          )}

          {socialConfig.instagram && (
            <a 
              href={socialConfig.instagram}
              target="_blank"
              rel="noopener noreferrer" 
              className="group flex flex-col items-center gap-5 p-10 bg-zinc-950 border border-white/5 hover:border-white/10 transition-all duration-500 w-full md:w-auto min-w-[220px]"
            >
              <Instagram size={28} className="text-zinc-600 group-hover:text-zinc-300 transition-colors duration-500" />
              <div className="text-center">
                <p className="text-[11px] uppercase tracking-[0.2em] text-zinc-600 mb-2">Instagram</p>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-zinc-300 font-light text-sm group-hover:text-zinc-50 transition-colors duration-500">Ver Perfil</span>
                  <ArrowRight size={12} className="text-zinc-500 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500" />
                </div>
              </div>
            </a>
          )}
          
          {socialConfig.facebook && (
             <a 
               href={socialConfig.facebook}
               target="_blank"
               rel="noopener noreferrer"
               className="group flex flex-col items-center gap-5 p-10 bg-zinc-950 border border-white/5 hover:border-white/10 transition-all duration-500 w-full md:w-auto min-w-[220px]"
             >
               <Facebook size={28} className="text-zinc-600 group-hover:text-zinc-300 transition-colors duration-500" />
               <div className="text-center">
                 <p className="text-[11px] uppercase tracking-[0.2em] text-zinc-600 mb-2">Facebook</p>
                 <span className="text-zinc-300 font-light text-sm group-hover:text-zinc-50 transition-colors duration-500">Ver Página</span>
               </div>
             </a>
          )}
        </div>
      </div>
    </section>
  );
}
