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
    <section id="contact" className="py-24 md:py-32 px-6 md:px-12 lg:px-24">
      <div className="max-w-4xl mx-auto text-center space-y-12 animate-fade-in-up">
        
        <div className="space-y-4">
          <h2 className="font-display text-4xl md:text-6xl font-medium tracking-wide text-white">
            Contactos
          </h2>
          <p className="text-foreground/60 text-lg md:text-xl max-w-2xl mx-auto font-light">
            Pronto para capturar os seus momentos? Fale comigo.
          </p>
        </div>

        <div className="h-px w-24 bg-accent/40 mx-auto" />

        <div className="flex flex-col md:flex-row justify-center items-center gap-6 md:gap-12 pt-8">
          {socialConfig.email && (
             <a 
               href={`mailto:${socialConfig.email}`} 
               className="group flex flex-col items-center gap-4 p-8 rounded-2xl bg-surface/30 border border-border hover:border-accent hover:bg-surface/50 transition-all duration-300 w-full md:w-auto min-w-[240px]"
             >
               <Mail size={32} className="text-foreground/40 group-hover:text-accent transition-colors" />
               <div>
                 <p className="text-sm uppercase tracking-widest text-foreground/40 mb-1">Email</p>
                 <p className="text-white font-medium">{socialConfig.email}</p>
               </div>
             </a>
          )}

          {socialConfig.instagram && (
            <a 
              href={socialConfig.instagram}
              target="_blank"
              rel="noopener noreferrer" 
              className="group flex flex-col items-center gap-4 p-8 rounded-2xl bg-surface/30 border border-border hover:border-accent hover:bg-surface/50 transition-all duration-300 w-full md:w-auto min-w-[240px]"
            >
              <Instagram size={32} className="text-foreground/40 group-hover:text-accent transition-colors" />
              <div className="text-center">
                <p className="text-sm uppercase tracking-widest text-foreground/40 mb-1">Instagram</p>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-white font-medium group-hover:underline underline-offset-4 decoration-accent">Ver Perfil</span>
                  <ArrowRight size={14} className="text-accent opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                </div>
              </div>
            </a>
          )}
          
          {socialConfig.facebook && (
             <a 
               href={socialConfig.facebook}
               target="_blank"
               rel="noopener noreferrer"
               className="group flex flex-col items-center gap-4 p-8 rounded-2xl bg-surface/30 border border-border hover:border-accent hover:bg-surface/50 transition-all duration-300 w-full md:w-auto min-w-[240px]"
             >
               <Facebook size={32} className="text-foreground/40 group-hover:text-accent transition-colors" />
               <div>
                 <p className="text-sm uppercase tracking-widest text-foreground/40 mb-1">Facebook</p>
                 <span className="text-white font-medium group-hover:underline underline-offset-4 decoration-accent">Ver Página</span>
               </div>
             </a>
          )}
        </div>
      </div>
    </section>
  );
}
