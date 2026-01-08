import { AppHeader } from '@/components/app-header';
import { AppSidebar } from '@/components/app-sidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { CreateOrganizationModal } from '@/features/organization/components/create-organization-modal';
import { OrganizationError } from '@/features/organization/components/organization';
import { prefetchOrganizations } from '@/features/organization/server/prefetch';
import { EditTaskModal } from '@/features/task/components/edit-task-modal';
import { HydrateClient } from '@/trpc/server';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default async function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  await prefetchOrganizations();

  return (
    <>
      <SidebarProvider>
        <HydrateClient>
          <ErrorBoundary fallback={<OrganizationError />}>
            <Suspense>
              <AppSidebar />
              <SidebarInset className="bg-background">
                <AppHeader />
                <main className="mx-auto w-full max-w-screen-2xl flex-1 overflow-auto p-4 md:p-10 md:py-6">
                  {children}
                  <CreateOrganizationModal />
                  <EditTaskModal />
                </main>
              </SidebarInset>
            </Suspense>
          </ErrorBoundary>
        </HydrateClient>
      </SidebarProvider>
    </>
  );
}
