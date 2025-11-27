import { ProjectView } from '@/features/project/components/project';
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
  params: Promise<{ slug: string; name: string }>;
}
export default async function ProjectEditPage({
  params,
}: ProjectEditPageProps) {
  const { slug, name } = await params;
  const projectName = decodeURIComponent(name);

  const session = await requireOrganizationAccess(slug);

  await prefetchProject({
    organizationId: session.session.activeOrganizationId!,
    projectName,
  });

  return (
    <HydrateClient>
      <ErrorBoundary fallback={<ProjectsError />}>
        <Suspense fallback={<ProjectsLoading />}>
          <ProjectView
            slug={slug}
            organizationId={session.session.activeOrganizationId!}
            projectName={projectName}
          />
        </Suspense>
      </ErrorBoundary>
    </HydrateClient>
  );
}
