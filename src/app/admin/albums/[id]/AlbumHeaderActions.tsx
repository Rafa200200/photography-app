'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Send, Loader2, CheckCircle } from 'lucide-react';

interface AlbumHeaderActionsProps {
  publicLink: string;
  album: any;
}

export default function AlbumHeaderActions({ publicLink, album }: AlbumHeaderActionsProps) {
  const [isSending, setIsSending] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSendEmail() {
    if (!album.client_email) {
      alert("Por favor, edite o álbum e adicione um email de cliente antes de enviar.");
      return;
    }

    setIsSending(true);
    try {
      // In production, get the full host. For now let's just use window.location.origin
      const fullUrl = `${window.location.origin}${publicLink}`;
      
      const res = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientEmail: album.client_email,
          clientName: album.client_name,
          albumName: album.name,
          albumCode: album.code,
          albumUrl: fullUrl
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Erro ao enviar email');
      }

      setSent(true);
      setTimeout(() => setSent(false), 3000);
    } catch (error: any) {
      console.error(error);
      const msg = typeof error === 'string' ? error : error?.message || JSON.stringify(error);
      alert('Erro: ' + msg);
    } finally {
      setIsSending(false);
    }
  }

  return (
    <div className="flex items-center gap-3">
      <Link
        href={publicLink}
        target="_blank"
        className="px-4 py-2 border border-border bg-surface text-foreground/80 hover:text-white rounded-lg transition-colors text-sm font-medium"
      >
        Ver Galeria
      </Link>
      
      <button 
        onClick={handleSendEmail}
        disabled={isSending || sent}
        className="px-4 py-2 bg-accent hover:bg-accent/90 disabled:opacity-70 text-white rounded-lg transition-colors flex items-center gap-2 text-sm font-medium"
      >
        {isSending ? (
          <><Loader2 size={16} className="animate-spin" /> A enviar...</>
        ) : sent ? (
          <><CheckCircle size={16} /> Enviado</>
        ) : (
          <><Send size={16} /> Enviar Acesso</>
        )}
      </button>
    </div>
  );
}
