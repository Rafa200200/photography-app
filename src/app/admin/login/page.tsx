import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import LoginForm from './LoginForm';

export default async function LoginPage() {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (session) {
    redirect('/admin');
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-background relative overflow-hidden">
      {/* Background orb matching the site aesthetic */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[120px] -z-10" />
      
      <div className="w-full max-w-md space-y-8 animate-fade-in-up">
        <div className="text-center">
          <h1 className="font-display text-4xl mb-2 text-white">HL Photography</h1>
          <p className="text-foreground/60">Painel de Administração</p>
        </div>

        <div className="bg-surface/50 backdrop-blur-md border border-white/5 rounded-2xl p-8 shadow-xl">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
