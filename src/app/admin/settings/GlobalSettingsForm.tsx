'use client';

import { useState, useEffect, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Save, Image as ImageIcon, Loader2, Upload } from 'lucide-react';
import SafeImage from '@/components/ui/SafeImage';

interface PhotographerConfig {
  id: string;
  name: string;
  email: string;
  auth_id?: string;
  logo_url: string;
  profile_image_url?: string;
  bio: string;
  social_links: {
    instagram?: string;
    facebook?: string;
    email?: string;
  };
}

export default function GlobalSettingsForm() {
  const [config, setConfig] = useState<PhotographerConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [isUploadingProfile, setIsUploadingProfile] = useState(false);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const profileInputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  useEffect(() => {
    loadConfig();
  }, []);

  async function loadConfig() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('photographers')
        .select('*')
        .eq('auth_id', user.id)
        .single();
        
      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setConfig(data as PhotographerConfig);
      } else {
        const { data: fallback } = await supabase.from('photographers').select('*').limit(1).single();
        if (fallback) {
           setConfig(fallback as PhotographerConfig);
        }
      }
    } catch (error) {
      console.error('Error loading config:', error);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>, type: 'logo' | 'profile') {
    const file = e.target.files?.[0];
    if (!file || !config) return;

    if (file.size > 5 * 1024 * 1024) {
      setSaveMessage('Erro: A imagem excede o tamanho máximo de 5MB.');
      return;
    }

    if (type === 'logo') setIsUploadingLogo(true);
    else setIsUploadingProfile(true);
    
    setSaveMessage('');

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${type}-${Date.now()}.${fileExt}`;
      const filePath = `brand/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('portfolio')
        .upload(filePath, file, { cacheControl: '3600', upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('portfolio')
        .getPublicUrl(filePath);

      if (type === 'logo') {
        setConfig({ ...config, logo_url: publicUrl });
      } else {
        setConfig({ ...config, profile_image_url: publicUrl });
      }
      
    } catch (error) {
      console.error('Upload error:', error);
      setSaveMessage(`Erro ao fazer upload da imagem de ${type}.`);
    } finally {
      if (type === 'logo') {
        setIsUploadingLogo(false);
        if (logoInputRef.current) logoInputRef.current.value = '';
      } else {
        setIsUploadingProfile(false);
        if (profileInputRef.current) profileInputRef.current.value = '';
      }
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!config) return;
    
    setIsSaving(true);
    setSaveMessage('');

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { error } = await supabase
        .from('photographers')
        .update({
          name: config.name,
          bio: config.bio,
          logo_url: config.logo_url,
          profile_image_url: config.profile_image_url,
          social_links: config.social_links,
          auth_id: user?.id || config.auth_id // Liga a conta auth ao perfil a primeira vez
        })
        .eq('id', config.id);

      if (error) throw error;
      setSaveMessage('Configurações guardadas com sucesso!');
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (error) {
      console.error('Error saving:', error);
      setSaveMessage('Erro ao guardar configurações.');
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) {
    return <div className="flex h-32 items-center justify-center"><Loader2 className="animate-spin text-accent" /></div>;
  }

  if (!config) return <div>Erro ao carregar configurações.</div>;

  return (
    <form onSubmit={handleSubmit} className="space-y-8 animate-fade-in-up">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-display text-white">Sobre Mim & Contactos</h2>
          <p className="text-foreground/60 text-sm mt-1">Gere os textos e redes sociais que aparecem na página inicial.</p>
        </div>
        <button 
          type="submit"
          disabled={isSaving}
          className="bg-accent text-white px-6 py-2 rounded-lg font-medium hover:bg-accent/90 transition-colors flex items-center gap-2 disabled:opacity-50"
        >
          {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
          {isSaving ? 'A guardar...' : 'Guardar Alterações'}
        </button>
      </div>

      {saveMessage && (
        <div className={`p-4 rounded-lg text-sm ${saveMessage.includes('Erro') ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'}`}>
          {saveMessage}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Identidade */}
        <div className="space-y-6 bg-surface p-6 rounded-xl border border-border">
          <h3 className="text-lg font-medium text-white border-b border-white/10 pb-2">Identidade Global</h3>
          
          {/* Logo Upload */}
          <div className="flex flex-col gap-4">
            <label className="text-sm text-foreground/70">Logótipo (Usado na barra de navegação superior)</label>
            <div className="flex items-center gap-6">
              <div className="relative w-24 h-24 rounded-full overflow-hidden border border-border bg-background flex items-center justify-center shrink-0">
                {config.logo_url ? (
                  <SafeImage src={config.logo_url} alt="Logo preview" fill className="object-cover" fallbackIconSize={24} />
                ) : (
                  <ImageIcon className="text-foreground/20 w-8 h-8" />
                )}
                {isUploadingLogo && (
                  <div className="absolute inset-0 bg-background/50 backdrop-blur-sm flex items-center justify-center">
                    <Loader2 className="animate-spin text-accent w-6 h-6" />
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <input 
                  type="file" 
                  ref={logoInputRef}
                  onChange={(e) => handleImageUpload(e, 'logo')}
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden" 
                />
                <button 
                  type="button"
                  onClick={() => logoInputRef.current?.click()}
                  disabled={isUploadingLogo}
                  className="btn-outline text-xs px-4 py-2 flex items-center gap-2"
                >
                  <Upload size={14} /> Mudar Logótipo
                </button>
                <p className="text-xs text-foreground/40">Recomendado: Fundo Transparente (PNG). Máx 5MB.</p>
              </div>
            </div>
          </div>

          <div className="border-t border-border/50 my-6" />

          {/* Profile Image Upload */}
          <div className="flex flex-col gap-4">
            <label className="text-sm text-foreground/70">Foto de Perfil (Usada na secção "Sobre Mim")</label>
            <div className="flex items-center gap-6">
              <div className="relative w-24 h-32 rounded-lg overflow-hidden border border-border bg-background flex items-center justify-center shrink-0">
                {config.profile_image_url ? (
                  <SafeImage src={config.profile_image_url} alt="Profile preview" fill className="object-cover" fallbackIconSize={24} />
                ) : (
                  <ImageIcon className="text-foreground/20 w-8 h-8" />
                )}
                {isUploadingProfile && (
                  <div className="absolute inset-0 bg-background/50 backdrop-blur-sm flex items-center justify-center">
                    <Loader2 className="animate-spin text-accent w-6 h-6" />
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <input 
                  type="file" 
                  ref={profileInputRef}
                  onChange={(e) => handleImageUpload(e, 'profile')}
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden" 
                />
                <button 
                  type="button"
                  onClick={() => profileInputRef.current?.click()}
                  disabled={isUploadingProfile}
                  className="btn-outline text-xs px-4 py-2 flex items-center gap-2"
                >
                  <Upload size={14} /> Mudar Foto de Perfil
                </button>
                <p className="text-xs text-foreground/40">Recomendado: Formato Retrato/Vertical (JPG, WEBP). Máx 5MB.</p>
              </div>
            </div>
          </div>

          <div className="border-t border-border/50 my-6" />

          <div>
            <label className="block text-sm text-foreground/70 mb-2">Nome do Fotógrafo / Estúdio</label>
            <input 
              type="text" 
              value={config.name}
              onChange={(e) => setConfig({...config, name: e.target.value})}
              className="w-full bg-background border border-border rounded-lg px-4 py-2 focus:border-accent outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-foreground/70 mb-2">Biografia (Aparece na secção Sobre Mim)</label>
            <textarea 
              value={config.bio || ''}
              onChange={(e) => setConfig({...config, bio: e.target.value})}
              className="w-full bg-background border border-border rounded-lg px-4 py-3 min-h-[120px] focus:border-accent outline-none whitespace-pre-wrap"
              required
            />
          </div>
        </div>

        {/* Redes Sociais */}
        <div className="space-y-6 bg-surface p-6 rounded-xl border border-border">
          <h3 className="text-lg font-medium text-white border-b border-white/10 pb-2">Redes Sociais</h3>
          
          <div>
            <label className="block text-sm text-foreground/70 mb-2">Link do Instagram</label>
            <input 
              type="url" 
              value={config.social_links?.instagram || ''}
              onChange={(e) => setConfig({...config, social_links: {...(config.social_links || {}), instagram: e.target.value}})}
              className="w-full bg-background border border-border rounded-lg px-4 py-2 focus:border-accent outline-none"
            />
          </div>

          <div>
            <label className="block text-sm text-foreground/70 mb-2">Link do Facebook</label>
            <input 
              type="url" 
              value={config.social_links?.facebook || ''}
              onChange={(e) => setConfig({...config, social_links: {...(config.social_links || {}), facebook: e.target.value}})}
              className="w-full bg-background border border-border rounded-lg px-4 py-2 focus:border-accent outline-none"
            />
          </div>

          <div>
            <label className="block text-sm text-foreground/70 mb-2">Email de Contacto</label>
            <input 
              type="email" 
              value={config.social_links?.email || ''}
              onChange={(e) => setConfig({...config, social_links: {...(config.social_links || {}), email: e.target.value}})}
              className="w-full bg-background border border-border rounded-lg px-4 py-2 focus:border-accent outline-none"
            />
          </div>
        </div>
      </div>
    </form>
  );
}
