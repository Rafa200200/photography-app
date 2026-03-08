import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Vercel Cron Job Route
// This route should be protected by checking the Authorization header against a secret
// In Vercel, this is done using the CRON_SECRET environment variable
export async function GET(request: Request) {
  try {
    // 1. Authenticate the cron request
    const authHeader = request.headers.get('authorization');
    if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      // Allow execution in development even without the secret for testing purposes
      if (process.env.NODE_ENV !== 'development') {
        return new NextResponse('Unauthorized', { status: 401 });
      }
    }

    // 2. Initialize Supabase Admin Client (bypass RLS)
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing Supabase variables');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // 3. Find and update all active albums where expires_at is in the past
    const now = new Date().toISOString();
    
    const { data: expiredAlbums, error } = await supabase
      .from('albums')
      .update({ status: 'expired' })
      .eq('status', 'active')
      .lt('expires_at', now)
      .select('id, name');

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      message: `Checked for expired albums at ${now}`,
      expiredCount: expiredAlbums?.length || 0,
      albums: expiredAlbums
    });

  } catch (error: any) {
    console.error('Cron Expiration Error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
