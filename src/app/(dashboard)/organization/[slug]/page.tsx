import { prefetchOrganizationMembers } from '@/features/organization-member/server/prefetch';
import {
  OrganizationError,
  OrganizationLoading,
  OrganizationView,
} from '@/features/organization/components/organization';
import { prefetchOrganizationAnalytics } from '@/features/organization/server/prefetch';
import { projectsParamsLoader } from '@/features/project/server/params-loader';
import { prefetchProjects } from '@/features/project/server/prefetch';
import { taskParamsLoader } from '@/features/task/server/params-loader';
import { prefetchTasks } from '@/features/task/server/prefetch';
import { requireOrganizationAccess } from '@/lib/utils/auth-action';
import { HydrateClient } from '@/trpc/server';
import { SearchParams } from 'nuqs/server';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

interface SubdomainPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<SearchParams>;
}

export default async function SlugPage({
  params,
  searchParams,
}: SubdomainPageProps) {
  //Check user session and access permission
  const { slug } = await params;
  const access = await requireOrganizationAccess(slug);

  const organizationId = access.session.activeOrganizationId!;

  const taskSearchParams = await taskParamsLoader(searchParams);
  const projectsSearchParams = await projectsParamsLoader(searchParams);

  await prefetchTasks({
    ...taskSearchParams,
    organizationId,
  });

  await prefetchOrganizationAnalytics({
    organizationId,
    assigneeId: access.session.userId,
  });

  await prefetchProjects({
    ...projectsSearchParams,
    organizationId,
  });

  await prefetchOrganizationMembers(organizationId);

  return (
    <HydrateClient>
      <ErrorBoundary fallback={<OrganizationError />}>
        <Suspense fallback={<OrganizationLoading />}>
          <OrganizationView />
        </Suspense>
      </ErrorBoundary>
    </HydrateClient>
  );
}
