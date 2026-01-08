import {
  ProjectsError,
  ProjectsLoading,
} from '@/features/project/components/projects';
import { TaskViewSwitcher } from '@/features/task/components/task-view-switcher';
import { taskParamsLoader } from '@/features/task/server/params-loader';
import { prefetchTasks } from '@/features/task/server/prefetch';
import { requireOrganizationAccess } from '@/lib/utils/auth-action';
import { HydrateClient } from '@/trpc/server';
import { SearchParams } from 'nuqs/server';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

interface TasksPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<SearchParams>;
}

export default async function TasksPage({
  params,
  searchParams: p,
}: TasksPageProps) {
  const { slug } = await params;

  const access = await requireOrganizationAccess(slug);
  const search = await taskParamsLoader(p);

  await prefetchTasks({
    ...search,
    organizationId: access.session.activeOrganizationId!,
  });

  return (
    <HydrateClient>
      <ErrorBoundary fallback={<ProjectsError />}>
        <Suspense fallback={<ProjectsLoading />}>
          <TaskViewSwitcher
            organizationId={access.session.activeOrganizationId!}
          />
        </Suspense>
      </ErrorBoundary>
    </HydrateClient>
  );
}
