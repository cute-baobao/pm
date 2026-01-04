import { ProjectView } from '@/features/project/components/project';
import {
  ProjectsError,
  ProjectsLoading,
} from '@/features/project/components/projects';
import {
  prefetchProject,
  prefetchProjectAnalytics,
} from '@/features/project/server/prefetch';
import { taskParamsLoader } from '@/features/task/server/params-loader';
import { prefetchTasks } from '@/features/task/server/prefetch';
import { requireOrganizationAccess } from '@/lib/utils/auth-action';
import { HydrateClient } from '@/trpc/server';
import { SearchParams } from 'nuqs';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

interface ProjectDetailPageProps {
  params: Promise<{ slug: string; projectId: string }>;
  searchParams: Promise<SearchParams>;
}
export default async function ProjectDetailPage({
  searchParams,
  params,
}: ProjectDetailPageProps) {
  const { slug, projectId } = await params;
  const session = await requireOrganizationAccess(slug);
  const loader = await taskParamsLoader(searchParams);

  const userId = session.session.userId;

  await prefetchProject({
    organizationId: session.session.activeOrganizationId!,
    projectId,
  });

  await prefetchTasks({
    ...loader,
    organizationId: session.session.activeOrganizationId!,
  });

  await prefetchProjectAnalytics({
    projectId,
    assigneeId: userId,
  });

  return (
    <HydrateClient>
      <ErrorBoundary fallback={<ProjectsError />}>
        <Suspense fallback={<ProjectsLoading />}>
          <ProjectView slug={slug} projectId={projectId} userId={userId} />
        </Suspense>
      </ErrorBoundary>
    </HydrateClient>
  );
}
