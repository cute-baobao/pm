import { CreateTaskFormWrapper } from '@/features/task/components/create-task-form-wrapper';
import { requireOrganizationAccess } from '@/lib/utils/auth-action';

interface CreateTaskPageProps {
  params: Promise<{ slug: string; projectId: string }>;
}

export default async function CreateTaskPage({ params }: CreateTaskPageProps) {
  const { slug, projectId } = await params;
  const access = await requireOrganizationAccess(slug);

  return (
    <CreateTaskFormWrapper
      projectId={projectId}
      organizationId={access.session.activeOrganizationId!}
    />
  );
}
