import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// Whitelist of allowed redirect paths to prevent open redirect attacks
const ALLOWED_REDIRECT_PATHS = ['/admin', '/admin/login', '/'];

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/admin'

  // 🔒 Validate redirect path — prevent open redirect attacks
  const safePath = ALLOWED_REDIRECT_PATHS.includes(next) ? next : '/admin';

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      const forwardedHost = request.headers.get('x-forwarded-host')
      const isLocalEnv = process.env.NODE_ENV === 'development'
      if (isLocalEnv) {
        return NextResponse.redirect(`${origin}${safePath}`)
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${safePath}`)
      } else {
        return NextResponse.redirect(`${origin}${safePath}`)
      }
    }
  }

  return NextResponse.redirect(`${origin}/admin/login?error=Invalid+Link`)
}
