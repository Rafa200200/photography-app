import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Use service_role to bypass RLS — favorites are anonymous (no auth required)
function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

function getClientIdentifier(request: Request) {
  const ip = request.headers.get('x-forwarded-for') || 'anonymous';
  const userAgent = request.headers.get('user-agent') || 'unknown';
  return Buffer.from(`${ip}-${userAgent}`).toString('base64').substring(0, 32);
}

export async function POST(request: Request) {
  try {
    const supabase = getSupabaseAdmin();
    const body = await request.json();
    const { photo_id, album_id, is_favorite } = body;

    const clientIdentifier = getClientIdentifier(request);

    if (is_favorite) {
      // Add favorite
      const { error } = await supabase
        .from('favorites')
        .insert({
          photo_id,
          album_id,
          client_identifier: clientIdentifier
        });

      if (error && error.code !== '23505') { // Ignore unique violation if already favorited
        throw error;
      }
    } else {
      // Remove favorite
      const { error } = await supabase
        .from('favorites')
        .delete()
        .match({
          photo_id,
          client_identifier: clientIdentifier
        });

      if (error) throw error;
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Favorites API error:', error);
    return NextResponse.json(
      { error: error.message || 'Erro ao guardar favorito' },
      { status: 500 }
    );
  }
}
