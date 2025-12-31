import { AppHeader } from '@/components/app-header';
import { AppSidebar } from '@/components/app-sidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { CreateOrganizationModal } from '@/features/organization/components/create-organization-modal';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default async function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  return (
    <>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset className="bg-background">
          <AppHeader />
          <main className="mx-auto w-full max-w-screen-2xl flex-1 overflow-auto p-4 md:p-6 md:py-4">
            {children}
            <CreateOrganizationModal />
          </main>
        </SidebarInset>
      </SidebarProvider>
    </>
  );
}
