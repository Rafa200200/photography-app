interface FooterProps {
  config: {
    name: string;
  };
}

export default function Footer({ config }: FooterProps) {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="w-full bg-surface border-t border-border py-12 px-6">
      <div className="max-w-screen-xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <p className="text-foreground/40 text-sm">
          &copy; {currentYear} {config.name}. Todos os direitos reservados.
        </p>
        <div className="flex gap-8 text-sm text-foreground/40">
          <a href="/admin/login" className="hover:text-accent transition-colors">Admin Login</a>
        </div>
      </div>
    </footer>
  );
}
