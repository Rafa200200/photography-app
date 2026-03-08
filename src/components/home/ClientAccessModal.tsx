'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { X, Lock, ArrowRight } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function ClientAccessModal({ isOpen, onClose }: Props) {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length < 6) {
      setError('O código deve ter pelo menos 6 caracteres');
      return;
    }
    
    // Na fase seguinte (Fase 5), isto irá bater na API do Supabase 
    // ou redirecionar para `/album[code]` e a verificação acontece lá.
    // Por enquanto, apenas redireciona.
    router.push(`/album/${code}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 modal-overlay animate-fade-in"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-md bg-surface border border-white/10 rounded-2xl shadow-2xl overflow-hidden glass mix-blend-plus-lighter animate-scale-in">
        
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-foreground/50 hover:text-foreground transition-colors"
        >
          <X size={20} />
        </button>

        <div className="p-8 md:p-10">
          <div className="w-16 h-16 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center mb-8 text-accent mx-auto">
            <Lock size={28} strokeWidth={1.5} />
          </div>
          
          <div className="text-center mb-8">
            <h3 className="font-display text-3xl font-bold mb-3">Área de Cliente</h3>
            <p className="text-foreground/60 text-sm leading-relaxed max-w-[280px] mx-auto">
              Insira o código exclusivo fornecido pelo fotógrafo para aceder ao seu álbum privado.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="code" className="sr-only">Código do Álbum</label>
              <input
                id="code"
                type="text"
                value={code}
                onChange={(e) => {
                  setCode(e.target.value.toUpperCase());
                  setError('');
                }}
                placeholder="EX: WED2024"
                className="w-full bg-surface-light/50 border border-white/5 rounded-xl px-4 py-4 text-center text-xl tracking-[0.2em] font-medium uppercase focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/50 transition-all placeholder:text-foreground/20 placeholder:tracking-normal placeholder:font-normal"
                autoFocus
              />
              <div className="h-4 mt-2 text-center">
                {error && <p className="text-red-400 text-xs animate-slide-down">{error}</p>}
              </div>
            </div>

            <button 
              type="submit"
              className="w-full bg-foreground text-background font-semibold rounded-xl px-4 py-4 hover:bg-accent hover:text-white transition-all duration-300 flex items-center justify-center gap-2 group"
            >
              Aceder ao Álbum
              <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
