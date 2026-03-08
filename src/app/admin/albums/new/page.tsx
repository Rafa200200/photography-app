'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { Loader2, ArrowLeft, RefreshCw, Save } from 'lucide-react';
import { generateAlbumCode } from '@/lib/utils';

export default function NewAlbumPage() {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    client_name: '',
    client_email: '',
    code: generateAlbumCode(),
    watermark_enabled: false,
  });

  const supabase = createClient();

  const handleGenerateCode = () => {
    setFormData(prev => ({ ...prev, code: generateAlbumCode() }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError('');

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data: profile } = await supabase
        .from('photographers')
        .select('id')
        .eq('auth_id', user.id)
        .single();

      if (!profile) throw new Error('Profile not found');

      // Expires in 3 months
      const expiresAt = new Date();
      expiresAt.setMonth(expiresAt.getMonth() + 3);

      const { data: newAlbum, error: insertError } = await supabase
        .from('albums')
        .insert({
          photographer_id: profile.id,
          name: formData.name,
          client_name: formData.client_name,
          client_email: formData.client_email,
          code: formData.code,
          status: 'active',
          watermark_enabled: formData.watermark_enabled,
          expires_at: expiresAt.toISOString(),
        })
        .select()
        .single();

      if (insertError) throw insertError;

      // Create default category
      if (newAlbum) {
        await supabase.from('album_categories').insert({
          album_id: newAlbum.id,
          name: 'Principal',
          sort_order: 0
        });
      }

      router.push(`/admin/albums/${newAlbum.id}`);
    } catch (err: any) {
      console.error('Error creating album:', err);
      if (err.code === '23505') {
        setError('Este PIN/Código já está em uso. Gera um novo.');
      } else {
        setError('Ocorreu um erro ao criar o álbum. Tenta novamente.');
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in-up max-w-3xl">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link href="/admin/albums" className="p-2 bg-surface hover:bg-surface-light border border-border rounded-lg text-foreground/70 transition-colors">
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h2 className="text-2xl font-display text-white">Novo Álbum</h2>
            <p className="text-foreground/60 text-sm mt-1">Cria uma nova galeria privada para um cliente.</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-surface border border-border rounded-xl p-6 md:p-8 space-y-6">
        
        {error && (
          <div className="bg-red-500/10 text-red-500 p-4 rounded-lg border border-red-500/20 text-sm">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <h3 className="text-lg font-medium text-white border-b border-border/50 pb-2">Informação Principal</h3>
          
          <div>
            <label className="block text-sm text-foreground/70 mb-2">Nome do Álbum (ex: Casamento Rita & João)</label>
            <input 
              type="text" 
              required
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full bg-background border border-border rounded-lg px-4 py-2 focus:border-accent outline-none"
              placeholder="Aparece como título principal do álbum"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-foreground/70 mb-2">Nome do Cliente</label>
              <input 
                type="text" 
                value={formData.client_name}
                onChange={(e) => setFormData({...formData, client_name: e.target.value})}
                className="w-full bg-background border border-border rounded-lg px-4 py-2 focus:border-accent outline-none"
                placeholder="Nome da pessoa a contactar"
              />
            </div>
            <div>
              <label className="block text-sm text-foreground/70 mb-2">Email do Cliente</label>
              <input 
                type="email" 
                value={formData.client_email}
                onChange={(e) => setFormData({...formData, client_email: e.target.value})}
                className="w-full bg-background border border-border rounded-lg px-4 py-2 focus:border-accent outline-none"
                placeholder="Para envio automático do link"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4 pt-4">
          <h3 className="text-lg font-medium text-white border-b border-border/50 pb-2">Acesso & Segurança</h3>
          
          <div>
            <label className="block text-sm text-foreground/70 mb-2">PIN / Código Secreto de Acesso</label>
            <div className="flex gap-2">
              <input 
                type="text" 
                readOnly
                value={formData.code}
                className="w-full md:w-48 text-center font-mono tracking-widest bg-background border border-border rounded-lg px-4 py-2 text-white outline-none cursor-not-allowed"
              />
              <button 
                type="button"
                onClick={handleGenerateCode}
                className="px-4 py-2 bg-background border border-border rounded-lg hover:border-accent text-foreground/70 transition-colors flex items-center justify-center"
                title="Gerar Novo PIN"
              >
                <RefreshCw size={16} />
              </button>
            </div>
            <p className="text-xs text-foreground/40 mt-2">
              Os clientes vão usar este PIN de 8 dígitos para aceder ao álbum privado. O álbum expirará automaticamente após 3 meses.
            </p>
          </div>
        </div>

        <div className="pt-6 border-t border-border flex justify-end gap-4">
          <Link 
            href="/admin/albums"
            className="px-6 py-2 border border-border text-foreground/70 rounded-lg hover:bg-surface-light hover:text-white transition-colors"
          >
            Cancelar
          </Link>
          <button 
            type="submit"
            disabled={isSaving}
            className="bg-accent text-white px-8 py-2 rounded-lg font-medium hover:bg-accent/90 transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
            {isSaving ? 'A criar álbum...' : 'Criar Álbum'}
          </button>
        </div>

      </form>
    </div>
  );
}
