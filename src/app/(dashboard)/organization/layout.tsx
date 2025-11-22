import { AppHeader } from '@/components/app-header';
import { AppSidebar } from '@/components/app-sidebar';
import { Loading } from '@/components/loading';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { CreateOrganizationModal } from '@/features/organization/components/create-organization-modal';
import { prefetchOrganizations } from '@/features/organization/server/prefetch';
import { HydrateClient } from '@/trpc/server';
import { Suspense } from 'react';

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
          <Suspense fallback={<Loading />}>
            <AppSidebar />
            <SidebarInset className="bg-accent/20">
              <AppHeader />
              <main className="mx-auto w-full max-w-screen-2xl flex-1 overflow-auto">
                {children}
                <CreateOrganizationModal />
              </main>
            </SidebarInset>
          </Suspense>
        </HydrateClient>
      </SidebarProvider>
    </>
  );
}
