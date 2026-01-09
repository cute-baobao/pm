import { requireOrganizationAccess } from '@/lib/utils/auth-action';
import { TaskClient } from './client';
import { prefetchTaskChangeLog } from '@/features/task/server/prefetch';

interface TaskPageProps {
  params: Promise<{ slug: string; projectId: string; taskId: string }>;
}

export default async function TaskPage({ params }: TaskPageProps) {
  const { slug, taskId } = await params;
  await requireOrganizationAccess(slug);

  await prefetchTaskChangeLog(taskId)

  return <TaskClient />;
}
