import AdminSidebar from '@/components/layout/AdminSidebar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Sidebar Navigation */}
      <AdminSidebar />
      
      {/* Main Content Area */}
      <main className="flex-1 lg:ml-64 p-6 md:p-8 lg:p-12 transition-all">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
