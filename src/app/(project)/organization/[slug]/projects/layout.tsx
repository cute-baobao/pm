import { AppHeader } from '@/components/app-header';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { CreateOrganizationModal } from '@/features/organization/components/create-organization-modal';
import { ProjectSidebar } from '@/features/project/components/project-sidebar';
import { CreateTaskModal } from '@/features/task/components/create-task-modal';
import { EditTaskModal } from '@/features/task/components/edit-task-modal';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default async function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  return (
    <>
      <EditTaskModal />
      <CreateTaskModal />
      <SidebarProvider>
        <ProjectSidebar />
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
