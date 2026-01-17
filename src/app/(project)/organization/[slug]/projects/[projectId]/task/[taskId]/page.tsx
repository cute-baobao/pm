import { ErrorView } from '@/components/entity-component';
import { prefetchTaskChangeLog } from '@/features/task/server/prefetch';
import { requireOrganizationAccess } from '@/lib/utils/auth-action';
import { HydrateClient } from '@/trpc/server';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { TaskClient, TaskLoading } from './client';

interface TaskPageProps {
  params: Promise<{ slug: string; projectId: string; taskId: string }>;
}

export default async function TaskPage({ params }: TaskPageProps) {
  const { slug, taskId } = await params;
  await requireOrganizationAccess(slug);

  await prefetchTaskChangeLog(taskId);

  return (
    <HydrateClient>
      <ErrorBoundary fallback={<ErrorView entity="Task" />}>
        <Suspense fallback={<TaskLoading />}>
          <TaskClient />
        </Suspense>
      </ErrorBoundary>
    </HydrateClient>
  );
}
