import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createClient as createServerClient } from '@/lib/supabase/server';

// Service role for DB operations (bypasses RLS)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Verify the request is from an authenticated admin
async function verifyAdmin(): Promise<boolean> {
  try {
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    // Check against admin whitelist
    const adminEmails = (process.env.ADMIN_EMAILS || '')
      .split(',')
      .map(e => e.trim().toLowerCase())
      .filter(Boolean);
    
    if (adminEmails.length > 0) {
      return adminEmails.includes((user.email || '').toLowerCase());
    }
    
    return true; // If no whitelist configured, any authenticated user is admin
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  try {
    // 🔒 Auth guard — only admins can add photos
    const isAdmin = await verifyAdmin();
    if (!isAdmin) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const body = await request.json();
    const { album_id, category_id, storage_path, original_filename, size_bytes, sort_order } = body;

    if (!album_id || !storage_path) {
      return NextResponse.json(
        { error: 'album_id e storage_path são obrigatórios' },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from('photos')
      .insert({
        album_id,
        category_id: category_id || null,
        storage_path,
        original_filename: original_filename || null,
        size_bytes: size_bytes || null,
        sort_order: sort_order || 0,
      })
      .select()
      .single();

    if (error) {
      console.error('DB insert error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, photo: data });
  } catch (error: any) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: error.message || 'Erro interno' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    // 🔒 Auth guard — only admins can delete photos
    const isAdmin = await verifyAdmin();
    if (!isAdmin) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const storagePath = searchParams.get('storagePath');

    if (!id) {
      return NextResponse.json({ error: 'ID em falta' }, { status: 400 });
    }

    // Apagar do storage se path existir
    if (storagePath) {
      const urlParts = storagePath.split('/albums/');
      if (urlParts.length > 1) {
        await supabaseAdmin.storage.from('albums').remove([urlParts[1]]);
      }
    }

    // Apagar registo na BD
    const { error } = await supabaseAdmin
      .from('photos')
      .delete()
      .eq('id', id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Erro interno' },
      { status: 500 }
    );
  }
}
