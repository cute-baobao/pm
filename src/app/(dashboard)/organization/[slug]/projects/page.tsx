import {
  ProjectsError,
  ProjectsList,
  ProjectsLoading,
  WorkflowsContainer,
} from '@/features/project/components/projects';
import { projectsParamsLoader } from '@/features/project/server/params-loader';
import { prefetchProjects } from '@/features/project/server/prefetch';
import { requireOrganizationAccess } from '@/lib/utils/auth-action';
import { HydrateClient } from '@/trpc/server';
import { SearchParams } from 'nuqs';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

interface ProjectsPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<SearchParams>;
}

export default async function ProjectsPage({
  params,
  searchParams: p,
}: ProjectsPageProps) {
  const { slug } = await params;

  const access = await requireOrganizationAccess(slug);
  const search = await projectsParamsLoader(p);

  await prefetchProjects({
    organizationId: access.session.activeOrganizationId!,
    ...search,
  });

  return (
    <HydrateClient>
      <WorkflowsContainer organizationId={access.session.activeOrganizationId!}>
        <ErrorBoundary fallback={<ProjectsError />}>
          <Suspense fallback={<ProjectsLoading />}>
            <ProjectsList />
          </Suspense>
        </ErrorBoundary>
      </WorkflowsContainer>
    </HydrateClient>
  );
}
