import { EditProjectForm } from '@/features/project/components/edit-project-form';
import {
  ProjectsError,
  ProjectsLoading,
} from '@/features/project/components/projects';
import { prefetchProject } from '@/features/project/server/prefetch';
import { requireOrganizationAccess } from '@/lib/utils/auth-action';
import { HydrateClient } from '@/trpc/server';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

interface ProjectEditPageProps {
  params: Promise<{ slug: string; projectId: string }>;
}
export default async function ProjectEditPage({
  params,
}: ProjectEditPageProps) {
  const { slug, projectId } = await params;

  const session = await requireOrganizationAccess(slug);

  await prefetchProject({
    organizationId: session.session.activeOrganizationId!,
    projectId,
  });

  return (
    <HydrateClient>
      <ErrorBoundary fallback={<ProjectsError />}>
        <Suspense fallback={<ProjectsLoading />}>
          <EditProjectForm
            organizationId={session.session.activeOrganizationId!}
            projectId={projectId}
            role={'member'}
            slug={slug}
          />
        </Suspense>
      </ErrorBoundary>
    </HydrateClient>
  );
}
