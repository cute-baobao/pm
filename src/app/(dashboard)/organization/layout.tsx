import { AppHeader } from '@/components/app-header';
import { AppSidebar } from '@/components/app-sidebar';
import { Loading } from '@/components/loading';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { CreateOrganizationModal } from '@/features/organization/components/create-organization-modal';
import { OrganizationError } from '@/features/organization/components/organization';
import { prefetchOrganizations } from '@/features/organization/server/prefetch';
import { HydrateClient } from '@/trpc/server';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await prefetchOrganizations();
  return (
    <>
      <SidebarProvider>
        <HydrateClient>
          <ErrorBoundary fallback={<OrganizationError />}>
            <Suspense fallback={<Loading />}>
              <AppSidebar />
              <SidebarInset className="bg-background">
                <AppHeader />
                <main className="mx-auto w-full max-w-screen-2xl flex-1 overflow-auto">
                  {children}
                  <CreateOrganizationModal />
                </main>
              </SidebarInset>
            </Suspense>
          </ErrorBoundary>
        </HydrateClient>
      </SidebarProvider>
    </>
  );
}
