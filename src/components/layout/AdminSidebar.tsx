'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Images, 
  Settings, 
  LogOut, 
  Camera 
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

const NAV_ITEMS = [
  { label: 'Painel', href: '/admin', icon: LayoutDashboard },
  { label: 'Álbuns de Clientes', href: '/admin/albums', icon: Images },
  { label: 'Portfólio (Site)', href: '/admin/portfolio', icon: Camera },
  { label: 'Configurações Globais', href: '/admin/settings', icon: Settings },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/admin/login');
    router.refresh(); // Force a refresh to clear state
  };

  return (
    <aside className="fixed inset-y-0 left-0 w-64 bg-surface border-r border-border hidden lg:flex flex-col">
      <div className="p-6 border-b border-border">
        <h2 className="font-display text-xl font-bold tracking-wider text-white">
          HL Admin
        </h2>
        <p className="text-xs text-foreground/40 mt-1 uppercase tracking-widest">Painel de Controlo</p>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive 
                  ? 'bg-accent/10 text-accent font-medium' 
                  : 'text-foreground/70 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border">
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
        >
          <LogOut size={18} />
          Sair
        </button>
      </div>
    </aside>
  );
}
