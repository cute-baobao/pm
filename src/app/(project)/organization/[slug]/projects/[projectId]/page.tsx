import { ProjectView } from '@/features/project/components/project';
import {
  ProjectsError,
  ProjectsLoading,
} from '@/features/project/components/projects';
import { prefetchProject } from '@/features/project/server/prefetch';
import { prefetchTasks } from '@/features/task/server/prefetch';
import { requireOrganizationAccess } from '@/lib/utils/auth-action';
import { HydrateClient } from '@/trpc/server';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

interface ProjectDetailPageProps {
  params: Promise<{ slug: string; projectId: string }>;
}
export default async function ProjectDetailPage({
  params,
}: ProjectDetailPageProps) {
  const { slug, projectId } = await params;
  const session = await requireOrganizationAccess(slug);

  await prefetchProject({
    organizationId: session.session.activeOrganizationId!,
    projectId,
  });

  await prefetchTasks({
    organizationId: session.session.activeOrganizationId!,
  });

  return (
    <HydrateClient>
      <ErrorBoundary fallback={<ProjectsError />}>
        <Suspense fallback={<ProjectsLoading />}>
          <ProjectView
            slug={slug}
            organizationId={session.session.activeOrganizationId!}
            projectId={projectId}
          />
        </Suspense>
      </ErrorBoundary>
    </HydrateClient>
  );
}
