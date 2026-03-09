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
    <section id="about" className="py-32 md:py-40 px-6 md:px-12 lg:px-24">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-16 md:gap-24 items-start relative">
        {/* Profile Image Column */}
        <div className="w-full md:w-5/12 relative aspect-[3/4] overflow-hidden bg-zinc-900 md:sticky md:top-32">
          <SafeImage
            src={config.profile_image}
            alt={config.name}
            fill
            className="object-cover object-center transition-transform duration-[1000ms] ease-out hover:scale-105"
            sizes="(max-width: 768px) 100vw, 40vw"
            priority
            fallbackIconSize={64}
          />
        </div>
        
        {/* Text Column */}
        <div className="w-full md:w-7/12 space-y-10">
          <div>
            <div className="section-divider mb-8" />
            <h2 className="font-display text-4xl md:text-5xl font-extralight tracking-[0.15em] text-zinc-50 uppercase">
              Sobre Mim
            </h2>
          </div>

          <div className="space-y-6 text-base md:text-lg text-zinc-400 font-light leading-loose whitespace-pre-wrap">
            {config.bio}
          </div>
          
          <div className="pt-4">
            <h3 className="font-display text-xl text-zinc-50 font-light tracking-wider mb-1">{config.name}</h3>
            <p className="text-accent/70 tracking-[0.2em] uppercase text-xs font-light">Fotógrafo</p>
          </div>
        </div>
      </div>
    </section>
  );
}
