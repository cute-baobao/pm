import { AppHeader } from '@/components/app-header';
import { AppSidebar } from '@/components/app-sidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  
  return (
    <>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset className="bg-accent/20">
          <AppHeader />
          <main className="mx-auto w-full max-w-screen-2xl flex-1 overflow-auto">
            {children}
          </main>
        </SidebarInset>
      </SidebarProvider>
    </>
  );
}
