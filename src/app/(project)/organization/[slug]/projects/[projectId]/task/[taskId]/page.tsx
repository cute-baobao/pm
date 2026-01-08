import { requireOrganizationAccess } from '@/lib/utils/auth-action';
import { TaskClient } from './client';

interface TaskPageProps {
  params: Promise<{ slug: string; projectId: string; taskId: string }>;
}

export default async function TaskPage({ params }: TaskPageProps) {
  const { slug } = await params;
  await requireOrganizationAccess(slug);
  return <TaskClient />;
}
