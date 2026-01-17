import { CreateMilestoneForm } from '@/features/milestone/components/create-milestone-form';
import { prefetchTaskWithoutMilestoneSelect } from '@/features/task/server/prefetch';
import { requireOrganizationAccess } from '@/lib/utils/auth-action';

interface CreateMilestonePageProps {
  params: Promise<{ slug: string; projectId: string }>;
}

export default async function CreateMilestonePage({
  params,
}: CreateMilestonePageProps) {
  const { slug, projectId } = await params;
  await requireOrganizationAccess(slug);

  await prefetchTaskWithoutMilestoneSelect(projectId);

  return (
    <div className="flex w-full items-center justify-center">
      <CreateMilestoneForm />
    </div>
  );
}
