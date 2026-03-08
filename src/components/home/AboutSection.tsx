import SafeImage from '@/components/ui/SafeImage';

interface AboutSectionProps {
  config: {
    name: string;
    bio: string;
    profile_image: string;
  };
}

export default function AboutSection({ config }: AboutSectionProps) {
  return (
    <section id="about" className="py-24 md:py-32 bg-surface/30 px-6 md:px-12 lg:px-24">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-16 items-center">
        {/* Profile Image Column */}
        <div className="w-full md:w-1/2 relative aspect-[3/4] md:aspect-[4/5] rounded-tl-[100px] rounded-br-[100px] overflow-hidden border border-border bg-surface">
          <div className="absolute inset-0 bg-gradient-to-tr from-accent/10 to-transparent z-10 mix-blend-overlay" />
          <SafeImage
            src={config.profile_image}
            alt={config.name}
            fill
            className="object-cover object-center transition-transform duration-700 hover:scale-105"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
            fallbackIconSize={64}
          />
        </div>
        
        {/* Text Column */}
        <div className="w-full md:w-1/2 space-y-8">
          <h2 className="font-display text-4xl md:text-5xl font-medium tracking-wide text-white">
            Sobre Mim
          </h2>
          
          <div className="h-px w-16 bg-accent/40" />

          <div className="space-y-6 text-lg text-foreground/70 font-light leading-relaxed whitespace-pre-wrap">
            {config.bio}
          </div>
          
          <div className="pt-8">
            <h3 className="font-display text-2xl text-white mb-2">{config.name}</h3>
            <p className="text-accent tracking-widest uppercase text-sm font-medium">Fotógrafo</p>
          </div>
        </div>
      </div>
    </section>
  );
}
