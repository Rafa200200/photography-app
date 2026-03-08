import { NextResponse } from 'next/server';
import { Resend } from 'resend';

// Inicializar Resend com chave (ou mock temporário se não houver chave)
const resend = new Resend(process.env.RESEND_API_KEY || 're_123456789');

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { clientEmail, clientName, albumName, albumCode, albumUrl } = body;

    if (!clientEmail || !albumUrl || !albumCode) {
      return NextResponse.json(
        { error: 'Email, URL ou código do álbum em falta' },
        { status: 400 }
      );
    }

    if (!process.env.RESEND_API_KEY) {
      console.warn("RESEND_API_KEY não definida. A simular envio de email...");
      return NextResponse.json({ success: true, mocked: true });
    }

    const { data, error } = await resend.emails.send({
      from: 'Hugo Lourenço Fotografia <onboarding@resend.dev>', // Em produção, usar um domínio verificado
      to: [clientEmail],
      subject: `A sua Galeria de Fotos: ${albumName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #333;">Olá, ${clientName || 'Cliente'}!</h2>
          <p>O seu álbum "<strong>${albumName}</strong>" já está disponível.</p>
          
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
            <p style="margin-bottom: 15px; font-size: 16px;">Para aceder às suas fotografias, clique no botão abaixo ou utilize o seu código de acesso pessoal:</p>
            
            <a href="${albumUrl}" style="display: inline-block; background-color: #000; color: #fff; text-decoration: none; padding: 12px 24px; border-radius: 4px; font-weight: bold; margin-bottom: 15px;">
              Ver Galeria
            </a>
            
            <p style="margin: 0; font-size: 14px; color: #666;">
              Código de Acesso:<br/>
              <strong style="font-size: 24px; color: #000; letter-spacing: 2px;">${albumCode}</strong>
            </p>
          </div>
          
          <p style="color: #666; font-size: 14px;">Se tiver alguma dúvida, não hesite em contactar.</p>
          <p style="color: #666; font-size: 14px;">Obrigado,<br/>Hugo Lourenço</p>
        </div>
      `,
    });

    if (error) {
      const errorMsg = typeof error === 'string' ? error : (error as any).message || JSON.stringify(error);
      return NextResponse.json({ error: errorMsg }, { status: 400 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro interno ao tentar enviar email' },
      { status: 500 }
    );
  }
}
