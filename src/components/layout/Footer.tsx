interface FooterProps {
  config: {
    name: string;
  };
}

export default function Footer({ config }: FooterProps) {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="w-full border-t border-white/5 py-10 px-6">
      <div className="max-w-screen-xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-zinc-600 text-xs tracking-wider font-light">
          &copy; {currentYear} {config.name}. Todos os direitos reservados.
        </p>
        <a href="/admin/login" className="text-zinc-700 hover:text-zinc-400 transition-colors duration-500 text-xs tracking-wider font-light">
          Admin
        </a>
      </div>
    </footer>
  );
}
