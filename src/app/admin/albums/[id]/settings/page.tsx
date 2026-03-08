'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { Loader2, ArrowLeft, RefreshCw, Save } from 'lucide-react';
import { generateAlbumCode } from '@/lib/utils';
import { use } from 'react';

export default function AlbumSettingsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    client_name: '',
    client_email: '',
    code: '',
    watermark_enabled: false,
    status: 'active',
  });

  const supabase = createClient();

  useEffect(() => {
    loadAlbum();
  }, [id]);

  async function loadAlbum() {
    try {
      const { data, error } = await supabase
        .from('albums')
        .select('*')
        .eq('id', id)
        .single();
        
      if (error) throw error;
      
      if (data) {
        setFormData({
          name: data.name,
          client_name: data.client_name || '',
          client_email: data.client_email || '',
          code: data.code,
          watermark_enabled: data.watermark_enabled,
          status: data.status,
        });
      }
    } catch (err) {
      console.error('Failed to load album:', err);
      setError('Não foi possível carregar as definições do álbum.');
    } finally {
      setIsLoading(false);
    }
  }

  const handleGenerateCode = () => {
    setFormData(prev => ({ ...prev, code: generateAlbumCode() }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError('');
    setSuccess('');

    try {
      const { error: updateError } = await supabase
        .from('albums')
        .update({
          name: formData.name,
          client_name: formData.client_name,
          client_email: formData.client_email,
          code: formData.code,
          watermark_enabled: formData.watermark_enabled,
          status: formData.status,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (updateError) throw updateError;
      
      setSuccess('Definições atualizadas com sucesso!');
      
      // Auto-hide success message
      setTimeout(() => setSuccess(''), 3000);
      
    } catch (err: any) {
      console.error('Error updating album:', err);
      if (err.code === '23505') {
        setError('Este PIN/Código já está em uso noutro álbum. Gera um novo.');
      } else {
        setError('Ocorreu um erro ao atualizar o álbum. Tenta novamente.');
      }
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="flex h-64 items-center justify-center"><Loader2 className="animate-spin text-accent" /></div>;
  }

  return (
    <div className="space-y-8 animate-fade-in-up max-w-3xl">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link href="/admin/albums" className="p-2 bg-surface hover:bg-surface-light border border-border rounded-lg text-foreground/70 transition-colors">
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h2 className="text-2xl font-display text-white">Definições do Álbum</h2>
            <p className="text-foreground/60 text-sm mt-1">Altera as configurações desta galeria.</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-surface border border-border rounded-xl p-6 md:p-8 space-y-6">
        
        {error && (
          <div className="bg-red-500/10 text-red-500 p-4 rounded-lg border border-red-500/20 text-sm">
            {error}
          </div>
        )}
        
        {success && (
          <div className="bg-emerald-500/10 text-emerald-500 p-4 rounded-lg border border-emerald-500/20 text-sm">
            {success}
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
          <h3 className="text-lg font-medium text-white border-b border-border/50 pb-2">Acesso & Estado</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm text-foreground/70 mb-2">PIN / Código Secreto de Acesso</label>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  readOnly
                  value={formData.code}
                  className="w-full text-center font-mono tracking-widest bg-background border border-border rounded-lg px-4 py-2 text-white outline-none cursor-not-allowed"
                />
                <button 
                  type="button"
                  onClick={handleGenerateCode}
                  className="px-4 py-2 bg-background border border-border rounded-lg hover:border-accent text-foreground/70 transition-colors flex items-center justify-center shrink-0"
                  title="Gerar Novo PIN"
                >
                  <RefreshCw size={16} />
                </button>
              </div>
              <p className="text-xs text-foreground/40 mt-2">
                Podes gerar um novo código para revogar o acesso imediatamente a quem tinha o antigo.
              </p>
            </div>
            
            <div>
              <label className="block text-sm text-foreground/70 mb-2">Estado do Álbum</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value})}
                className="w-full bg-background border border-border rounded-lg px-4 py-2 focus:border-accent outline-none text-white h-[42px]"
              >
                <option value="active">Ativo (Acesso Público com PIN)</option>
                <option value="archived">Arquivado (Invisível para Cliente)</option>
                <option value="expired">Expirado (Bloqueado por validade)</option>
              </select>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-border flex justify-end gap-4 mt-8">
          <Link 
            href={`/admin/albums/${id}`}
            className="px-6 py-2 border border-border text-foreground/70 rounded-lg hover:bg-surface-light hover:text-white transition-colors"
          >
            Voltar ao Álbum
          </Link>
          <button 
            type="submit"
            disabled={isSaving}
            className="bg-accent text-white px-8 py-2 rounded-lg font-medium hover:bg-accent/90 transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
            {isSaving ? 'A guardar...' : 'Guardar Alterações'}
          </button>
        </div>

      </form>
    </div>
  );
}
